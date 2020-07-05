process.env.NODE_ENV = 'test';
import App from '../src/server';
import * as chai from 'chai';

import UserModel from '../src/models/user.model';
import RoleModel from '../src/models/role.model';
import ArticleModel from '../src/models/article.model';
import ResourcePermissionModel from '../src/models/resource-permission.model';
import { Document } from 'mongoose';
import { Auth } from '../src/middleware/auth';
import chaiHttp = require('chai-http');

chai.use(chaiHttp);
const should = chai.should();
const app = App.express;

const publicRoleDetails = {
  name: 'Public',
  description: 'Unauthenticated user',
  isAuthenticated: false
};

const adminRoleDetails = {
  name: 'Admin',
  description: 'Top level authenticated user',
  isAuthenticated: true
};

const adminUserDetails = {
  email: process.env.ADMIN_EMAIL,
  name: process.env.ADMIN_NAME,
  password: process.env.ADMIN_PASSWORD
};

const publicUserDetails = {
  email: 'public@email.com',
  name: 'Testlogin',
  password: 'qwerty'
};

const article1Details = {
  title: 'A test article'
};

const article2Details = {
  title: 'A test article2'
};

const newArticleDetails = {
  title: 'A new article'
};

const modifiedArticleDetails = {
  title: 'A modified article'
};

const falseUID = '5ca4ab6f3f86e02af8e1a5a3';

describe('Articles', () => {
  let publicRole: Document;
  let adminRole: Document;
  let adminUser: Document;
  let publicUser: Document;
  let article1: Document;
  let article2: Document;
  let tokenAdmin: string;
  before(async () => {
    await UserModel.deleteMany({});
    await ResourcePermissionModel.deleteMany({});
    await RoleModel.deleteMany({});
    await ArticleModel.deleteMany({});
    publicRole = await new RoleModel(publicRoleDetails).save();
    adminRole = await new RoleModel(adminRoleDetails).save();
    publicUser = await new UserModel({...publicUserDetails, role: publicRole}).save();
    adminUser = await new UserModel({...adminUserDetails, role: adminRole}).save();
    const articleResourcePermission: any = {
      resourceName: 'articles',
      methods: [
        {
          roles: [publicRole],
          name: 'list'
        },
        {
          roles: [publicRole],
          name: 'show'
        },
        {
          roles: [adminRole],
          name: 'create'
        },
        {
          roles: [adminRole],
          name: 'update'
        },
        {
          roles: [adminRole],
          name: 'delete'
        }
      ]
    };
    await new ResourcePermissionModel(articleResourcePermission).save();
    await Auth.updateAppPermissions(null, app);
    article1 = await new ArticleModel({...article1Details, author: adminUser}).save();
    article2 = await new ArticleModel({...article2Details, author: adminUser}).save();
    const res = await chai.request(app)
      .post('/api/auth/login')
      .send(adminUserDetails);
    tokenAdmin = JSON.parse(res.text).token;
  });
  describe('/GET articles', () => {
    it('it should return list of articles', async () => {
      const res = await chai.request(app)
        .get('/api/articles');
      res.should.have.status(200);
      res.body.should.be.an('array');
      res.body.should.have.lengthOf(2);
    });
  });
  describe('/GET articles/:id', () => {
    it('it should return a single article', async () => {
      const res = await chai.request(app)
        .get(`/api/articles/${article1._id}`);
      res.should.have.status(200);
      res.body.should.have.property('title').eqls(article1Details.title);
    });
    it('it should return 404 when article does not exist', async () => {
      const res = await chai.request(app)
        .get(`/api/articles/${falseUID}`);
      res.should.have.status(404);
      res.body.should.have.property('message').eqls('Not Found');
    });
    it('it should return 500 when id not a mongoose uid', async () => {
      const res = await chai.request(app)
        .get(`/api/articles/1234`);
      res.should.have.status(500);
      res.body.should.have.property('message').eqls('Server Error');
    });
  });
  describe('/POST articles', () => {
    it('it should insert new article', async () => {
      const res = await chai.request(app)
        .post(`/api/articles`)
        .set('Authorization', 'Bearer ' + tokenAdmin)
        .send(newArticleDetails);
      res.should.have.status(201);
      res.body.should.have.property('title').eqls(newArticleDetails.title);
      res.body.should.have.property('author').have.property('email').eqls(adminUserDetails.email);
    });
    it('it should not insert new article with wrong body', async () => {
      const res = await chai.request(app)
        .post(`/api/articles`)
        .set('Authorization', 'Bearer ' + tokenAdmin)
        .send({});
      res.should.have.status(500);
    });
  });
  describe('/PUT articles/:id', () => {
    it('it should modify article', async () => {
      const res = await chai.request(app)
        .put(`/api/articles/${article1._id}`)
        .set('Authorization', 'Bearer ' + tokenAdmin)
        .send(modifiedArticleDetails);
      res.should.have.status(200);
      res.body.should.have.property('title').eqls(modifiedArticleDetails.title);
    });
    it('it should not modify article with false id', async () => {
      const res = await chai.request(app)
        .put(`/api/articles/${falseUID}`)
        .set('Authorization', 'Bearer ' + tokenAdmin)
        .send(article1Details);
      res.should.have.status(404);
    });
    it('it should return 500 when id not a mongoose uid', async () => {
      const res = await chai.request(app)
        .put(`/api/articles/1234`)
        .set('Authorization', 'Bearer ' + tokenAdmin)
        .send(article1Details);
      res.should.have.status(500);
      res.body.should.have.property('message').eqls('Server Error');
    });
  });
  describe('/DELETE articles/:id', () => {
    it('it should delete article', async () => {
      const res = await chai.request(app)
        .delete(`/api/articles/${article1._id}`)
        .set('Authorization', 'Bearer ' + tokenAdmin);
      res.should.have.status(204);
    });
    it('it should not delete article with false id', async () => {
      const res = await chai.request(app)
        .delete(`/api/articles/${falseUID}`)
        .set('Authorization', 'Bearer ' + tokenAdmin);
      res.should.have.status(404);
    });
    it('it should return 500 when id not a mongoose uid', async () => {
      const res = await chai.request(app)
        .delete(`/api/articles/1234`)
        .set('Authorization', 'Bearer ' + tokenAdmin);
      res.should.have.status(500);
      res.body.should.have.property('message').eqls('Server Error');
    });
  });
});
