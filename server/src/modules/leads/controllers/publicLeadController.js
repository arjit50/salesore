const Lead = require('../models/Lead');
const User = require('../../auth/models/User');
const redisClient = require('../../../config/redis');

// @desc    Capture lead from public form
// @route   POST /leads/public/:userId
// @access  Public
exports.captureLead = async (req, res) => {
    try {
        const { userId } = req.params;
        const { name, email, phone, company, message, source } = req.body;

        // Verify user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Invalid form ID' });
        }

        // Basic validation
        if (!name || !email) {
            return res.status(400).json({ message: 'Name and Email are required' });
        }

        // Create the lead
        const lead = await Lead.create({
            name,
            email,
            phone,
            company, // Optional
            assignedTo: userId,
            source: source || 'Web Form',
            status: 'New',
            history: [{
                type: 'Note',
                content: message ? `Form Submission Message: ${message}` : 'Lead captured via Web Form',
                date: new Date()
            }]
        });

        // Invalidate cache for the user
        await redisClient.del(`leads:all:${userId}`);
        await redisClient.del(`analytics:dashboard:${userId}`);

        // Return a redirect or simple success message (Redirect is better for HTML forms)
        if (req.headers['content-type'] === 'application/x-www-form-urlencoded') {
            // If it's a standard HTML form submission, redirect back or to a thank you page
            // For now, we'll send a simple HTML response
            return res.send(`
                <div style="font-family: sans-serif; text-align: center; padding: 50px;">
                    <h1 style="color: #10b981;">Thank You!</h1>
                    <p>We have received your information and will contact you soon.</p>
                    <button onclick="window.history.back()" style="padding: 10px 20px; cursor: pointer;">Go Back</button>
                </div>
            `);
        }

        // For API/JSON requests
        res.status(201).json({ success: true, message: 'Lead captured successfully' });

    } catch (error) {
        console.error('Public lead capture error:', error);
        res.status(500).json({ message: 'Server error processing lead' });
    }
};
