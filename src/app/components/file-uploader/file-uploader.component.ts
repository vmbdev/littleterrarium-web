import { CommonModule } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  numberAttribute,
  Output,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * Provides drag and drop and manual selection for multiple files.
 */
@Component({
  standalone: true,
  selector: 'lt-file-uploader',
  imports: [CommonModule],
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FileUploaderComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileUploaderComponent {
  /**
   * Max amount of files the user can select. By default, 1.
   */
  @Input({ transform: numberAttribute }) maxAmount: number = 1;
  
  /**
   * Special mode in which the file uploader design changes to fill a circular
   * container.
  */
  @Input({ transform: booleanAttribute }) embedded = false;
  @Input({ transform: numberAttribute }) embeddedSize?: number;

  /**
   * Emitted when the files selected in the component have changed.
   * In case we don't want to use this component as a FormControl.
   */
  @Output() fileChange = new EventEmitter<File[] | File>();

  /**
   * Files currently selected in the component.
   */
  protected files: File[] = [];

  /**
   * Thumbnails for the current file selection, in the same order.
   */
  protected previews: string[] = new Array<string>(this.maxAmount);

  /**
   * Mouse is over the component containing a file.
   */
  protected dragOver: boolean = false;

  protected disabled: boolean = false;
  private onChange = (_val: File[] | File | null) => {};

  writeValue(val: File[]): void {
    if (val) this.onChange(val);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(_fn: any): void {}

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  /**
   * Mouse is dragging a file over the component.
   * 
   * @param {DragEvent} event  The drag and drop event.
   */
  dragEnter(event: DragEvent): void {
    event.stopPropagation();
    event.preventDefault();

    if (!this.dragOver && (this.availableSlots() > 0)) this.dragOver = true;
  }

  /**
   * Mouse left the component.
   * 
   * @param {DragEvent} event  The drag and drop event.
   */
  dragLeave(event: DragEvent): void {
    event.stopPropagation();
    event.preventDefault();

    if (this.dragOver) this.dragOver = false;
  }

  /**
   * A file was dropped over the component, containing one or more files.
   * 
   * @param {DragEvent} event  The drag and drop event.
   */
  dropFile(event: DragEvent): void {
    event.stopPropagation();
    event.preventDefault();

    const files = event.dataTransfer?.files;

    this.dragOver = false;

    if (files) this.addFiles(files);
  }

  /**
   * One or more files have been manually selected by the user.
   * 
   * @param {Event} event  The input event.
   */
  fileInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;

    if (target.files) this.addFiles(target.files);
  }

  /**
   * The number of files that can still be added, depending on the max amount
   * of files allowed.
   * 
   * @returns {number} The difference between maxAmount and the number of files
   * already selected.
   */
  availableSlots(): number {
    return (this.maxAmount - this.files.length);
  }

  /**
   * Add files to the current selection. Called when the user drags and drop
   * or selects more files.
   * 
   * @param {FileList} list  The list of files to be added.
   */
  addFiles(list: FileList): void {
    const slots = this.availableSlots();

    if (slots > 0) {
      const limit = list.length > slots ? slots : list.length;
      const base = this.files.length;

      this.files.push(...Array.from(list).splice(0, slots));

      // previews array must follow the same order as files array
      for (let i = base; i < base + limit; i++) {
        this.previews[i] = URL.createObjectURL(this.files[i]);
      }

      if (this.maxAmount === 1) {
        this.onChange(this.files[0]);
        this.fileChange.emit(this.files[0]);
      } else {
        this.onChange(this.files);
        this.fileChange.emit(this.files);
      }
    }
  }

  /**
   * Removes a file from the current selection.
   * 
   * @param {number} index  The index of the file to be removed.
   */
  removeFile(index: number): void {
    this.files.splice(index, 1);
    this.previews.splice(index, 1);
    this.onChange(this.files);
  }

  /**
   * Revokes an URL object to free memory after the thumbnail for the preview
   * has been rendered.
   * 
   * @param url 
   */
  revokeUrl(url: string) {
    URL.revokeObjectURL(url);
  }

}
