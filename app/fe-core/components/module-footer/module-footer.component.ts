import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';

export interface ModuleFooterData {
  infoDesc: string, // text description that describes what is the footer going to display
  text: string, // the text that is in the mod-footer button that describes where the Route link is navigating to
  url: any,//USED FOR ROUTER LINK
  hrefUrl?: boolean
}

export interface FooterStyle {
  ctaBoxClass?: string, // to be sent into the style in the html to determine what is the style of the module footer box
  ctaBtnClass?: string, // to be sent into the style in the html to determine what is the style of the module footer button
  hasIcon?:boolean, //Input for the button to determine if there is an icon on the left side or not
}

@Component({
    selector: 'module-footer',
    templateUrl: './app/fe-core/components/module-footer/module-footer.component.html'
})

export class ModuleFooter implements OnInit{
  @Input() footerData: ModuleFooterData;
  @Input() footerStyle: FooterStyle;
  public windowWidth: number;

    ngOnInit(){
      if(typeof this.footerStyle == 'undefined'){
        this.footerStyle = {
          ctaBoxClass: '',
          ctaBtnClass: '',
          hasIcon: false,
        };
      }

      if(typeof this.footerData == 'undefined'){
        this.footerData = {
          infoDesc:'Want to see the full list',
          text:'VIEW THE LIST',
          url:['Disclaimer-page'],
        }
      }

      var windowWidth = window.innerWidth;
      this.windowWidth = windowWidth;
    }

    private onWindowLoadOrResize(event) {
      var windowWidth = event.target.innerWidth;
      this.windowWidth = windowWidth;
    }
}
