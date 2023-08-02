// Copyright (c) 2023 Anshuman Nayak (AL03232)
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import formidable from 'formidable';
import lodash from 'lodash';
import { Request, Response, NextFunction } from 'express';

const customFileParser = (req: Request, res: Response, next: NextFunction) => {
  if (req.is('multipart/form-data')) {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err: any, fields: any, files: any) => {
      req.body = JSON.parse(fields.operations);
      const map = JSON.parse(fields.map);
      for (let key in files) {
        let fileKeyPath = map[key][0];
        let fileObj = files[key];
        lodash.set(req.body, fileKeyPath, fileObj);
      }
      req.headers['content-type'] = 'application/json';
      next();
    });
  } else {
    next();
  }
};

export { customFileParser };
