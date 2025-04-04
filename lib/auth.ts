import { compare, hash } from "bcrypt";
import { prisma } from "./prisma";
import { v4 as uuidv4 } from "uuid";

export async function authenticateUser(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return null;
  }

  const passwordMatch = await compare(password, user.passwordHash);

  if (!passwordMatch) {
    return null;
  }

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    balance: user.balance,
  };
}

export async function registerUser(
  username: string,
  email: string,
  password: string
) {
  const passwordHash = await hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        id: uuidv4(),
        username,
        email,
        passwordHash,
        balance: 1000, // Default starting balance
      },
    });

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      balance: user.balance,
    };
  } catch (error) {
    console.error("Error registering user:", error);
    return null;
  }
}
