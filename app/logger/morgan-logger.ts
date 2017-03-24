import { getLogger } from './logger';
import * as express from 'express';
import * as morgan from 'morgan';
import { TTS4T_HTTP } from '../../typings';

const httpLogger = getLogger('http');

class MorganLogger implements morgan.StreamOptions {
  // morgan passes newline to a stream. so let's cut it.
  //
  // http://stackoverflow.com/questions/14572413
  // https://github.com/expressjs/morgan/issues/70
  public write(str: string): void {
    const withoutEmptyCharacters: string = str.replace(/^\s+|\s+$/g, '');
    httpLogger.info(withoutEmptyCharacters);
  }
}

morgan.token('tickserId', function (req: TTS4T_HTTP.Request, res: TTS4T_HTTP.Response): string {
  if (req.local == null) {
    return '(tid: no)';
  }

  if ((req.local.user != null) && (req.local.user.id != null)) {
    return '(tid: ' + req.local.user.id + ')';
  }
  //
  //// forLogging stuff is analyzed to provide more consistent behavior - in logs in [http] row there always be tickserId
  //if ((req.local.forLogging != null) && (req.local.forLogging.tickserId != null)) {
  //  return '(tid: ' + req.local.forLogging.tickserId + ')';
  //}

  return '(tid: no)';
});

const MORGAN_LOG_FORMAT: string =
  ':tickserId' +
  ' :req[x-forwarded-for]' +
  ' :remote-addr -' +
  ' :remote-user' +
  ' [:date[clf]]' +
  ' ":method :url HTTP/:http-version"' +
  ' :status' +
  ' :res[content-length]' +
  ' ":referrer"' +
  ' ":user-agent" -' +
  ' :response-time ms';

const MORGAN_OPTIONS: morgan.Options = {
  stream: new MorganLogger()
};

//noinspection TypeScriptValidateTypes
export const logger: express.RequestHandler = morgan(MORGAN_LOG_FORMAT, MORGAN_OPTIONS);