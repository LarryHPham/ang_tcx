import {Pipe, PipeTransform} from '@angular/core';
import {GlobalFunctions} from '../../global/global-functions';

@Pipe({
  name: 'priceFormat'
})

export class PriceFormatPipe implements PipeTransform {
  constructor(private globalFunctions: GlobalFunctions) {

  }

  transform(value) : string {
    return this.globalFunctions.formatPriceNumber(value);
  }
}
