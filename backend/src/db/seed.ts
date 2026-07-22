import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { db } from './index';
import { usersTable } from './schema';

async function seed() {
  console.log('Seeding admin user...');

  const adminEmail = 'admin@mail.com';
  const rawPassword = '123';

  const [existingUser] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, adminEmail));

  const hashedPassword = await bcrypt.hash(rawPassword, 10);

  if (existingUser) {
    await db
      .update(usersTable)
      .set({
        password: hashedPassword,
        role: 'super_admin',
        is_active: true,
      })
      .where(eq(usersTable.id, existingUser.id));

    console.log(`[✓] Admin user (${adminEmail}) updated successfully!`);
  } else {
    await db.insert(usersTable).values({
      name: 'Admin',
      email: adminEmail,
      password: hashedPassword,
      role: 'super_admin',
      is_active: true,
    });

    console.log(`[✓] Admin user (${adminEmail}) created successfully!`);
  }

  process.exit(0);
}

seed().catch((err) => {
  console.error('[X] Seed failed:', err);
  process.exit(1);
});
