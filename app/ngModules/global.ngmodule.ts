//spits out router-outlet for our deepdive websites
import { AppComponent }  from '../app-component/app.component';

import {CommonModule} from "@angular/common";
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';

/*** COMPONENTS ***/
import { SectionFrontTopNav } from '../ui-modules/section-front-top-nav/section-front-top-nav.component';
import { ComplexInnerHtml } from '../fe-core/components/complex-inner-html/complex-inner-html.component';
import { HeaderComponent } from "../ui-modules/header/header.component";
import { SectionNameComponent } from "../fe-core/components/section-name/section-name.component";
import { Search } from "../ui-modules/search/search.component";
import { HamburgerMenuComponent, MenuData } from '../ui-modules/hamburger-menu/hamburger-menu.component';
import { RectangleImage } from "../fe-core/components/images/rectangle-image/rectangle-image";
import { CircleImage } from "../fe-core/components/images/circle-image/circle-image";
import { HoverImage } from "../fe-core/components/images/hover-image";
import { ImagesMedia } from "../fe-core/components/carousels/images-media-carousel/images-media-carousel.component";
import { CircleButton } from "../fe-core/components/buttons/circle/circle.button";
import { ArticleScheduleComponent } from "../fe-core/components/articles/article-schedule/article-schedule.component";
import { ModuleHeader } from "../fe-core/components/module-header/module-header.component";
import { ArticleBlockComponent } from "../fe-core/components/article-block/article-block.component";
import { DropdownComponent } from "../fe-core/components/dropdown/dropdown.component";
import { LoadingComponent } from "../fe-core/components/loading/loading.component";
import { LoadMoreButtonComponent } from "../fe-core/components/load-more-button/load-more-button.component";
import { ScrollableContent } from "../fe-core/components/scrollable-content/scrollable-content.component";
import { SidekickWrapperAI } from "../fe-core/components/sidekick-wrapper-ai/sidekick-wrapper-ai.component";
import { Larousel } from '../fe-core/components/larousel/larousel';
import { NewsBox } from '../fe-core/components/news-box/news-box';
import { LineChartComponent } from '../fe-core/components/line-chart/line-chart.component';
import { InfoComponent } from '../fe-core/components/page-information/page-information.component';
import {ShareLinksComponent} from "../fe-core/components/articles/share-links/share-links.component";
import {BillboardComponent} from "../fe-core/components/articles/billboard/billboard.component";
import {SidekickContainerComponent} from "../fe-core/components/articles/sidekick-container/sidekick-container.component";
import { ScoreBoard } from "../fe-core/components/score-board/score-board.component";
import { CitationComponent } from "../fe-core/components/citation/citation.component";

/*** MODULES ***/
import { SearchBoxModule } from "../fe-core/modules/search-box-module/search-box-module.module";
import { DeepDiveRecommendation } from "../fe-core/modules/deep-dive-recommendation/deep-dive-recommendation.module";

/*** UI MODULES AND WIDGETS ***/
import { BillboardModule } from "../ui-modules/billboard/billboard.module";
import { FooterComponent } from "../ui-modules/footer/footer.component";
import { ResponsiveWidget } from "../ui-modules/responsive-widget/responsive-widget.component";
import { WidgetCarouselModule } from "../ui-modules/widget/widget-carousel.module";
import { WidgetModule } from "../ui-modules/widget/widget.module";
import { ChatterboxModule } from "../ui-modules/chatterbox/chatterbox.module";

/*** WEBPAGES ***/
import { AboutUsPage } from "../webpages/aboutus/aboutus";
import { PrivacyPolicy } from "../webpages/privacy-policy/privacy-policy";
import { TermsOfService } from "../webpages/terms-of-service/terms-of-service";

//Pipes
import {SanitizeScript, SanitizeHtml, SanitizeRUrl, SanitizeStyle, SanitizeUrl} from "../fe-core/pipes/safe.pipe";
import { StatHyphenValuePipe } from "../fe-core/pipes/stat-hyphen.pipe";

//router
import { routing  } from '../app.routing';
import { InputBar } from "../fe-core/components/input-bar/input-bar.component";
import { ArticleSearchBar } from "../fe-core/components/search-bar-article/search-bar-article.component";
import {ErrorComponent} from "../fe-core/components/error/error.component";
import {NoDataBox} from "../fe-core/components/error/data-box/data-box.component";

//Global custom Directives
import {verticalWidgetScrollDirective} from "../fe-core/custom-directives/verticalWidgetScroll.directive";
import {WindowClickDirective} from "../fe-core/custom-directives/windowClick.directive";
import {SwipeIconComponent} from "../fe-core/components/swipe-icon/swipe-icon.component";

@NgModule({
    imports: [
      CommonModule,
      HttpModule,
      routing,
      FormsModule,
      ReactiveFormsModule
    ],
    declarations: [
      SectionFrontTopNav,
      AppComponent,
      HeaderComponent,
      Search,
      HamburgerMenuComponent,
      HoverImage,
      CircleImage,
      RectangleImage,
      FooterComponent,
      ModuleHeader,
      ImagesMedia,
      CircleButton,
      LoadingComponent,
      SearchBoxModule,
      SidekickWrapperAI,
      WidgetModule,
      WidgetCarouselModule,
      SanitizeHtml,
      SanitizeRUrl,
      SanitizeUrl,
      SanitizeStyle,
      SanitizeScript,
      StatHyphenValuePipe,
      ScrollableContent,
      DropdownComponent,
      Larousel,
      NewsBox,
      LineChartComponent,
      SectionNameComponent,
      ArticleBlockComponent,
      DeepDiveRecommendation,
      InputBar,
      ArticleSearchBar,
      BillboardModule,
      AboutUsPage,
      PrivacyPolicy,
      TermsOfService,
      InfoComponent,
      ChatterboxModule,
      ResponsiveWidget,
      ShareLinksComponent,
      BillboardComponent,
      SidekickContainerComponent,
      ComplexInnerHtml,
      ArticleScheduleComponent,
      ScoreBoard,
      LoadMoreButtonComponent,
      ErrorComponent,
      NoDataBox,
      verticalWidgetScrollDirective,
      WindowClickDirective,
      CitationComponent,
      SwipeIconComponent
    ],
    exports: [
      CommonModule,
      HttpModule,
      FormsModule,
      ReactiveFormsModule,
      SectionFrontTopNav,
      HeaderComponent,
      HoverImage,
      CircleImage,
      RectangleImage,
      FooterComponent,
      ModuleHeader,
      ImagesMedia,
      CircleButton,
      LoadingComponent,
      SearchBoxModule,
      SidekickWrapperAI,
      WidgetModule,
      WidgetCarouselModule,
      ShareLinksComponent,
      ScrollableContent,
      SanitizeHtml,
      SanitizeRUrl,
      SanitizeStyle,
      SanitizeScript,
      StatHyphenValuePipe,
      Larousel,
      DropdownComponent,
      Search,
      NewsBox,
      LineChartComponent,
      SectionNameComponent,
      ArticleBlockComponent,
      DeepDiveRecommendation,
      InputBar,
      ArticleSearchBar,
      BillboardModule,
      AboutUsPage,
      PrivacyPolicy,
      TermsOfService,
      InfoComponent,
      ChatterboxModule,
      ResponsiveWidget,
      BillboardComponent,
      SidekickContainerComponent,
      ArticleScheduleComponent,
      ScoreBoard,
      LoadMoreButtonComponent,
      ErrorComponent,
      NoDataBox,
      verticalWidgetScrollDirective,
      WindowClickDirective,
      CitationComponent,
      SwipeIconComponent
    ],
})
export class GlobalModule { }
