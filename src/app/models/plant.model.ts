import { Photo } from './photo.model';
import { Specie } from './specie.model';

export interface Plant {
  id: number;
  specieId: number | null;
  customName: string | null;
  description: string | null;
  condition: Condition | null;
  waterFreq: number | null;
  waterLast: Date | string | null;
  waterNext: Date | string | null;
  fertFreq: number | null;
  fertLast: Date | string | null;
  fertType: string | null;
  fertNext: Date | string | null;
  potType: string | null;
  potSize: number | null;
  soil: string | null;
  public: boolean;
  coverId?: number;
  locationId: number;
  ownerId: number;
  createdAt: Date;
  updatedAt: Date;
  cover?: Photo;
  photos?: Photo[];
  specie?: Specie;
  visibleName?: string;
}

export interface CoverPhoto {
  coverId: number | null;
}

export const Condition: { [key: string]: string } = {
  BAD: $localize`:@@interfaces.condition.bad:On the line`, // red
  POOR: $localize`:@@interfaces.condition.poor:Holding on to life`, // yellow
  GOOD: $localize`:@@interfaces.condition.good:Looks good`, // grey
  GREAT: $localize`:@@interfaces.condition.great:Looks great`, // light green
  EXCELLENT: $localize`:@@interfaces.condition.excellent:Prime example of its specie`, // vibrant green
};
export type Condition = (typeof Condition)[keyof typeof Condition];

export type Pot = {
  name: string;
  image: string;
};
// client-side only
export const potChoices: { [key: string]: Pot } = {
  LT_POT_TERRACOTTA: {
    name: $localize`:@@interfaces.potMaterial.terracotta:Terracotta`,
    image: 'assets/pot-terracotta.jpg',
  },
  LT_POT_PLASTIC: {
    name: $localize`:@@interfaces.potMaterial.plastic:Plastic`,
    image: 'assets/pot-plastic.jpg',
  },
  LT_POT_CERAMIC: {
    name: $localize`:@@interfaces.potMaterial.ceramic:Ceramic`,
    image: 'assets/pot-ceramic.jpg',
  },
  LT_POT_METAL: {
    name: $localize`:@@interfaces.potMaterial.metal:Metal`,
    image: 'assets/pot-metal.jpg',
  },
  LT_POT_GLASS: {
    name: $localize`:@@interfaces.potMaterial.glass:Glass`,
    image: 'assets/pot-glass.jpg',
  },
  LT_POT_WOOD: {
    name: $localize`:@@interfaces.potMaterial.wood:Wood`,
    image: 'assets/pot-wood.jpg',
  },
  LT_POT_CONCRETE: {
    name: $localize`:@@interfaces.potMaterial.concrete:Concrete`,
    image: 'assets/pot-concrete.jpg',
  },
  LT_POT_OTHER: {
    name: $localize`:@@interfaces.potMaterial.other:Other`,
    image: 'assets/pot-other.jpg',
  },
};
