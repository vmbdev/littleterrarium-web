import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpecieFinderComponent } from './specie-finder.component';
import { HighlightPipe } from './highlight.pipe';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    SpecieFinderComponent,
    HighlightPipe,
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    SpecieFinderComponent,
    HighlightPipe
  ]
})
export class SpecieFinderModule { }
