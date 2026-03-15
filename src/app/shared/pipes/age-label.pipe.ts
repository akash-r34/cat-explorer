import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'ageLabel', standalone: true, pure: true })
export class AgeLabelPipe implements PipeTransform {
  transform(age: number | string | null | undefined): string {
    if (age === null || age === undefined || age === '') return 'Unknown age';
    const ageNum = Number(age);
    if (isNaN(ageNum)) return 'Unknown age';
    if (ageNum === 0) return 'Kitten';
    if (ageNum === 1) return '1 year old';
    return `${ageNum} years old`;
  }
}
