import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.scss']
})
export class FileUploaderComponent implements OnInit {
  @Input() amount: number = 1;
  @Input() controlName: string | null = null;
  @Output() fileChange: EventEmitter<File[]> = new EventEmitter<File[]>();
  files: File[] = [];
  dragOver: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  dragEnter(event: Event): void {
    event.stopPropagation();
    event.preventDefault();

    if (!this.dragOver && (this.availableSlots() > 0)) this.dragOver = true;
  }

  dragLeave(event: Event): void {
    event.stopPropagation();
    event.preventDefault();

    if (this.dragOver) this.dragOver = false;
  }

  dropFile(event: DragEvent): void {
    const files = event.dataTransfer?.files;
  
    event.stopPropagation();
    event.preventDefault();
    this.dragOver = false;
  
    if (files) this.setFiles(files);
  }

  fileInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files) this.setFiles(target.files);
  }

  availableSlots(): number {
    return (this.amount - this.files.length);
  }

  setFiles(list: FileList): void {
    this.files.push(...Array.from(list).splice(0, this.availableSlots()));
    this.fileChange.emit(this.files);
  }

  removeFile(index: number): void {
    this.files.splice(index, 1);
  }

}
