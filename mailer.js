const nodemailer = require("nodemailer");

class Mailer {
  constructor(to, text, subject) {
    this.to = to;
    this.text = text;
    this.subject = subject;
  }

  async sendEmail() {
    const mailTransporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      port: 4000,
    });

    let details = {
      from: process.env.EMAIL_USER,
      to: this.to,
      subject: this.subject,
      text: this.text,
    };

    try {
      await mailTransporter.sendMail(details);
      // console.log("Email sent successfully");
    } catch (err) {
      console.error("Error sending email:", err);
    }
  }
}

module.exports = Mailer;
