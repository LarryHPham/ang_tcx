import { Component, Input, OnInit } from '@angular/core';
import { VideoStackData } from "../../interfaces/deep-dive.data";

declare var moment;

@Component({
  selector: 'deep-dive-video-module',
  templateUrl: './app/fe-core/modules/video-deep-dive/video-deep-dive.module.html',
})

export class DeepDiveVideoModule implements OnInit{
  @Input() videoData: Array<VideoStackData>;
  ngOnInit() {}
}
