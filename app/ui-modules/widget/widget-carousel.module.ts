import {Component, Input} from '@angular/core';
import {Http, Headers} from '@angular/http';
declare var jQuery:any;

@Component({
    selector: 'widget-carousel-module',
    templateUrl: './app/ui-modules/widget/widget.module.html',

})

export class WidgetCarouselModule {
    @Input() aiSidekick:boolean;
    sidekickHeight:number = 0;
    headerHeight:string;

    ngOnInit() {
        var titleHeight = jQuery('.articles-page-title').height();// get main title height on article pages

        var padding = 420;// height of larousel on news feed page
        if( document.getElementById('pageHeader') != null){// page header is tcx header and salad bar combined
            var padding = document.getElementById('pageHeader').offsetHeight + 420;
        }

        if( document.getElementById('partner') != null){// check if on partner page then need to get parter header height and add it to the padding top
            var partnerHeight = document.getElementById('partner').offsetHeight;
            padding += partnerHeight;
        }

        if (!this.aiSidekick) {
            this.headerHeight = padding + 'px';
        } else {
            if (titleHeight == 40) {
                this.headerHeight = padding + 95 + 'px';
            } else if (titleHeight == 80) {
                this.headerHeight = padding + 135 + 'px';
            }
        }
    }

    // Page is being scrolled
    onScroll(event) {
        var scrollTop = jQuery(window).scrollTop();
        var partnerHeight = document.getElementById('partner') != null ? document.getElementById('partner').offsetHeight:0;
        if( document.getElementById('partner') != null && scrollTop <=  (jQuery('.deep-dive-container1').height() + partnerHeight)){
            partnerHeight = partnerHeight + scrollTop;
        }
        var blueBar = 0;
        if (document.getElementById('deep-dive-blueBar') != null){
          blueBar = document.getElementById('deep-dive-blueBar').offsetHeight;
        }
        var titleHeight = 0;
        var padding = 0;
        if( document.getElementById('pageHeader') != null){
        var padding = document.getElementById('pageHeader').offsetHeight;
        }
        var y_buffer = 50;
        var maxScroll = partnerHeight - scrollTop;
        var carouselTop = (jQuery('.deep-dive-container1').height() + 30) - scrollTop ; // +30 for margin
        if (!this.aiSidekick) {
            this.sidekickHeight = 0;
        } else {
            titleHeight = jQuery('.articles-page-title').height();
            if (titleHeight == 40) {//
                this.sidekickHeight = 95;
            } else if (titleHeight == 80) {
                this.sidekickHeight = 135;
            }
            if (maxScroll <= 0) {
                this.sidekickHeight += maxScroll;
                if (this.sidekickHeight < 0) {
                    this.sidekickHeight = 0
                }
            }
            y_buffer += this.sidekickHeight;
        }
        if(maxScroll <= 0){
            maxScroll = 0;
        }
        if(carouselTop <=0){
          carouselTop = 0;
        }

        //this.headerHeight = carouselTop + padding + maxScroll + this.sidekickHeight + 'px';
        //set class on blue bar and widget once user has scrolled past the carousel and top partner header
        if ((document.getElementById('partner') != null && carouselTop <= 0) || (document.getElementById('partner') == null && carouselTop <= blueBar)) {
          jQuery("#widget").addClass("widget-top-ddp");
          jQuery("#deep-dive-blueBar").addClass("deep-dive-blueBar-top");
        }
        else {
          jQuery("#widget").removeClass("widget-top-ddp");
          jQuery("#deep-dive-blueBar").removeClass("deep-dive-blueBar-top");
        }
        var $widget = jQuery("#widget");
        var $pageWrapper = jQuery(".deep-dive-container2a");
        if ($widget.length > 0 && $pageWrapper.length > 0) {
            var widgetHeight = $widget.height();
            var pageWrapperTop = $pageWrapper.offset().top;
            var pageWrapperBottom = pageWrapperTop + $pageWrapper.height() - padding;
            //logic for when user scrolls to bottom of page
            if ((scrollTop + widgetHeight + y_buffer) > (pageWrapperBottom  + this.sidekickHeight)) {
                this.headerHeight = this.sidekickHeight + 'px';
                $widget.addClass("widget-bottom");
                var diff = $pageWrapper.height() - (widgetHeight + y_buffer);
                $widget.get(0).style.top = diff + "px";
            }
            else if (scrollTop < (pageWrapperTop + this.sidekickHeight)) {
                $widget.removeClass("widget-bottom");
                $widget.get(0).style.top = "";
            }
            else {
                $widget.removeClass("widget-bottom");
                $widget.get(0).style.top = "";
            }
        }
    }
}
