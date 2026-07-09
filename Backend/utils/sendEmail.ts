import nodemailer from "nodemailer"

interface SendEmailOptions {
  email: string
  subject: string
  message: string
}

const sendEmail = async (options: SendEmailOptions): Promise<void> => {
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  })

  const message = {
    from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    html: options.message,
  }

  await transport.sendMail(message)
}

export default sendEmail
