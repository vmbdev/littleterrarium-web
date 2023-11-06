import { Component, ContentChild, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { PageDescriptionComponent } from '@modules/wizard/page-description/page-description.component';

@Component({
  selector: 'lt-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent implements OnInit {
  @Input() title?: string;
  @Input() control?: string;
  @ViewChild('pageTemplate') pageTemplate!: TemplateRef<any>;
  @ContentChild(PageDescriptionComponent) description?: PageDescriptionComponent;

  ngOnInit(): void {
  }

}
