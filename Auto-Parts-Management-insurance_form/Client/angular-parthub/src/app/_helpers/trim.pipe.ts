import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'trim'})
export class TrimPipe implements PipeTransform {
  transform(inValue: any): string {
    let value = '';
    try {
      value = inValue.toString();
      console.log('TrimPipe: >>' + value + '<<');
      return value.substring(0, value.length - 1);
    } catch (err) {
      console.log(err);
      return value;
    }
  }
}