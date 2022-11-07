import { ChangeDetectorRef, Component, ContentChildren, EventEmitter, Input, OnInit, Output, QueryList } from '@angular/core';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'toolbox',
  templateUrl: './toolbox.component.html',
  styleUrls: ['./toolbox.component.scss']
})
export class ToolboxComponent implements OnInit {
  @ContentChildren(ButtonComponent) buttons!: QueryList<ButtonComponent>;
  @Input() title?: string;
  @Input() subtitle?: string;

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
  }

  ngAfterViewChecked(): void {
    this.cdr.detectChanges();
  }

}
