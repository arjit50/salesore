const { getStats } = require('../services/analyticsService');
const redisClient = require('../../../config/redis');

const CACHE_KEY = 'analytics:dashboard';

// @desc    Get dashboard stats
// @route   GET /analytics/dashboard
// @access  Private
exports.getDashboardStats = async (req, res) => {
    try {
        const cacheKey = `analytics:dashboard:${req.user.id}`;

        // Check cache
        const cachedStats = await redisClient.get(cacheKey);
        if (cachedStats) {
            console.log(`Cache Hit for ${cacheKey}`);
            return res.status(200).json(JSON.parse(cachedStats));
        }

        console.log(`Cache Miss for ${cacheKey}`);
        const stats = await getStats(req.user.id);

        // Set cache (expire in 10 minutes)
        await redisClient.set(cacheKey, JSON.stringify(stats), {
            EX: 600
        });

        res.status(200).json(stats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
