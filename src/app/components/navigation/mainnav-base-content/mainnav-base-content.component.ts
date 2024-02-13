import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'lt-mainnav-base-content',
  standalone: true,
  templateUrl: './mainnav-base-content.component.html',
  styleUrl: './mainnav-base-content.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export abstract class MainnavBaseContentComponent {
  @ViewChild('template') template!: TemplateRef<any>;
}
