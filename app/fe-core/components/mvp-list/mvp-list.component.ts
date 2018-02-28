import { Injectable, Component, OnInit, DoCheck, Output, EventEmitter, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

//interfaces
import { DetailedListItem, DetailListInput } from '../../components/detailed-list-item/detailed-list-item.component';
import { SliderCarousel, SliderCarouselInput } from '../../components/carousels/slider-carousel/slider-carousel.component';
import { FooterStyle } from '../../components/module-footer/module-footer.component';
import { PaginationParameters } from "../../interfaces/pagination.data";



export interface MVPTabData {
  tabDisplayTitle: string;
  tabDataKey: string;
  errorData: any;
  isLoaded: boolean;
  listData: DetailListInput[];
  getCarouselData(): Array<SliderCarouselInput>;
}

@Component({
    selector: 'mvp-list',
    templateUrl: './app/fe-core/components/mvp-list/mvp-list.component.html'
})

export class MVPListComponent implements DoCheck, OnInit  {
  @Output() tabSelectedListener = new EventEmitter();
  @Output() dropdownPositionSelection = new EventEmitter();

  @Input() tabs: Array<MVPTabData>;
  @Input() carouselFooter: FooterStyle;
  @Input() selectedTabTitle: string;
  @Input() position: string;
  @Input() sortOptions: Array<any>;
  @Input() selectedKey;

  detailedDataArray: DetailListInput[]; //variable that is just a list of the detailed DataArray
  carouselDataArray: Array<any>;
  dropDownFirstRun: boolean = true;
  tabsLoaded: {[index:number]:string};

  listType: string;
  displayTab: string;

  dropdownSelectedKey: string = 'cb';

  ngDoCheck() {
    if ( this.tabs && this.tabs.length > 0 ) {
      if ( !this.tabsLoaded  ) {
        this.tabsLoaded = {};
        if ( !this.selectedTabTitle ) {
          this.selectedTabTitle = this.tabs[0].tabDisplayTitle;
        }

        this.tabSelected(this.selectedTabTitle);
      }
      else {
        let selectedTab = this.getSelectedTab();

        //Only run update carousel on first run
        if ( selectedTab && selectedTab.listData && selectedTab.listData.length > 0 && !this.tabsLoaded[selectedTab.tabDisplayTitle]) {
          if (this.carouselDataArray != null && this.carouselDataArray[0].description[0].textData[0].text != selectedTab.getCarouselData()[0].description[0].textData[0].text) {
            this.updateCarousel(selectedTab);
          }
          else if (this.carouselDataArray == null) {
            this.updateCarousel(selectedTab);
          }
          //this.tabsLoaded[selectedTab.tabDisplayTitle] = "qb";
        }
      }
    }
  } //ngDoCheck()

  constructor( private activateRoute: ActivatedRoute ) {
    this.activateRoute.params.subscribe(
      (param :any) => {
        this.listType = param['type'] ? param['type'] : null;
        this.displayTab = param['tab'] ? param['tab'] : null;
      }
    )
  }



  ngOnInit(){
      if (this.listType == null ) {
        this.position = this.position == null ? this.dropdownSelectedKey : this.position;
      }
      else {
        this.position = this.listType;
      }
  }

  getSelectedTab() {
    if ( !this.tabs ) return null;

    var tabTitle = this.selectedTabTitle;
    var matches = this.tabs.filter(tab => tab.tabDisplayTitle == tabTitle);

    return matches.length > 0 ? matches[0] : null;
  } //getSelectedTab()

  //each time a tab is selected the carousel needs to change accordingly to the correct list being shown
  tabSelected(tabTitle){
    this.selectedTabTitle = tabTitle;
    var selectedTab = this.getSelectedTab();

    if ( selectedTab ) {
      this.detailedDataArray = null;
      if(!selectedTab.listData){
        selectedTab.isLoaded = false;
        this.tabSelectedListener.next({
          tab:selectedTab,
          position:this.position
        });
      }
      else {
        this.tabSelectedListener.next({
          tab: selectedTab,
          position: this.position
        });
        this.updateCarousel(selectedTab);
      }
    }
  } //tabSelected

  updateCarousel(tab: MVPTabData) {
    if ( tab.listData.length == 0 ) {
      this.carouselDataArray = tab.getCarouselData()
    }
    else {
      this.carouselDataArray = tab.getCarouselData();
      this.detailedDataArray = tab.listData;
    }

    this.dropdownSelectedKey = this.position == null ? this.dropdownSelectedKey  : this.position;
  } //updateCarousel

  ngOnChanges() {
    // reset dropdown when new datapoints have populated
    var matches = this.tabs.filter(tab => tab.tabDisplayTitle == this.selectedTabTitle);
    if(matches.length > 0){
      this.selectedTabTitle = matches[0].tabDisplayTitle;
    }else{
      this.selectedTabTitle = this.tabs[0].tabDisplayTitle;
    }
    this.dropDownFirstRun = true;
  }

  dropdownChanged($event) {
    this.dropDownFirstRun = false;
    this.position = $event;
    this.dropdownPositionSelection.next({
      tab: this.getSelectedTab(),
      position: $event //position 'key' value
    });
    this.dropdownSelectedKey = this.position == null ? this.dropdownSelectedKey  : this.position;
  }
}
