import { Plant } from "./plant.model"

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