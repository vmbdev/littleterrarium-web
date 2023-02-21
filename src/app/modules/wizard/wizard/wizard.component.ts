import { ChangeDetectorRef, Component, ContentChild, ContentChildren, EventEmitter, Input, OnInit, Output, QueryList, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { WizardHeaderComponent } from '../wizard-header/wizard-header.component';
import { PageComponent } from '../page/page.component';

// TODO: focus input on page change

@Component({
  selector: 'wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.scss']
})
export class WizardComponent implements OnInit {
  @ContentChildren(PageComponent, { descendants: true }) pageList!: QueryList<PageComponent>;
  @ContentChild(WizardHeaderComponent) wizardHeader?: WizardHeaderComponent;
  @Input() form?: FormGroup;
  @Input() start?: number = 0;
  @Input() moveTo: number | undefined = undefined;
  @Input() singlePage: boolean = false;
  @Output() indexChange = new EventEmitter();
  currentIndex: number = 0;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
  }

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

    if (!validationErrors && (this.currentIndex < (this.pageList.toArray().length - 1))) {
      this.setIndex(this.currentIndex + 1);
    }
  }
}
