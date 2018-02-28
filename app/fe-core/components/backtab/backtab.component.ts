import {Component} from '@angular/core';
import {Input} from "@angular/core";

@Component({
    selector: 'backtab-component',
    templateUrl: './app/fe-core/components/backtab/backtab.component.html',
})

export class BackTabComponent{
    @Input() labelInput : string;
    label : string;
    history=window.history;

    goBack() {
      if(history.length <= 2){
        window.location.href = '/';
      } else {
        history.go(-1);
      }
    }

    ngOnInit(){
        this.label = this.labelInput ? this.labelInput : "Go Back To Previous Page";
    }
}
