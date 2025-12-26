import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import prisma from "../lib/prisma";

interface RegisterInput {
  username: string;
  email: string;
  password: string;
}

interface SigninInput {
  email: string;
  password: string;
}

const JWT_SECRET = (process.env.JWT_SECRET ?? "dev-secret") as jwt.Secret;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? "1d";

export const register = async (data: RegisterInput) => {
  const existingEmail = await prisma.user.findUnique({
    where: { email: data.email }
  });
  if (existingEmail) {
    throw new Error("Email already in use");
  }

  const existingUsername = await prisma.user.findUnique({
    where: { username: data.username }
  });
  if (existingUsername) {
    throw new Error("Username already in use");
  }

  const passwordHash = await bcrypt.hash(data.password, 10);
  const user = await prisma.user.create({
    data: {
      username: data.username,
      email: data.email,
      passwordHash
    }
  });

  return {
    message: "Registered successfully",
    username: user.username,
    email: user.email
  };
};

export const signin = async (data: SigninInput) => {
  const user = await prisma.user.findUnique({
    where: { email: data.email }
  });
  if (!user) {
    throw new Error("Invalid email or password");
  }

  const ok = await bcrypt.compare(data.password, user.passwordHash);
  if (!ok) {
    throw new Error("Invalid email or password");
  }

  const signOptions: SignOptions = {
    expiresIn: JWT_EXPIRES_IN as SignOptions["expiresIn"]
  };

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    JWT_SECRET,
    signOptions
  );

  return {
    message: "Signin successful",
    username: user.username,
    email: user.email,
    token
  };
};

export const getAllUsers = async () => {
  return prisma.user.findMany({
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      createdAt: true
    }
  });
};

interface UpdateUserInput {
  id: string;
  username?: string;
  email?: string;
  password?: string;
}

export const updateUser = async ({ id, username, email, password }: UpdateUserInput) => {
  if (!username && !email && !password) {
    throw new Error("No fields to update");
  }

  if (username) {
    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing && existing.id !== id) {
      throw new Error("Username already in use");
    }
  }

  if (email) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing && existing.id !== id) {
      throw new Error("Email already in use");
    }
  }

  const data: { username?: string; email?: string; passwordHash?: string } = {};
  if (username) data.username = username;
  if (email) data.email = email;
  if (password) data.passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.update({
    where: { id },
    data
  });

  return { id: user.id, username: user.username, email: user.email, role: user.role };
};

export const deleteUser = async (id: string) => {
  await prisma.user.delete({ where: { id } });
  return { message: "User deleted" };
};
  
