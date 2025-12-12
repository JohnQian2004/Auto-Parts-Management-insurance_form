import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortName'
})
export class ShortNamePipe implements PipeTransform {
  transform(fullName: string, numChars: number = 2): string {
    if (!fullName) return '';

    return fullName
      .split(' ')
      .filter(n => n) // filter out empty strings
      .slice(0, numChars)
      .map(n => {
        const firstChar = n.toString().charAt(0);
        return isNaN(+firstChar) ? firstChar.toUpperCase() : firstChar;
      })
      .join('');
  }
}

// @Pipe({
//     name: 'shortName'
//   })
//   export class ShortNamePipe implements PipeTransform {
//     transform(fullName: string, numChars: number = 2): any {
//       return fullName
//         .split(' ')
//         .slice(0, numChars)
//         .map(n => n[0].toUpperCase())
//         .join('');
//     }
//   }
