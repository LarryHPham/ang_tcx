import { Component, OnInit, OnChanges, Input, AfterContentChecked } from '@angular/core';

//interfaces
import { ModuleHeaderData } from '../../components/module-header/module-header.component';

// declare var twttr: any;

export interface twitterModuleData {
  twitterHandle: string;
  id: number;
  entityId: number;
  entityFirstName: string;
  entitySecondName: string;
}

@Component({
    selector: 'twitter-module',
    templateUrl: './app/fe-core/modules/twitter/twitter.module.html'
})

export class TwitterModule implements OnInit, OnChanges, AfterContentChecked {
  @Input() profileName: string;
  @Input() twitterData: twitterModuleData;

  twitterLoaded: boolean = false;
  twitterUrl: string;

  public headerInfo: ModuleHeaderData = {
    moduleTitle: "Twitter Feed - [Profile Name]",
    moduleIdentifier: "[Profile Identifier]",
    hasIcon: false,
    iconClass: ""
  };

  ngAfterContentChecked() {
    if ( window['twttr'] && !this.twitterLoaded ) {
      if ( document.getElementById("twitter-href") && document.getElementById("twitter-wjs") ) {
        // var a = document.getElementById("twitter-href");
        // window['twttr'].widgets.load(
        //   document.getElementById("twitter-href")
        // );
        this.twitterLoaded = true;
      }
    }
  }

  ngOnChanges() {
    this.twitterUrl = "https://www.twitter.com/"+this.twitterData.twitterHandle;

    let profileName = this.profileName ? this.profileName : "[Profile Name]";
    this.headerInfo.moduleTitle = "Twitter Feed";
    this.headerInfo.moduleIdentifier = " - " + profileName;
  }

  ngOnInit() {
    var script:any = document.createElement("script");
    script.innerHTML = !function(d,s,id){
      var js, p=/^http:/.test(d.URL)?'http':'https';
      if(!d.getElementById("twitter-wjs")){
        var fjs = d.getElementsByTagName(s)[0];
        js=d.createElement(s);js.id=id;js.src=p+"://platform.twitter.com/widgets.js";
        fjs.parentNode.insertBefore(js,fjs);
      }
      else {
        var fjs = d.getElementsByTagName(s)[0];
        js=d.createElement(s);js.id=id;js.src=p+"://platform.twitter.com/widgets.js";
        fjs.parentNode.insertBefore(js,fjs);
      }
    }(document,"script","twitter-wjs");
    if(!script.innerHTML){
      document.body.appendChild(script);
    }
  }

  ngOnDestroy() {
    document.getElementById("twitter-wjs").remove();
    // delete window['twttr'];

  }
}
