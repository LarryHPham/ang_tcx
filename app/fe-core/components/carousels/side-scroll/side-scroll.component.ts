import {Component, AfterContentChecked, Input, Output, EventEmitter} from '@angular/core';

declare var jQuery:any;

@Component({
    selector: 'side-scroll',
    templateUrl: './app/fe-core/components/carousels/side-scroll/side-scroll.component.html',
    outputs: ['carouselCount', 'reloadSame']
})

export class SideScroll{
  @Input() maxLength:any;
  @Input() current:any;
  @Input() data: any;
  public carouselCount = new EventEmitter();
  public reloadSame = new EventEmitter();
  public currentScroll = 0;
  public rightText:string = '0px';
  private itemSize:number = 230;
  private maxScroll:boolean = false;

  private isMouseDown: boolean = false;
  private drag: number = 0;
  private mouseDown:number = 0;
  private mouseUp:number = 0;
  private boundary:any = {};

  private transition:any = null;
  constructor(){

  }

  ngOnChanges(event) {
    if (event.data) { //if we get new data from the api, reset to the first item on scroller
      setTimeout(() => {
        this.currentScroll = 0;
        this.checkCurrent(this.currentScroll);
      }, 10);

    }
  }

  scrollX(event){
    let currentClick = event.clientX;
    let mouseType = event.type;
    if(mouseType == 'mousedown'){
      this.mouseDown = event.clientX;
    }
    if(mouseType == 'mouseup'){
      this.mouseUp = event.clientX;
      this.checkCurrent(this.currentScroll);
    }
  }

  movingMouse(event){
    this.isMouseDown = event.buttons === 1;
    this.maxScroll = !((this.maxLength-1) > Math.round(this.currentScroll/this.itemSize));
    if(this.isMouseDown && !this.maxScroll){
      this.drag = (this.mouseDown - event.clientX);
      this.currentScroll += this.drag;
      this.mouseDown = event.clientX;
      if(this.currentScroll <= 0){
        this.currentScroll = 0;
      }
      this.rightText = this.currentScroll+'px';
    }
  }

  checkCurrent(num){
    if(num < 0){
      num = 0;
    }
    let pos = (num / this.itemSize);
    this.currentScroll = Math.round(pos) * this.itemSize;
    this.carouselCount.next(Math.round(pos));
    this.rightText = this.currentScroll+'px';
  }

  left(event) {
    this.currentScroll -= this.itemSize;
    if(this.currentScroll <= 0){
      this.currentScroll = 0;
    }
    this.checkCurrent(this.currentScroll);
  }
  right(event) {
    this.maxScroll = !((this.maxLength-1) > Math.round(this.currentScroll/this.itemSize));
    if((this.maxLength-1) > Math.round(this.currentScroll/this.itemSize)){
      this.currentScroll += this.itemSize;
      this.checkCurrent(this.currentScroll);
    }

    if ((this.maxLength-5) == Math.round(this.currentScroll/this.itemSize)) { // append current data to end of scroller if reached near the end
      this.reloadSame.next(null);
    }
  }

}
