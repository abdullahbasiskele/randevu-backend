export type AppAction = 'manage' | 'create' | 'read' | 'update' | 'delete';
export type AppSubject = 'User' | 'Role' | 'Permission' | 'all';

export interface AbilityRule {
  action: AppAction | AppAction[];
  subject: AppSubject | AppSubject[];
  conditions?: Record<string, unknown>;
  inverted?: boolean;
}
