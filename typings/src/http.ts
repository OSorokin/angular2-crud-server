import * as express from 'express';
import {User} from '../../models/index';

export namespace TTS4T_HTTP {

  export interface Next extends express.NextFunction {
  }

  export interface Response extends express.Response {
  }

  export interface Request extends express.Request {
    local: {
      user?: User.Instance;
    }
  }

}