import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.scss']
})
export class FileUploaderComponent implements OnInit {
  @Input() amount: number = 0;
  @Input() controlName: string | null = null;
  @Output() fileChange: EventEmitter<File[]> = new EventEmitter<File[]>();
  files: File[] = [];
  dragOver: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  dragEnter(event: Event) {
    event.stopPropagation();
    event.preventDefault();

    if (!this.dragOver) this.dragOver = true;
  }

  dragLeave(event: Event) {
    event.stopPropagation();
    event.preventDefault();

    if (this.dragOver) this.dragOver = false;
  }

  dropFile(event: DragEvent) {
    event.stopPropagation();
    event.preventDefault();
    this.dragOver = false;
  
    const files = event.dataTransfer?.files;
    if (files) this.setFiles(files);
  }

  fileInputChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files) this.setFiles(target.files);
  }

  setFiles(list: FileList): void {
    this.files.push(...Array.from(list));
    this.fileChange.emit(this.files);
  }

  removeFile(index: number) {
    this.files.splice(index, 1);
  }

}
