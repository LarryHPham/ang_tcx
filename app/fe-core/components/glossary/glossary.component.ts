import {Component,OnInit,Input} from '@angular/core';
import {SanitizeHtml} from "../../pipes/safe.pipe";

export interface GlossaryData{
  key: string;
  value: string;
}

@Component({
  selector: 'glossary-component',
  templateUrl: './app/fe-core/components/glossary/glossary.component.html',
})

export class GlossaryComponent implements OnInit{
  public title: string = "Glossary";
  @Input() glossaryData: Array<GlossaryData>;
  public classType: string;
  getClassType(){
    var termsCount = this.glossaryData.length;
  }
  ngOnInit() {
    this.getClassType();
  }//ngOnInit ends
}
