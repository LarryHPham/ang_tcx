import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { ModuleHeaderData } from '../../components/module-header/module-header.component';

declare var stButtons: any;

@Component({
    selector: 'news-module',
    templateUrl: './app/fe-core/modules/news/news.module.html'
})

export class NewsModule implements OnInit, OnChanges {
    public counter: number = 0;
    public max:number;
    public newsLink: string;
    public displayData: Object;
    public title: string = "Articles";
    public locateShareThis = function(){
      stButtons.locateElements();
    };
    @Input() newsDataArray: Array<Object>;
    @Input() profileName: string;
    public headerInfo: ModuleHeaderData = {
      moduleTitle: "Other Content You Will Love - [Profile Name]",
      hasIcon: true,
      iconClass: "fa fa-heart"
    };

    constructor(){ }

    left(){
      var counter = this.counter;
      counter--;


      //make a check to see if the array is below 0 change the array to the top level
      if(counter < 0){
        this.counter = (this.max - 1);
      }else{
        this.counter = counter;
      }
      this.changeMain(this.counter);
    }

    right(){
      var counter = this.counter;
      counter++;
      //check to see if the end of the obj array of images has reached the end and will go on the the next obj with new set of array
      if(counter == this.max){
        this.counter = 0;
      }else{
        this.counter = counter;
      }
      this.changeMain(this.counter);
    }

    //this is where the angular2 decides what is the main image
    changeMain(num){
      if ( num < this.max ) {
        this.displayData = this.newsDataArray[num];
      };
    }

    private setupNewsData(){
      this.max = this.newsDataArray.length;
         if (this.max >= 10) {
           this.max = 10;
         }
      //  this.max = 10;
        this.changeMain(this.counter);
    }

    ngOnChanges() {
      let profileName = this.profileName ? this.profileName : "NFL";
      this.headerInfo.moduleTitle = "Other Content You Will Love";
      this.headerInfo.moduleIdentifier = " - " + profileName;
    }

    ngOnInit(){
      this.setupNewsData();
    }

}
