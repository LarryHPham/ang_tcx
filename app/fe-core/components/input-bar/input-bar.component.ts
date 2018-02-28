import {Component, Input,OnInit} from '@angular/core';
import {FormGroup, FormControl, FormBuilder, Validators} from "@angular/forms";

declare var moment;
@Component({
    selector: 'input-bar',
    templateUrl: './app/fe-core/components/input-bar/input-bar.component.html',
})

export class InputBar{
    ddIcon="caret-down";
    searchControl= new FormControl();
    @Input() scope;

    onsubmit(){
        //console.log(this.searchControl.value);

       /* this.searchControl.valueChanges.subscribe(value => {
s
        });*/
    }
    public searchInput: any = {
        placeholderText: "Search by keyword, topic or article name",
        hasSuggestions: true
    };
    selectedSport(e){
        //console.log(e);
    }



}
