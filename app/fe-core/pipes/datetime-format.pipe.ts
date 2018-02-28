import {Pipe, PipeTransform} from '@angular/core';
import {GlobalFunctions} from '../../global/global-functions';

declare var moment: any;

@Pipe({
  name: 'dateTimeStamp'
})

export class DateTimePipe implements PipeTransform {  
  transform(value: any) : string {
    let date = moment(value);
    return date.format('dddd, ') + 
      GlobalFunctions.formatAPMonth(date.month()) +
      date.format(' Do, YYYY') + 
      ' | ' + 
      date.format('hh:mm A') + ' ET';
  }
}