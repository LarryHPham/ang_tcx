import {Component,OnInit,EventEmitter,Input} from '@angular/core';
// import {DeepDiveService} from '../../../services/deep-dive.service';
import {GlobalFunctions} from '../../../global/global-functions';

declare var jQuery:any;
declare var moment;

@Component({
  selector: 'carousel-dive-module',
  templateUrl: './app/fe-core/modules/carousel-dive/carousel-dive.module.html'
})

export class CarouselDiveModule{
  @Input() carouselData: any;
  @Input() state:any;
  @Input() videoData: any;

  constructor(){
    window.addEventListener("resize", this.onResize);
  }

  ngOnInit() {

    setTimeout(function(){
      jQuery(".owl-carousel").owlCarousel({
        items:1,
        loop:true,
        dots:false,
        nav:false,
        navText:false,
        mouseDrag: false
      });

    }, 1000);
  }

  onResize() {
    // var iframe =  (<HTMLScriptElement[]><any>document.getElementsByClassName('carousel-video-iframe'))[0];
    // var iframeHeight = iframe.offsetHeight;
    // console.log(iframe, iframeHeight);
  }

  leftcarousel() {
    var owl = jQuery('.carousel_owl');
    owl.owlCarousel();
    owl.trigger('prev.owl.carousel');
  }
  rightcarousel() {
    var owl = jQuery('.carousel_owl');
    owl.owlCarousel();
    owl.trigger('next.owl.carousel');
  }
​
}
