import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import connectDB from "@/utils/connectDB";
import { SubscribedEmail } from "@/models/subscribed-emails";

const getEmailTemplate = (title, message, contactEmail, contactInfo) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>${title}</title>
        <!--[if mso]>
        <noscript>
            <xml>
                <o:OfficeDocumentSettings>
                    <o:PixelsPerInch>96</o:PixelsPerInch>
                </o:OfficeDocumentSettings>
            </xml>
        </noscript>
        <![endif]-->
        <style>
            /* Reset and base styles */
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
                background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
                color: #2c3e50;
                margin: 0;
                padding: 0;
                min-height: 100vh;
                line-height: 1.6;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
            }
            
            /* Table-based layout for email clients */
            table {
                border-collapse: collapse;
                mso-table-lspace: 0pt;
                mso-table-rspace: 0pt;
            }
            
            .email-wrapper {
                width: 100%;
                background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
                padding: 20px 0;
            }
            
            .container {
                max-width: 600px;
                margin: 0 auto;
                background: #ffffff;
                border-radius: 16px;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
                overflow: hidden;
                border: 1px solid rgba(255, 255, 255, 0.2);
            }
            
            /* Brand header with gradient */
            .brand-header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                padding: 40px 20px 30px;
                text-align: center;
                position: relative;
                overflow: hidden;
            }
            
            .brand-header::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 20"><defs><radialGradient id="a" cx="50%" cy="40%"><stop offset="0%" stop-color="%23fff" stop-opacity=".1"/><stop offset="100%" stop-color="%23fff" stop-opacity="0"/></radialGradient></defs><rect width="100" height="20" fill="url(%23a)"/></svg>');
                opacity: 0.3;
            }
            
            .brand-header h1 {
                position: relative;
                margin: 0;
                font-size: 2.5rem;
                font-weight: 900;
                letter-spacing: 3px;
                color: #ffffff;
                text-transform: uppercase;
                text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
                margin-bottom: 8px;
            }
            
            .brand-header .tagline {
                position: relative;
                font-size: 1.1rem;
                color: rgba(255, 255, 255, 0.9);
                font-weight: 400;
                letter-spacing: 1.5px;
                text-transform: uppercase;
                font-size: 0.9rem;
            }
            
            /* Main content area */
            .content {
                padding: 40px 30px 30px;
                background: #ffffff;
            }
            
            .content h2 {
                margin: 0 0 24px 0;
                color: #2c3e50;
                font-size: 1.75rem;
                font-weight: 700;
                line-height: 1.3;
                text-align: center;
            }
            
            .message {
                font-size: 1.1rem;
                color: #34495e;
                line-height: 1.8;
                margin: 0 0 30px 0;
                text-align: left;
            }
            
            .message p {
                margin: 0 0 16px 0;
            }
            
            /* Contact info card */
            .contact-info {
                margin-top: 30px;
                padding: 24px 26px;
                background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                border: 1px solid #dee2e6;
                border-radius: 12px;
                position: relative;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
            }
            
            .contact-info::before {
                content: '';
                position: absolute;
                left: 0;
                top: 0;
                bottom: 0;
                width: 4px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 2px 0 0 2px;
            }
            
            .contact-info h3 {
                margin: 0 0 12px 0;
                font-size: 1.2rem;
                color: #2c3e50;
                font-weight: 600;
            }
            
            .contact-info p {
                margin: 0 0 8px 0;
                color: #495057;
                font-size: 1rem;
            }
            
            .contact-email {
                color: #667eea !important;
                text-decoration: none;
                font-weight: 600;
                padding: 8px 16px;
                background: rgba(102, 126, 234, 0.1);
                border-radius: 6px;
                display: inline-block;
                margin-top: 8px;
                transition: all 0.3s ease;
            }
            
            .contact-email:hover {
                background: rgba(102, 126, 234, 0.15);
                transform: translateY(-1px);
            }
            
            /* CTA Button */
            .cta-button {
                display: inline-block;
                padding: 14px 32px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: #ffffff !important;
                text-decoration: none;
                border-radius: 50px;
                font-weight: 600;
                font-size: 1rem;
                text-align: center;
                margin: 20px auto;
                display: block;
                max-width: 250px;
                box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
                transition: all 0.3s ease;
            }
            
            .cta-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 12px 25px rgba(102, 126, 234, 0.4);
            }
            
            /* Footer */
            .footer {
                background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
                color: #bdc3c7;
                padding: 30px 30px 25px;
                text-align: center;
            }
            
            .footer-brand {
                font-size: 1.1rem;
                font-weight: 700;
                color: #ffffff;
                margin-bottom: 12px;
                letter-spacing: 1px;
            }
            
            .footer-description {
                font-size: 0.95rem;
                margin-bottom: 20px;
                opacity: 0.8;
            }
            
            .unsubscribe {
                font-size: 0.85rem;
                color: #95a5a6;
                line-height: 1.5;
                margin-top: 16px;
                padding-top: 16px;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .unsubscribe a {
                color: #667eea;
                text-decoration: none;
            }
            
            /* Mobile responsiveness */
            @media only screen and (max-width: 600px) {
                .email-wrapper {
                    padding: 10px;
                }
                
                .container {
                    margin: 0 10px;
                    border-radius: 12px;
                }
                
                .brand-header {
                    padding: 30px 20px 25px;
                }
                
                .brand-header h1 {
                    font-size: 2rem;
                    letter-spacing: 2px;
                }
                
                .brand-header .tagline {
                    font-size: 0.85rem;
                    letter-spacing: 1px;
                }
                
                .content {
                    padding: 30px 20px 25px;
                }
                
                .content h2 {
                    font-size: 1.5rem;
                    margin-bottom: 20px;
                }
                
                .message {
                    font-size: 1rem;
                    line-height: 1.7;
                }
                
                .contact-info {
                    padding: 20px 22px;
                    margin-top: 25px;
                }
                
                .contact-info h3 {
                    font-size: 1.1rem;
                }
                
                .footer {
                    padding: 25px 20px 20px;
                }
                
                .footer-brand {
                    font-size: 1rem;
                }
                
                .footer-description {
                    font-size: 0.9rem;
                }
                
                .unsubscribe {
                    font-size: 0.8rem;
                }
                
                .cta-button {
                    padding: 12px 28px;
                    font-size: 0.95rem;
                    margin: 18px auto;
                }
            }
            
            @media only screen and (max-width: 480px) {
                .container {
                    margin: 0 5px;
                }
                
                .brand-header h1 {
                    font-size: 1.8rem;
                    letter-spacing: 1.5px;
                }
                
                .content {
                    padding: 25px 18px 20px;
                }
                
                .content h2 {
                    font-size: 1.3rem;
                }
                
                .contact-info {
                    padding: 18px 20px;
                }
                
                .footer {
                    padding: 20px 18px 18px;
                }
            }
            
            /* Dark mode support */
            @media (prefers-color-scheme: dark) {
                .container {
                    background: #1a1a1a;
                    border-color: #333;
                }
                
                .content {
                    background: #1a1a1a;
                }
                
                .content h2 {
                    color: #ffffff;
                }
                
                .message {
                    color: #e0e0e0;
                }
                
                .contact-info {
                    background: linear-gradient(135deg, #2a2a2a 0%, #333333 100%);
                    border-color: #444;
                }
                
                .contact-info h3 {
                    color: #ffffff;
                }
                
                .contact-info p {
                    color: #cccccc;
                }
            }
        </style>
    </head>
    <body>
        <div class="email-wrapper">
            <div class="container">
                <div class="brand-header">
                    <h1>Century</h1>
                    <div class="tagline">Premium Fashion Marketplace</div>
                </div>
                <div class="content">
                    <h2>${title}</h2>
                    <div class="message">
                        ${message.replace(/\n/g, '<br>')}
                    </div>
                    ${contactInfo ? `
                    <div class="contact-info">
                        <h3>💬 Contact Information</h3>
                        <p>${contactInfo}</p>
                        ${contactEmail ? `<p>📧 <a href="mailto:${contactEmail}" class="contact-email">${contactEmail}</a></p>` : ''}
                    </div>
                    ` : ''}
                </div>
                <div class="footer">
                    <div class="footer-brand">CENTURY.COM</div>
                    <div class="footer-description">Premium Fashion • Exclusive Collections • Worldwide Delivery</div>
                    <div class="unsubscribe">
                        You're receiving this email because you subscribed to our premium updates.<br>
                        <a href="mailto:support@century.com?subject=Unsubscribe">Click here to unsubscribe</a> or contact our support team.
                    </div>
                </div>
            </div>
        </div>
    </body>
    </html>
  `;
};

export async function POST(request) {
  try {
    await connectDB();
    
    const { subject, title, message, contactEmail, contactInfo, senderEmail, senderPassword } = await request.json();

    // Validate required fields
    if (!subject || !title || !message || !senderEmail || !senderPassword) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Get all subscribers
    const subscribers = await SubscribedEmail.find({});
    
    if (subscribers.length === 0) {
      return NextResponse.json(
        { error: "No subscribers found" },
        { status: 400 }
      );
    }

    // Configure nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: senderEmail,
        pass: senderPassword
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Verify the transporter configuration
    try {
      await transporter.verify();
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid email credentials. Please check your email and password." },
        { status: 401 }
      );
    }

    // Send immediate response to frontend
    const response = NextResponse.json({
      success: true,
      message: "Email campaign started successfully!",
      subscriberCount: subscribers.length,
      status: "sending"
    });

    // Send emails in background (non-blocking)
    setImmediate(async () => {
      const emailTemplate = getEmailTemplate(title, message, contactEmail, contactInfo);
      
      let successCount = 0;
      let failCount = 0;

      for (const subscriber of subscribers) {
        try {
          await transporter.sendMail({
            from: `"Product Updates" <${senderEmail}>`,
            to: subscriber.email,
            subject: subject,
            html: emailTemplate
          });
          successCount++;
          
          // Add small delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error) {
          console.error(`Failed to send email to ${subscriber.email}:`, error);
          failCount++;
        }
      }

      // console.log(`Email campaign completed: ${successCount} sent, ${failCount} failed`);
    });

    return response;

  } catch (error) {
    console.error("Email campaign error:", error);
    return NextResponse.json(
      { error: "Failed to start email campaign" },
      { status: 500 }
    );
  }
}
