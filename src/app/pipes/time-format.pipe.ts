import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeFormat'
})
export class TimeFormatPipe implements PipeTransform {

  transform(hour: number | null | undefined, minute: number | null | undefined): string {
    const h = String(hour ?? 0).padStart(2, '0');
    const m = String(minute ?? 0).padStart(2, '0');
    return `${h}:${m}`;
  }

}
