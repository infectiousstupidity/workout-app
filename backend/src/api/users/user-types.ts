export interface UserRegistrationData {
  username: string;
  email: string;
  password: string;
  roleId: number;
}

export interface UserUpdatePayload {
  username?: string;
  email?: string;
  roleId?: number;
}
