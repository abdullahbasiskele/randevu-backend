export interface UserRoleModel {
  id: string;
  name: string;
  permissions: string[];
}

export interface UserAggregate {
  id: string;
  email: string;
  passwordHash: string;
  isActive: boolean;
  roles: UserRoleModel[];
  permissions: string[];
}

export interface UserSummary {
  id: string;
  email: string;
  isActive: boolean;
}
