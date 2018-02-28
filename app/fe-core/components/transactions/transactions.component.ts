import { Component, OnInit, Injectable, Output, EventEmitter, Input } from '@angular/core';

//services
import { TransactionsService } from '../../../services/transactions.service';

//interfaces
import { TransactionsListInput } from '../../components/transactions-list-item/transactions-list-item.component';
import { SliderCarousel, SliderCarouselInput } from '../../components/carousels/slider-carousel/slider-carousel.component';


export interface TransactionTabData {
  tabDataKey: string;
  tabDisplay: string;
  isLoaded: boolean;
  sortTitle?: string;
  sortOptions?: Array<{key: string, value: string}>;
  selectedSort?: string;
  includeDropdown?: boolean;
  errorMessage?: string;
  totalTransactions?: string;
  dataArray?: Array<TransactionsListInput>;//array of data for transactions list
  carData?: Array<SliderCarouselInput>;
  yearArray?: Array<any>;
}


@Component({
  selector: 'transactions',
  templateUrl: './app/fe-core/components/transactions/transactions.component.html'
})

export class TransactionsComponent implements OnInit {
  @Output() tabSelectedListener = new EventEmitter();
  @Output() transactionKeyFilter = new EventEmitter();

  @Input() tabs: Array<TransactionTabData>;
  @Input() dropdownKey1: string;
  @Input() transactionFilter1 : Array<{key:string, value:string}>;
  @Input() selectedTabName;

  carouselDataArray: Array<SliderCarouselInput>;
  pageName: string;

  public selectedFilterSeason: string;
  public selectedFilter: string;
  public activeFilter: any;
  public newSelectionMade: boolean;

  private selectedTabTitle: string;
  private selectedFilterTitle: string;
  private tabsLoaded: {[index:number]:string};

  constructor() {}

  ngDoCheck() {
    if ( this.newSelectionMade == true ) {
      this.updateCarousel();
    }

    if ( this.tabs && this.tabs.length > 0 ) {
      if ( !this.tabsLoaded  ) {
        this.tabsLoaded = {};
        if ( !this.selectedTabName ) { // if URL param for tabs doesn't exist as input get value from tabs
          this.selectedTabName = this.tabs[0].tabDisplay;
        }
        this.tabSelected(this.selectedTabName);
      }
      else {
        let selectedTab = this.getSelectedTab();
        if ( selectedTab && selectedTab.dataArray && !this.tabsLoaded[selectedTab.tabDisplay] ) {
          this.tabsLoaded[selectedTab.tabDisplay] = "1";
        }
      }

      this.updateCarousel();
    }
    else {

    }
  } //ngDoCheck()


  ngOnInit() {
    if ( this.selectedFilterSeason == null ) {
      this.selectedFilterSeason = new Date().getFullYear() + "/" + (new Date().getFullYear()+1);
    }
  }

  updateCarousel() {
    var selectedTab = this.getSelectedTab();
    if ( selectedTab ) {
      this.carouselDataArray = selectedTab.carData;
    }
    else {
      // an error occurred because tab is null
    }
  }

  getSelectedTab() {
    var tabTitle = this.selectedTabName;
    var tabs = this.tabs.filter(tab => tab.tabDisplay == tabTitle);
    return tabs.length > 0 ? tabs[0] : null;
  }

  tabSelected(tabTitle){
    this.selectedTabName = tabTitle;
    var selectedTab = this.getSelectedTab();
    var modFooter;

    if ( selectedTab ) {
        selectedTab.isLoaded = true;
        this.tabSelectedListener.next(selectedTab);
    }
    else {
        this.tabSelectedListener.next(selectedTab);
        this.updateCarousel();
    }

    this.pageName = this.selectedTabTitle;
  }

  transactionDropdownChange(event) {
    this.transactionKeyFilter.next(event);
    this.selectedFilter = event;
    this.selectedFilterSeason = (Number(event)).toString() + "/" + ((Number(event))+1).toString();

    if ( this.activeFilter != this.selectedFilter ) {
      this.newSelectionMade = true;
      this.activeFilter = this.selectedFilter;
    }
    else {
      this.newSelectionMade = false;
    }
  } //transactionDropdownChange
}
