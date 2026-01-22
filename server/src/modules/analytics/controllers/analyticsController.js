const { getStats } = require('../services/analyticsService');
const redisClient = require('../../../config/redis');

const CACHE_KEY = 'analytics:dashboard';

// @desc    Get dashboard stats
// @route   GET /analytics/dashboard
// @access  Private
exports.getDashboardStats = async (req, res) => {
    try {
        // Check cache
        const cachedStats = await redisClient.get(CACHE_KEY);
        if (cachedStats) {
            return res.status(200).json(JSON.parse(cachedStats));
        }

        const stats = await getStats();

        // Set cache (expire in 10 minutes)
        await redisClient.set(CACHE_KEY, JSON.stringify(stats), {
            EX: 600
        });

        res.status(200).json(stats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
