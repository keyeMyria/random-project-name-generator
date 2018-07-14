import * as mongoose from 'mongoose';
import { UserRole } from '../models/user.model';
import { EnumHelper } from '../../shared/helpers/enum.helper';

export const UserSchema = new mongoose.Schema({
  username: { type: String, require: true, index: { unique: true } },
  email: { type: String, require: true, index: { unique: true } },
  password: { type: String, require: true },
  role: { type: String, enum: EnumHelper.values(UserRole) },
  firstName: { type: String },
  lastName: { type: String },
});