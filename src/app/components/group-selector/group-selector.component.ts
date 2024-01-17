import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, numberAttribute } from '@angular/core';
import { BoxIconComponent } from '@components/box-icon/box-icon.component';

export type GroupSelectorData<T> = {
  id: T;
  asset?: string;
  name?: string;
  color?: string;
}

@Component({
  selector: 'lt-group-selector',
  standalone: true,
  imports: [
    CommonModule,
    BoxIconComponent,
  ],
  templateUrl: './group-selector.component.html',
  styleUrl: './group-selector.component.scss'
})
export class GroupSelectorComponent {
  @Input({ required: true }) group!: GroupSelectorData<any>[];
  @Input() default: any;
  @Input() assetType: 'image' | 'icon' = 'image';
  @Input({ transform: numberAttribute }) columns: number = 4;
  @Output() change: EventEmitter<any> = new EventEmitter<any>();
  selectedOption: any | null = null;

  ngOnInit(): void {
    this.selectedOption = this.default;
  }

  selectPot<T>(id: T): void {
    // deselect
    if (id === this.selectedOption) this.selectedOption = null;
    else this.selectedOption = id;

    this.change.emit(this.selectedOption);
  }
}
