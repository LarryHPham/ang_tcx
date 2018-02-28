import {Directive, ElementRef, Renderer, HostListener} from "@angular/core";
@Directive({
    selector:'[verticalWidgetScroll]'
})
export class verticalWidgetScrollDirective{
    scrollWidget;
    scrollTopPrev:number = 0;
    constructor(private _elref:ElementRef, private _render:Renderer){

    }
    @HostListener('window:scroll',['$event']) onScroll(e){
        this.scrollWidget=e.target.getElementById('verticalSideScroller');
        var partnerHeader= e.target.getElementById('topPartnerHeader');
        var partnerHeaderHeight=partnerHeader? partnerHeader.offsetHeight : 0;
        var header = e.target.body.getElementsByClassName('header')[0];
        var sharebtns = e.target.getElementById('shareLinksBtn');
        var articleTitle = e.target.getElementById('articleMainTitle');
        var carouselHeight = e.target.getElementById('rectangleCarousel');
        var videoElement = e.target.getElementById('rectangleBoxvideo');

        var fixedHeader = e.target.body.getElementsByClassName('fixedHeader')[0] != null ? e.target.body.getElementsByClassName('fixedHeader')[0].offsetHeight : 0;
        var footer = e.target.body.getElementsByClassName('footer')[0];
        let topCSS = 0;
        topCSS = header != null ? topCSS + header.offsetHeight : topCSS;
        topCSS = sharebtns !=null ? topCSS + sharebtns.offsetHeight + 25 : topCSS;
        topCSS = articleTitle != null ? topCSS + articleTitle.offsetHeight : topCSS;
        topCSS = carouselHeight != null? topCSS +carouselHeight.offsetHeight :topCSS;
        topCSS = videoElement != null ? topCSS + videoElement.offsetHeight : topCSS;
        topCSS = topCSS - fixedHeader;
        let bottomCSS=0;
        bottomCSS = footer!=null? bottomCSS + footer.offsetHeight: bottomCSS;

        var scrollTop =e.target.documentElement.scrollTop?e.target.documentElement.scrollTop:e.target.body.scrollTop;
        let scrollUp = scrollTop - this.scrollTopPrev>0?true:false;
        let scrolHeight=e.target.documentElement.scrollHeight?e.target.documentElement.scrollHeight:e.target.body.scrollHeight;
        var scrollBottom = scrolHeight-scrollTop==e.target.body.clientHeight?true:false;

        this.scrollTopPrev=scrollTop;
        var checkWindowHeight = 610 - window.innerHeight + footer.offsetHeight - partnerHeaderHeight;
        if(this.scrollWidget){
            var scrollYaxis= window.pageYOffset? window.pageYOffset: window.scrollY;
            if(scrollYaxis>topCSS){
               if(scrollUp) {
                    var topstyle = scrollYaxis - topCSS + 'px';
                    this._render.setElementStyle(this.scrollWidget, 'top', topstyle);
                }else{
                   if(window.innerHeight - footer.offsetHeight- partnerHeaderHeight < 615){
                       var newTopCSS =scrollYaxis - topCSS - checkWindowHeight + 35 + 'px';
                       this._render.setElementStyle(this.scrollWidget,'top', newTopCSS);
                   }else{
                       var topstyle = scrollYaxis - topCSS + partnerHeaderHeight + 35 +'px';
                       this._render.setElementStyle(this.scrollWidget, 'top', topstyle);
                   }


                }

                if(scrollBottom && window.innerHeight - footer.offsetHeight - partnerHeaderHeight < 610){
                    var newTopCSS =scrollYaxis - topCSS - bottomCSS - checkWindowHeight + 'px';
                    this._render.setElementStyle(this.scrollWidget,'top', newTopCSS);
                }


            }else{
                this._render.setElementStyle(this.scrollWidget, 'top', '0px');

            }
        }

    }
}
