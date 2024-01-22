import { Component, TemplateRef, ViewChild } from '@angular/core';

@Component({
  selector: 'lt-mainnav-base-content',
  standalone: true,
  imports: [],
  templateUrl: './mainnav-base-content.component.html',
  styleUrl: './mainnav-base-content.component.scss'
})
export abstract class MainnavBaseContentComponent {
  @ViewChild('template') template!: TemplateRef<any>;
}
