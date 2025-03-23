import dotenv from 'dotenv';
dotenv.config();
import nodemailer from 'nodemailer';
import JWT from 'jsonwebtoken'
// ** Helper for reauthenticating admin access token
async function generateAccessToken(admin) {
    return JWT.sign(admin, process.env.JWT_ACCESS_TOKEN_SECRET, { expiresIn: '72h' })
}
const mail = async ({ email, subject, message, header }) => {
    // Destructure environment variables with sensible defaults
    const MAILER_USERNAME = process.env.MAILER_USERNAME || "support@zenithearn.com";
    const MAILER_PASSWORD = process.env.MAILER_PASSWORD || "123654qwertA?"; // TODO: remove default password

    // Create the transporter using Namecheap Private Email settings
    const transporter = nodemailer.createTransport({
        host: 'mail.privateemail.com', // Fixed as per Namecheap guidelines
        port: 465,                     // For SSL (use 587 for TLS/STARTTLS if preferred)
        secure: true,                  // true for port 465, false for 587
        auth: {
            user: MAILER_USERNAME,
            pass: MAILER_PASSWORD,
        },
        // Outgoing server authentication must be enabled and SPA disabled per Namecheap recommendations.
    });

    try {
        const info = await transporter.sendMail({
            from: {
                name: "Zenithearn",
                address: MAILER_USERNAME,
            },
            to: Array.isArray(email) ? email.join(', ') : email,
            subject,
            html: generateEmailHTML({ message, header }),
        });

        return {
            success: true,
            accepted: info.accepted, // List of addresses that accepted the message
            rejected: info.rejected, // List of addresses that rejected the message
            response: info.response, // Server response
            messageId: info.messageId, // Message ID for tracking
        };
    } catch (error) {
        return {
            success: false,
            error: error.message, // Error message for debugging
        };
    }
};

export function generateEmailHTML(details) {
    const { message, header } = details
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    background-color: #f4f4f4;
                    color: #333;
                }
                .email-container {
                    max-width: 600px;
                    margin: 20px auto;
                    padding: 20px;
                    background-color: #ffffff;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }
                .header {
                    font-size: 24px;
                    font-weight: bold;
                    text-align: center;
                    margin-bottom: 20px;
                    color: #7B1FA2;
                }
                .content {
                    font-size: 16px;
                    line-height: 1.6;
                    margin-bottom: 20px;
                }
                .footer {
                    font-size: 14px;
                    text-align: center;
                    color: #777;
                    margin-top: 20px;
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="header">${header}</div>
                <div class="content">${message}</div>
                <div class="footer">
                    &copy; ${new Date().getFullYear()} Zenithearn. All rights reserved.
                </div>
            </div>
        </body>
        </html>
    `;
}
export { generateAccessToken, mail }
