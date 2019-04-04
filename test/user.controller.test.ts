process.env.NODE_ENV = "test";
import App from '../src/server';
import * as chai from "chai";
import chaiHttp = require('chai-http');

const app = App.express;
chai.use(chaiHttp);
const should = chai.should();


import { Role } from '../src/models/role.enum';
import userModel from '../src/models/user.model';


let adminUserDetails = {
  'email': process.env.ADMIN_EMAIL,
  'name': process.env.ADMIN_NAME,
  'password': process.env.ADMIN_PASSWORD,
  'role': Role.ADMIN
};

let deskUserDetails = {
  'email': 'testregister@email.com',
  'name': 'TestRegister',
  'password': 'qwerty',
  'role': Role.DESKUSER
};

let simpleUserDetails = {
  'email': 'testlogin@email.com',
  'name': 'Testlogin',
  'password': 'qwerty'
};

let modifiedSimpleUserDetails = {
  'email': 'testlogin@email.com',
  'name': 'Testloginmodified',
  'password': 'qwerty'
};

let falseUID = '5ca4ab6f3f86e02af8e1a5a3';

describe('User', () => {
  before(async () => {
    await userModel.deleteMany({});
    await new userModel(adminUserDetails).save();
    await new userModel(simpleUserDetails).save();
  });
  describe('/GET list of user', () => {
    let tokenAdmin = '';
    let tokenSimple = '';
    before(async () => {
      const res1 = await  chai.request(app)
        .post('/api/auth/login')
        .send(adminUserDetails);
      tokenAdmin = JSON.parse(res1.text).token;
      const res2 = await  chai.request(app)
        .post('/api/auth/login')
        .send(simpleUserDetails);
      tokenSimple = JSON.parse(res2.text).token;
    });
    it('it should return list of user', async () => {
      const res = await chai.request(app)
        .get('/api/user')
        .set('Authorization', 'Bearer ' + tokenAdmin);
      res.should.have.status(200);
      res.body.should.be.an('array');
      res.body.should.have.lengthOf(2);
    });
    it('it should prevent simple user role to access user', async () => {
      const res = await chai.request(app)
        .get('/api/user')
        .set('Authorization', 'Bearer ' + tokenSimple);
      res.should.have.status(401);
      res.body.should.have.property('message').eql('Unauthorized.');

    });
  });
  describe('/GET user by id', () => {
    let tokenAdmin = '';
    let user: any;
    before(async () => {
      const res1 = await  chai.request(app)
        .post('/api/auth/login')
        .send(adminUserDetails);
      tokenAdmin = JSON.parse(res1.text).token;
      user = await userModel.findOne({'email': adminUserDetails.email});
    });
    it('it should return a single user', async () => {
      const res = await chai.request(app)
        .get(`/api/user/${user._id}`)
        .set('Authorization', 'Bearer ' + tokenAdmin);
      res.should.have.status(200);
      res.body.should.have.property('email').eqls(adminUserDetails.email);
    });
    it('it should return 404 when user does not exist', async () => {
      const res = await chai.request(app)
        .get(`/api/user/${falseUID}`)
        .set('Authorization', 'Bearer ' + tokenAdmin);
      res.should.have.status(404);
      res.body.should.have.property('message').eqls('No such user');
    });
    it('it should return 500 when id provided is not a mongoose uid', async () => {
      const res = await chai.request(app)
        .get(`/api/user/1234`)
        .set('Authorization', 'Bearer ' + tokenAdmin);
      res.should.have.status(500);
      res.body.should.have.property('message').eqls('Error when getting user.');
    });
  });
  describe('/POST user', () => {
    let tokenAdmin = '';
    before(async () => {
      const res1 = await  chai.request(app)
        .post('/api/auth/login')
        .send(adminUserDetails);
      tokenAdmin = JSON.parse(res1.text).token;
    });
    it('it should insert new deskUser', async () => {
      const res = await chai.request(app)
        .post(`/api/user`)
        .set('Authorization', 'Bearer ' + tokenAdmin)
        .send(deskUserDetails);
      res.should.have.status(201);
      res.body.should.have.property('email').eqls(deskUserDetails.email);
    });
    it('it should prevent user duplication insert', async () => {
      const res = await chai.request(app)
        .post(`/api/user`)
        .set('Authorization', 'Bearer ' + tokenAdmin)
        .send(deskUserDetails);
      res.should.have.status(500);
    });
  });
  describe('/PUT user', () => {
    let tokenAdmin = '';
    let user: any;
    before(async () => {
      const res1 = await  chai.request(app)
        .post('/api/auth/login')
        .send(adminUserDetails);
      tokenAdmin = JSON.parse(res1.text).token;
      user = await userModel.findOne({'email': simpleUserDetails.email});
    });
    it('it should modify simpleLoginUser', async () => {
      const res = await chai.request(app)
        .put(`/api/user/${user._id}`)
        .set('Authorization', 'Bearer ' + tokenAdmin)
        .send(modifiedSimpleUserDetails);
      res.should.have.status(200);
      res.body.should.have.property('name').eqls(modifiedSimpleUserDetails.name);
    });
    it('it should modify not modify a user with false id', async () => {
      const res = await chai.request(app)
        .put(`/api/user/${falseUID}`)
        .set('Authorization', 'Bearer ' + tokenAdmin)
        .send(modifiedSimpleUserDetails);
      res.should.have.status(404);
    });
  });
  describe('/DELETE user', () => {
    let tokenAdmin = '';
    let user: any;
    before(async () => {
      const res1 = await  chai.request(app)
        .post('/api/auth/login')
        .send(adminUserDetails);
      tokenAdmin = JSON.parse(res1.text).token;
      user = await userModel.findOne({'email': modifiedSimpleUserDetails.email});
    });
    it('it should delete modifiedSimpleUser', async () => {
      const res = await chai.request(app)
        .delete(`/api/user/${user._id}`)
        .set('Authorization', 'Bearer ' + tokenAdmin);
      res.should.have.status(204);
    });
  });
});