import * as express from 'express';
import { resolve } from 'path';
import { config } from 'dotenv';
import * as compression from 'compression';
import * as logger from 'morgan';
import * as cors from 'cors';
import * as mongoose from 'mongoose';
import * as errorHandler from 'errorhandler';
import * as swaggerUI from 'swagger-ui-express';
import * as yaml from 'yamljs';
import { HTTP_BAD_REQUEST, HTTP_NOT_FOUND } from './helpers/http.responses';
import { getApiURL } from './helpers/server.utils';
import { OpenApiV3Object } from './models/open-api-v3-object.interface';
import { Auth } from './middleware/auth';
import { UploadService } from './services/upload.service';
import { EndpointService } from './services/endpoint.service';
import { MediaObjectRoute } from './routes/media-object.route';
import { ResourcePermissionRoute } from './routes/resource-permission.route';
import { RoleRoute } from './routes/role.route';
import { AuthRoute } from './routes/auth.route';
import { RootRoute } from './routes/root.route';
import { UserRoute } from './routes/user.route';
import { EndpointRoute } from './routes/endpoint.route';
import { BookRoute } from './routes/book.route';

class App {
  public express: express.Application;

  constructor() {
    this.express = express();
    this.setupEnvironment();
    this.middleware();
    this.enableCors();
    this.routes();
    this.setupSwagger();
    this.registerServices();
    this.registerHttpExceptions();
    this.launch();
  }

  /**
   * Load .env and set logging
   */
  private setupEnvironment(): void {
    switch (process.env.NODE_ENV) {
      case 'production': {
        config({path: resolve(__dirname, '../.env.production')});
        break;
      }
      case 'test': {
        this.express.use(errorHandler());
        config({path: resolve(__dirname, '../.env.test')});
        break;
      }
      default: {
        this.express.use(logger('dev'));
        this.express.use(errorHandler());
        config({path: resolve(__dirname, '../.env')});
        break;
      }
    }
  }

  /**
   * Register Middleware
   */
  private middleware(): void {
    this.express.set('address', process.env.ADDRESS);
    this.express.set('port', process.env.PORT);
    this.express.use(compression());
    this.express.use(express.urlencoded({extended: true}));
    this.express.use(express.json());
  }

  /**
   * Enable Cross-Origin Resource Sharing
   */
  private enableCors(): void {
    const options: cors.CorsOptions = {
      allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'X-Access-Token', 'Authorization'],
      credentials: true,
      methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
      origin: '*',
      preflightContinue: false
    };
    this.express.use(cors(options));
    this.express.options('*', cors(options));
  }

  /**
   * Register routes
   */
  private routes(): void {
    if (process.env.UPLOAD_PROVIDER === 'local') {
      this.express.use('/uploads', express.static(process.env.UPLOAD_PROVIDER_FOLDER));
    }
    this.express.use('/', new RootRoute().router);
    this.express.use(`/${process.env.API_NAME}/auth`, new AuthRoute().router);
    this.express.use(`/${process.env.API_NAME}/users`, new UserRoute().router);
    this.express.use(`/${process.env.API_NAME}/resource-permissions`, new ResourcePermissionRoute().router);
    this.express.use(`/${process.env.API_NAME}/roles`, new RoleRoute().router);
    this.express.use(`/${process.env.API_NAME}/media-objects`, new MediaObjectRoute().router);
    this.express.use(`/${process.env.API_NAME}/endpoints`, new EndpointRoute().router);
    this.express.use(`/${process.env.API_NAME}/books`, new BookRoute().router);
  }

  /**
   * Setup Swagger and inject server configuration as defined in .env
   */
  private setupSwagger(): void {
    const options: swaggerUI.SwaggerUiOptions = {
      customSiteTitle: process.env.SITE_TITLE,
      swaggerOptions: {
        layout: 'BaseLayout',
        tryItOutEnabled: true
      }
    };
    const swaggerDoc = yaml.load('./swagger.yaml') as OpenApiV3Object;
    swaggerDoc.info.title = process.env.SITE_TITLE;
    swaggerDoc.servers = [
      {
        url: getApiURL()
      }
    ];
    this.express.use(`/${process.env.API_NAME}/docs`, swaggerUI.serve, swaggerUI.setup(swaggerDoc, options));
  }

  /**
   * Register services
   */
  private registerServices(): void {
    this.express.set('services', {
      uploadService: new UploadService(),
      endpointService: new EndpointService(this.express)
    });
  }

  /**
   * Register 404 / 400 responses
   */
  private registerHttpExceptions(): void {
    this.express.use((req: express.Request, res: express.Response) => {
      return HTTP_NOT_FOUND(res);
    });
    this.express.use((err: any, req: express.Request, res: express.Response) => {
      return HTTP_BAD_REQUEST(res, err);
    });
  }

  /**
   * Connect to DB and launch app
   */
  private launch(): void {
    const mongooseOptions: mongoose.ConnectionOptions = {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    };
    mongoose.connect(process.env.MONGODB_URL, mongooseOptions)
      .then(() => {
        console.info(`MongoDB connected at ${process.env.MONGODB_URL}`);
        this.express.listen(this.express.get('port'), this.express.get('address'), async () => {
          // eslint-disable-next-line max-len
          console.info(`API running at http://${this.express.get('address')}:${this.express.get('port')} in ${this.express.get('env')} mode`);
          await Auth.updateAppPermissions(null, this.express);
          this.express.emit('Express_TS_Started');
        });
      })
      .catch((err: any) => {
        console.error(`MongoDB cannot connect at ${process.env.MONGODB_URL}\nError: ${err}`);
        process.exit(1);
      });
  }
}

export default new App();
