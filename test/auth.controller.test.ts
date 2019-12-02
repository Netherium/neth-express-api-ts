process.env.NODE_ENV = 'test';
import App from '../src/server';
import * as chai from 'chai';
import chaiHttp = require('chai-http');

const app = App.express;
chai.use(chaiHttp);
const should = chai.should();

import userModel from '../src/models/user.model';

const adminDetails = {
  email: process.env.ADMIN_EMAIL,
  name: process.env.ADMIN_NAME,
  password: process.env.ADMIN_PASSWORD
};

const registerDetails = {
  email: 'testregister@email.com',
  name: 'TestRegister',
  password: 'qwerty'
};

const loginDetails = {
  email: 'testlogin@email.com',
  name: 'Testlogin',
  password: 'qwerty'
};
const modifiedDetails = {
  email: 'testloginmodified@email.com',
  name: 'Testloginmodified',
  password: 'qwerty1'
};

const wrongDetails = {
  email: 'testlogin@email.com',
  name: 'Testlogin',
  password: 'qwe'
};

// //Ensure app has started
before((done) => {
  app.on('Express_TS_Started', () => {
    done();
  });
});

describe('Auth', () => {
  before(async () => {
    await userModel.deleteOne({email: registerDetails.email});
    await userModel.deleteOne({email: loginDetails.email});
    await userModel.deleteOne({email: adminDetails.email});
    await userModel.deleteOne({email: modifiedDetails.email});
    await new userModel(loginDetails).save();
  });
  describe('/POST register', () => {
    it('it should register a user and return a token', async () => {
      const res = await chai.request(app)
        .post('/api/auth/register')
        .send(registerDetails);
      res.should.have.status(201);
      res.body.should.be.a('object');
      res.body.should.have.property('token');
    });
  });
  describe('/POST login', () => {
    it('it should login a user and return a token', async () => {
      const res = await chai.request(app)
        .post('/api/auth/login')
        .send(registerDetails);
      res.should.have.status(201);
      res.body.should.be.a('object');
      res.body.should.have.property('token');
    });
    it('it should prevent a user from logging in with wrong credentials', async () => {
      const res = await chai.request(app)
        .post('/api/auth/login')
        .send(wrongDetails);
      res.should.have.status(401);
      res.body.should.be.a('object');
      res.body.should.have.property('message').eql('Wrong credentials.');
    });
  });
  describe('/GET profile', () => {
    let token = '';
    before(async () => {
      const res = await chai.request(app)
        .post('/api/auth/login')
        .send(loginDetails);
      const result = JSON.parse(res.text);
      token = result.token;
    });
    it('it should return user profile', async () => {
      const res = await chai.request(app)
        .get('/api/auth/profile')
        .set('Authorization', 'Bearer ' + token);
      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.have.property('email');
      res.body.should.have.property('name');
      res.body.should.have.property('isVerified');
      res.body.should.have.property('createdAt');
    });
    it('it should prevent access to profile with wrong token', async () => {
      const res = await chai.request(app)
        .get('/api/auth/profile');
      res.should.have.status(403);
      res.body.should.be.a('object');
      res.body.should.have.property('message');
    });
  });
  describe('/PUT profile', () => {
    let token = '';
    beforeEach(async () => {
      await userModel.deleteOne({email: registerDetails.email});
      await userModel.deleteOne({email: loginDetails.email});
      await userModel.deleteOne({email: modifiedDetails.email});
      await new userModel(loginDetails).save();
      const res = await chai.request(app)
        .post('/api/auth/login')
        .send(loginDetails);
      token = JSON.parse(res.text).token;
    });
    it('it should return a modified user profile name', async () => {
      const res = await chai.request(app)
        .put('/api/auth/profile')
        .set('Authorization', 'Bearer ' + token)
        .send({name: modifiedDetails.name});
      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.have.property('name').eqls(modifiedDetails.name);
    });
  });
  describe('/DELETE profile', () => {
    let token = '';
    beforeEach(async () => {
      await userModel.deleteOne({email: registerDetails.email});
      await userModel.deleteOne({email: loginDetails.email});
      await userModel.deleteOne({email: adminDetails.email});
      await userModel.deleteOne({email: modifiedDetails.email});
      await new userModel(loginDetails).save();
      const res = await chai.request(app)
        .post('/api/auth/login')
        .send(loginDetails);
      token = JSON.parse(res.text).token;
    });
    it('it should delete user', async () => {
      const res = await chai.request(app)
        .delete('/api/auth/profile')
        .set('Authorization', 'Bearer ' + token);
      res.should.have.status(204);
    });
  });
  describe('/POST createAdmin', () => {
    before(async () => {
      await userModel.deleteOne({email: adminDetails.email});
    });
    it('it should create and admin and return a token', async () => {
      const res = await chai.request(app)
        .post('/api/auth/createadmin');
      res.should.have.status(201);
      chai.use(chaiHttp);
      res.body.should.have.property('token');
    });
    it('it should prevent an additional admin from being created', async () => {
      const res = await chai.request(app)
        .post('/api/auth/createadmin');
      res.should.have.status(500);
    });
  });
});
