import { CommonModule } from '@angular/common';
import {
  booleanAttribute,
  numberAttribute,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  EventEmitter,
  Input,
  Output,
  QueryList,
  SimpleChanges
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  WizardHeaderComponent
} from '@components/wizard/wizard-header/wizard-header.component';
import { WizardPageComponent } from '@components/wizard/wizard-page/wizard-page.component';

// TODO: focus input on page change

@Component({
  selector: 'lt-wizard',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.scss']
})
export class WizardComponent {
  @ContentChildren(WizardPageComponent, { descendants: true })
  pageList!: QueryList<WizardPageComponent>;

  @ContentChild(WizardHeaderComponent)
  wizardHeader?: WizardHeaderComponent;

  @Input() form?: FormGroup;
  @Input({ transform: numberAttribute }) start: number = 0;
  @Input() moveTo: number | undefined = undefined;
  @Input({ transform: booleanAttribute }) singlePage: boolean = false;
  @Input() disableNavigation: boolean = false;
  @Output() indexChange = new EventEmitter();
  currentIndex: number = 0;

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterContentInit(): void {
    if (this.start) this.setIndex(this.start);
  }

  ngAfterViewChecked(): void {
    this.cdr.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['moveTo'] && (changes['moveTo'].currentValue !== undefined)) {
      this.setIndex(changes['moveTo'].currentValue);
    }
  }

  setIndex(value: number): void {
    this.currentIndex = value;
    this.indexChange.emit();
  }

  navigateBack(): void {
    if (this.currentIndex > 0) this.setIndex(this.currentIndex - 1);
  }

  navigateNext(): void {
    let validationErrors = false;

    if (this.form) {
      const page = this.pageList.get(this.currentIndex);

      if (page?.control) {
        const control = this.form.controls[page.control];
        this.form.updateValueAndValidity();

        if (control.errors) {
          control.markAsDirty();
          validationErrors = true;
        }
      }
    }

    if (
      !validationErrors
      && (this.currentIndex < (this.pageList.toArray().length - 1))
    ) {
      this.setIndex(this.currentIndex + 1);
    }
  }
}
