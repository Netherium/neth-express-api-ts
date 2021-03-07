import * as express from 'express';
import { resolve } from 'path';
import { config } from 'dotenv';
import * as compression from 'compression';
import * as logger from 'morgan';
import * as cors from 'cors';
import * as mongoose from 'mongoose';
import * as errorHandler from 'errorhandler';
import * as swaggerUI from 'swagger-ui-express';
import { SwaggerUiOptions } from 'swagger-ui-express';
import * as yaml from 'yamljs';
/**
 * Import Routes, Services, Helpers
 */
import { HTTP_BAD_REQUEST, HTTP_NOT_FOUND } from './helpers/http.responses';
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
    this.registerServices();
    this.registerHttpExceptions();
    this.launch();
  }

  /**
   * Load .env and set logging
   */
  private setupEnvironment() {
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
  private middleware() {
    this.express.set('port', process.env.PORT);
    this.express.set('address', process.env.ADDRESS);
    // TODO Missing proper compression with filter
    this.express.use(compression());
    this.express.use(express.urlencoded({extended: true}));
    this.express.use(express.json());
  }

  /**
   * Enable Cross-Origin Resource Sharing
   */
  private enableCors() {
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
  private routes() {
    this.express.use('/', new RootRoute().router);
    const options: SwaggerUiOptions = {
      customSiteTitle: 'Neth-Express-Api-TS',
      swaggerOptions: {
        layout: 'BaseLayout',
      }
    };
    this.express.use('/api/docs', swaggerUI.serve, swaggerUI.setup(yaml.load('./swagger.yaml'), options));
    if (process.env.UPLOAD_PROVIDER === 'local') {
      this.express.use('/uploads', express.static(process.env.UPLOAD_PROVIDER_FOLDER));
    }
    this.express.use('/api/auth', new AuthRoute().router);
    this.express.use('/api/users', new UserRoute().router);
    this.express.use('/api/resource-permissions', new ResourcePermissionRoute().router);
    this.express.use('/api/roles', new RoleRoute().router);
    this.express.use('/api/media-objects', new MediaObjectRoute().router);
    this.express.use('/api/endpoints', new EndpointRoute().router);
    this.express.use('/api/books', new BookRoute().router);
  }

  /**
   * Register services
   */
  private registerServices() {
    this.express.set('services', {
      uploadService: new UploadService(),
      endpointService: new EndpointService(this.express)
    });
  }

  /**
   * Register 404 / 400 responses
   */
  private registerHttpExceptions() {
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
  private launch() {
    // tslint:disable-next-line:object-literal-type-assertion
    const mongooseOptions: mongoose.ConnectionOptions = {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    };
    mongoose.connect(process.env.MONGODB_URL, mongooseOptions)
      .then(() => {
        // tslint:disable-next-line:no-console
        console.info(`MongoDB connected at ${process.env.MONGODB_URL}`);
        this.express.listen(this.express.get('port'), this.express.get('address'), async () => {
          // tslint:disable-next-line
          console.info(`API running at http://${this.express.get('address')}:${this.express.get('port')} in ${this.express.get('env')} mode`);
          await Auth.updateAppPermissions(null, this.express);
          this.express.emit('Express_TS_Started');
        });
      })
      .catch((err) => {
        console.error(`MongoDB cannot connect at ${process.env.MONGODB_URL}\nError: ${err}`);
        process.exit(1);
      });
  }
}

export default new App();
