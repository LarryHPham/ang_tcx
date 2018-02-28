// import {Component, OnInit, OnChanges, Input} from '@angular/core';
//
// import {ListPageService} from '../../../services/list-page.service';
// import {DraftHistoryTab, DraftHistoryService} from '../../../services/draft-history.service';
// 
// import {IProfileData} from '../../modules/profile-header/profile-header.module';
// import {SliderCarouselInput} from '../carousels/slider-carousel/slider-carousel.component';
//
// @Component({
//     selector: 'draft-history',
//     templateUrl: './app/fe-core/components/draft-history/draft-history.component.html'
// })
//
// export class DraftHistoryComponent implements OnInit {
//   @Input() profileData: IProfileData;
//   @Input() type: string;
//
//   private dataArray: Array<DraftHistoryTab>;
//
//   private carouselDataArray: Array<Array<SliderCarouselInput>>;
//
//   private isError: boolean = false;
//
//   private currentIndex: number = 0;
//
//   private sortOptions: Array<any> = [{key: '1', value: 'Ascending'}, {key: '2', value: 'Descending'}];
//
//   private currentTab: any;
//
//   constructor(
//     private _draftService:DraftHistoryService
//   ) {}
//
//   ngOnInit() {
//     if ( this.profileData != null ) {
//       this.dataArray = this._draftService.getDraftHistoryTabs(this.profileData);
//       if ( this.dataArray && this.dataArray.length > 0 ) {
//         this.getDraftPage(this.dataArray[0], "1");
//       }
//     }
//     this.currentTab = this.dataArray[0];
//   }
//
//   // getDraftPage(tab: DraftHistoryTab, sortBy) {
//   getDraftPage(tab: any, sortBy) {
//     if ( tab.isLoaded ) {
//       if ( tab.paginationDetails ) {
//         tab.paginationDetails.index = this.currentIndex + 1;
//       }
//       this.carouselDataArray = tab.carouselDataArray;
//     }
//     this._draftService.getDraftHistoryService(this.profileData, tab, this.currentIndex, this.type, sortBy)
//         .subscribe(
//             draftData => {
//               tab.isLoaded = true;
//               tab.detailedDataArray = draftData.detailedDataArray;
//               tab.carouselDataArray = draftData.carouselDataArray;
//               tab.paginationDetails = draftData.paginationDetails;
//               this.carouselDataArray = tab.carouselDataArray;
//             },
//             err => {
//               tab.isLoaded = true;
//               this.isError = true;
//               console.log('Error: draftData API: ', err);
//             }
//         );
//   }
//
//   selectedTab(tabTitle) {
//     let tabs = this.dataArray.filter(tab => tab.tabTitle == tabTitle);
//     this.currentTab = tabs[0];
//     if ( tabs.length > 0 ) {
//       this.currentIndex = 0; // change page back to beginning
//       this.getDraftPage(tabs[0], "1");
//     }
//   }
//
//   newIndex(index) {
//     window.scrollTo(0,0);
//     this.currentIndex = index - 1; //page index is 1-based, but we need 0-based to select correct array
//   }
//   dropdownChanged(event) {
//     this.getDraftPage(this.currentTab, event);
//   }
// }
