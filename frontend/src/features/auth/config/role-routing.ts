export type RoleName = 'ADMIN' | 'USER';

interface RoleRouteConfig {
  role: RoleName;
  path: string;
}

const roleRouteTable: RoleRouteConfig[] = [
  { role: 'ADMIN', path: '/admin/dashboard' },
  { role: 'USER', path: '/app/home' },
];

const fallbackRoute = '/app/home';

export function resolvePostLoginRoute(roles: string[]): string {
  const normalizedRoles = roles.map((role) => role.toUpperCase());

  for (const { role, path } of roleRouteTable) {
    if (normalizedRoles.includes(role)) {
      return path;
    }
  }

  return fallbackRoute;
}
