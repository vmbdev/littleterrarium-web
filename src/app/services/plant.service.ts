import { Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY, map, Observable } from 'rxjs';

import {
  ApiService,
  PlantGetConfig,
  PlantUpdateConfig
} from '@services/api.service';
import { AuthService } from '@services/auth.service';
import { ImagePathService } from '@services/image-path.service';
import { Photo } from '@models/photo.model';
import { Condition, Plant, Pot } from '@models/plant.model';

@Injectable({
  providedIn: 'root',
})
export class PlantService {
  private plant = new BehaviorSubject<Plant | null>(null);
  public readonly plant$ = this.plant.asObservable();
  private owned = new BehaviorSubject<boolean>(false);
  public readonly owned$ = this.owned.asObservable();

  constructor(
    private readonly api: ApiService,
    private readonly auth: AuthService,
    private readonly imagePath: ImagePathService
  ) {}

  create(plant: Plant): Observable<Plant> {
    return this.api.createPlant(plant);
  }

  get(id: number, options?: PlantGetConfig): Observable<Plant> {
    this.plant.next(null);

    return this.api.getPlant(id, options).pipe(
      map((plant: Plant) => {
        this.owned.next(this.auth.getUser()?.id === plant.ownerId);
        plant.visibleName = this.getVisibleName(plant);

        this.plant.next(plant);

        return plant;
      })
    );
  }

  getMany(options: PlantGetConfig): Observable<Plant[]> {
    return this.api.getPlants(options).pipe(
      map((plants: Plant[]) => {
        for (const plant of plants) {
          plant.visibleName = this.getVisibleName(plant);
        }

        return plants;
      })
    );
  }

  getCover(id: number): Observable<any> {
    return this.api.getPlantCover(id);
  }

  getPhotos(id: number): Observable<Photo[]> {
    return this.api.getPlantPhotos(id);
  }

  getVisibleName(plant: Plant): string {
    let name;

    if (plant.customName) name = plant.customName;
    else if (plant.specie?.name) {
      name =
        plant.specie.name.slice(0, 1).toUpperCase() +
        plant.specie.name.slice(1);
    } else {
      name = $localize`:@@general.unnamedPlant:Unnamed plant ${plant.id}:plantId:`;
    }

    return name;
  }

  update(plant: Plant, options: PlantUpdateConfig = {}): Observable<Plant> {
    if (plant.specieId === null) options.removeSpecie = true;

    return this.api.updatePlant(plant, options).pipe(
      map((plant: Plant) => {
        const current = this.plant.getValue();
        plant.visibleName = this.getVisibleName(plant);

        if (current) {
          plant.photos = current.photos;
          this.plant.next(plant);
        }

        return plant;
      })
    );
  }

  delete(id?: number): Observable<any> {
    if (!id) id = this.plant.getValue()?.id;

    if (id) {
      this.plant.next(null);
      return this.api.deletePlant(id);
    } else return EMPTY;
  }

  fertilize(id?: number): Observable<any> {
    let plantId: number | undefined;

    if (id) plantId = id;
    else plantId = this.plant.getValue()?.id;

    if (plantId) {
      const updatedPlant = {
        id: plantId,
        fertLast: new Date(),
      } as Plant;

      return this.update(updatedPlant);
    }

    return EMPTY;
  }

  water(id?: number): Observable<any> {
    let plantId: number | undefined;

    if (id) plantId = id;
    else plantId = this.plant.getValue()?.id;

    if (plantId) {
      const updatedPlant = {
        id: plantId,
        waterLast: new Date(),
      } as Plant;

      return this.update(updatedPlant);
    }

    return EMPTY;
  }

  current(): Plant | null {
    return this.plant.getValue();
  }

  coverPhoto(plant?: Plant): string | null {
    let workingPlant;

    if (!plant) workingPlant = this.plant.getValue();
    else workingPlant = plant;

    if (workingPlant) {
      let image: any;

      if (workingPlant.cover) {
        image = this.imagePath.get(workingPlant.cover.images, 'thumb');
      } else if (
        workingPlant.photos &&
        workingPlant.photos[0] &&
        workingPlant.photos[0].images
      ) {
        image = this.imagePath.get(workingPlant.photos[0].images, 'thumb');
      } else image = null;

      return image;
    } else return null;
  }

getPotInfo(key: string): Pot {
  let pot: Pot;

  switch (key) {
    case 'LT_POT_TERRACOTTA': {
      pot = {
        name: $localize`:@@interfaces.potMaterial.terracotta:Terracotta`,
        image: 'assets/pot-terracotta.jpg',
      };
      break;
    }
    case 'LT_POT_PLASTIC': {
      pot = {
        name: $localize`:@@interfaces.potMaterial.plastic:Plastic`,
        image: 'assets/pot-plastic.jpg',
      };
      break;
    }
    case 'LT_POT_CERAMIC': {
      pot = {
        name: $localize`:@@interfaces.potMaterial.ceramic:Ceramic`,
        image: 'assets/pot-ceramic.jpg',
      };
      break;
    }
    case 'LT_POT_METAL': {
      pot = {
        name: $localize`:@@interfaces.potMaterial.metal:Metal`,
        image: 'assets/pot-metal.jpg',
      };
      break;
    }
    case 'LT_POT_GLASS': {
      pot = {
        name: $localize`:@@interfaces.potMaterial.glass:Glass`,
        image: 'assets/pot-glass.jpg',
      };
      break;
    }
    case 'LT_POT_WOOD': {
      pot = {
        name: $localize`:@@interfaces.potMaterial.wood:Wood`,
        image: 'assets/pot-wood.jpg',
      };
      break;
    }
    case 'LT_POT_CONCRETE': {
      pot = {
        name: $localize`:@@interfaces.potMaterial.concrete:Concrete`,
        image: 'assets/pot-concrete.jpg',
      };
      break;
    }
    default: {
      pot = {
        name: $localize`:@@interfaces.potMaterial.other:Other`,
        image: 'assets/pot-other.jpg',
      };
      break;
    }
  }

  return pot;
}

getConditionDesc(condition: Condition | string): string {
  let desc: string;

  switch (condition) {
    case 'BAD': {
      desc = $localize`:@@interfaces.condition.bad:On the line`; // red
      break;
    }
    case 'POOR': {
      desc = $localize`:@@interfaces.condition.poor:Holding on to life`; // yellow
      break;
    }
    case 'GREAT': {
      desc = $localize`:@@interfaces.condition.great:Looks great`; // l;ght green
      break;
    }
    case 'EXCELLENT': {
      desc = $localize`:@@interfaces.condition.excellent:Prime example of its specie`; // vib;ant green
      break;
    }
    default:
    case 'GOOD': {
      desc = $localize`:@@interfaces.condition.good:Looks good`; // grey
      break;
    }
  }
  return desc;
}

getConditionColor(condition: Condition | string): string {
  let color: string;

  switch (condition) {
    case 'BAD':
      color = 'red';
      break;
    case 'POOR':
      color = 'yellow';
      break;
    case 'GREAT':
      color = 'greenyellow';
      break;
    case 'EXCELLENT':
      color = 'green';
      break;
    default:
      color = 'grey';
      break;
  }

  return color;
}

}
