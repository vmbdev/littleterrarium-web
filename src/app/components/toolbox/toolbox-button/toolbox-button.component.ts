import {
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { BoxIconComponent } from '@components/box-icon/box-icon.component';

@Component({
  selector: 'lt-toolbox-button',
  standalone: true,
  imports: [
    BoxIconComponent,
  ],
  templateUrl: './toolbox-button.component.html',
  styleUrls: ['./toolbox-button.component.scss'],
})
export class ToolboxButtonComponent {
  @Input({ required: true }) name!: string;
  @Input() type: 'solid' | 'regular' | 'logo' = 'solid';
  @Output() click = new EventEmitter<any>();
  @ViewChild('buttonTemplate') buttonTemplate!: TemplateRef<any>;

  clickEvent(): void {
    this.click.emit();
  }
}
