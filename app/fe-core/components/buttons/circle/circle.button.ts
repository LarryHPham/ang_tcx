/**
 * Created by Victoria on 3/3/2016.
 */
import {Component, Output, EventEmitter, Input} from '@angular/core';

@Component({
    selector: 'circle-button',
    templateUrl: './app/fe-core/components/buttons/circle/circle.button.html',
    
    outputs: ['scrollRight', 'scrollLeft']
})
export class CircleButton{
  @Input() addSwipeIcon:boolean=false;
  public scrollRight = new EventEmitter();
  public scrollLeft = new EventEmitter();

  left(){
      this.scrollLeft.next(true);
  }
  right(){
      this.scrollRight.next(true);
  }
}
