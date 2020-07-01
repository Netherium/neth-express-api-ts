# Neth-express-api-ts
A REST API written in Typescript using [Express](https://github.com/expressjs/express) that tries to adhere to best practices

Provides JWT Bearer Token authentication with basic Access Control Lists (ACL), MongoDB and (soon™) Elasticsearch integration

Testing/coverage with [Mocha](https://www.npmjs.com/package/mocha),[chai](https://www.npmjs.com/package/chai) and [nyc](https://www.npmjs.com/package/nyc)
  
Made with ❤ by [Netherium](https://github.com/Netherium)


## Table of contents

- [Quick Start](#quick-start)
- [Features](#features)
- [Status](#status)
- [Basic Routes](#basic-routes)
- [Resource Permissions](#resource-permissions)
- [Tests](#tests)
- [Debug](#debug)
- [Authors](#authors)
- [Copyright and license](#copyright-and-license)


## Quick Start

1. Clone this repo
    ```bash
    $ git clone https://github.com/Netherium/neth-express-api-ts
    ```

2. Install dependencies
    ```bash
    $ npm install
    ```

3. Setup your environment files: `.env`, `.env.test`, `.env.production`, according to `.env.sample`
    ```bash
    ADDRESS=localhost
    PORT=4000
    MONGODB_URL=mongodb://localhost:27017/YOUDBNAMEHERE
    ELASTIC_URL=localhost:9200
    SECRET=YOURSECRETHERE
    ....
    ```

4. Run server
     ```bash
    $ npm run start
    ```

5. Navigate to http://localhost:4000/api/auth/init
    - 2 Roles will be created, 1 Admin, 1 Public
    - 1 User will be created, based on your `.env` credentials
    - Resource permissions will be created for basic routes

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

![Lines](#lines# "Lines Coverage")
![BuildStatus](#buildstatus# "Building Status")


## Basic Routes
TODO


## Resource Permissions
TODO


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
