import { UserPreferences } from '@services/api.service';
import { Photo } from '@models/photo.model';
import { Plant } from '@models/plant.model';
import { ImagePath } from '@models/image-path.model';

export interface User {
  id: number;
  username: string;
  firstname: string | null;
  lastname: string | null;
  password: string;
  avatar: ImagePath;
  avatarFile: File;
  preferences: UserPreferences;
  email: string;
  bio: string | null;
  role: Role;
  public: boolean;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
  locations?: Location[];
  plants?: Plant[];
  photos?: Photo[];
  _count?: {
    plants?: number;
    locations?: number;
    photos?: number;
  }
}

export const Role: { [key: string]: string } = {
  USER: 'USER',
  ADMIN: 'ADMIN',
};
export type Role = (typeof Role)[keyof typeof Role];

export const UserStatus: { [key: string]: string } = {
  UNVERIFIED: 'UNVERIFIED',
  VERIFIED: 'VERIFIED',
  BANNED: 'BANNED',
};
export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];

export interface UsernameRequirements {
  minLength: number;
  maxLength: number;
}

export interface PasswordRequirements {
  minLength: number;
  requireUppercase: boolean;
  requireNumber: boolean;
  requireNonAlphanumeric: boolean;
}

export interface UsernameErrors {
  usernameExists: boolean;
  usernameInvalid: boolean;
}

export interface EmailErrors {
  emailExists: boolean;
  emailInvalid: boolean;
}

export interface UserRegisterErrors extends UsernameErrors, EmailErrors {
  pwd: {
    length: boolean;
    uppercase: boolean;
    numbers: boolean;
    nonAlphanumeric: boolean;
  };
}
