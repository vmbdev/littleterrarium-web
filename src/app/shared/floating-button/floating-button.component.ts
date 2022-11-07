import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'floating-button',
  templateUrl: './floating-button.component.html',
  styleUrls: ['./floating-button.component.scss']
})
export class FloatingButtonComponent implements OnInit {
  @Input() linkSrc!: string;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  navigate(): void {
    this.router.navigate([this.linkSrc]);
  }
}
