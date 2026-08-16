const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userRepository = require("../repositories/user.repository");

const registerUser = async ({ name, email, password }) => {
  const normalizedEmail = email.toLowerCase().trim();

  const existingUser =
    await userRepository.findUserByEmail(normalizedEmail);

  if (existingUser) {
    throw new Error("User already exists");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await userRepository.createUser({
    name: name.trim(),
    email: normalizedEmail,
    passwordHash,
  });

  return {
    id: user._id,
    name: user.name,
    email: user.email,
  };
};

const loginUser = async ({ email, password }) => {
  const normalizedEmail = email.toLowerCase().trim();

  const user = await userRepository.findUserByEmail(normalizedEmail);

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const passwordMatches = await bcrypt.compare(
    password,
    user.passwordHash
  );

  if (!passwordMatches) {
    throw new Error("Invalid email or password");
  }

  const accessToken = jwt.sign(
    {
      userId: user._id.toString(),
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "15m",
    }
  );

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    accessToken,
  };
};

module.exports = {
  registerUser,
  loginUser,
};