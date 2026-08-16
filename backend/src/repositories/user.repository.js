const User = require("../models/user.model");

const createUser = async (userData) => {
  const user = await User.create(userData);

  return user;
};

const findUserByEmail = async (email) => {
  const user = await User.findOne({ email }).select("+passwordHash");

  return user;
};

const findUserById = async (userId) => {
  const user = await User.findById(userId);

  return user;
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
};