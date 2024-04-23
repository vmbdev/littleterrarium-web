import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  numberAttribute,
  Output,
  SimpleChanges,
} from '@angular/core';

import { BoxIconComponent } from '@components/box-icon/box-icon.component';
import { FileUploaderComponent } from '@components/file-uploader/file-uploader.component';
import { ImageCropComponent } from '@components/image-crop/image-crop.component';

@Component({
  selector: 'lt-image-selector',
  standalone: true,
  imports: [ImageCropComponent, FileUploaderComponent, BoxIconComponent],
  templateUrl: './image-selector.component.html',
  styleUrl: './image-selector.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageSelectorComponent {
  @Input() source?: string | null;
  @Input({ transform: numberAttribute }) smallSize = 200;
  @Input({ transform: numberAttribute }) expandedSize = 300;
  @Output() selected = new EventEmitter<File | null>();

  protected editMode: boolean = false;
  protected newSource?: File;

  ngOnChanges(changes: SimpleChanges) {
    const changeSrc = changes['source'];

    if (changeSrc) {
      if (changeSrc.firstChange && !changeSrc.currentValue) {
        this.editMode = true;
      } else if (!changeSrc.firstChange && changeSrc.currentValue) {
        this.editMode = false;
        this.newSource = undefined;
      }
    }
  }

  edit() {
    this.editMode = true;
    this.selected.emit(null);
  }

  getNewFile(file: File | File[]) {
    this.newSource = file as File;
  }

  removeNewSource() {
    this.newSource = undefined;
  }

  acceptNewSource() {
    if (this.newSource) this.selected.emit(this.newSource);
  }

  fetchNewSource(file: File) {
    this.newSource = file;
  }
}
