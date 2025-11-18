import nodemailer from 'nodemailer';
import logger from '../config/logger.js';

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT),
      secure: process.env.EMAIL_PORT === '465',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  async sendVerificationEmail(email, token, firstName) {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
    
    const mailOptions = {
      from: `"Sakina - Child Safety App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '🌈 Verify Your Email - Sakina App',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%); margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; padding: 40px; box-shadow: 0 10px 40px rgba(255, 105, 180, 0.3); }
            .header { text-align: center; margin-bottom: 30px; }
            .logo { font-size: 48px; margin-bottom: 10px; }
            h1 { color: #ff69b4; margin: 0; }
            .content { color: #333; line-height: 1.6; }
            .button { display: inline-block; padding: 15px 40px; background: linear-gradient(135deg, #ff9a9e 0%, #ff69b4 100%); color: white; text-decoration: none; border-radius: 50px; font-weight: bold; margin: 20px 0; box-shadow: 0 4px 15px rgba(255, 105, 180, 0.4); }
            .button:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(255, 105, 180, 0.5); }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 2px solid #fecfef; color: #666; font-size: 14px; text-align: center; }
            .decorations { text-align: center; font-size: 24px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🌸</div>
              <h1>Welcome to Sakina!</h1>
            </div>
            
            <div class="decorations">🌈 ☁️ ⭐ ✨ 💫</div>
            
            <div class="content">
              <p>Hi ${firstName}! 👋</p>
              
              <p>Thank you for joining Sakina - the fun and safe learning app for children! We're excited to have you and your child start this wonderful learning journey.</p>
              
              <p>To get started, please verify your email address by clicking the button below:</p>
              
              <div style="text-align: center;">
                <a href="${verificationUrl}" class="button">✨ Verify My Email ✨</a>
              </div>
              
              <p>Or copy and paste this link into your browser:</p>
              <p style="background: #fecfef; padding: 10px; border-radius: 5px; word-break: break-all; font-size: 12px;">${verificationUrl}</p>
              
              <p><strong>This link will expire in 24 hours.</strong></p>
              
              <p>Once verified, you can:</p>
              <ul>
                <li>🎮 Let your child enjoy safe, educational games</li>
                <li>📚 Access interactive learning modules</li>
                <li>👨‍👩‍👧 Monitor progress with parental controls</li>
                <li>📊 View detailed activity reports</li>
              </ul>
            </div>
            
            <div class="decorations">💖 🎨 🎯 🎪 🎭</div>
            
            <div class="footer">
              <p>If you didn't create an account with Sakina, please ignore this email.</p>
              <p>Need help? Contact us at support@sakina-app.com</p>
              <p>&copy; 2024 Sakina - Making Learning Fun & Safe! 🌟</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      logger.info(`Verification email sent to ${email}`);
      return true;
    } catch (error) {
      logger.error(`Failed to send verification email to ${email}:`, error);
      throw new Error('Failed to send verification email');
    }
  }

  async sendPasswordResetEmail(email, token, firstName) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    
    const mailOptions = {
      from: `"Sakina - Child Safety App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '🔐 Reset Your Password - Sakina App',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%); margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; padding: 40px; box-shadow: 0 10px 40px rgba(255, 105, 180, 0.3); }
            .header { text-align: center; margin-bottom: 30px; }
            .logo { font-size: 48px; margin-bottom: 10px; }
            h1 { color: #ff69b4; margin: 0; }
            .content { color: #333; line-height: 1.6; }
            .button { display: inline-block; padding: 15px 40px; background: linear-gradient(135deg, #ff9a9e 0%, #ff69b4 100%); color: white; text-decoration: none; border-radius: 50px; font-weight: bold; margin: 20px 0; box-shadow: 0 4px 15px rgba(255, 105, 180, 0.4); }
            .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 2px solid #fecfef; color: #666; font-size: 14px; text-align: center; }
            .decorations { text-align: center; font-size: 24px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🔒</div>
              <h1>Password Reset Request</h1>
            </div>
            
            <div class="decorations">🌈 ☁️ ⭐</div>
            
            <div class="content">
              <p>Hi ${firstName},</p>
              
              <p>We received a request to reset your password for your Sakina account. No worries - it happens to everyone!</p>
              
              <p>Click the button below to reset your password:</p>
              
              <div style="text-align: center;">
                <a href="${resetUrl}" class="button">🔐 Reset Password</a>
              </div>
              
              <p>Or copy and paste this link into your browser:</p>
              <p style="background: #fecfef; padding: 10px; border-radius: 5px; word-break: break-all; font-size: 12px;">${resetUrl}</p>
              
              <div class="warning">
                <strong>⚠️ Security Notice:</strong>
                <ul style="margin: 10px 0;">
                  <li>This link will expire in 1 hour</li>
                  <li>If you didn't request this, please ignore this email</li>
                  <li>Your password won't change unless you click the link above</li>
                  <li>Never share this link with anyone</li>
                </ul>
              </div>
              
              <p>After resetting your password, you'll be able to access all the wonderful features of Sakina again! 🎉</p>
            </div>
            
            <div class="decorations">💖 ✨ 💫</div>
            
            <div class="footer">
              <p>If you didn't request a password reset, please contact us immediately at security@sakina-app.com</p>
              <p>&copy; 2024 Sakina - Your Child's Safety is Our Priority! 🌟</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      logger.info(`Password reset email sent to ${email}`);
      return true;
    } catch (error) {
      logger.error(`Failed to send password reset email to ${email}:`, error);
      throw new Error('Failed to send password reset email');
    }
  }

  async sendWelcomeEmail(email, firstName, childName) {
    const mailOptions = {
      from: `"Sakina - Child Safety App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '🎉 Welcome to Sakina - Let the Learning Begin!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%); margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; padding: 40px; box-shadow: 0 10px 40px rgba(255, 105, 180, 0.3); }
            .header { text-align: center; margin-bottom: 30px; }
            .logo { font-size: 48px; margin-bottom: 10px; }
            h1 { color: #ff69b4; margin: 0; }
            .content { color: #333; line-height: 1.6; }
            .feature-box { background: linear-gradient(135deg, #fecfef 0%, #ffdde1 100%); padding: 20px; border-radius: 15px; margin: 15px 0; }
            .button { display: inline-block; padding: 15px 40px; background: linear-gradient(135deg, #ff9a9e 0%, #ff69b4 100%); color: white; text-decoration: none; border-radius: 50px; font-weight: bold; margin: 20px 0; box-shadow: 0 4px 15px rgba(255, 105, 180, 0.4); }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 2px solid #fecfef; color: #666; font-size: 14px; text-align: center; }
            .decorations { text-align: center; font-size: 24px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🎊</div>
              <h1>Welcome to Sakina!</h1>
            </div>
            
            <div class="decorations">🌈 ☁️ ⭐ ✨ 💫 🎨 🎯</div>
            
            <div class="content">
              <p>Hi ${firstName}! 🎉</p>
              
              <p>Congratulations! Your email has been verified and ${childName}'s learning adventure can begin! 🚀</p>
              
              <h2 style="color: #ff69b4; text-align: center;">What's Inside Sakina?</h2>
              
              <div class="feature-box">
                <h3>🎮 Fun Learning Games</h3>
                <p>Interactive games that teach body safety, object recognition, and important life skills through play!</p>
              </div>
              
              <div class="feature-box">
                <h3>📚 Educational Modules</h3>
                <p>Engaging lessons on body parts, safe vs. unsafe scenarios, and age-appropriate safety concepts.</p>
              </div>
              
              <div class="feature-box">
                <h3>👨‍👩‍👧 Parental Controls</h3>
                <p>PIN-protected dashboard to monitor progress, set time limits, and track your child's activities.</p>
              </div>
              
              <div class="feature-box">
                <h3>📊 Progress Tracking</h3>
                <p>Detailed reports showing game scores, learning milestones, and time spent on each activity.</p>
              </div>
              
              <div style="text-align: center;">
                <a href="${process.env.FRONTEND_URL}/login" class="button">🚀 Start Learning Now!</a>
              </div>
              
              <h3 style="color: #ff69b4;">Quick Tips for Parents:</h3>
              <ul>
                <li>🔐 Set up parental controls with a secure PIN (default: 1234)</li>
                <li>⏰ Configure daily time limits to balance screen time</li>
                <li>📱 Check the dashboard regularly to see progress</li>
                <li>👂 Talk with ${childName} about what they're learning</li>
                <li>🎯 Celebrate their achievements and progress!</li>
              </ul>
            </div>
            
            <div class="decorations">💖 🎪 🎭 🌟 💝</div>
            
            <div class="footer">
              <p>Need help getting started? Visit our Help Center or email support@sakina-app.com</p>
              <p>Follow us for tips and updates! 📱</p>
              <p>&copy; 2024 Sakina - Making Learning Fun & Safe! 🌟</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      logger.info(`Welcome email sent to ${email}`);
      return true;
    } catch (error) {
      logger.error(`Failed to send welcome email to ${email}:`, error);
      throw new Error('Failed to send welcome email');
    }
  }
}

export default new EmailService();
