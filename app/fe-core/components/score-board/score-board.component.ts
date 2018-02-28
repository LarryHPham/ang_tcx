import { Component, Input, OnInit, EventEmitter } from '@angular/core';

export interface ScoreBoardInput{

}

@Component({
    selector: 'score-board',
    templateUrl: './app/fe-core/components/score-board/score-board.component.html'
})

export class ScoreBoard implements OnInit{
  @Input() scoreBoard:any;
  public pixel:number = 27;// amount of pixels the display will shift when clicking on carousel buttons
  public scrollScore:string;
  public offset:number;

  constructor(){
  }

  left(){
    if(this.offset > 0){//do not allow scoreboard to move below the first inning
      this.offset--;
    }
    this.scrollScore = "-"+(this.pixel * this.offset)+"px";
  }
  right(){
    if(this.offset < (this.scoreBoard.scoreArray.length - 9)){//there has to be 9 innings and if there happens to be more allow user to scroll up to that point
      this.offset++;
    }
    this.scrollScore = "-"+(this.pixel * this.offset)+"px";
  }

  ngOnInit(){
    this.offset = 0;//sets the offset to 0
  }
}
