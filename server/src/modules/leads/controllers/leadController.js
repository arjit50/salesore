const Lead = require('../models/Lead');
const redisClient = require('../../../config/redis');
const transporter = require('../../../config/email');

const getCacheKey = (userId) => `leads:all:${userId}`;

// @desc    Send email to lead
// @route   POST /leads/:id/email
// @access  Private
exports.sendEmailToLead = async (req, res) => {
    const { subject, message } = req.body;

    try {
        const lead = await Lead.findById(req.params.id);

        if (!lead) {
            return res.status(404).json({ message: 'Lead not found' });
        }

        if (!lead.email) {
            return res.status(400).json({ message: 'Lead has no email address' });
        }

        const mailOptions = {
            from: process.env.FROM_EMAIL || 'Salesor CRM <noreply@salesor.com>',
            to: lead.email,
            subject: subject,
            text: message,
            html: `<div style="font-family: sans-serif; padding: 20px;">
                    <h2 style="color: #2563eb;">Message from Salesor</h2>
                    <p style="white-space: pre-wrap;">${message}</p>
                   </div>`
        };

        await transporter.sendMail(mailOptions);

        // Record in history
        lead.history.push({
            type: 'Email',
            content: `Subject: ${subject}`,
            date: new Date(),
            performedBy: req.user.id
        });

        // Auto-convert status from New to Contacted
        if (lead.status === 'New') {
            const oldStatus = lead.status;
            lead.status = 'Contacted';
            lead.history.push({
                type: 'StatusChange',
                content: `Automatically changed from ${oldStatus} to Contacted (Email sent)`,
                date: new Date(),
                performedBy: req.user.id
            });
        }

        await lead.save();

        // Invalidate caches
        await redisClient.del(getCacheKey(req.user.id));
        await redisClient.del(`analytics:dashboard:${req.user.id}`);

        res.status(200).json({
            message: 'Email sent successfully',
            lead: lead
        });
    } catch (error) {
        console.error('Email sending error:', error);
        res.status(500).json({ message: 'Error sending email: ' + error.message });
    }
};

// @desc    Get all leads
// @route   GET /leads
// @access  Private
exports.getLeads = async (req, res) => {
    try {
        const cacheKey = getCacheKey(req.user.id);

        // Check cache
        const cachedLeads = await redisClient.get(cacheKey);
        if (cachedLeads && req.query.refresh !== 'true') {
            console.log(`Cache Hit for ${cacheKey}`);
            return res.status(200).json(JSON.parse(cachedLeads));
        }

        if (req.query.refresh === 'true') {
            console.log(`Cache Refresh requested for ${cacheKey}`);
        } else {
            console.log(`Cache Miss for ${cacheKey}`);
        }
        const leads = await Lead.find({ assignedTo: req.user.id });

        // Set cache (expire in 1 hour)
        await redisClient.set(cacheKey, JSON.stringify(leads), {
            EX: 3600
        });

        res.status(200).json(leads);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single lead
// @route   GET /leads/:id
// @access  Private
exports.getLead = async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id);

        if (!lead) {
            return res.status(404).json({ message: 'Lead not found' });
        }

        res.status(200).json(lead);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new lead
// @route   POST /leads
// @access  Private
exports.createLead = async (req, res) => {
    try {
        // Automatically assign to current user
        const leadData = { ...req.body, assignedTo: req.user.id };
        const lead = await Lead.create(leadData);

        // Invalidate cache
        await redisClient.del(getCacheKey(req.user.id));

        res.status(201).json(lead);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update lead
// @route   PUT /leads/:id
// @access  Private
exports.updateLead = async (req, res) => {
    try {
        let lead = await Lead.findOne({ _id: req.params.id, assignedTo: req.user.id });

        if (!lead) {
            return res.status(404).json({ message: 'Lead not found or unauthorized' });
        }

        // Check if status is being updated
        if (req.body.status && req.body.status !== lead.status) {
            lead.history.push({
                type: 'StatusChange',
                content: `Changed from ${lead.status} to ${req.body.status}`,
                date: new Date(),
                performedBy: req.user.id
            });
        }

        // Update other fields
        Object.assign(lead, req.body);
        await lead.save();

        // Invalidate caches
        await redisClient.del(getCacheKey(req.user.id));
        await redisClient.del(`analytics:dashboard:${req.user.id}`);

        res.status(200).json(lead);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete lead
// @route   DELETE /leads/:id
// @access  Private
exports.deleteLead = async (req, res) => {
    try {
        const lead = await Lead.findOneAndDelete({ _id: req.params.id, assignedTo: req.user.id });

        if (!lead) {
            return res.status(404).json({ message: 'Lead not found or unauthorized' });
        }

        // Invalidate cache
        await redisClient.del(getCacheKey(req.user.id));

        res.status(200).json({ message: 'Lead removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// @desc    Import bulk leads
// @route   POST /leads/bulk
// @access  Private
exports.importLeads = async (req, res) => {
    try {
        const leadsData = req.body;

        if (!Array.isArray(leadsData)) {
            return res.status(400).json({ message: 'Input data must be an array' });
        }

        // Add assignedTo if available in req.user
        const leads = leadsData.map(lead => ({
            ...lead,
            assignedTo: req.user ? req.user.id : undefined
        }));

        const result = await Lead.insertMany(leads);

        // Invalidate cache
        await redisClient.del(getCacheKey(req.user.id));

        res.status(201).json({ message: 'Leads imported successfully', count: result.length });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete multiple leads
// @route   POST /leads/bulk-delete
// @access  Private
exports.deleteLeadsBulk = async (req, res) => {
    try {
        const { leadIds } = req.body;

        if (!leadIds || !Array.isArray(leadIds) || leadIds.length === 0) {
            return res.status(400).json({ message: 'No lead IDs provided' });
        }

        const result = await Lead.deleteMany({
            _id: { $in: leadIds },
            assignedTo: req.user.id
        });

        // Invalidate cache
        await redisClient.del(getCacheKey(req.user.id));

        res.status(200).json({ message: `${result.deletedCount} leads deleted successfully` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Send email to multiple leads
// @route   POST /leads/bulk-email
// @access  Private
exports.sendEmailToLeadsBulk = async (req, res) => {
    const { leadIds, subject, message } = req.body;

    if (!leadIds || !Array.isArray(leadIds) || leadIds.length === 0) {
        return res.status(400).json({ message: 'No lead IDs provided' });
    }

    try {
        const leads = await Lead.find({
            _id: { $in: leadIds },
            assignedTo: req.user.id
        });

        let successCount = 0;
        let failCount = 0;

        // Send emails in parallel
        const emailPromises = leads.map(async (lead) => {
            if (!lead.email) {
                failCount++;
                return;
            }

            try {
                const mailOptions = {
                    from: process.env.FROM_EMAIL || 'Salesor CRM <noreply@salesor.com>',
                    to: lead.email,
                    subject: subject,
                    text: message,
                    html: `<div style="font-family: sans-serif; padding: 20px;">
                            <h2 style="color: #2563eb;">Message from Salesor</h2>
                            <p style="white-space: pre-wrap;">${message}</p>
                           </div>`
                };

                await transporter.sendMail(mailOptions);

                // Record in history
                lead.history.push({
                    type: 'Email',
                    content: `Subject: ${subject} (Bulk)`,
                    date: new Date(),
                    performedBy: req.user.id
                });

                // Auto-convert status
                if (lead.status === 'New') {
                    lead.status = 'Contacted';
                    lead.history.push({
                        type: 'StatusChange',
                        content: `Automatically changed from New to Contacted (Bulk Email)`,
                        date: new Date(),
                        performedBy: req.user.id
                    });
                }

                await lead.save();
                successCount++;
            } catch (err) {
                console.error(`Failed to send email to ${lead.email}:`, err);
                failCount++;
            }
        });

        await Promise.all(emailPromises);

        // Invalidate caches
        await redisClient.del(getCacheKey(req.user.id));
        await redisClient.del(`analytics:dashboard:${req.user.id}`);

        res.status(200).json({
            message: `Emails sent: ${successCount} succeeded, ${failCount} failed`,
            successCount,
            failCount
        });
    } catch (error) {
        res.status(500).json({ message: 'Error processing bulk emails: ' + error.message });
    }
};

// @desc    Log WhatsApp message to multiple leads
// @route   POST /leads/bulk-whatsapp
// @access  Private
exports.sendWhatsAppToLeadsBulk = async (req, res) => {
    const { leadIds, message } = req.body;

    if (!leadIds || !Array.isArray(leadIds) || leadIds.length === 0) {
        return res.status(400).json({ message: 'No lead IDs provided' });
    }

    try {
        const leads = await Lead.find({
            _id: { $in: leadIds },
            assignedTo: req.user.id
        });

        const updates = leads.map(async (lead) => {
            // Record in history
            lead.history.push({
                type: 'Note', // Using Note for now as 'WhatsApp' might not be in enum yet, or we can add it
                content: `WhatsApp Message: ${message}`,
                date: new Date(),
                performedBy: req.user.id
            });

            // Auto-convert status
            if (lead.status === 'New') {
                lead.status = 'Contacted';
                lead.history.push({
                    type: 'StatusChange',
                    content: `Automatically changed from New to Contacted (WhatsApp)`,
                    date: new Date(),
                    performedBy: req.user.id
                });
            }

            return lead.save();
        });

        await Promise.all(updates);

        // Invalidate caches
        await redisClient.del(getCacheKey(req.user.id));
        await redisClient.del(`analytics:dashboard:${req.user.id}`);

        res.status(200).json({
            message: `WhatsApp activity recorded for ${leads.length} leads`,
            count: leads.length
        });
    } catch (error) {
        res.status(500).json({ message: 'Error processing WhatsApp logs: ' + error.message });
    }
};
