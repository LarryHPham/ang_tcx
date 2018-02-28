import {Component, Input, AfterViewChecked} from '@angular/core';
import {Http, Headers} from '@angular/http';
import { GlobalSettings } from "../../global/global-settings";

declare var jQuery:any;

@Component({
    selector: 'vertical-widget',
    templateUrl: './app/ui-modules/widget/widget.module.html'
})

export class WidgetModule  implements AfterViewChecked{
    sidekickHeight:number = 0;
    headerHeight:string;
    isProSport:boolean = true;
    srcLink: string;
    @Input() category: string;
    @Input() subCategory: string;
    //adding temporary variables in order to avoid making changes to the category and subcategory directly
    vwcategory:string;
    vwsubCategory:string;
    firstCheck = null;
    getData(){
        var topScope = GlobalSettings.getTCXscope(this.category).topScope ? GlobalSettings.getTCXscope(this.category).topScope : null;
        this.vwcategory = this.category=="real estate"? this.category.replace(/ /g,"-"):this.category;
        this.vwsubCategory = this.subCategory=="real estate"? this.subCategory.replace(/ /g,"-"):this.subCategory;

      if(topScope && this.vwcategory != "all"){
          this.vwcategory = this.vwcategory;
          this.vwsubCategory = this.vwsubCategory && this.vwsubCategory != this.vwcategory && this.vwsubCategory != "real-estate" ? this.vwsubCategory : "";
      } else {
        this.vwcategory = "trending";
        this.vwsubCategory = "";
      }
      this.srcLink = "/app/ads/vertical_widget.html?category=" + this.vwcategory + "&sub_category=" + this.vwsubCategory;
    }
    ngOnInit() {
      this.getData();

        // this.isProSport = this.scope == 'nfl' ? true: false;
        // var titleHeight = jQuery('.articles-page-title').height();
        // var padding = document.getElementById('pageHeader').offsetHeight;
        //
        // if( document.getElementById('partner') != null){
        //     var partnerHeight = document.getElementById('partner').offsetHeight;
        //     padding += partnerHeight;
        // }
        // if (!this.syndicated && !this.aiSidekick) {
        //     this.headerHeight = padding + 'px';
        // } else {
        //     if (titleHeight == 40) {
        //         this.headerHeight = padding + 95 + 'px';
        //     } else if (titleHeight == 80) {
        //         this.headerHeight = padding + 135 + 'px';
        //     }
        //     else if (titleHeight == 70) {
        //       this.headerHeight = padding + 128 + 'px';
        //   }
        //   else if (titleHeight == 35) {
        //     this.headerHeight = padding + 102 + 'px';
        // }
        // }
    }
    ngOnChanges(){
      this.getData();
      this.firstCheck = null;
    }
    ngAfterViewChecked():void{
        //Reload an IFRAME without adding to the history
        //Change the src attribute of an iframe element when the iframe is not in the DOM in order to avoid a history push to the browsers history stack,
        var state = document.readyState;
        //check if DOM is completely loaded
        if(state === "complete"){
            if(this.firstCheck == null){
                var parentArray = document.getElementsByClassName('widgetMain');
                var parentDiv= Array.prototype.filter.call( parentArray, function(singleDiv){
                    return singleDiv
                });
                for(var i=0; i <parentArray.length; i++){
                    var oldFrame = parentDiv[i].firstElementChild;
                    var parent = parentDiv[i];
                    if(oldFrame!=null){
                        parent.removeChild(oldFrame);
                    }
                    if(parent!= null){
                        var newFrame = document.createElement("iframe");
                        newFrame.id = 'frameWidgetChild';
                        newFrame.style.width = '300px';
                        newFrame.style.height ='600px';
                        newFrame.style.border = '0px';
                        newFrame.style.margin = '0px';
                        newFrame.style.zIndex = '0';
                        newFrame.frameBorder = '0';
                        newFrame.scrolling = 'no';
                        newFrame.setAttribute('allowtransparency', 'true');
                        newFrame.style.display= 'block';
                        newFrame.style.overflow= 'hidden';
                        newFrame.src = this.srcLink;
                        parent.appendChild(newFrame);
                        this.firstCheck=state;
                    }
                }

            }

        }
    }

    // Page is being scrolled
    onScroll(event) {
        // var partnerHeight = 0;
        // if( document.getElementById('partner') != null){
        //     partnerHeight = document.getElementById('partner').offsetHeight;
        // }
        // var titleHeight = 0;
        // var padding = document.getElementById('pageHeader').offsetHeight;
        // var y_buffer = 23;
        // var scrollTop = jQuery(window).scrollTop();
        // var maxScroll = partnerHeight - scrollTop;
        // if (!this.syndicated && !this.aiSidekick) {
        //     this.sidekickHeight = 0;
        // } else {
        //     titleHeight = jQuery('.articles-page-title').height();
        //     if (titleHeight == 40) {//
        //         this.sidekickHeight = 95;
        //     } else if (titleHeight == 80) {
        //         this.sidekickHeight = 135;
        //     }
        //     else if (titleHeight == 70) {
        //         this.sidekickHeight = 128;
        //     }
        //     else if (titleHeight == 35) {
        //         this.sidekickHeight = 102;
        //     }
        //     if (maxScroll <= 0) {
        //         this.sidekickHeight += maxScroll;
        //         if (this.sidekickHeight < 0) {
        //             this.sidekickHeight = 0
        //         }
        //     }
        //     y_buffer += this.sidekickHeight;
        // }
        // if(maxScroll <= 0){
        //     maxScroll = 0;
        // }
        // //this.headerHeight = padding + maxScroll + this.sidekickHeight + 'px';
        // if ((document.getElementById('partner') != null && maxScroll == 0) || (document.getElementById('partner') == null && scrollTop >= padding)) {
        //   jQuery("#widget").addClass("widget-top");
        // }
        // else {
        //   jQuery("#widget").removeClass("widget-top");
        // }
        // var $widget = jQuery("#widget");
        // var $pageWrapper = jQuery(".widget-page-wrapper");
        // if ($widget.length > 0 && $pageWrapper.length > 0) {
        //     var widgetHeight = $widget.height();
        //     var pageWrapperTop = $pageWrapper.offset().top;
        //     var pageWrapperBottom = pageWrapperTop + $pageWrapper.height() - padding;
        //     if ((scrollTop + widgetHeight + y_buffer) > (pageWrapperBottom  + this.sidekickHeight)) {
        //         this.headerHeight = this.sidekickHeight + 'px';
        //         $widget.addClass("widget-bottom");
        //         var diff = $pageWrapper.height() - (widgetHeight + y_buffer);
        //         $widget.get(0).style.top = diff + "px";
        //     }
        //     else if (scrollTop < (pageWrapperTop + this.sidekickHeight)) {
        //         $widget.removeClass("widget-bottom");
        //         $widget.get(0).style.top = "";
        //     }
        //     else {
        //         $widget.removeClass("widget-bottom");
        //         $widget.get(0).style.top = "";
        //     }
        // }
    }
}
