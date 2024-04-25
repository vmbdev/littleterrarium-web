import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  numberAttribute,
  Output,
  ViewChild,
} from '@angular/core';

// import '@interactjs/auto-start';
// import '@interactjs/actions';
// import '@interactjs/inertia';
// import '@interactjs/reflow';
// import '@interactjs/actions/drag';
// import '@interactjs/actions/gesture';
// import '@interactjs/modifiers';
// import interact from '@interactjs/interact';

import interact from 'interactjs'

type Coords = {
  x: number;
  y: number;
};

@Component({
  selector: 'lt-image-crop',
  standalone: true,
  imports: [],
  templateUrl: './image-crop.component.html',
  styleUrl: './image-crop.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageCropComponent {
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;
  @Input({ transform: numberAttribute }) size: number = 300;
  @Input() imageSource!: File;
  @Output() imageFile = new EventEmitter<File>();

  private ctx: CanvasRenderingContext2D | null = null;
  private image = new Image();
  private scale = 1;
  private position: Coords = { x: 0, y: 0 };
  private imageDim: Coords = { x: 0, y: 0 };

  ngAfterViewInit(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.image.src = URL.createObjectURL(this.imageSource);
    this.image.crossOrigin = 'anonymous';
    this.canvas.nativeElement.width = this.size;
    this.canvas.nativeElement.height = this.size;

    this.image.onload = () => {
      let imageBaseDim: Coords;

      if (this.image.naturalWidth >= this.size && this.image.naturalHeight >= this.size) {
        imageBaseDim = {
          x: this.image.naturalWidth,
          y: this.image.naturalHeight,
        };
      } else {
        const mindim = Math.min(this.image.naturalHeight, this.image.naturalWidth);
        const ratio = this.size / mindim;
        
        imageBaseDim = {
          x: this.image.naturalWidth * ratio,
          y: this.image.naturalHeight * ratio,
        };
      }

      this.imageDim.x = imageBaseDim.x;
      this.imageDim.y = imageBaseDim.y;
      this.position.x = (this.size - imageBaseDim.x) / 2;
      this.position.y = (this.size - imageBaseDim.y) / 2;
      this.draw();
      this.setupCanvasInteraction();
      this.snapshot();
      URL.revokeObjectURL(this.image.src);
    };
  }

  setupCanvasInteraction() {
    interact(this.canvas.nativeElement)
    .draggable({
      onmove: (event: any) => {
        this.dragImage(event.dx, event.dy);
      },
      onend: () => {
        this.snapshot();
      },
    })
    .gesturable({
      onmove: (event: any) => {
        // console.log(event);
      }
    })
    .on('doubletap', (event) => {
      event.preventDefault();

      this.zoom(-400, event.clientX, event.clientY);
      this.snapshot();
    })
  }

  /**
   * Draw the image on canvas
   */
  draw(grid: boolean = true) {
    this.clear();
    this.ctx?.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.imageDim.x,
      this.imageDim.y,
    );

    if (grid) this.drawGrid();
  }

  drawGrid() {
    if (!this.ctx) return;

    const gap = this.size / 4;
    this.ctx.beginPath();
    this.ctx.lineWidth = 0.5;
    this.ctx.strokeStyle = 'grey';

    for (let i = 1; i <= 3; i++) {
      this.ctx.moveTo(i * gap, 0);
      this.ctx.lineTo(i * gap, this.size);
      this.ctx.stroke();

      this.ctx.moveTo(0, i * gap);
      this.ctx.lineTo(this.size, i * gap);
      this.ctx.stroke();
    }
  }

  /**
   * Clear the canvas to redraw on it
   */
  clear() {
    this.ctx?.clearRect(0, 0, this.size, this.size);
  }

  /**
   * Move the image on the canvas
   * @param x In pixels, the horizontal distance
   * @param y In pixels, the vertical distance
   */
  move(x: number = 0, y: number = 0, full: boolean = false) {
    const borderX = this.canvas.nativeElement.width - this.imageDim.x;
    const borderY = this.canvas.nativeElement.height - this.imageDim.y;
    const newX = full ? x : this.position.x + x;
    const newY = full ? y : this.position.y + y;

    // test the horizontal limits to not move the photo out of screen
    if (newX <= 0 && newX >= borderX) this.position.x = newX;
    else if (newX < borderX) {
      this.position.x = Math.min(0, this.size - this.imageDim.x);
    }

    // test the vertical limits to not move the photo out of screen
    if (newY <= 0 && newY >= borderY) this.position.y = newY;
    else if (newY < borderY) {
      this.position.y = Math.min(0, this.size - this.imageDim.y);
    }

    this.draw();
  }

  dragImage(dx: number, dy: number) {
    const canvasW = this.canvas.nativeElement.width;
    const canvasH = this.canvas.nativeElement.height;

    // if image is wider than the canvas
    if (dx !== 0 && this.imageDim.x > canvasW) this.move(dx, 0);

    // if image is taller than the canvas
    if (dy !== 0 && this.imageDim.y > canvasH) this.move(0, dy);
  }

  onWheel(event: WheelEvent) {
    event.stopPropagation();
    event.preventDefault();

    this.zoom(event.deltaY, event.clientX, event.clientY);
  }

  zoom(delta: number, pointerX: number, pointerY: number) {
    const newScale = Math.min(
      Math.max(0.125, this.scale + delta * -0.001),
      2.5,
    );

    const newImageDimX = newScale * this.image.naturalWidth;
    const newImageDimY = newScale * this.image.naturalHeight;

    if (newImageDimX >= this.size && newImageDimY >= this.size) {
      const newX =
        pointerX -
        (pointerX - this.position.x) * (newScale / this.scale);
      const newY =
        pointerY -
        (pointerY - this.position.y) * (newScale / this.scale);

      this.imageDim = {
        x: newImageDimX,
        y: newImageDimY,
      };
      this.scale = newScale;
      this.move(newX, newY, true);
    }
  }

  snapshot() {
    this.draw(false);

    this.canvas.nativeElement.toBlob(
      (blob: Blob | null) => {
        if (blob) {
          const file = new File([blob], `snap-${Date.now()}.jpeg`, {
            type: 'image/jpeg',
          });

          this.imageFile.emit(file);
        }
      },
      'image/jpeg',
      80,
    );

    this.draw();
  }
}
