export interface Location {
  id: number
  name: string
  light: Light
  public: boolean
  ownerId: number
  createdAt: Date
  updatedAt: Date
  plants?: Plant[]
  _count?: any
  pictureFile: File
  pictures?: any
}

export interface Plant {
  id: number
  specieId: number | null
  customName: string | null
  description: string | null
  condition: Condition | null
  waterFreq: number | null
  waterLast: Date | null
  waterNext: Date | null
  fertFreq: number | null
  fertLast: Date | null
  fertType: string | null
  fertNext: Date | null
  potType: string | null
  potSize: number | null
  soil: string | null
  public: boolean
  locationId: number
  ownerId: number
  createdAt: Date
  updatedAt: Date
  photos?: Photo[]
  specie?: Specie
}

export interface User {
  id: number
  username: string
  firstname: string | null
  lastname: string | null
  password: string
  avatar: any
  avatarFile: File
  preferences: any
  email: string
  bio: string | null
  role: Role
  public: boolean
  status: UserStatus
  createdAt: Date
  updatedAt: Date
  locations?: Location[]
  plants?: Plant[]
  photos?: Photo[]
}

export interface Specie {
  id: number
  family: string
  name: string
  commonName: string | null
  care: any
  createdAt: Date
  updatedAt: Date
  plants?: Plant[]
}

export interface Photo {
  id: number
  images: any
  description: string | null
  public: boolean
  takenAt: Date
  hashId: number
  plantId: number
  ownerId: number
  createdAt: Date
  updatedAt: Date
  pictureFiles: File[]
}

export type Notification = {
  id: number
  type: NotificationType
  read: Date | null
  content: any
  plantId: number
  ownerId: number
  createdAt: Date
  updatedAt: Date
}

export const NotificationType: { [key: string]: string } = {
  WATER: 'WATER',
  FERTILIZER: 'FERTILIZER',
  COMMENT: 'COMMENT'
}
export type NotificationType = (typeof NotificationType)[keyof typeof NotificationType]

export const Light: { [key: string]: any } = {
  FULLSUN: {
    desc: 'Full sun',
    verbose: 'Sun shines over the whole day',
  },
  PARTIALSUN: {
    desc: 'Partial sun',
    verbose: 'Sun is here for a few hours each day',
  },
  SHADE: {
    desc: 'Shade',
    verbose: 'Sun is not allowed here',
  },
}
export type Light = (typeof Light)[keyof typeof Light];

export const Condition: { [key: string]: string } = {
  BAD: 'On the line', // red
  POOR: 'Holding on to life', // yellow
  GOOD: 'Looks good', // grey
  GREAT: 'Looks great', // light green
  EXCELLENT: 'Prime example of its specie', // vibrant green
}
export type Condition = (typeof Condition)[keyof typeof Condition];

// client-side only
export const potChoices: { [key: string]: any } = {
  LT_POT_TERRACOTTA: { name: 'Terracotta', image: '/assets/pot-terracotta.jpg' },
  LT_POT_PLASTIC: { name: 'Plastic', image: '/assets/pot-plastic.jpg' },
  LT_POT_CERAMIC: { name: 'Ceramic', image: '/assets/pot-ceramic.jpg' },
  LT_POT_METAL: { name: 'Metal', image: '/assets/pot-metal.jpg' },
  LT_POT_GLASS: { name: 'Glass', image: '/assets/pot-glass.jpg' },
  LT_POT_WOOD: { name: 'Wood', image: '/assets/pot-wood.jpg' },
  LT_POT_CONCRETE: { name: 'Concrete', image: '/assets/pot-concrete.jpg' },
  LT_POT_OTHER: { name: 'Other', image: '/assets/pot-other.jpg' },
};

export const Role: { [key: string]: string } = {
  USER: 'USER',
  ADMIN: 'ADMIN'
};
export type Role = (typeof Role)[keyof typeof Role]


export const UserStatus: { [key: string]: string } = {
  UNVERIFIED: 'UNVERIFIED',
  VERIFIED: 'VERIFIED',
  BANNED: 'BANNED'
};
export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus]