import {Component, Input, Output, OnChanges, EventEmitter} from '@angular/core';
import {CircleImage} from '../../components/images/circle-image/circle-image';
import {ImageData, CircleImageData} from '../../components/images/image-data';
import {GlobalSettings} from '../../../global/global-settings';

export interface TitleInputData {
    imageURL  : string;
    imageRoute?: Array<any>;
    text1     : string;
    text2     : string;
    text3     : string;
    text4?     : string;
    icon      : string;
}

@Component({
    selector: 'title-component',
    templateUrl: './app/fe-core/components/title/title.component.html',
})
export class TitleComponent implements OnChanges {
    @Input() titleData: TitleInputData;

    public titleImage: CircleImageData;
    @Input() runMeta:boolean;

    constructor(){}

    ngOnInit(){}


    ngOnChanges() {
        if(!this.titleData){
            this.titleData =
            {
                imageURL : GlobalSettings.getSiteLogoUrl(),
                imageRoute: null,
                text1: "lorem ipsum delor",
                text2: "ipsum delor lorem",
                text3: "lorem ipsum delor",
                text4: "lorem ipsum delor",
                icon: 'fa fa-map-marker'
            };
        }

        var hoverText = this.titleData.imageRoute ? "<p>View</p><p>Profile</p>" : "";
        this.titleImage = {
            imageClass: "page-title-titleImage",
            mainImage: {
                imageUrl: ( this.titleData.imageURL ? this.titleData.imageURL : GlobalSettings.getSiteLogoUrl() ),
                urlRouteArray: this.titleData.imageRoute,
                hoverText: hoverText,
                imageClass: "border-2"
            }
        };

        // if ( this.imageData ) {
        //     this.titleImage.mainImage = this.imageData;
        // }
    }


}
