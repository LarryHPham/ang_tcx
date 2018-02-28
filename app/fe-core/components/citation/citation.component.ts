import { Component,Input } from '@angular/core';
import { citationData } from "../../interfaces/deep-dive.data";

@Component({
  selector: 'citation-component',
  templateUrl: './app/fe-core/components/citation/citation.component.html',
})

export class CitationComponent{
  @Input() citationInfo: citationData;
  ngOnInit() {
    if(typeof this.citationInfo == "undefined" || this.citationInfo.url == null){
      this.citationInfo = null;
    }
  }
}
