import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { routing } from '../app.routing';
//Root Component
import { AppDomain }  from '../app-domain/app.domain';

//NgModules
import {GlobalModule} from "./global.ngmodule";
import { DeepDiveNgModule } from "./deep-dive.ngmodule";
import { SyndicatedArticleNgModule } from "./article.ngmodule";
import {HttpModule, Headers, Http} from "@angular/http";
import {SearchPageNgModule} from "./search-page.ngmodule";

//Services
import {SearchService} from "../services/search.service";
import { SeoService } from "../global/seo.service";
import {VerticalGlobalFunctions} from "../global/vertical-global-functions";
import {GlobalSettings} from "../global/global-settings";
import {GlobalFunctions} from "../global/global-functions";
import {SanitizeScript} from "../fe-core/pipes/safe.pipe";
import {ScrollerFunctions} from "../global/scroller-functions";
import { GeoLocation } from "../global/global-service";

@NgModule({
  imports: [
    BrowserModule,
    routing,
    GlobalModule,
    DeepDiveNgModule,
    SyndicatedArticleNgModule,
    SearchPageNgModule
  ],
  declarations: [
    AppDomain
  ],
  providers: [
      HttpModule,
      SearchService,
      SeoService,
      VerticalGlobalFunctions,
      GlobalSettings,
      GlobalFunctions,
      GeoLocation,
      SanitizeScript,
      ScrollerFunctions
    ],
  bootstrap: [ AppDomain ]
})
export class AppModule { }
