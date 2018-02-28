import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { ModuleHeaderData } from '../../components/module-header/module-header.component';

//globals
import { GlobalSettings } from "../../../global/global-settings";

//interfaces
import { SportPageParameters } from '../../../global/global-interface';


declare var DISQUS: any;

@Component({
    selector: 'comment-module',
    templateUrl: './app/fe-core/modules/comment/comment.module.html'
})
export class CommentModule implements OnInit, OnChanges {
    @Input() profileName: string;

    public headerInfo: ModuleHeaderData = {
      moduleTitle: "Comments - [Profile Name]",
      hasIcon: false,
      iconClass: ""
    };

    ngOnChanges() {
        let profileName = this.profileName ? this.profileName : "[Profile Name]";
        this.headerInfo.moduleTitle = "Comments - " + profileName;
    }

    ngOnInit(){
        var script:any = document.createElement("script");

        // DisQus Plugin
        script.innerHTML = (function(d, s, id) {
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)){
                    DISQUS.reset({
                        reload: true,
                        config: function () {
                            this.page.identifier = (window.location.pathname + " ").replace("/"," ");
                            this.page.url = window.location.href + "#!newthread";
                        }
                    });
                }else{
                    js = d.createElement(s); js.id = id;
                    js.src = "//"+GlobalSettings.getHomePageLinkName()+".disqus.com/embed.js";
                    fjs.parentNode.insertBefore(js, fjs);
                }
              }(document, 'script', 'disqusJS'));
              if(typeof script.innerHTML != 'undefined'){
                document.body.appendChild(script);
              }
    }
}
