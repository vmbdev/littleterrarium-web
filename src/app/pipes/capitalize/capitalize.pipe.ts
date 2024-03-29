import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'capitalize',
})
export class CapitalizePipe implements PipeTransform {
  transform(value: string | null): string {
    if (!value) return '';

    return value.slice(0, 1).toUpperCase() + value.slice(1);
  }
}
