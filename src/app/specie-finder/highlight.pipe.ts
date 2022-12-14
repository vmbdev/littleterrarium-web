import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlight'
})
export class HighlightPipe implements PipeTransform {
  transform(value: string, pattern: string): string {
    return value.replace(pattern,  `<b>${pattern}</b>`);
  }

}
