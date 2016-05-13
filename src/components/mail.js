import nodemailer from 'nodemailer';
import config from '../config';
import { handleError } from './errors';
import logger from 'winston';

const smtpTransport = nodemailer.createTransport(config.smtpUrl);

export function sendMail(payload) {
    smtpTransport.sendMail(payload, (error, info) => {
        if (error) {
            return handleError(error);
        }
        logger.info(`Message sendt: ${info.response}`);
    });
}
