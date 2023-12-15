import {
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewChild
} from '@angular/core';

@Component({
  selector: 'lt-toolbox-button',
  standalone: true,
  templateUrl: './toolbox-button.component.html',
  styleUrls: ['./toolbox-button.component.scss'],
})
export class ToolboxButtonComponent {
  @Input({ required: true }) image!: string;
  @Output() click = new EventEmitter<any>();
  @ViewChild('buttonTemplate') buttonTemplate!: TemplateRef<any>;

  clickEvent(): void {
    this.click.emit();
  }
}
