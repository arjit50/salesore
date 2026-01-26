const Lead = require('../../leads/models/Lead');
const axios = require('axios');

exports.handleChatMessage = async (req, res) => {
    const { message } = req.body;
    const userId = req.user.id;

    try {
        // Fetch data for context
        const leads = await Lead.find({ assignedTo: userId });
        const totalLeads = leads.length;
        const totalValue = leads.reduce((acc, lead) => acc + (lead.value || 0), 0);
        const wonLeads = leads.filter(l => l.status === 'Won').length;
        const statusCounts = leads.reduce((acc, lead) => {
            acc[lead.status] = (acc[lead.status] || 0) + 1;
            return acc;
        }, {});

        const context = `
            User CRM Data Summary:
            - Total Leads: ${totalLeads}
            - Total Potential Revenue: ₹ ${totalValue.toLocaleString()}
            - Closed/Won Deals: ${wonLeads}
            - Status Breakdown: ${JSON.stringify(statusCounts)}
            
            Current Leads Detail (Top 10 by value):
            ${leads.sort((a, b) => (b.value || 0) - (a.value || 0)).slice(0, 10).map(l => `- ${l.name}: ₹ ${l.value} (${l.status})`).join('\n')}
        `;

        const groqResponse = await axios.post(
            'https://api.groq.com/openai/v1/chat/completions',
            {
                model: 'llama-3.3-70b-versatile',
                messages: [
                    {
                        role: 'system',
                        content: `You are Salesor AI, a smart assistant for a CRM platform. 
                        Use the provided context to answer the user's questions concisely and professionally. 
                        If the user asks about their performance or leads, use the data provided. 
                        
                        FORMATTING RULES:
                        1. NEVER use asterisks (*) for bullet points or emphasis.
                        2. Use numbered lists (1., 2.) or simple dashes (-) for lists.
                        3. Use clear line breaks between points.
                        4. Do not use markdown bolding (which uses **). 
                        5. Keep the response organized and easy to read.
                        
                        Context: ${context}`
                    },
                    {
                        role: 'user',
                        content: message
                    }
                ],
                temperature: 0.7,
                max_tokens: 1024
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const aiMessage = groqResponse.data.choices[0].message.content;

        res.status(200).json({
            message: aiMessage,
            timestamp: new Date()
        });
    } catch (error) {
        console.error('Chat Error:', error.response?.data || error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};
