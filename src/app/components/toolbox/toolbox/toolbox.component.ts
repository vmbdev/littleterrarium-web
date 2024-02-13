import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  Input,
  QueryList,
} from '@angular/core';

import { ToolboxButtonComponent } from '@components/toolbox/toolbox-button/toolbox-button.component';
import { CapitalizePipe } from '@pipes/capitalize/capitalize.pipe';

@Component({
  selector: 'lt-toolbox',
  standalone: true,
  imports: [CommonModule, CapitalizePipe],
  templateUrl: './toolbox.component.html',
  styleUrls: ['./toolbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolboxComponent {
  @ContentChildren(ToolboxButtonComponent)
  buttons?: QueryList<ToolboxButtonComponent>;
  @Input() title?: string;
  @Input() subtitle?: string;

  constructor(private readonly cdr: ChangeDetectorRef) {}

  ngAfterViewChecked(): void {
    this.cdr.detectChanges();
  }
}
