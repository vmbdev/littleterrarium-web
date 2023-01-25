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
  visibleName?: string
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
    desc: $localize `:@@interfaces.light.fullsunDesc:Full sun`,
    verbose: $localize `:@@interfaces.light.fullsunVerbose:Sun shines over the whole day`,
  },
  PARTIALSUN: {
    desc: $localize `:@@interfaces.light.partialsunDesc:Partial sun`,
    verbose: $localize `:@@interfaces.light.partialsunVerbose:Sun is here for a few hours each day`,
  },
  SHADE: {
    desc: $localize `:@@interfaces.light.shadeDesc:Shade`,
    verbose: $localize `:@@interfaces.light.shadeVerbose:Sun is not allowed here`,
  },
}
export type Light = (typeof Light)[keyof typeof Light];

export const Condition: { [key: string]: string } = {
  BAD: $localize `:@@interfaces.condition.bad:On the line`, // red
  POOR: $localize `:@@interfaces.condition.poor:Holding on to life`, // yellow
  GOOD: $localize `:@@interfaces.condition.good:Looks good`, // grey
  GREAT: $localize `:@@interfaces.condition.great:Looks great`, // light green
  EXCELLENT: $localize `:@@interfaces.condition.excellent:Prime example of its specie`, // vibrant green
}
export type Condition = (typeof Condition)[keyof typeof Condition];

// client-side only
export const potChoices: { [key: string]: any } = {
  LT_POT_TERRACOTTA: { name: $localize `:@@interfaces.potMaterial.terracotta:Terracotta`, image: 'assets/pot-terracotta.jpg' },
  LT_POT_PLASTIC: { name: $localize `:@@interfaces.potMaterial.plastic:Plastic`, image: 'assets/pot-plastic.jpg' },
  LT_POT_CERAMIC: { name: $localize `:@@interfaces.potMaterial.ceramic:Ceramic`, image: 'assets/pot-ceramic.jpg' },
  LT_POT_METAL: { name: $localize `:@@interfaces.potMaterial.metal:Metal`, image: 'assets/pot-metal.jpg' },
  LT_POT_GLASS: { name: $localize `:@@interfaces.potMaterial.glass:Glass`, image: 'assets/pot-glass.jpg' },
  LT_POT_WOOD: { name: $localize `:@@interfaces.potMaterial.wood:Wood`, image: 'assets/pot-wood.jpg' },
  LT_POT_CONCRETE: { name: $localize `:@@interfaces.potMaterial.concrete:Concrete`, image: 'assets/pot-concrete.jpg' },
  LT_POT_OTHER: { name: $localize `:@@interfaces.potMaterial.other:Other`, image: 'assets/pot-other.jpg' },
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