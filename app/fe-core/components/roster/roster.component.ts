import {Component, Input, OnInit, DoCheck, Output, EventEmitter} from '@angular/core';

import {SliderCarouselInput} from '../carousels/slider-carousel/slider-carousel.component';
import {TableModel} from '../custom-table/table-data.component';

export interface RosterTabData<T> {
  title: string;
  tableData: TableModel<T>;
  isLoaded: boolean;
  hasError: boolean;
  errorMessage: string;
  loadData();
  convertToCarouselItem(item:T, index:number):SliderCarouselInput
}

@Component({
  selector: "roster-component",
  templateUrl: "./app/fe-core/components/roster/roster.component.html",
})
export class RosterComponent implements DoCheck {
  private tabsLoaded: {[index:number]:string};
  private selectedIndex: number;
  private carDataArray: Array<SliderCarouselInput>
  @Input() tabs: Array<RosterTabData<any>>;

  private selectedTabTitle: string;

  private selectedKey: string;

  public noDataMessage: string = "No Data Is Available";

  public footerStyle = {
    ctaBoxClass: "list-footer",
    ctaBtnClass:"list-footer-btn",
    hasIcon: true
  };

  constructor() {}

  ngDoCheck() {
    if ( this.tabs && this.tabs.length > 0 ) {
      if ( !this.tabsLoaded  ) {
        this.tabsLoaded = {};
        var selectedTitle = this.tabs[0].title;
        this.tabs.forEach((tab, i) => {
          this.setSelectedCarouselIndex(tab, 0);
          if ( i == 0 ) {
            selectedTitle = tab.title;
          }
        });
        this.tabSelected(selectedTitle);
      }
      else {
        let selectedTab = this.getSelectedTab();
        if ( selectedTab && !this.tabsLoaded[selectedTab.title] ) {
          if ( selectedTab.tableData ) {
            selectedTab.tableData.setSelectedKey(this.selectedKey);
          }
          this.updateCarousel();
          this.tabsLoaded[selectedTab.title] = "1";
        }
      }
    }
  }

  setSelectedCarouselIndex(tab: RosterTabData<any>, index: number) {
    if ( tab.tableData ) {
      tab.tableData.setRowSelected(index);
    }
  }

  getSelectedTab(): RosterTabData<any> {
    var matchingTabs = this.tabs.filter(value => value.title === this.selectedTabTitle);
    if ( matchingTabs.length > 0 && matchingTabs[0] !== undefined ) {
      return matchingTabs[0];
    } else {
      return null;
    }
  }

  tabSelected(newTitle) {
    this.selectedTabTitle = newTitle;
    var selectedTab = this.getSelectedTab();
    if ( selectedTab ) {
      this.noDataMessage = selectedTab.errorMessage;
      selectedTab.loadData();
      if ( selectedTab.tableData ) {
        selectedTab.tableData.setSelectedKey(this.selectedKey);
      }
      this.updateCarousel();
    }
  }

  indexNum($event) {
    let selectedIndex = Number($event);
    let matchingTabs = this.tabs.filter(value => value.title === this.selectedTabTitle);
    if ( matchingTabs.length > 0 ) {
      if ( !matchingTabs[0] || !matchingTabs[0].tableData ) {
        return;
      }
      let selectedTab = matchingTabs[0];
      let table = selectedTab.tableData;
      if ( selectedIndex < table.rows.length ) {
        table.setRowSelected(selectedIndex);
        this.selectedKey = table.getSelectedKey();
      }
    }
  }

  updateCarousel(sortedRows?) {
    var selectedTab = this.getSelectedTab();
    let carouselData: Array<SliderCarouselInput> = [];
    let selectedIndex = -1;
    if ( selectedTab && selectedTab.tableData ) {
      let table = selectedTab.tableData;
      let index = 0;
      table.rows.map((value) => {
        let item = selectedTab.convertToCarouselItem(value, index);
        if ( table.isRowSelected(value, index) ) {
          selectedIndex = index;
        }
        index++;
        return item;
      })
      .forEach(value => {
        carouselData.push(value);
      });
    }
    this.selectedIndex = selectedIndex < 0 ? 0 : selectedIndex;
    this.carDataArray = carouselData;
  }
}
