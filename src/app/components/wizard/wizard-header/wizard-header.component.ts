import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'lt-wizard-header',
  standalone: true,
  templateUrl: './wizard-header.component.html',
  styleUrls: ['./wizard-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WizardHeaderComponent {
  @ViewChild('wizardHeaderTemplate') wizardHeaderTemplate!: TemplateRef<any>;
}
