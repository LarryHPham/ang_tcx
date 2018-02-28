import {
    Component, OnInit, Input, Output, EventEmitter, ElementRef, Renderer, AfterViewChecked,
    DoCheck
} from '@angular/core';
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {ModuleHeaderData} from "../../module-header/module-header.component";


declare var jQuery:any;

export interface MediaImageItem {
    id: number;
    image: string;
    copyData: string;
    title: string;
}

@Component({
    selector: 'images-media-carousel',
    templateUrl: './app/fe-core/components/carousels/images-media-carousel/images-media-carousel.component.html'
})

export class ImagesMedia implements OnInit {
    @Input() copyright: string;
    @Input() imageData: string;
    @Input() imageTitle: string;
    @Input() isProfilePage: boolean;
    @Input() profHeader: any;

    expand:boolean = false;
    isSmall:boolean = false;
    expandText:string = 'Expand';
    expandIcon:string = 'fa-expand';
    modalButton:boolean = false;

    mediaImages:Array<MediaImageItem>;
    // smallImage: MediaImageItem;

    smallObjCounter:number = 0;
    backgroundImage:String;
    totalImageCount:number = 0;
    imageCounter:number = 0;
    imagesTitle:string = "Image";
    image_url = './app/public/no_photo_images/onError.png';
    images:any;
    displayCounter:number;
    imageCredit:string;
    description:string;
    greyBar;
    imageElement;
    imageHeight;
    oldImageHeight;
    oldImageElement;
    //profHeader:any;
    arraySize:number = 5;
    modHeadData:ModuleHeaderData;


    constructor(
      private _sanitizer:DomSanitizer,
      private elementRef:ElementRef,
      private render:Renderer){}

    modalExpand(e) {
        if (this.expand == true) {
            this.expand = false;
            this.render.setElementClass(e.target.parentElement, 'carousel-modal-open', false);


        } else {
            this.expand = true;
            this.render.setElementClass(e.target.parentElement, 'carousel-modal-open', true);
        }
        return this.expand;
    }

    left(e) {

        //check to see if the end of the obj array of images has reached the end and will go on the the next obj with new set of array
        this.imageCounter = (((this.imageCounter - 1) % this.imageData.length) + this.imageData.length) % this.imageData.length;
        this.smallObjCounter = (((this.smallObjCounter - 1) % this.arraySize) + this.arraySize) % this.arraySize;
        if (this.smallObjCounter == 4) {
            this.mediaImages = this.modifyMedia(this.imageData, this.copyright, this.imageTitle, false);
        }
        //run the changeMain function to change the main image once a new array has been established
        this.changeMain(this.imageCounter);

    }

    right(e) {

        this.imageCounter = (this.imageCounter + 1) % this.imageData.length;
        this.smallObjCounter = (this.smallObjCounter + 1) % this.arraySize;
        if (this.smallObjCounter == 0) {
            this.mediaImages = this.modifyMedia(this.imageData, this.copyright, this.imageTitle);
        }
        //run the changeMain function to change the main image once a new array has been established
        this.changeMain(this.imageCounter);

    }


    //this is where the angular2 decides what is the main image
    changeMain(num) {
        this.displayCounter = this.imageCounter + 1;
        // this.smallImage = this.mediaImages;
        if (this.mediaImages && this.smallObjCounter < this.mediaImages.length) {
            this.backgroundImage = this.mediaImages[this.smallObjCounter].image;
            this.imageCredit = this.mediaImages[this.smallObjCounter].copyData;
            this.description = this.mediaImages[this.smallObjCounter].title;
        }

    }
    modifyMedia(images, copyright, imageTitle, forward = true):Array<MediaImageItem> {
        if (this.modalButton) {//just so the carousel knows that the expand button is
            this.expandText = 'Collapse';
            this.expandIcon = 'fa-compress';
        }
        var totalImgs = images.length;
        if (totalImgs < 5) {
            this.arraySize = totalImgs;
        }
        var newImageArray = [];
        var arrayStart = (((this.imageCounter + (forward ? 0 : -4)) % totalImgs) + totalImgs) % totalImgs;
        for (var i = arrayStart; i < arrayStart + this.arraySize; i++) {
            var index = i % totalImgs;
            if (typeof this.copyright != 'undefined' && typeof this.imageTitle != 'undefined') {
                newImageArray.push({
                    id: index,
                    image: images[index],
                    backgroundImage: images[index],
                    copyData: copyright[index],
                    title: imageTitle[index]
                });
            } else {
                newImageArray.push({id: index, image: images[index]});
            }
        }
        return newImageArray;
    }

    //makes sure to show first image and run the modifyMedia function once data has been established
    ngOnChanges(event) {
        if (typeof this.imageData != 'undefined') {
            //if data coming from module to variable mediaImages changes in what way then reset to first image and rerun function
            this.smallObjCounter = 0;
            this.imageCounter = 0;
            if (this.copyright == 'undefined') {
                this.copyright = '';
            }
            if (this.imageTitle == 'undefined') {
                this.imageTitle = '';
            }
            this.mediaImages = this.modifyMedia(this.imageData, this.copyright, this.imageTitle);
            this.changeMain(0);
            this.totalImageCount = this.imageData.length;
            if (this.isProfilePage) {
                if (!this.isSmall) {
                    this.modHeadData = {
                        moduleTitle: "Images &amp; Media - " + this.profHeader.profileName,
                        hasIcon: false,
                        iconClass: '',
                    };
                } else {
                    this.modHeadData = {
                        moduleTitle: "Images &amp; Media",
                        hasIcon: false,
                        iconClass: '',
                    };
                }
            }
        }



    }

    ngOnInit() {
        this.isSmall = window.innerWidth <= 639;
    }

    onResize(event) {
        if (this.isProfilePage) {
            this.isSmall = event.target.innerWidth <= 639;
            if (!this.isSmall) {
                this.modHeadData = {
                    moduleTitle: "Images &amp; Media - " + this.profHeader.profileName,
                    hasIcon: false,
                    iconClass: '',
                };
            } else {
                this.modHeadData = {
                    moduleTitle: "Images &amp; Media",
                    hasIcon: false,
                    iconClass: '',
                };
            }
        }
    }
}
