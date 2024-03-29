import { Photo } from '@models/photo.model';
import { Plant } from '@models/plant.model';
import { ImagePath } from './image-path.model';

export interface User {
  id: number;
  username: string;
  firstname: string | null;
  lastname: string | null;
  password: string;
  avatar: ImagePath;
  avatarFile: File;
  preferences: any;
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

export interface UserRegisterErrors {
  usernameExists: boolean;
  usernameInvalid: boolean;
  emailExists: boolean;
  emailInvalid: boolean;
  pwd: {
    length: boolean;
    uppercase: boolean;
    numbers: boolean;
    nonAlphanumeric: boolean;
  };
}
