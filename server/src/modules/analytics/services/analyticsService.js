const Lead = require('../../leads/models/Lead');
const User = require('../../auth/models/User');

exports.getStats = async () => {
    const totalLeads = await Lead.countDocuments();
    const totalUsers = await User.countDocuments();

    // Stats for today
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const newLeadsToday = await Lead.countDocuments({ createdAt: { $gte: startOfToday } });

    // Mock revenue calculation based on won leads
    const wonLeads = await Lead.find({ status: 'Won' });
    const totalRevenue = wonLeads.reduce((acc, lead) => acc + (lead.value || 0), 0);

    const leadsByStatus = await Lead.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Conversion rate
    const convertedLeads = await Lead.countDocuments({ status: 'Won' });
    const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;

    // Recent Activities (last 5 leads)
    const recentActivities = await Lead.find().sort({ updatedAt: -1 }).limit(5);

    return {
        totalLeads,
        totalUsers,
        totalRevenue,
        newLeadsToday,
        conversionRate,
        leadsByStatus,
        recentActivities
    };
};
