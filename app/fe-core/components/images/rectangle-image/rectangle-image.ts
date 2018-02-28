import {Component, Input, OnInit} from '@angular/core';
import {RectangleImageData} from '../image-data';

@Component({
    selector: 'rectangle-image',
    templateUrl: './app/fe-core/components/images/rectangle-image/rectangle-image.html',
})
export class RectangleImage implements OnInit{
    @Input() data: RectangleImageData;
    @Input() imgResize: number;
    ngOnInit() {
      var testImage = "/app/public/Tile_Overlay.png";
      if(this.imgResize && this.data != null){
        this.data.imageUrl += "&width=" + this.imgResize;
      }
      if(typeof this.data === undefined || this.data == null){
        this.data = {
          imageUrl: testImage,
          imageClass: "embed-responsive-16by9",
          urlRouteArray: ["/syndicated-article"],
          imageDesc: "Something about this image"
        }
      }
    }
}
