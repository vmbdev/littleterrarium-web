import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';

@Component({
  selector: 'lt-wizard-header',
  templateUrl: './wizard-header.component.html',
  styleUrls: ['./wizard-header.component.scss']
})
export class WizardHeaderComponent implements OnInit {
  @ViewChild('wizardHeaderTemplate') wizardHeaderTemplate!: TemplateRef<any>;

  constructor() { }

  ngOnInit(): void {
  }

}
