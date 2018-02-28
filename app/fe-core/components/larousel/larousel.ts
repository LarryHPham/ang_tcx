import {Component, OnChanges, Input, Output, EventEmitter, ElementRef} from '@angular/core';

declare var jQuery:any;
declare var moment:any;

@Component({
    selector: 'larousel',
    templateUrl: './app/fe-core/components/larousel/larousel.html',
})

export class Larousel implements OnChanges{
  @Input() maxLength:any;
  @Input() current:any;
  @Input() graphData: any;
  @Input() videoData: any;
  @Input() toggleData: any;
  @Input() carData: any;
  public currentScroll = 0;
  public rightText:string;
  private itemSize:number = 205;
  private minScroll:boolean = false;
  private maxScroll:boolean = false;
  public numResizes: number = 0;

  private isMouseDown: boolean = false;
  private drag: number = 0;
  private mouseDown:number = null;
  private mouseUp:number = 0;
  private swipeDirection:string;
  private boundary:any = {};

  private transition:any = '';
  private transition2:any = '';

  @Input('show-item-num') totalItems:number;
  @Input('loop') loop:boolean;
  @Input('fade') fade:boolean;
  @Input('button-class') buttonClass: string;
  @Output() displayedData = new EventEmitter();//outputs and array of objects for other components to use
  @Output() displayedItem = new EventEmitter();//outputs and array of objects for other components to use
  @Output() carouselCount = new EventEmitter();
  private startIndex:number = 0;
  private endIndex:number = 1;
  private originalData: any;
  private displayedItems:any;
  private currentItem:any;

  private prevImage:any;
  private currentImage:any;
  private nextImage:any;
  private imageTransition:string = '0px';
  private transitionDirection:any;

  private clones:number = 1;
  constructor(private _elRef: ElementRef){

  }
  ngOnChanges(event){
    this.originalData = null;
    this.currentScroll = null;
    var ssItems = [];//side scroll item
    if(event.carData != null){
      this.carData = event.carData.currentValue;
      this.maxLength = null;
    }
    if(event.videoData != null){
      this.videoData = event.videoData.currentValue;
      this.graphData = event.graphData != null ? event.graphData.currentValue:null;
      this.maxLength = null;
    }
    if(event.graphData != null){
      this.videoData = event.videoData != null ? event.videoData.currentValue:null;
      this.graphData = event.graphData.currentValue;
      this.maxLength = null;
    }

    //push in video items first this can probably handle arguments in future
    var startLength = ssItems.length;

    if(this.toggleData != null){
      this.toggleData.forEach(function(val, index){
        ssItems.push({
          id: startLength + index,
          data:val,
          type:'toggle',
          type2:'toggle'
        })
      });
      startLength = ssItems.length
    }

    if(this.graphData != null){
      ssItems.push({
        id: startLength,
        data:this.graphData,
        type:'graph',
        type2:'graph'
      })
      startLength = ssItems.length
    }

    if(this.videoData != null){
      this.videoData.forEach(function(val, index){
        ssItems.push({
          id: startLength + index,
          data:val,
          type:'video',
          type2:'video'
        })
      });
      startLength = ssItems.length
    }

    //push in carousels items next this can probably handle arguments in future
    if(this.carData != null){
      this.carData.forEach(function(val, index){
        ssItems.push({
          id:startLength + index,
          data:val,
          type:'carousel',
          type2:'carousel'
        })
      });
      startLength = ssItems.length; //get total valid items
    }

    for(var c = 1; c <= this.clones; c++){
      //push clones at end of array
      ssItems.push({
        id: ssItems[0].id,
        data:ssItems[0].data,
        type:ssItems[0].type,
        type2:'clone'
      })
      //unshift pushes clones before array only if we have that extra carousel in front
      ssItems.unshift({
        id:ssItems[startLength-1].id,
        data:ssItems[startLength-1].data,
        type:ssItems[startLength-1].type,
        type2:'clone'
      })
    }
    //set all inputed data into a single originalData variable to be used
    this.originalData = ssItems;
    this.currentScroll = this.itemSize * this.clones;
    this.currentItem = this.originalData[this.clones];
    this.displayedItem.emit(this.currentItem);
    //delete below when done testing
    // this.carData.length = 2;
    //if loop is not given default to infinite looping
    if(this.loop == null){
      this.loop = true;
    }

    //if no class is set then set to default class of .carousel_scroll-left
    if(this.buttonClass == null){
      this.buttonClass = 'carousel_scroll-button';
    }

    // if no input comes from totalItems then default to showing 1 item in carousel
    if(this.totalItems == null){
      this.totalItems = 1;
    }

    this.startIndex = 0;//on initial load of component start index at 1
    this.endIndex = (this.startIndex + (this.totalItems-1)) % this.originalData.length; //the ending index needs to be the start of the index
    if(this.maxLength == null){
      this.maxLength = this.originalData.length;
    }
    this.generateArray();
    this.preLoadImage();// run the first time
    this.onResize(window);
  }

  ngDoCheck(){
    if(this._elRef.nativeElement.getElementsByClassName('carousel_scroll-container').length > 0){
      let larouselContainer = this.itemSize = this._elRef.nativeElement.getElementsByClassName('carousel_scroll-container')[0].offsetWidth;
      if(larouselContainer != this.itemSize){
        this.itemSize = larouselContainer;
      }
    }
  }

  ngAfterViewInit(){
    //make sure to run the element ref after the content has loaded to get the full size;
    this.itemSize = this._elRef.nativeElement.getElementsByClassName('carousel_scroll-container')[0].offsetWidth;
    this.currentScroll = this.itemSize * this.clones;
    this.rightText = this.currentScroll+'px';
    this.currentItem = this.originalData[this.clones];
    this.displayedItem.emit(this.currentItem);
    //once scrolls are set declare the min and max scrolls if loops is set false
    if(!this.loop){
      this.minScroll = this.currentScroll < this.itemSize * this.clones;
      this.maxScroll = !((this.maxLength) >= Math.round(this.currentScroll/(this.itemSize)));
    }
    this.generateArray();
    this.onResize(window);
  }

  onResize(event?){
    if(this._elRef.nativeElement.getElementsByClassName('carousel_scroll-container').length > 0 && this.numResizes > 0){
      this.itemSize = this._elRef.nativeElement.getElementsByClassName('carousel_scroll-container')[0].offsetWidth;
      if (this.currentItem.id == 0){
        this.currentScroll = this.itemSize;
      } else {
        this.currentScroll = this.itemSize * (Number(this.currentItem.id) + 1);
      }
      this.transition = "";
      this.imageTransition = this.itemSize+'px';
      this.rightText = this.currentScroll+'px';
      //ran after the transition to the clone is made and instant switch to the beginning or end of array with no transition
      setTimeout(function(){
        this.transition = "score-transition2";
      },200);
    }
    this.numResizes = this.numResizes + 1;
  }

  generateArray(){
    var self = this;
    var originalData = this.originalData;
    var total = this.totalItems;
    this.displayedItems = [];
    // this.currentScroll = 0;
    //if loops from input is true then the hidden item needs to be the last item of the array + the prev item before that
    for(var item = 0; item < originalData.length; item++){
      this.displayedItems.push(originalData[item]);
      this.endIndex = originalData[item].id;//set ending index to last item of total items shown
    }
    this.displayedData.emit(this.displayedItems);
  }

  left(event) {
    //moves the current scroll over the item size
    this.currentScroll -= (this.itemSize);
    this.transitionDirection = 'left';
    if(this.currentScroll < 0){
      this.currentScroll = (this.itemSize * this.maxLength-(this.clones*2));
    }
    this.checkCurrent(this.currentScroll);
  }

  right(event) {
    this.currentScroll += (this.itemSize);
    this.transitionDirection = 'right';
    if(this.maxLength >= Math.round(this.currentScroll/this.itemSize)){
      this.checkCurrent(this.currentScroll);
    }else{
      this.currentScroll = 0;
      this.checkCurrent(this.currentScroll);
    }
  }

  //For mobile screen swiping events
  onSwipe(event){
    this.swipeDirection = event.deltaX > 0 ? 'right' : 'left';
    if(this.swipeDirection == 'right'){//this is for quick fix but not final version
      this.left('left');
    }else if (this.swipeDirection == 'left'){
      this.right('right');
    }
    this.checkCurrent(this.currentScroll);
  }

  scrollX(event){
    let currentClick = event.clientX;
    let mouseType = event.type;
    if (event.which == 1) { //if left click only
      if(mouseType == 'mousedown'){
        this.mouseDown = event.clientX;
      }
      if(mouseType == 'mouseup'){
        var className = event.target.className;
        if(className.indexOf('title') != -1 || className.indexOf('content') != -1) { //prevents scroll when pressing content
          event.preventDefault();
          return;
        }
        this.mouseUp = event.clientX;
        this.drag = this.mouseDown - this.mouseUp;
        if(this.drag >= 0){//this is for quick fix but not final version
          this.right('right');
        }else{
          this.left('left');
        }
        this.checkCurrent(this.currentScroll);
      }
    }
  }

  checkCurrent(currentScroll){
    var self = this;
    let currentItem;
    //set maxScroll and minScroll if loops is set to false
    if(!this.loop){
      this.minScroll = this.currentScroll < (this.itemSize * this.clones);
      this.maxScroll = !((this.maxLength) > Math.round(this.currentScroll/(this.itemSize)));
    }
    let pos = Math.round((currentScroll / this.itemSize));
    //if num which is currentScroll is below the above the clone pos then reset to beginning of array else if current size is below then reset to beginning
    if(pos > (this.maxLength-(this.clones*2))){//if position is larger or same as the length of array
      currentItem = this.clones;
    }else if (pos < this.clones){//othwerwise if position is less than the first item after clones
      currentItem = this.maxLength-(this.clones*2);
    }else{
      currentItem = pos;
      this.transition = "score-transition2";
      this.transition2 = "score-transition2";
    }
    //if pos (position) is between then round to nearest  whole number and move carousel
    this.currentScroll = Math.round(pos) * this.itemSize;
    this.currentItem = this.originalData[currentItem];
    this.displayedItem.emit(this.currentItem);
    this.carouselCount.next(Math.round(pos));
    this.rightText = this.currentScroll+'px';

    //this will determine which direction the image is going to transition (from left function || right function)
    if(this.transitionDirection == 'right'){//shift image left
      this.imageTransition = (this.itemSize*2)+'px';
    }else{//shift image right start at item.size
      this.imageTransition = '0px';
    }
    //ran after the transition to the clone is made and instant switch to the beginning or end of array with no transition
    setTimeout(function(){
      self.transition2 = "";
      if(pos <= 0){
        self.transition = "";
        self.currentScroll = (self.maxLength-2) * self.itemSize;
        self.rightText = self.currentScroll+'px';
      }
      if(pos >= self.maxLength - 1){
        self.transition = "";
        self.currentScroll = self.itemSize;
        self.rightText = self.currentScroll+'px';
      }
      self.imageTransition = self.itemSize+'px';
      self.preLoadImage();
    },200);
  }

  preLoadImage(){
    let currentItem = this.currentItem;
    let prevNum = Number(currentItem.id);
    let nextNum = Number(currentItem.id) + 2;
    this.prevImage = this.imageCase(this.displayedItems[prevNum]);
    this.currentImage = this.imageCase(currentItem);
    this.nextImage = this.imageCase(this.displayedItems[nextNum]);
  }

  imageCase(currentItem){
    let currentImage;
    let currentType = currentItem != null ? currentItem.type: null;
    switch(currentType){
      case "toggle":
      currentImage = '';
      break;
      case "carousel":
      currentImage = encodeURI(currentItem.data.image_url);
      break;
      case "video":
      currentImage = encodeURI(currentItem.data.thumbnail);
      break;
      default:
      currentImage = '';
      break;
    }
    return currentImage;
  }
}
