import { Component, OnInit } from '@angular/core';
import { NavigateBackService } from 'src/app/shared/navigateback/navigateback.service';

@Component({
  selector: 'mainnav',
  templateUrl: './mainnav.component.html',
  styleUrls: ['./mainnav.component.scss']
})
export class MainnavComponent implements OnInit {

  constructor(private nbService: NavigateBackService) {}

  ngOnInit(): void {
  }

  navigateBack() {
    this.nbService.navigateBack();
  }

}
