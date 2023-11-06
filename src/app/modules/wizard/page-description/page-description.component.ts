import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';

@Component({
  selector: 'lt-page-description',
  templateUrl: './page-description.component.html',
  styleUrls: ['./page-description.component.scss']
})
export class PageDescriptionComponent implements OnInit {
  @ViewChild('pageDescTemplate') pageDescTemplate!: TemplateRef<any>;

  ngOnInit(): void {
  }

}
