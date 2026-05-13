import nodemailer from 'nodemailer';
import { NEWS_SUMMARY_EMAIL_TEMPLATE, WELCOME_EMAIL_TEMPLATE } from '@/lib/nodemailer/templates';

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD,
    }
})

export const sendWelcomeEmail = async ({email, name, intro}: WelcomeEmailData) => {
    const htmlTemplate = WELCOME_EMAIL_TEMPLATE
        .replace('{{name}}', name)
        .replace('{{intro}}', intro);

    const mailOptions = {
        from: `Signalist <zubairsanaullah1122@gmail.com>`,
        to: email,
        subject: 'Welcome to Signalist! Your Journey to S marter Investing Starts Here',
        text: `Hi ${name},\n\n${intro}\n\nWelcome to Signalist! We're thrilled to have you on board and can't wait to help you achieve your investment goals. If you have any questions or need assistance, feel free to reach out to our support team.\n\nBest regards,\nThe Signalist Team`,
        html: htmlTemplate
    };

    await transporter.sendMail(mailOptions);
}
export const sendNewsSummaryEmail = async ({email, date, newsContent}: NewsSummaryEmailData) => {
    const htmlTemplate = NEWS_SUMMARY_EMAIL_TEMPLATE
        .replace('{{date}}', date)
        .replace('{{newsContent}}', newsContent);

    const mailOptions = {
        from: `Signalist <zubairsanaullah1122@gmail.com>`,
        to: email,
        subject: `Market News Summary Today - `,
        text: `Here is your market news summary for today, :\n\n`,
        html: htmlTemplate
    };

    await transporter.sendMail(mailOptions);
}
