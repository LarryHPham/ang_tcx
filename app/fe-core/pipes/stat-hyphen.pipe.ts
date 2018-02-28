import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'statHyphenValue'
})

export class StatHyphenValuePipe implements PipeTransform {
  transform(value) : string {
    return value === null || value === undefined ? "-" : value;
  }
}
