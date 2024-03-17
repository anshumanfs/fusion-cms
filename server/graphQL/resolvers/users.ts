import { dbModels } from '../../db';

const registerUser = async (_: any, args: any) => {
  const { email, password } = args;
  const user = await dbModels.users.findOne({ email });
  if (user) {
    throw new Error('User already exists');
  }
  const newUser = await dbModels.users.create({ email, password });
  return newUser;
};

const registerAdmin = async (_: any, args: any) => {
  const { firstName, lastName, email, password } = args;
  const admin = await dbModels.users.findOne({ email, role: 'admin' });
  if (admin) {
    throw new Error('Admin already exists !');
  }
  const newAdmin = await dbModels.users.create({ email, firstName, lastName, password, role: 'admin' });
  return newAdmin;
};

const login = async (_: any, args: any) => {
  const { email, password } = args;
  const user = await dbModels.users.findOne({ email, password });
  if (!user) {
    throw new Error('Invalid credentials');
  }
  const token = await user.generateToken();
  // it will return token
  return token;
};

const modifyUser = async (_: any, args: any) => {
  const { id, email, role, firstName, lastName } = args;
  const user = await dbModels.users.findOne({ id });
  if (!user) {
    throw new Error('User not found');
  }
  const updatedUser = await user.update({ email, role, firstName, lastName });
  return updatedUser;
};

const changePassword = async (_: any, args: any) => {
  /**
   * Password can be changed in two ways
   * 1. By the user itself (if the user knows the current password)
   * 2. By the user (if the user forgets the password and requests for a new password using email otp)
   * 3. By the admin (by sending user a unique password change email)
   */
};

export {};
