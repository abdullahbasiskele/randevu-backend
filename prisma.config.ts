﻿import { defineConfig } from '@prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    seed: 'ts-node --project tsconfig.json prisma/seed.ts',
  },
});
