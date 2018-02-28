import { Component, Input, OnInit, DoCheck, Output, EventEmitter } from '@angular/core';

//interfaces
import { SliderCarouselInput } from '../carousels/slider-carousel/slider-carousel.component';
import { Tabs } from '../tabs/tabs.component';
import { Tab } from '../tabs/tab.component';
import { TableModel } from '../custom-table/table-data.component';

export interface TableTabData<T> {
  title: string;
  tabName: string;
  isActive: boolean;
  isLoaded: boolean;
  hasError: boolean;
  sections: Array<TableComponentData<T>>;
  convertToCarouselItem(item:T, index:number, scope?):SliderCarouselInput
}

export interface TableComponentData<T> {
  groupName: string;
  tableData: TableModel<T>;
}

@Component({
  selector: "season-stats-component",
  templateUrl: "./app/fe-core/components/season-stats/season-stats.component.html"
})

export class SeasonStatsComponent implements DoCheck {
  public selectedIndex;

  public carouselData: Array<SliderCarouselInput> = [];

  @Input() tabs: Array<TableTabData<any>>;
  @Output("tabSelected") tabSelectedListener = new EventEmitter();

  private selectedTabTitle: string;
  private tabsLoaded: {[index:number]:string};
  private noDataMessage = "Sorry, there is no data available.";

  constructor() {}

  ngDoCheck() {
    if ( this.tabs && this.tabs.length > 0 ) {
      if ( !this.tabsLoaded  ) {
        this.tabsLoaded = {};
        var selectedTitle = this.tabs[0].title;
        this.tabs.forEach(tab => {
          this.setSelectedCarouselIndex(tab, 0);
          if ( tab.isActive ) {
            selectedTitle = tab.title;
          }
        });
        this.tabSelected(selectedTitle);
      }
      else {
        let selectedTab = this.getSelectedTab();
        if ( selectedTab && selectedTab.sections && selectedTab.sections.length > 0 && !this.tabsLoaded[selectedTab.title] ) {
          this.updateCarousel();
          this.tabsLoaded[selectedTab.title] = "1";
        }
      }
    }
  }

  getSelectedTab(): TableTabData<any> {
    var matchingTabs = this.tabs.filter(value => value.title === this.selectedTabTitle);
    if ( matchingTabs.length > 0 && matchingTabs[0] !== undefined ) {
      return matchingTabs[0];
    }
    else {
      return null;
    }
  }

  setSelectedCarouselIndex(tab: TableTabData<any>, index: number) {
    let offset = 0;
    if ( !tab.sections ) return;

    tab.sections.forEach((section, sectionIndex) => {
      if ( index >= offset && index < section.tableData.rows.length + offset ) {
        section.tableData.setRowSelected(index-offset);
      }
      else {
        section.tableData.setRowSelected(-1);
      }
      offset += section.tableData.rows.length;
    });
  }

  tabSelected(newTitle) {
    this.selectedTabTitle = newTitle;
    this.noDataMessage = "Sorry, there is no data available";
    this.tabSelectedListener.next(this.getSelectedTab());
    this.updateCarousel();
  }

  indexNum($event) {
    let selectedIndex = Number($event);
    let matchingTabs = this.tabs.filter(value => value.title === this.selectedTabTitle);
    if ( matchingTabs.length > 0 && matchingTabs[0] !== undefined ) {
      let selectedTab = matchingTabs[0];
      this.setSelectedCarouselIndex(selectedTab, selectedIndex);
    }
  }

  updateCarousel(sortedRows?) {
    var selectedTab = this.getSelectedTab();

    if ( selectedTab === undefined || selectedTab === null ) {
      return;
    }

    let carouselData: Array<SliderCarouselInput> = [];
    let index = 0;
    let selectedIndex = -1;

    if ( selectedTab.sections ) {
      selectedTab.sections.forEach(section => {
        section.tableData.rows
          .map((value) => {
            let item = selectedTab.convertToCarouselItem(value, index, 'nfl');
            if ( section.tableData.isRowSelected(value, index) ) {
              selectedIndex = index;
            }
            index++;
            return item;
          })
          .forEach(value => {
            carouselData.push(value);
          });
      });
    }

    this.selectedIndex = selectedIndex < 0 ? 0 : selectedIndex;
    this.carouselData = carouselData;
  }
}
