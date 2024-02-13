import { CommonModule } from '@angular/common';
import {
  booleanAttribute,
  numberAttribute,
  Component,
  ContentChild,
  ContentChildren,
  EventEmitter,
  Input,
  Output,
  QueryList,
  SimpleChanges,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { FormGroup } from '@angular/forms';

import { WizardHeaderComponent } from '@components/wizard/wizard-header/wizard-header.component';
import { WizardPageComponent } from '@components/wizard/wizard-page/wizard-page.component';
import { BehaviorSubject } from 'rxjs';

// TODO: focus input on page change

@Component({
  selector: 'lt-wizard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WizardComponent {
  @ContentChildren(WizardPageComponent, { descendants: true })
  pageList!: QueryList<WizardPageComponent>;

  @ContentChild(WizardHeaderComponent)
  wizardHeader?: WizardHeaderComponent;

  @Input() form?: FormGroup;
  @Input({ transform: numberAttribute }) start: number = 0;
  @Input({ transform: numberAttribute }) moveTo?: number;
  @Input({ transform: booleanAttribute }) singlePage: boolean = false;
  @Input({ transform: booleanAttribute }) disableNavigation: boolean = false;
  @Output() indexChange = new EventEmitter();

  protected currentIndex$ = new BehaviorSubject<number>(0);

  constructor(private readonly cdr: ChangeDetectorRef) {}

  ngAfterContentInit(): void {
    if (this.start) this.setIndex(this.start);
  }

  ngAfterViewInit() {
      this.cdr.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['moveTo']) {
      const newVal = changes['moveTo'].currentValue;

      if (newVal || newVal >= 0) {
        this.setIndex(newVal);
      }
    }
  }

  setIndex(value: number): void {
    this.currentIndex$.next(value);
    this.indexChange.emit();
  }

  navigateBack(): void {
    const index = this.currentIndex$.getValue();
    if (index > 0) this.setIndex(index - 1);
  }

  navigateNext(): void {
    const index = this.currentIndex$.getValue();
    let validationErrors = false;

    if (this.form) {
      const page = this.pageList.get(index);

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
      !validationErrors &&
      index < this.pageList.toArray().length - 1
    ) {
      this.setIndex(index + 1);
    }
  }
}
