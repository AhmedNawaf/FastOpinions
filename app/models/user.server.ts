import bcrypt from 'bcryptjs';
import { prisma } from '~/services/db/db.server';

export async function checkUser(email: string) {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  return Boolean(user);
}

export async function createUser({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}) {
  await prisma.user.create({
    data: {
      name,
      email,
      password: {
        create: {
          hash: await bcrypt.hash(password, 10),
        },
      },
    },
  });
}
