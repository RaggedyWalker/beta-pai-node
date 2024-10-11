import nodeMailer, { SendMailOptions } from 'nodemailer';
import { MAIL_P, MAIL_U, MAIL_HOST, ME_MAIL } from '../config';

const transporter = nodeMailer.createTransport({
  // 	smtp-mail.outlook.com  smtp.office365.com
  host: MAIL_HOST, // Outlook SMTP 服务器地址
  port: 465, // 使用端口587进行安全的传输
  secure: true, // 启用TLS
  auth: {
    user: MAIL_U, // 你的Outlook邮件地址
    pass: MAIL_P // 你的Outlook邮件密码
  }
});

export function sendMail(mailOptions: SendMailOptions) {
  const defaultOptions: SendMailOptions = {
    from: MAIL_U,
    to: ME_MAIL
  };
  const finalOptions = { ...defaultOptions, ...mailOptions };
  // 发送邮件
  return new Promise((resolve, reject) => {
    transporter.sendMail(finalOptions, (error, info) => {
      if (error) {
        console.log(error);
        return reject(error);
      }
      resolve('邮件发送成功: ' + info.response);
    });
  });
}

// sendMail({
//   subject: '测试nodejs发送邮件',
//   text: 'from betaeye'
// });
