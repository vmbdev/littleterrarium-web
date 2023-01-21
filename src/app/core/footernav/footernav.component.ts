import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'footernav',
  templateUrl: './footernav.component.html',
  styleUrls: ['./footernav.component.scss']
})
export class FooternavComponent implements OnInit {
  githubLink: string = '<a href="https://github.com/vmbdev/littleterrarium" target="_blank">GitHub</a>';
  footerMsg: string = $localize `:@@footer.msg:&#169; Little Terrarium 2022 - Source code available at ${this.githubLink}:github.link:`;

  constructor() { }

  ngOnInit(): void {
  }

}
