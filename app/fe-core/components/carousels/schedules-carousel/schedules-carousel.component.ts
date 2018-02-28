import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import {CircleImageData} from '../../images/image-data';

export interface SchedulesCarouselInput{
  backgroundGradient:string;
  index?:any;//to know the or position of the input in the array it could possibly be in
  displayNext:string;
  displayTime:string;
  detail1Data:string;
  detail1Value:string;
  detail2Value:string;
  detail1Route?: Array<any>;
  detail2Route?: Array<any>;
  imageConfig1:CircleImageData;
  imageConfig2:CircleImageData;
  teamUrl1: Array<any>;
  teamUrl2: Array<any>;
  teamName1: string;
  teamName2: string;
  teamLocation1:string;
  teamLocation2:string;
  teamRecord1:string;
  teamRecord2:string;
}

@Component({
    selector: 'schedules-carousel',
    templateUrl: './app/fe-core/components/carousels/schedules-carousel/schedules-carousel.component.html',
    outputs:['indexNum'],
})

export class SchedulesCarousel implements OnInit{
  @Input() carouselData:Array<SchedulesCarouselInput>;
  @Input() indexInput: any;//this is an optional Input to determine where the current index is currently positioned. otherwise set the defaul indexInput to 0;
  public indexNum = new EventEmitter();//interface for the output to return an index
  public dataPoint: SchedulesCarouselInput;
  response(event){
    //set the data event being emitted back from the carousel component
    this.dataPoint = event;
    //sets the index of the dataPoint of its current position in the array
    // the '?' meaning if there is data to even receive
    if(this.dataPoint && typeof this.dataPoint['index'] != 'undefined'){
      this.indexNum.next(this.dataPoint['index']);
    }
  }

  ngOnInit(){
    //on initial component view set the datapoint to the first item in the array if it exists
    if(typeof this.carouselData != 'undefined'){
      this.dataPoint = this.carouselData[0];
      //if there is rank then initially set it when component is initially in view
      if(this.dataPoint && typeof this.dataPoint['index'] != 'undefined'){
        this.indexNum.next(this.dataPoint['index']);
      }
    }
  }
}
