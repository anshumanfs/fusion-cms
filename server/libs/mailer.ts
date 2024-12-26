import nodemailer from 'nodemailer';
import { smtp } from '../../.secure.json';
import logger from './logger';
import config from '../../config.json';

const transporter = nodemailer.createTransport({
  ...smtp,
});

const sendMail = (to: string | [string], subject: string, text: string = '', html: string = '') => {
  const mailOptions = {
    from: `${config.APP_NAME} <${smtp.auth.user}>`,
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
