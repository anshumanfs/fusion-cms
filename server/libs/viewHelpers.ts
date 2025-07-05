/**
 * Helper utilities for the EJS templates and controllers
 */

import { Request, Response } from 'express';

/**
 * Flash message types
 */
export enum FlashType {
  SUCCESS = 'success',
  ERROR = 'error',
  INFO = 'info',
  WARNING = 'warning',
}

/**
 * Add a flash message and optionally redirect
 *
 * @param req Express request object
 * @param res Express response object
 * @param type Flash message type
 * @param message Flash message content
 * @param redirect Optional URL to redirect to
 */
export const addFlashMessage = (req: Request, res: Response, type: FlashType, message: string, redirect?: string) => {
  req.flash(type, message);
  req.flash('type', type);

  if (redirect) {
    res.redirect(redirect);
    return true;
  }

  return false;
};

/**
 * Set success flash message and optionally redirect
 */
export const flashSuccess = (req: Request, res: Response, message: string, redirect?: string) => {
  return addFlashMessage(req, res, FlashType.SUCCESS, message, redirect);
};

/**
 * Set error flash message and optionally redirect
 */
export const flashError = (req: Request, res: Response, message: string, redirect?: string) => {
  return addFlashMessage(req, res, FlashType.ERROR, message, redirect);
};

/**
 * Set info flash message and optionally redirect
 */
export const flashInfo = (req: Request, res: Response, message: string, redirect?: string) => {
  return addFlashMessage(req, res, FlashType.INFO, message, redirect);
};

/**
 * Set warning flash message and optionally redirect
 */
export const flashWarning = (req: Request, res: Response, message: string, redirect?: string) => {
  return addFlashMessage(req, res, FlashType.WARNING, message, redirect);
};
