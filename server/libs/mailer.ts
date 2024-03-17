import nodemailer from 'nodemailer';
import { smtp } from '../../.secure.json';
import logger from './logger';

const transporter = nodemailer.createTransport({
  ...smtp,
});

const sendMail = (email: string, to: string | [string], subject: string, text: string = '', html: string = '') => {
  const mailOptions = {
    from: `Fusion CMS <${smtp.auth.user}>`,
    to,
    subject,
    text,
    html,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      logger.error(`Email Error :- ${error}`);
    } else {
      logger.info(`Email Sent :- ${info.response}`);
    }
  });
};

export default sendMail;
