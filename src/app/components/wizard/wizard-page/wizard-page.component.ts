import { CommonModule } from '@angular/common';
import {
  Component,
  ContentChild,
  Input,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {
  WizardPageDescriptionComponent
} from '@components/wizard/wizard-page-description/wizard-page-description.component';

@Component({
  selector: 'lt-wizard-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wizard-page.component.html',
  styleUrls: ['./wizard-page.component.scss']
})
export class WizardPageComponent {
  @Input() title?: string;
  @Input() control?: string;
  @ViewChild('pageTemplate') pageTemplate!: TemplateRef<any>;
  @ContentChild(WizardPageDescriptionComponent) description?: WizardPageDescriptionComponent;

}
