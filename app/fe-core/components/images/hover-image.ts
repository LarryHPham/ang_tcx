import {Component, Input} from '@angular/core';
// import {DomSanitizationService} from '@angular/platform-browser';

@Component({
    selector: 'hover-image',
    templateUrl: './app/fe-core/components/images/hover-image.html',
})

export class HoverImage {
    @Input() imageData: any;
    @Input() textOnly: boolean;
    errorIMG: string = "/app/public/profile_placeholder.png";
    onError(event: any){
      event.src = this.errorIMG;
    }

    // ngOnChanges() {
    //   if ( this.imageData && this.imageData.imageUrl ) {
    //       this.imageUrl = this._sanitizer.bypassSecurityTrustUrl(this.imageData.imageUrl);
    //   }
    // }
}
