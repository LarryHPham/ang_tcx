import { Component, ContentChildren, QueryList, AfterContentInit, Input, Output, EventEmitter } from '@angular/core';
import { Tab } from './tab.component';

@Component({
  selector: 'tabs',
  templateUrl: './app/fe-core/components/tabs/tabs.component.html',
})

export class Tabs implements AfterContentInit {
  public tabWidth: string;
  @ContentChildren(Tab) tabs: QueryList<Tab>;
  @Output() tabSelected = new EventEmitter();

  // contentChildren are set
  ngAfterContentInit() {
    // Disabled: Causes component to throw an exception when used with ngFor
    // get all active tabs
    //let activeTabs = this.tabs.filter((tab)=>tab.active);
    //// if there is no active tab set, activate the first
    //if(activeTabs.length === 0) {
    //  this.tabs.first.active = true;
    //}
    // get width for each tab
    if ( this.tabs.length > 0 ) { //can't divide by 0
      this.tabWidth = 100/(this.tabs.length) + "%";
    }
  }

  selectTab(tab: Tab){
    //If selected tab is currently selected, exit function
    if(tab.active === true){
      return false;
    }
    // deactivate all tabs
    this.tabs.toArray().forEach(tab => tab.active = false);
    // activate the tab the user has clicked on.
    tab.active = true;
    this.tabSelected.emit(tab.title);
  }
}
