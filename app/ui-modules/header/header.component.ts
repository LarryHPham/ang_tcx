import { Component, Input, OnInit, OnChanges, Output, EventEmitter, ElementRef, Renderer } from '@angular/core';
import { GlobalSettings } from "../../global/global-settings";
import { HeaderLinksService } from '../../services/header-links.service';
import { DeepDiveService } from '../../services/deep-dive.service';
import { GeoLocation } from "../../global/global-service";

declare var stButtons: any;

@Component({
    selector: 'header-component',
    templateUrl: './app/ui-modules/header/header.component.html'
})

export class HeaderComponent implements OnInit {
    @Input() partnerID: string;
    @Input() partnerScript: any;
    @Output() tabSelected = new EventEmitter();
    public logoUrl: string = 'app/public/TCX_Logo_Outlined.svg';
    public homeUrl: Array<string>;
    public searchInput: any = {
        placeholderText: "Search for a topic...",
        hasSuggestions: true
    };
    public hamburgerMenuData: Array<any>;
    public hamburgerMenuInfo: Array<any>;
    public headerLinks: Array<any> = HeaderLinksService.createMenu();
    public isOpened: boolean = false;
    public isSearchOpened: boolean = false;
    public isActive: boolean = false;
    public breakingHeadLines: any;
    scrollTopPrev: number = 0; // to help with scroll polarity + or - scroll
    scrollUp: boolean = false; // determin is user is scrolling up or down relates to scrollTopPrev

    private elementRef: any;

    constructor(elementRef: ElementRef, private _renderer: Renderer, private _deepDiveData: DeepDiveService, private _geoLocation: GeoLocation) {
        this.elementRef = elementRef;
    }

    getTrendingData() {
        this._deepDiveData.getDeepDiveBatchService("trending", 10, 1)
            .subscribe(data => {
                try{
                    if (data) {
                        this.breakingHeadLines = this._deepDiveData.transformToArticleStack(data, "trending");
                    } else throw new Error('Missing Trending Headlines Data !!')
                }
                catch(e){
                    console.log(e.message);
                }

            },
            err => {
            });
    }

    openSearch(event) {
        if (this.isSearchOpened == true) {
            this.isSearchOpened = false;
        } else {
            this.isSearchOpened = true;
        }
    }
    // Page is being scrolled
    onScrollStick(event) {
        var header =event.target.getElementById('pageHeader');
        var stickyItem = event.target.getElementById('bottomHeader');
        var scrollTop = event.target.documentElement.scrollTop?event.target.documentElement.scrollTop:event.target.body.scrollTop;
        // var saladBar = document.getElementById('salad-bar-top');
        //check if partner header exist and the sticky header shall stay and not partner header
        let heightBeforeStick = header.offsetHeight - stickyItem.offsetHeight;

        let scrollPolarity = scrollTop - this.scrollTopPrev;

        if(scrollPolarity > 0 || scrollTop == 0){// scrollUp is true scrollPolarity is negative which will add the header back
          this.scrollUp = false;
        }else{
          this.scrollUp = true;
        }
        this.scrollTopPrev = scrollTop;

        if(scrollTop > heightBeforeStick){// if body scrollTop is greater than height before sticky header then add fix header class
          stickyItem.classList.add('fixedHeader');

          //
          if(this.scrollUp){
            stickyItem.classList.remove('fixedHeader');
          }else{
            stickyItem.classList.add('fixedHeader');
          }
        } else{
          stickyItem.classList.remove('fixedHeader');
        }

        //BELOW ARE UNUSED ATM but commenting out since it was there before this was modified at 12/4/2016

        // if (document.getElementById('partner') != null) {
        //     var partner = document.getElementById('partner');
        //     var partnerHeight = document.getElementById('partner').offsetHeight;
        //     let stickyHeader = partnerHeight ? partnerHeight : 0;
        //     let maxScroll = stickyHeader - scrollTop;
        //
        //     if (maxScroll <= 0) {
        //         maxScroll = 0;
        //     }
        //
        //     this._stickyHeader = (maxScroll) + "px";
        //     // if (scrollTop == 0 || scrollTop < this.scrollTopPrev || scrollTop < (header.offsetHeight + saladBar.offsetHeight + partnerHeight)) {
        //     if (scrollTop == 0 || scrollTop < this.scrollTopPrev || scrollTop < (header.offsetHeight + partnerHeight)) {
        //         this._stickyHeader = "unset";
        //         header.classList.add('fixedHeader');
        //         partner.classList.add('fixedHeader');
        //     } else {
        //         this._stickyHeader = (maxScroll) + "px";
        //         header.classList.remove('fixedHeader');
        //         partner.classList.remove('fixedHeader');
        //     }
        // } else {
        //     // if (scrollTop == 0 || scrollTop < this.scrollTopPrev || scrollTop < (header.offsetHeight + saladBar.offsetHeight)) {
        //     if (scrollTop == 0 || scrollTop < this.scrollTopPrev || scrollTop < header.offsetHeight) {
        //         this._stickyHeader = "unset";
        //         header.classList.add('fixedHeader');
        //     }
        //     else {
        //         this._stickyHeader = "0px";
        //         header.classList.remove('fixedHeader');
        //     }
        // }
        // this.scrollTopPrev = scrollTop;
    }//onScrollStick ends

    public getMenu(event): void {
        if (this.isOpened == true) {
            this.isOpened = false;
        } else {
            this.isOpened = true;
        }
    }

    ngOnInit() {

        if(this.partnerID){
          this.homeUrl = ["/"+this.partnerID, "news"];
        }else{
          this.homeUrl = ["/news-feed"];
        }
        this.getTrendingData();
        stButtons.locateElements();
        this._renderer.listenGlobal('document', 'mousedown', (event) => {

            var element = document.elementFromPoint(event.clientX, event.clientY);
            if (element != null) {
                var menuCheck = element.className.indexOf("menucheck");
                let searchCheck = element.className.indexOf("searchcheck");
                if (this.isOpened && menuCheck < 0) {
                    this.isOpened = false;
                }
                if (this.isSearchOpened && searchCheck < 0) {
                    this.isSearchOpened = false;
                }
            }
        });

        // //insert salad bar
        // var v = document.createElement('script');
        // v.src = 'http://w1.synapsys.us/widgets/deepdive/bar/bar.js?brandHex=234a66';
        // // document.getElementById('salad-bar-top').insertBefore(v, document.getElementById('salad-bar'));
        //
        // var setPlaceholder = setInterval(function(){ // keep checking for the existance of the salad bar until it loads in
        //   if (document.getElementById('ddb-search-desktop')) {
        //     //override the salad bar default placeholder text, and use the one for TDL
        //     document.getElementById('ddb-search-desktop')['placeholder'] = "Search for a sports team…";
        //     document.getElementById('ddb-small-desktop-search-input')['placeholder'] = "Search for a sports team…";
        //     document.getElementById('ddb-search-mobile')['placeholder'] = "Search for a sports team…";
        //     //override the default salad bars hamburger icon and use the scoreboard icon when on TDL
        //     var scoreboardIcon = document.getElementById('ddb-dropdown-boxscores-button').getElementsByClassName('ddb-icon')[0];
        //     scoreboardIcon.classList.add('fa','fa-box-scores');
        //     scoreboardIcon.classList.remove('ddb-icon-bars','ddb-icon');
        //
        //     //dont need to keep running this anymore now that its all set
        //     clearInterval(setPlaceholder);
        //   }
        // }, 1000);
    }

}
