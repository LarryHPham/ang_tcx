import {Pipe, PipeTransform} from '@angular/core';
import {GlobalFunctions} from '../../global/global-functions';

@Pipe({
  name: 'possessive'
})

export class PossessivePipe implements PipeTransform {
  transform(value) : string {
    return GlobalFunctions.convertToPossessive(value);
  }
}
