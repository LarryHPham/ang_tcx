import { Component, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { ModuleHeader, ModuleHeaderData } from '../../components/module-header/module-header.component';

export interface faqModuleData{
  question: string;
  answer: string;
  active: boolean;
}

@Component({
    selector: 'faq-module',
    templateUrl: './app/fe-core/modules/faq/faq.module.html'
})

export class FAQModule implements OnChanges {
  @Input() profileName: string;
  @Input() faqData: Array<faqModuleData>;
  @Output() faqSelected = new EventEmitter();

  public headerInfo: ModuleHeaderData = {
    moduleTitle: "FAQ - [Profile Name]",
    hasIcon: false,
    iconClass: ""
  };

  constructor() { }

  isSelected(faqData){
    faqData.active = !faqData.active;
    this.faqData.forEach(faqData => faqData.active = false);
    faqData.active = true;
    this.faqSelected.emit(faqData.question);
  }

  ngOnChanges() {
    let profileName = this.profileName ? this.profileName : "MLB";
    this.headerInfo.moduleTitle = "FAQ <span class='mod-info'>- " + profileName + "</span>";
  }
}
