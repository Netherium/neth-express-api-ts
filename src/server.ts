import * as express from 'express';
import { resolve } from "path"
import { config } from "dotenv"
import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as logger from 'morgan';
import * as cors from 'cors';
import * as mongoose from 'mongoose';
import * as errorHandler from 'errorhandler';
import { Role } from './models/role.enum';
import Auth from './middleware/auth';

/**
 * Import routes
 */
import rootRouter from './routes/root';
import authRoutes from './routes/auth.routes';

class App {
    public express: express.Application;

    constructor() {
        this.express = express();
        this.setupEnvironment();
        this.middleware();
        this.enableCors();
        this.routes();
        this.catchNotFound();
        this.launch();
    }

    /**
     * Load .env and set logging
     */
    private setupEnvironment() {
        if (process.env.NODE_ENV === 'production') {
            config({path: resolve(__dirname, "../.env.production")});
        } else {
            config({path: resolve(__dirname, "../.env")});
            this.express.use(logger('dev'));
            this.express.use(errorHandler());
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
        this.express.use(bodyParser.json());
        this.express.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
            if (error instanceof Error) {
                return res.status(500).json({
                    message: 'Syntax Error'
                });
            }
            next();
        });
        this.express.use(bodyParser.urlencoded({extended: true}));
    }

    /**
     * Enable Cross-Origin Resource Sharing
     */
    private enableCors() {
        const options: cors.CorsOptions = {
            allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "X-Access-Token", "Authorization"],
            credentials: true,
            methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
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
        this.express.use('/', rootRouter);
        this.express.use('/api/auth', authRoutes);
    }

    /**
     * Catch Mot Found
     */
    private catchNotFound() {
        this.express.use((req: express.Request, res: express.Response) => {
            let err = {message: 'Not Found', status: 404};
            return res.status(err.status).json({
                message: err.message
            });
        });
    }

    /**
     * Connect to DB and launch app
     */
    private launch() {
        mongoose.connect(process.env.MONGODB_URL, {useNewUrlParser: true})
            .then(() => {
                console.info(`MongoDB connected at ${process.env.MONGODB_URL}`);
                this.express.listen(this.express.get('port'), this.express.get('address'), () => {
                    console.info(`API running at http://${this.express.get('address')}:${this.express.get('port')} in ${this.express.get('env')} mode`);
                });
            })
            .catch(function (err) {
                console.error(`MongoDB cannot connect at ${process.env.MONGODB_URL}\nError: ${err}`);
                process.exit(1);
            });
    }
}

export default new App().express;