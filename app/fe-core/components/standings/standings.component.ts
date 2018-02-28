import {Component, Input, OnInit, DoCheck, Output, EventEmitter} from '@angular/core';

import {SliderCarousel, SliderCarouselInput} from '../carousels/slider-carousel/slider-carousel.component';
import {Tabs} from '../tabs/tabs.component';
import {Tab} from '../tabs/tab.component';
import {CustomTable} from '../custom-table/custom-table.component';
import {TableModel} from '../custom-table/table-data.component';
import {LoadingComponent} from '../loading/loading.component';
import {NoDataBox} from '../../components/error/data-box/data-box.component';
import {DropdownComponent} from '../../../fe-core/components/dropdown/dropdown.component';
import {GlobalFunctions} from '../../../global/global-functions';

export interface StandingsTableTabData<T> {
  season: any;
  conference: any;
  division: any;
  title: string;
  isActive: boolean;
  isLoaded: boolean;
  hasError: boolean;
  sections: Array<TableComponentData<T>>;
  getSelectedKey(): string;
  setSelectedKey(key:string);
  convertToCarouselItem(item:T, index:number):SliderCarouselInput
}

export interface TableComponentData<T> {
  groupName: string;
  tableData: TableModel<T>;
}

@Component({
  selector: "standings-component",
  templateUrl: "./app/fe-core/components/standings/standings.component.html"
})
export class StandingsComponent {
  public selectedIndex;

  public carouselData: Array<SliderCarouselInput> = [];

  @Input() tabs: Array<StandingsTableTabData<any>>;
  @Input() scope: string;
  @Output("tabSelected") tabSelectedListener = new EventEmitter();
  @Output("filterSelected") filterSelectedListener = new EventEmitter();

  private selectedTabTitle: string;
  private selectedKey: string;
  private tabsLoaded: {[index:number]:string};
  private noDataMessage = "Sorry, there is no data available.";
  sortConference: Array<any> = [{key: "", value: ""}];
  sortDivision: Array<any> = [{key: "", value: ""}];
  sortSeason: Array<any> = [{key: "", value: ""}];
  sortConferenceSelected: string = "";
  sortDivisionSelected: string = "";
  sortSeasonSelected: string = "";
  divFilterChanged: number = 0;
  confFilterChanged: number = 0;
  seasFilterChanged: number = 0;
  lastStanding = false;

  doCheck:number = 0;

  ngDoCheck() {
    if (this.doCheck == 0) {
      if ( this.tabs && this.tabs.length > 0) {
        if ( !this.tabsLoaded  ) {
          this.tabsLoaded = {};
          var selectedTitle = this.tabs[0].title;
          this.tabs.forEach(tab => {
            if ( tab.isActive ) {
              this.setSelectedCarouselIndex(tab, 0);
              selectedTitle = tab.title;
            }
          });
          this.tabSelected(selectedTitle);
        }
        else {
          let selectedTab = this.getSelectedTab();
          if ( selectedTab && selectedTab.sections && selectedTab.sections.length > 0 && !this.tabsLoaded[selectedTab.title] ) {
            // this.updateCarousel(); // wait until rows are sorted
            this.tabsLoaded[selectedTab.title] = "1";
          }
          this.doCheck++;
        }
      }
    }
  }
  setupDropdowns(currentTab) {
    var conference = [];
    var division = [];
    var seasons: Array<any> = [];
    if (currentTab.conferences == null || currentTab.conferences == undefined) {
      conference = [{key: "all", value: "All"}];
      this.sortConferenceSelected = "all";
    }
    else {
      conference = [{key: undefined, value: "All"}];
      for (var item in currentTab.conferences) {
        conference.push({key: item, value: item});
      }
      if (currentTab.conference == "Division" || currentTab.conference == "Conference") {
        this.sortConferenceSelected = undefined;
      }
      else {
        this.sortConferenceSelected = currentTab.conference;
      }
    }
    if (currentTab.divisions == null || currentTab.divisions == undefined) {
      division = [{key: undefined, value: "All"}];
      this.sortDivisionSelected = undefined;
    }
    else {
      division = [{key: undefined, value: "All"}];
      for (var item in currentTab.divisions) {
        var divisionName;
        if (currentTab.conference.toString() == item.toString()) {
          divisionName = item;
        }
        else {
          divisionName = item.replace(currentTab.conference, "");
        }
        division.push({key: item, value: divisionName});
      }
      this.sortDivisionSelected = currentTab.division;
    }
    if (currentTab.seasonsArray == null || currentTab.seasonsArray == undefined) {
      seasons = [{key: "N/A", value: "N/A"}];
      this.sortSeasonSelected = "N/A";
    }
    else {
      for (var i = 0; i < currentTab.seasonsArray.length; i++) {
        seasons.push({key: currentTab.seasonsArray[i], value: currentTab.seasonsArray[i] + '/' + (Number(currentTab.seasonsArray[i]) + 1).toString()});
      }
      this.sortSeasonSelected = currentTab.season;
    }
    this.sortConference = conference;
    this.sortDivision = division;
    this.sortSeason = seasons;
  }

  getSelectedTab(): StandingsTableTabData<any> {
    var matchingTabs = this.tabs.filter(value => value.title === this.selectedTabTitle);
    if ( matchingTabs.length > 0 && matchingTabs[0] !== undefined ) {
      return matchingTabs[0];
    }
    else {
      return null;
    }
  }

  setSelectedCarouselIndex(tab: StandingsTableTabData<any>, index: number) {

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
    this.noDataMessage = "Sorry, there is no data available for the "+ newTitle;
    var priorTab = this.getSelectedTab();
    if ( priorTab ) {
      this.selectedKey = priorTab.getSelectedKey();
    }

    this.selectedTabTitle = newTitle;
    var newTab = this.getSelectedTab();
    if ( newTab ) {
      newTab.setSelectedKey(this.selectedKey);
    }
    this.tabSelectedListener.next([newTab, this.selectedKey]);
    if ( newTab.isLoaded ) {
      this.updateCarousel();
    }
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
            let item = selectedTab.convertToCarouselItem(value, index);
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
    this.setupDropdowns(this.getSelectedTab());
  }
  conferenceChanged(event) {
    var priorTab = this.getSelectedTab();
    if ( priorTab ) {
      this.selectedKey = priorTab.getSelectedKey();
    }
    var newTab = this.getSelectedTab();
    if ( newTab ) {
      newTab.setSelectedKey(priorTab.getSelectedKey());
    }
    var params = {conference: event, division: undefined, season: priorTab.season};
    if (newTab.title != "Conference Standings") {
      this.filterSelectedListener.next([newTab, this.selectedKey, params]);
    }

  }
  divisionChanged(event) {
    var priorTab = this.getSelectedTab();
    if ( priorTab ) {
      this.selectedKey = priorTab.getSelectedKey();
    }
    var newTab = this.getSelectedTab();
    if ( newTab ) {
      newTab.setSelectedKey(priorTab.getSelectedKey());
    }
    var params = {conference: priorTab.conference, division: event, season: priorTab.season};
    if (newTab.title != "Conference Standings") {
      this.filterSelectedListener.next([newTab, this.selectedKey, params]);
    }


  }
  seasonChanged(event) {
    var priorTab = this.getSelectedTab();
    if ( priorTab ) {
      this.selectedKey = priorTab.getSelectedKey();
    }
    var newTab = this.getSelectedTab();
    if ( newTab ) {
      newTab.setSelectedKey(priorTab.getSelectedKey());
    }
    var params = {conference: priorTab.conference, division: priorTab.division, season: event};
    if (newTab.title != "Conference Standings" || newTab.title != "Division Standings") {
      this.filterSelectedListener.next([newTab, this.selectedKey, params]);
    }

  }
}
