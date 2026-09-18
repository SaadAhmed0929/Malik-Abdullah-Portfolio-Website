import nodemailer from 'nodemailer';

// In-memory rate limiting map (IP -> { count, resetTime })
// In production serverless environments, this protects against rapid burst flooding per instance.
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 5;

// Helper to sanitize input strings against XSS / Header injection
function sanitizeInput(str = '') {
    return String(str)
        .replace(/[\r\n]+/g, ' ') // Prevent email header injection
        .replace(/[<>]/g, '')     // Strip HTML angle brackets
        .trim();
}

export default async function handler(req, res) {
    // 1. Enforce HTTP method
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // 2. Extract client IP for Rate Limiting
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown_ip';
    const now = Date.now();
    const rateRecord = rateLimitMap.get(ip) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW_MS };

    if (now > rateRecord.resetTime) {
        rateRecord.count = 0;
        rateRecord.resetTime = now + RATE_LIMIT_WINDOW_MS;
    }

    if (rateRecord.count >= MAX_REQUESTS_PER_WINDOW) {
        return res.status(429).json({
            error: 'Too many requests. Please wait 10 minutes before sending another message.'
        });
    }
    rateRecord.count += 1;
    rateLimitMap.set(ip, rateRecord);

    // 3. Extract and check for Honeypot field (Anti-Bot Spam Protection)
    const { name, email, message, botcheck } = req.body;
    if (botcheck && botcheck.trim() !== '') {
        // Silent success drop for automated spambots
        return res.status(200).json({ success: 'Message sent successfully!' });
    }

    // 4. Validate required fields & Length constraints
    if (!name || !email || !message) {
        return res.status(400).json({ error: 'All fields are required.' });
    }
    if (name.length > 100 || email.length > 150 || message.length > 5000) {
        return res.status(400).json({ error: 'Input field exceeds maximum allowed character length.' });
    }

    // 5. Strict Email format regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Please provide a valid email address.' });
    }

    // 6. Sanitize fields
    const cleanName = sanitizeInput(name);
    const cleanEmail = sanitizeInput(email);
    const cleanMessage = String(message).trim(); // Allow line breaks in body, but keep clean

    // 7. Transporter Setup
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: cleanEmail,
        to: process.env.EMAIL_USER,
        subject: `[Portfolio Contact] Message from ${cleanName}`,
        text: `You have received a new message from your portfolio contact form.\n\nSender Name: ${cleanName}\nSender Email: ${cleanEmail}\nClient IP: ${ip}\n\nMessage:\n${cleanMessage}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: 'Message sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send message. Please try again later.' });
    }
}
