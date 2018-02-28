import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routing } from '../app.routing';
import { GlobalModule } from './global.ngmodule';
import { FormsModule } from '@angular/forms';

//providers
import { DeepDiveService } from '../services/deep-dive.service';
import { BoxScoresService } from '../services/box-scores.service';

import { SideScrollSchedule } from '../ui-modules/side-scroll-schedules/side-scroll-schedules.module';
import { ScheduleBox } from '../fe-core/components/schedule-box/schedule-box.component';
import { SideScroll } from '../fe-core/components/carousels/side-scroll/side-scroll.component';
import { SchedulesService } from '../services/schedules.service';

//deep-dive blocks
import { DeepDiveBlockMain } from '../ui-modules/deep-dive-blocks/deep-dive-block-main/deep-dive-block-main.module';
import { DeepDiveSectionFront } from '../ui-modules/deep-dive-blocks/deep-dive-section-front/deep-dive-section-front.module';

import { DeepDivePage } from "../webpages/deep-dive-page/deep-dive-page";
import { StackRowsComponent } from '../fe-core/components/stack-rows/stack-rows.component';
import { ArticleStacktopComponent } from '../fe-core/components/article-stacktop/article-stacktop.component';
import { ArticleStack1Module } from '../fe-core/modules/article-stack-style-1/article-stack.module';
import { ArticleStack2Module } from '../fe-core/modules/article-stack-style-2/article-stack.module';
import { DeepDiveVideoModule } from '../fe-core/modules/video-deep-dive/video-deep-dive.module';
import { VideoStackComponent } from '../fe-core/components/video-stack/video-stack.component';

//Box Scores
import { BoxScoresModule } from '../fe-core/modules/box-scores/box-scores.module';
import { GameInfo } from '../fe-core/components/game-info/game-info.component';
import { CalendarCarousel } from '../fe-core/components/carousels/calendar/calendar-carousel.component';
import { DatePicker } from '../fe-core/components/date-picker/date-picker.component';
import { GameArticle } from '../fe-core/components/game-article/game-article.component';



@NgModule({
    imports:[
      GlobalModule,
        routing,
    ],
    declarations:[
      DeepDivePage,
      SideScrollSchedule,
      ScheduleBox,
      SideScroll,
      StackRowsComponent,
      ArticleStacktopComponent,
      ArticleStack1Module,
      ArticleStack2Module,
      VideoStackComponent,
      BoxScoresModule,
      DatePicker,
      GameInfo,
      GameArticle,
      CalendarCarousel,
      DeepDiveVideoModule,
      DeepDiveBlockMain,
      DeepDiveSectionFront,
    ],
    exports:[],
    providers: [
      DeepDiveService,
      BoxScoresService,
      SchedulesService
    ]
})

export class DeepDiveNgModule{}
