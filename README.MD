# Neth-express-api-ts
A REST API written in Typescript using [Express](https://github.com/expressjs/express) that tries to adhere to best practices

Provides JWT Bearer Token authentication with basic Access-Control Lists (ACL), MongoDB and (soon™) Elasticsearch integration

Testing/coverage with [Mocha](https://www.npmjs.com/package/mocha),[chai](https://www.npmjs.com/package/chai) and [nyc](https://www.npmjs.com/package/nyc)

Made with ❤ by [Netherium](https://github.com/Netherium)


## Table of contents

- [Quick Start](#quick-start)
- [Features](#features)
- [Status](#status)
- [Basic Routes](#basic-routes)
- [Resource Permissions](#resource-permissions)
- [Coding Tips](#coding-tips)
- [Structure](#structure)
- [Tests](#tests)
- [Debug](#debug)
- [Authors](#authors)
- [Copyright and license](#copyright-and-license)


## Quick Start


1. :zap: Clone this repo
    ```bash
    $ git clone https://github.com/Netherium/neth-express-api-ts
    ```

2. :pray: Install dependencies
    ```bash
    $ npm install
    ```

3. :evergreen_tree: Setup your environment files: `.env`, `.env.test`, `.env.production`, according to `.env.sample`
    ```bash
    ADDRESS=localhost
    PORT=4000
    MONGODB_URL=mongodb://localhost:27017/YOUDBNAMEHERE
    ELASTIC_URL=localhost:9200
    SECRET=YOURSECRETHERE
    ....
    ```

4. :dash: Develop
     ```bash
    $ npm run start
    ```

5. :bulb: Initialize: Navigate to http://localhost:4000/api/auth/init
    - 2 Roles will be created, 1 Admin, 1 Public
    - 1 User will be created, based on your `.env` credentials
    - Resource permissions will be created for basic routes, with default access to admin Role

6. :rocket: Build!
    ```bash
    $ npm run build
    ```

## Features

- Typescript Intellisense Awesomeness
- Robust routing and middleware based on same principles of Express
- MongoDB integration
- Elasticsearch integration (soon™)
- Protected routes, ACL based with middleware, using [`jwt-token`](https://jwt.io/)
- Test and Coverage
- REST API Documentation via [swagger-ui-express](https://www.npmjs.com/package/swagger-ui-express)
- Various helper files and tools, i.e. CORS integration, swagger.yaml, .env environment setup
- Several scripts for easy development and testing


## Status

![Lines](https://img.shields.io/badge/Coverage-93.44%25-brightgreen.svg "Lines Coverage")
![BuildStatus](https://img.shields.io/badge/Build-Passing-brightgreen.svg "Building Status")


## Basic Routes

The basic routes provided are listed below.
Each one of them is being reflected by its own `route`, `controller`, `model`

#### Auth
- :unlock: `api/auth/register` [POST]
- :unlock: `api/auth/login` [POST]
- :closed_lock_with_key: `api/auth/profile` [GET, PUT, DELETE]
- :unlock:`api/auth/init` [GET]

#### Roles
- :closed_lock_with_key: `api/roles` [GET, GET `/:id`, POST, PUT `/:id`, DELETE `/:id`]

#### Resource Permissions
- :closed_lock_with_key: `api/resource-permissions` [GET, GET `/:id`, POST, PUT `/:id`, DELETE `/:id`]

#### Users
- :closed_lock_with_key: `api/users` [GET, GET `/:id`, POST, PUT `/:id`, DELETE `/:id`]

#### Uploads
- :closed_lock_with_key: `api/uploads` [GET, GET `/:id`, POST, PUT `/:id`, DELETE `/:id`]

#### Docs
- :unlock: `api/docs` [GET]

#### Root
- :unlock: `/` [GET]

#### Endpoints
- :closed_lock_with_key: `api/endpoints` [GET]

#### Articles (Example Resource Route)
- :closed_lock_with_key: `api/articles` [GET, GET `/:id`, POST, PUT `/:id`, DELETE `/:id`]

## Resource Permissions

- Add a new route with Access-Control List (ACL) by invoking middleware function `Auth.getACL()`
I.e. file `article.route.ts`
```typescript
    export class ArticleRoute {
      constructor() {
        this.router.get('/', Auth.getAcl(), controller.list);
        ...
        this.router.post('/', Auth.getAcl(), controller.create);
      }
    }
```

- Add the appropriate resource-permission for this resource for each method (`list`, `create`, in this case) and for each method the roles that will have access to.
:warning: **If you add at least 1 unauthenticated role then this resource route will be open **

```bash
POST api/resource-permissions
{
    resourceName: 'articles',
    methods: [
        {
            name: 'list',
            roles: [PublicRoleId]
        },
        {
            name: 'create',
            roles: [AdminRoleId, RegisteredUserRoleId]
        }
    ]
}
```

## Coding Tips

Get Service

- Register any service in `server.ts`, under `registerServices` function
- Access it anywhere by destructuring it `const {uploadService} = req.app.get('services');`

Get Authenticated User

- When a route is authenticated, you can access the authenticated user by `res.locals.authUser`

Get Resource Permissions

- For optimization, resource-permissions are stored in `app.locals.resourcePermissions`.
    If you update manually a resource (i.e. not via api call, but database manipulation), restart server or call `Auth.updateAppPermissions()`


## Structure

Follow the structure below. It will keep things and your mind tidy.

    .
    ├── :file_folder: dist              # Compiled files ready to deploy :rocket:
    ├── :file_folder: uploads           # When using local provider this is where uploads go
    │
    ├── :file_folder: src               # Source files
    │   ├── :file_folder: routes        # Routes that define endpoints, methods, handlers and middleware
    │   ├── :file_folder: controllers   # Controllers that handle functionality from routes
    │   ├── :file_folder: models        # Mongoose models and typescript interfaces
    │   ├── :file_folder: middleware    # Middleware functions
    │   ├── :file_folder: services      # Services in OOP style that can be called in controllers
    │   ├── :file_folder: helpers       # Exported functions that need no instantiation
    │   └── server.ts                   # Entrypoint
    │
    ├── :file_folder: test              # Automated tests `npm run test`
    │
    ├── swagger.yaml                    # Swagger documentation (`api/docs`) defined in yaml
    ├── LICENSE                         # License file
    └── README.md                       # This File

## Tests

Run tests

```bash
$ npm test
```


## Coverage

Run coverage (generated under folder `coverage`)

```bash
$ npm run test:coverage
```


## Debug

To debug TS without compiling it, you can setup your IDE of choice as in the example below
Note: Running older versions of node  may require attaching `--inspect` before `--require`

<img src="https://raw.githubusercontent.com/Netherium/neth-express-api-ts/master/img/debug_setup.png">


## Authors
**[Netherium](https://github.com/Netherium)**


## Copyright and license
Code released under [the MIT license](https://github.com/Netherium/neth-express-api-ts/blob/master/LICENSE)
