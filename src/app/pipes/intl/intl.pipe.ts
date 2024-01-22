import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'intl',
  standalone: true
})
export class IntlPipe implements PipeTransform {
  transform(value: string): string | null {
    const dn = new Intl.DisplayNames([value], { type: 'language' });
    const lang = dn.of(value.toUpperCase());

    return lang ?? null;
  }

}
