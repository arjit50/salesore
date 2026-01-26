const nodemailer = require('nodemailer');

// Check if credentials are placeholders or missing
const isPlaceholder = (val) => !val || val === 'your_smtp_user' || val === 'your_smtp_pass' || val.includes('placeholder');

let transporter;

if (isPlaceholder(process.env.SMTP_USER) || isPlaceholder(process.env.SMTP_PASS)) {
    console.log('⚠️  Email credentials not found in .env. Falling back to console logging for emails.');
    transporter = {
        sendMail: async (options) => {
            console.log('📧 [MOCK EMAIL]');
            console.log(`To: ${options.to}`);
            console.log(`Subject: ${options.subject}`);
            console.log(`Body: ${options.text}`);
            return Promise.resolve({ messageId: 'mock-id' });
        }
    };
} else {
    transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.ethereal.email',
        port: process.env.SMTP_PORT || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
}

module.exports = transporter;

