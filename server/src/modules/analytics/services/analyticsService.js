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

    // Source conversion tracking - which source converts best
    const sourceConversion = await Lead.aggregate([
        { $match: { assignedTo: new mongoose.Types.ObjectId(userId) } },
        {
            $group: {
                _id: '$source',
                totalLeads: { $sum: 1 },
                wonLeads: { $sum: { $cond: [{ $eq: ['$status', 'Won'] }, 1, 0] } },
                totalRevenue: { $sum: { $cond: [{ $eq: ['$status', 'Won'] }, '$value', 0] } }
            }
        },
        {
            $project: {
                _id: 1,
                totalLeads: 1,
                wonLeads: 1,
                totalRevenue: 1,
                conversionRate: {
                    $cond: [
                        { $gt: ['$totalLeads', 0] },
                        { $multiply: [{ $divide: ['$wonLeads', '$totalLeads'] }, 100] },
                        0
                    ]
                }
            }
        },
        { $sort: { conversionRate: -1 } }
    ]);

    // Lead Scoring System - Score leads based on email engagement and budget
    const allLeads = await Lead.find(filter).select('name email value emailOpens emailReplies status source lastEngagementDate');

    // Find max value for scaling
    const maxValue = allLeads.reduce((max, lead) => Math.max(max, lead.value || 0), 1);

    // Calculate scores for each lead
    const scoredLeads = allLeads.map(lead => {
        // Email opens: max 50 points (10 points per open, capped at 5 opens)
        const openScore = Math.min((lead.emailOpens || 0) * 10, 50);

        // Email replies: max 75 points (25 points per reply, capped at 3 replies)
        const replyScore = Math.min((lead.emailReplies || 0) * 25, 75);

        // Budget/Value: max 100 points (scaled based on highest value)
        const valueScore = maxValue > 0 ? ((lead.value || 0) / maxValue) * 100 : 0;

        // Total raw score (0-225)
        const rawScore = openScore + replyScore + valueScore;

        // Normalize to 0-100
        const normalizedScore = Math.round((rawScore / 225) * 100);

        return {
            _id: lead._id,
            name: lead.name,
            email: lead.email,
            value: lead.value || 0,
            emailOpens: lead.emailOpens || 0,
            emailReplies: lead.emailReplies || 0,
            status: lead.status,
            source: lead.source,
            lastEngagementDate: lead.lastEngagementDate,
            score: normalizedScore,
            scoreBreakdown: {
                openScore,
                replyScore,
                valueScore: Math.round(valueScore)
            }
        };
    });

    // Sort by score and get top 10
    const topScoredLeads = scoredLeads
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);


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



    // Identify Inactive Leads (> 3 days)
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    const inactiveLeads = await Lead.find({
        ...filter,
        status: { $nin: ['Won', 'Lost'] }, // Only active leads
        $or: [
            { lastEngagementDate: { $lt: threeDaysAgo } },
            { lastEngagementDate: { $exists: false }, createdAt: { $lt: threeDaysAgo } },
            { lastEngagementDate: null, createdAt: { $lt: threeDaysAgo } }
        ]
    })
        .select('name email phone status lastEngagementDate createdAt value whatsappNumber')
        .sort({ lastEngagementDate: 1, createdAt: 1 }) // Most stagnant first
        .limit(5);

    return {
        inactiveLeads,
        totalLeads,
        totalRevenue,
        newLeadsToday,
        conversionRate,
        leadsByStatus,
        recentActivities,
        weeklyPerformance,
        sourceBreakdown,
        sourceConversion,
        topScoredLeads
    };
};
