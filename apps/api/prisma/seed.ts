import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = 'jrodrguez08@gmail.com';
  const password = 'Admin123!'; // 🔐 password temporal

  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) {
    console.log('Super user already exists');
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      email,
      passwordHash: hashedPassword,
      isPlatformAdmin: true,
    },
  });

  console.log('Super user created successfully');
  console.log('Email:', email);
  console.log('Temporary password:', password);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
