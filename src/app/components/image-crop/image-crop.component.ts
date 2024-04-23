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

import '@interactjs/auto-start';
import '@interactjs/actions/drag';
import interact from '@interactjs/interact';

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
  @Input({ required: true }) imageSource!: File;
  @Output() imageFile = new EventEmitter<File>();

  private ctx: CanvasRenderingContext2D | null = null;
  private image = new Image();
  private position: Coords = { x: 0, y: 0 };

  ngAfterViewInit(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.image.src = URL.createObjectURL(this.imageSource);
    this.image.crossOrigin = 'anonymous';
    this.canvas.nativeElement.width = this.size;
    this.canvas.nativeElement.height = this.size;

    this.image.onload = () => {
      this.position.x = (this.size - this.image.naturalWidth) / 2;
      this.position.y = (this.size - this.image.naturalHeight) / 2;
      this.draw();
      this.setupCanvasInteraction();
      this.snapshot();
      URL.revokeObjectURL(this.image.src);
    };
  }

  setupCanvasInteraction() {
    interact(this.canvas.nativeElement).draggable({
      onmove: (event: any) => {
        const imgW = this.image.naturalWidth;
        const imgH = this.image.naturalHeight;
        const canvasW = this.canvas.nativeElement.width;
        const canvasH = this.canvas.nativeElement.height;

        // if image is wider than the canvas
        if (event.dx !== 0 && imgW > canvasW) {
          const destX = this.position.x + event.dx;

          // test the horizontal limits to not move the photo out of screen
          if (destX >= canvasW - imgW && destX <= 0) {
            this.move(event.dx, 0);
          }
        }

        // if image is taller than the canvas
        if (event.dy !== 0 && imgH > canvasH) {
          const destY = this.position.y + event.dy;

          // test the vertical limits to not move the photo out of screen
          if (destY >= canvasH - imgH && destY <= 0) {
            this.move(0, event.dy);
          }
        }
      },
      onend: () => {
        this.snapshot();
      },
    });
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
      this.image.naturalWidth,
      this.image.naturalHeight,
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
  move(x: number = 0, y: number = 0) {
    this.position.x += x;
    this.position.y += y;

    this.draw();
  }

  snapshot() {
    this.draw(false);

    this.canvas.nativeElement.toBlob((blob: Blob | null) => {
      if (blob) {
        const file = new File([blob], `snap-${Date.now()}.jpeg`, {
          type: 'image/jpeg',
        });

        this.imageFile.emit(file);
      }
    }, 'image/jpeg', 80);

    this.draw();
  }
}
