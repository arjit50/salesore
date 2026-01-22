const Lead = require('../models/Lead');
const redisClient = require('../../../config/redis');

const CACHE_KEY = 'leads:all';

// @desc    Get all leads
// @route   GET /leads
// @access  Private
exports.getLeads = async (req, res) => {
    try {
        // Check cache
        const cachedLeads = await redisClient.get(CACHE_KEY);
        if (cachedLeads) {
            return res.status(200).json(JSON.parse(cachedLeads));
        }

        const leads = await Lead.find();

        // Set cache (expire in 1 hour)
        await redisClient.set(CACHE_KEY, JSON.stringify(leads), {
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
        const lead = await Lead.create(req.body);

        // Invalidate cache
        await redisClient.del(CACHE_KEY);

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
        const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!lead) {
            return res.status(404).json({ message: 'Lead not found' });
        }

        // Invalidate cache
        await redisClient.del(CACHE_KEY);

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
        const lead = await Lead.findByIdAndDelete(req.params.id);

        if (!lead) {
            return res.status(404).json({ message: 'Lead not found' });
        }

        // Invalidate cache
        await redisClient.del(CACHE_KEY);

        res.status(200).json({ message: 'Lead removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
