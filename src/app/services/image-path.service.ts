import { Injectable } from '@angular/core';
import { ImagePath } from '@models/image-path.model';
import { baseUrl } from 'src/config';

@Injectable({
  providedIn: 'root'
})
export class ImagePathService {

  constructor() { }
  // TODO: webp support
  get(image: ImagePath, size: 'thumb' | 'mid' | 'full'): string {
    let path: string;
    
    //if (image.webp) path = image.webp[size];
    path = image.path[size];

    return `${baseUrl}/${path}`
  }
}
