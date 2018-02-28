import { OnInit, Output, Input, EventEmitter, Component } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';

import {CircleImage} from '../../images/circle-image/circle-image';
import {ImageData, CircleImageData} from '../../images/image-data';
import {Carousel} from '../carousel.component';
import {ModuleFooter, ModuleFooterData} from '../../module-footer/module-footer.component'
import {ComplexInnerHtml} from '../../complex-inner-html/complex-inner-html.component'
import {Link, ParagraphItem} from '../../../../global/global-interface';
import {VerticalGlobalFunctions} from '../../../../global/vertical-global-functions';
import {GlobalFunctions} from '../../../../global/global-functions';


/*
  index?: //(optional) parameter in case it is needed to know the position of the object in its current array
  backgroundImage?: string; // incase the carousel requires a background image for the whole carousel container will have default in place if none provided
  imageData: CircleImageData; // attached interface for the required fields needed for a functional Image for the slider. from image-data.ts please go there for documentation
  description?: Array<string>; // if there is description then will use angular2 [innerHTML] to render content.  the array can contain anything HTML related and in the slider-carousel.component.html it will loop through and display each item in the array.
  footerInfo?: ModuleFooterData; // (optional) if the carousel has a footer that requires information to link to its desired profile the contents please go to module-footer.component.ts for more info
*/
export interface SliderCarouselInput {
  index?:any;
  backgroundImage?: string;
  copyrightInfo?: string;
  imageConfig: CircleImageData;
  noData?: boolean;

  /**
   * Could be strings or an array of Links
   */
  description?: Array<any>; // an array of 'rows' that can be
  footerInfo?: ModuleFooterData;
}

export interface Type1CarouselItem {
  /**
   * Text only, circle icon is not needed to be included
   */
  subheader: Array<Link | string>;

  profileNameLink: Link;

  description: Array<Link | string>;

  copyrightInfo?: string;

  lastUpdatedDate: string;

  backgroundImage?: string;

  circleImageUrl: string;

  circleImageRoute: Array<any>;

  subImageUrl?: string;

  subImageRoute?: Array<any>;

  rank?: string;

  rankClass?: string;

  noData?: boolean;

}

export interface Type2CarouselItem {
  /**
   * This flag only determines the size of text to use
   * for the profile name, as spec has a larger size on
   * the page versions of the module
   */
  isPageCarousel: boolean;

  profileNameLink: Link;

  description: Array<Link | string>;

  dataValue: string;

  dataLabel: string;

  backgroundImage?: string;

  copyrightInfo?: string;

  circleImageUrl: string;

  circleImageRoute: Array<any>;

  subImageUrl?: string;

  subImageRoute?: Array<any>;

  lastUpdatedDate?: string;

  rank?: string;
}

@Component({
  selector: 'slider-carousel',
  templateUrl: './app/fe-core/components/carousels/slider-carousel/slider-carousel.component.html'
})

export class SliderCarousel implements OnInit {
  @Input() carouselData: Array<SliderCarouselInput>;
  @Input() backgroundImage: SafeUrl;
  @Input() indexInput: any;//this is an optional Input to determine where the current index is currently positioned. otherwise set the defaul indexInput to 0;
  @Input() footerStyle: any;

  /**
   * interface for the output to return an index
   */
  public indexNum = new EventEmitter(true); //async = true
  public dataPoint: SliderCarouselInput;

  constructor(private _sanitizer: DomSanitizer) {}

  response(event){
    //set the data event being emitted back from the carousel component
    this.dataPoint = event;
    if ( this.dataPoint.backgroundImage ) {
      this.backgroundImage = this._sanitizer.bypassSecurityTrustUrl(this.dataPoint.backgroundImage);
    }
    else {
      //var randomIndex = Math.random() > .5 ? 1 : 2;
      this.backgroundImage = this._sanitizer.bypassSecurityTrustUrl('/app/public/Image-Placeholder-2.jpg');
    }
    //sets the index of the dataPoint of its current position in the array
    // the '?' meaning if there is data to even receive
    if(typeof this.dataPoint['index'] != 'undefined'){
      this.indexNum.next(this.dataPoint.index);
    }
  }

  ngOnChanges(){
    // Don't set indexInput to 0 here, it resets anything the parent specifies
     //this.indexInput = 1;
  }

  ngOnInit() {
    //incase there is no backgroundImage being return set the default background
    if(typeof this.backgroundImage == 'undefined' || this.backgroundImage == null || !this.backgroundImage){
      this.backgroundImage = VerticalGlobalFunctions.getBackroundImageUrlWithStockFallback(this.backgroundImage);
    }


    //In case of errors display below
    if (typeof this.dataPoint == 'undefined') {
      var sampleImage = "./app/public/no-image.svg";
      this.dataPoint =
      {//placeholder data
        index:'1',
        imageConfig: {
          imageClass: "image-150",
          mainImage: {
            imageUrl: sampleImage,
            imageClass: "border-large"
          },
          subImages: [
            {
              imageUrl: sampleImage,
              imageClass: "image-50-sub image-round-lower-right"
            }
          ],
        },
        description: [
          "<p></p>",
          "<p></p>",
          "<p></p>",
          "<p></p>",
        ],
      };
    }
  }

/**
 * The type 1 carousel style is used most carousels. The circle image
 * can optionlly contain a sub-image (image-50-sub class) and
 * a rank (defaults to image-38-rank class if item.rankClass is null).
 * The four lines in the description are formatted as such:
 *
 *            • [subheader] (small, uppercase font)
 *            [profileNameLink] (large font)
 *            [description] (medium font)
 *            Last Updated On [lastUpdatedDate] (small font)
 */
  static convertToCarouselItemType1(index: number, item: Type1CarouselItem): SliderCarouselInput {
    var subImages = [];
    if ( item.subImageRoute ) {
      subImages.push({
          imageUrl: item.subImageUrl,
          urlRouteArray: item.subImageRoute,
          hoverText: "<i class='fa fa-mail-forward'></i>",
          imageClass: "image-50-sub image-round-lower-right"
      });
    }
    if ( item.rank != null ) {
      var rankClass = item.rankClass ? item.rankClass : "image-38-rank";
      subImages.push({
          text: "#" + item.rank,
          imageClass: rankClass + " image-round-upper-left image-round-sub-text"
      });
    }
    var subheaderText = ['<i class="fa fa-circle"></i>'];
    Array.prototype.push.apply(subheaderText, item.subheader);
    return {
        index: index,
        backgroundImage: item.backgroundImage, //optional
        copyrightInfo: item.copyrightInfo,
        description: [
          {//Carousel title line
            class: 'scc-details-type1-subhdr',
            textData: subheaderText
          },
          {//Item title line
            class: 'scc-details-type1-hdr',
            textData: item.profileNameLink ? [item.profileNameLink] : []
          },
          {//Description line
            class: 'scc-details-type1-desc',
            textData: item.description ? item.description : []
          },
          {//Last Updated line
            class: 'scc-details-type1-date',
            textData: item.lastUpdatedDate ? ["Last Updated: TODO "] : []
          }
        ],
      imageConfig: {
        imageClass: "image-150",
        mainImage: {
          imageClass: "border-10",
          urlRouteArray: item.circleImageRoute,
          imageUrl: item.circleImageUrl,
          hoverText: "<p>View</p><p>Profile</p>"
        },
        subImages: subImages
      },
      noData: item.noData
    };
  }

/**
 * The type 2 carousel style is used for list pages. The circle image
 * can optionally contain a sub-image (image-50-sub class) and
 * a rank (image-48-rank class).
 * The four lines in the description are formatted as such:
 *
 *            [ProfileNameLink] (larger font)
 *            [description] (smaller font)
 *
 *            [dataValue] (larger font)
 *            [dataLabel] (smaller font)
 */
  static convertToCarouselItemType2(index: number, item: Type2CarouselItem): SliderCarouselInput {
    var subImages = [];
    if ( item.subImageRoute ) {
      subImages.push({
          imageUrl: item.subImageUrl,
          urlRouteArray: item.subImageRoute,
          hoverText: "<i class='fa fa-mail-forward'></i>",
          imageClass: "image-50-sub image-round-lower-right"
      });
    }
    if ( item.rank != null ) {
      subImages.push({
          text: "#" + item.rank,
          imageClass: "image-48-rank image-round-upper-left image-round-sub-text"
      });
    }
    return {
        index: index,
        backgroundImage: item.backgroundImage, //optional
        copyrightInfo: item.copyrightInfo,
        description: [
          {//[Profile Name 1]
            class: item.isPageCarousel ? 'scc-details-type2-page-hdr' : 'scc-details-type2-hdr',
            textData: item.profileNameLink ? [item.profileNameLink] : []
          },
          {//data value list
            class: 'scc-details-type2-desc',
            textData: item.description
          },
          {//[Data Value 1]
            class: 'scc-details-type2-value',
            textData: item.dataValue ? [item.dataValue] : []
          },
          {//[Data Point 1]
            class: 'scc-details-type2-lbl',
            textData: item.dataLabel ? [item.dataLabel] : []
          },
          {//Last Updated line
            class: 'scc-details-type2-date',
            textData: item.lastUpdatedDate ? ["Last Updated: TODO"] : []
          }
        ],
      imageConfig: {
        imageClass: "image-150",
        mainImage: {
          imageClass: "border-10",
          urlRouteArray: item.circleImageRoute,
          imageUrl: item.circleImageUrl,
          hoverText: "<p>View</p><p>Profile</p>"
        },
        subImages: subImages
      }
    };
  }

  static convertToEmptyCarousel(errorMessage: string): SliderCarouselInput {
    return {
        index: 2,
        description: [
          {//error message
            class: 'scc-details-type2-error',
            textData: errorMessage ? [errorMessage] : []
          }
        ],
      imageConfig: {
        imageClass: "image-150",
        mainImage: {
          imageClass: "border-10",
          urlRouteArray: null,
          imageUrl: "/app/public/no-image.svg",
          hoverText: ""
        },
        subImages: []
      },
    };
  }
}
