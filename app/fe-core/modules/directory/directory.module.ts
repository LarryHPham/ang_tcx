import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { NgClass } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

//interfaces
import { PagingData, DirectoryModuleData } from './directory.data';

@Component({
    selector: 'directory-module',
    templateUrl: './app/fe-core/modules/directory/directory.module.html'
})

export class DirectoryModule implements OnChanges {
  @Input() data: DirectoryModuleData;

  @Input() currentPage: number = 0;

  //Boolean to determine if an error has occurred
  @Input() isError: boolean = false;

  public isLoading: boolean = true;
  public pagingDescription: PagingData;
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnChanges() {
    this.setupData();
  }

  // COMMENTED OUT FOR NOW (don't remove yet)
  isActive(instruction: any[]): boolean {
    console.log('instruction - ',instruction);
    console.log(this.activatedRoute);
    return true;
  }

  setupData() {
    if ( this.data === undefined || this.data === null ){
      this.pagingDescription = null;
      this.isLoading = true; //it may still be loading
      return;
    }

    if ( this.data.listingItems === undefined || this.data.listingItems === null  ){
      console.error("Unable to set up paging parameters: listing data is undefined");
      this.pagingDescription = null;
      return;
    }

    this.isLoading = false;

    // var pageName:string = this.data.pageName;
    var maxPageCount: number = Math.ceil(this.data.listingItems.totalItems / this.data.listingsLimit);
    var currPage: number = this.currentPage;

    //Determine range display for directory page (ex. 1-20, 22-40, etc)
    var rangeStart = 0;
    var rangeEnd = 0;
    var totalItems = 0;
    if ( this.data.hasListings ) {
      rangeStart = (currPage - 1) * this.data.listingsLimit + 1;
      rangeEnd = (currPage * this.data.listingsLimit <= this.data.listingItems.totalItems) ? (currPage * this.data.listingsLimit) : this.data.listingItems.totalItems;
      totalItems = this.data.listingItems.totalItems;
    }

    this.pagingDescription = {
      rangeText: rangeStart + "-" + rangeEnd,
      totalItems: totalItems,
      description: this.data.pagingDescription
    }
    
  } //setUpData
}
