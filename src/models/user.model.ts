import * as mongoose from 'mongoose';
import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
import { Role } from './role.enum';
import { Document } from 'mongoose';

const Schema = mongoose.Schema;

export interface IUser extends Document {
  email: string;
  firstName: string;
  lastName: string;
}

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: Object.values(Role),
    default: Role.USER
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  salt: {
    type: String,
    required: true
  },
  hash: {
    type: String,
    required: true
  }
}, {timestamps: true});

userSchema.virtual('password')
  .set(function (password: any) {
    const user: any = this;
    user.salt = crypto.randomBytes(16).toString('hex');
    user.hash = crypto.pbkdf2Sync(password, user.salt, 1000, 256, 'sha256').toString('hex');
  })
  .get(function () {
    const user: any = this;
    return user.hash;
  });

userSchema.set('toJSON', {
  transform: (doc: any, ret: any) => {
    delete ret.__v;
    delete ret.salt;
    delete ret.hash;
    return ret;
  }
});

// tslint:disable:only-arrow-functions
userSchema.methods.validPassword = function (password: any) {
  const hash = crypto.pbkdf2Sync(password, this.salt, 1000, 256, 'sha256').toString('hex');
  return this.hash === hash;
};

userSchema.methods.validateJWT = function (token: string) {
  return jwt.decode(token);
};

userSchema.methods.generateJWT = function () {
  const expiry = new Date();
  expiry.setDate(parseInt(expiry.getDate() + process.env.JWT_EXPIRATION));
  const user: any = this;
  return jwt.sign({
    _id: user._id,
    email: user.email,
    name: user.name,
    role: user.role,
    exp: ~~(expiry.getTime() / 1000)
  }, process.env.secret);
};

export default mongoose.model('user', userSchema);
