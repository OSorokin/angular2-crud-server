import 'reflect-metadata';
import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as compression from 'compression';
import * as bodyParser from 'body-parser';
import * as serveFavicon from 'serve-favicon';
import * as fs from 'fs';
import * as path from 'path';
import {useExpressServer} from 'routing-controllers';
import * as Morgan from './logger/morgan-logger';
import config from './configuration';
import {TTS4T_HTTP} from './typings';
import {getLogger} from './logger/logger';
const logger = getLogger(__filename);

export default class WebServer {

  public static createWebServer(): express.Express {

    const expressServer: any = express();
    expressServer.use(compression());
    expressServer.use(Morgan.logger);
    expressServer.use(cors());
    expressServer.use(bodyParser.json());
    expressServer.use(bodyParser.urlencoded({extended: false}));
    expressServer.use(cookieParser());

    const server = useExpressServer(expressServer, {
      controllerDirs: [__dirname + '/controllers/*.js'],
      defaultErrorHandler: false,
    });

    WebServer.configureWebappFilesServing(server);

    return server;
  }

  private static configureWebappFilesServing(expressServer): void {

    expressServer.get('/*', (req: TTS4T_HTTP.Request, res: TTS4T_HTTP.Response, next: TTS4T_HTTP.Next) => {

      if (req.originalUrl.startsWith('/api')) {
        return next();
      }

    });
  }
}
