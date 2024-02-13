import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'lt-wizard-page-description',
  standalone: true,
  templateUrl: './wizard-page-description.component.html',
  styleUrls: ['./wizard-page-description.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WizardPageDescriptionComponent {
  @ViewChild('pageDescTemplate') pageDescTemplate!: TemplateRef<any>;
}
