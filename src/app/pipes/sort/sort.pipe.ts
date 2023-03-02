import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sort',
  standalone: true
})
export class SortPipe implements PipeTransform {

  transform(value: any[], param: string, order: 'asc' | 'desc', caseInsensitive: boolean = false): any[] {
    return value.sort((a, b) => {
      const aParam = caseInsensitive ? (a[param] as string).toLowerCase() : a[param];
      const bParam = caseInsensitive ? (b[param] as string).toLowerCase() : b[param];

      if (order === 'asc') return ((aParam < bParam) ? -1 : 1);
      else return ((aParam > bParam) ? -1 : 1);
    });
  }
}
