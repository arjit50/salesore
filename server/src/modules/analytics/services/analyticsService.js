const mongoose = require('mongoose');
const Lead = require('../../leads/models/Lead');
const User = require('../../auth/models/User');

exports.getStats = async (userId) => {
    const filter = { assignedTo: userId };

    const totalLeads = await Lead.countDocuments(filter);

    // Stats for today
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const newLeadsToday = await Lead.countDocuments({
        ...filter,
        createdAt: { $gte: startOfToday }
    });

    // Revenue calculation based on won leads
    const wonLeads = await Lead.find({ ...filter, status: 'Won' });
    const totalRevenue = wonLeads.reduce((acc, lead) => acc + (lead.value || 0), 0);

    const leadsByStatus = await Lead.aggregate([
        { $match: { assignedTo: new mongoose.Types.ObjectId(userId) } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Conversion rate
    const convertedLeads = await Lead.countDocuments({ ...filter, status: 'Won' });
    const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;

    // Weekly performance data for charts
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const weeklyPerformance = await Lead.aggregate([
        {
            $match: {
                assignedTo: new mongoose.Types.ObjectId(userId),
                createdAt: { $gte: sevenDaysAgo }
            }
        },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                leads: { $sum: 1 },
                won: { $sum: { $cond: [{ $eq: ["$status", "Won"] }, 1, 0] } },
                revenue: { $sum: "$value" }
            }
        },
        { $sort: { "_id": 1 } }
    ]);

    // Source breakdown
    const sourceBreakdown = await Lead.aggregate([
        { $match: { assignedTo: new mongoose.Types.ObjectId(userId) } },
        { $group: { _id: '$source', value: { $sum: 1 } } }
    ]);

    // Simplified aggregation of histories
    const allLeadsWithHistory = await Lead.find(filter).select('name history');

    // Flatten and enrich history items with lead names
    let allHistory = [];
    allLeadsWithHistory.forEach(lead => {
        if (lead.history && lead.history.length > 0) {
            lead.history.forEach(h => {
                allHistory.push({
                    _id: h._id,
                    leadId: lead._id,
                    leadName: lead.name,
                    type: h.type,
                    content: h.content,
                    date: h.date,
                    performedBy: h.performedBy
                });
            });
        }
    });

    // Sort by date descending and limit to top 20 for the activity feed
    const recentActivities = allHistory
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 20);

    return {
        totalLeads,
        totalRevenue,
        newLeadsToday,
        conversionRate,
        leadsByStatus,
        recentActivities,
        weeklyPerformance,
        sourceBreakdown
    };
};
