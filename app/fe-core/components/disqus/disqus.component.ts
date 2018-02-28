import {Component, OnInit, Inject} from '@angular/core';
import {GlobalSettings} from "../../../global/global-settings";



declare var DISQUS: any;

@Component({
    selector: 'disqus-component',
    templateUrl: './app/fe-core/components/disqus/disqus.component.html',
    inputs: ["comment"]
})

export class DisqusComponent implements OnInit{
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
                js.src = "//"+ GlobalSettings.getHomePageLinkName()+".disqus.com/embed.js";
                fjs.parentNode.insertBefore(js, fjs);
            }
        }(document, 'script', 'disqusJS'));

        document.body.appendChild(script);
    }
}
