import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const permissions = [
    { name: 'USER_CREATE', description: 'Kullanıcı oluşturma yetkisi' },
    { name: 'USER_READ', description: 'Kullanıcıları görüntüleme yetkisi' },
    { name: 'USER_UPDATE', description: 'Kullanıcı güncelleme yetkisi' },
    { name: 'USER_DELETE', description: 'Kullanıcı silme yetkisi' },
    { name: 'ROLE_MANAGE', description: 'Rolleri yönetme yetkisi' },
    { name: 'PERMISSION_MANAGE', description: 'Yetkileri yönetme yetkisi' },
  ];

  await prisma.permission.createMany({ data: permissions, skipDuplicates: true });

  const [adminRole, userRole] = await Promise.all([
    prisma.role.upsert({
      where: { name: 'ADMIN' },
      update: { description: 'Sistem yöneticisi' },
      create: {
        name: 'ADMIN',
        description: 'Sistem yöneticisi',
      },
    }),
    prisma.role.upsert({
      where: { name: 'USER' },
      update: { description: 'Standart kullanıcı' },
      create: {
        name: 'USER',
        description: 'Standart kullanıcı',
      },
    }),
  ]);

  const permissionRecords = await prisma.permission.findMany({
    where: { name: { in: permissions.map((permission) => permission.name) } },
    select: { id: true, name: true },
  });

  const adminPermissionIds = permissionRecords.map((permission) => permission.id);
  const userPermissionIds = permissionRecords
    .filter((permission) => permission.name === 'USER_READ')
    .map((permission) => permission.id);

  await prisma.rolePermission.deleteMany({ where: { roleId: { in: [adminRole.id, userRole.id] } } });

  if (adminPermissionIds.length > 0) {
    await prisma.rolePermission.createMany({
      data: adminPermissionIds.map((permissionId) => ({ roleId: adminRole.id, permissionId })),
      skipDuplicates: true,
    });
  }

  if (userPermissionIds.length > 0) {
    await prisma.rolePermission.createMany({
      data: userPermissionIds.map((permissionId) => ({ roleId: userRole.id, permissionId })),
      skipDuplicates: true,
    });
  }

  const adminPassword = await hash('123123', 12);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@randevu.local' },
    update: {
      password: adminPassword,
      isActive: true,
    },
    create: {
      email: 'admin@randevu.local',
      password: adminPassword,
    },
  });

  await prisma.userRole.deleteMany({ where: { userId: adminUser.id } });
  await prisma.userRole.create({
    data: {
      userId: adminUser.id,
      roleId: adminRole.id,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error('Seed sırasında hata oluştu:', error);
    await prisma.$disconnect();
    process.exit(1);
  });
