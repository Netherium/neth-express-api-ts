import * as mongoose from 'mongoose';
import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
import { Role } from './role.enum';

const Schema = mongoose.Schema;

const userSchema = new Schema({
  'email': {
    type: String,
    required: true,
    unique: true
  },
  'name': {
    type: String,
    required: true
  },
  'role': {
    type: Number,
    enum: Role,
    default: Role.USER
  },
  'isVerified': Boolean,
  'salt': {
    type: String,
    required: true
  },
  'hash': {
    type: String,
    required: true
  }
}, {timestamps: true});

userSchema.methods.toJson = () => {
  let obj = this.toObject();
  delete obj.__v;
  delete obj.salt;
  delete obj.hash;
  return obj;
};

userSchema.virtual('password')
  .set(function (password: any) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 256, 'sha256').toString('hex');
    // console.log(crypto.getHashes());
  })
  .get(function () {
    return this.hash;
  });

userSchema.methods.validPassword = function (password: any) {
  let hash = crypto.pbkdf2Sync(password, this.salt, 1000, 256, 'sha256').toString('hex');
  return this.hash === hash;
};

userSchema.methods.validateJWT = function (token: string) {
  return jwt.decode(token);
};

userSchema.methods.generateJWT = function () {
  let expiry = new Date();
  expiry.setDate(parseInt(expiry.getDate() + process.env.JWT_EXPIRATION));
  console.log(
    this._id,
    this.email,
    this.name,
    this.createdAt,
    ~~(expiry.getTime() / 1000)
  );

  return jwt.sign({
    _id: this._id,
    email: this.email,
    name: this.name,
    exp: ~~(expiry.getTime() / 1000)
  }, process.env.secret);
};

export default mongoose.model('user', userSchema);
