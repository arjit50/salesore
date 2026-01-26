const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
    },
    phone: {
        type: String,
    },
    whatsappNumber: {
        type: String,
    },
    status: {
        type: String,
        enum: ['New', 'Contacted', 'Qualified', 'Proposal', 'Lost', 'Won'],
        default: 'New',
    },
    source: {
        type: String,
        default: 'Website',
    },
    value: {
        type: Number,
        default: 0,
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    history: [
        {
            type: {
                type: String,
                enum: ['Email', 'StatusChange', 'Note', 'Call'],
                required: true
            },
            content: String,
            date: {
                type: Date,
                default: Date.now
            },
            performedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Lead', leadSchema);
