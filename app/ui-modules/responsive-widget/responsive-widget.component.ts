import {Component, Input, Output, ChangeDetectorRef, OnInit, AfterViewChecked} from '@angular/core';
import { GlobalSettings } from "../../global/global-settings";

@Component({
  selector: 'responsive-widget',
  templateUrl: './app/ui-modules/responsive-widget/responsive-widget.component.html',
})

export class ResponsiveWidget implements OnInit,AfterViewChecked {
  @Input() embedPlace: string;//not sure why we need this
  @Input() category: string;
  @Input() subCategory: string;
  //adding temporary variables in order to avoid making changes to the category and subcategory directly
  wcategory:string;
  wsubCategory:string;
  windowWidth: number = window.innerWidth;
  srcLink: string;
  firstCheckHoz=null;

  getData(){
    //Check if category exists in the given list in global settings
    var topScope = GlobalSettings.getTCXscope(this.category).topScope ? GlobalSettings.getTCXscope(this.category).topScope : null;
    //If category is real estate then add the hyphen
    this.wcategory = this.category == "real estate" ? this.category.replace(/ /g,"-") : this.category;
    //If sub category is real estate then add hyphen
    this.wsubCategory = this.subCategory == "real estate" ? this.subCategory.replace(/ /g,"-") : this.subCategory;
    //If category is one of the given list and it's not on home page
    if(topScope && this.wcategory != "all"){
      //Sub category exist, not the same name with category and it's not real estate, else return empty space
      this.wsubCategory = this.wsubCategory && this.wsubCategory != this.wcategory && this.wsubCategory != "real-estate" ? this.wsubCategory : "";
    } else {//if on homepage or not one of the categories that given
      this.wcategory = "trending";
      this.wsubCategory = "";
    }
    this.srcLink = "/app/ads/horizontal_widget.html?category=" + this.wcategory + "&sub_category=" + this.wsubCategory;
  }
  ngOnInit() {
    this.getData();
    this.windowWidth = window.innerWidth;
  }
  ngOnChanges(){
    this.getData();
    this.firstCheckHoz= null;
  }

  ngAfterViewChecked():void{
    //Reload an IFRAME without adding to the history
    //Change the src attribute of an iframe element when the iframe is not in the DOM in order to avoid a history push to the browsers history stack,
    var state = document.readyState;
    //check if DOM is completely loaded
    if(state === "complete"){
      if(this.firstCheckHoz == null){
        var parentElementArray = document.getElementsByClassName('widgetHoz');

        var parentDivs = Array.prototype.filter.call(parentElementArray, function(singleDiv){
          return singleDiv
        });
        for(var i=0;i<parentDivs.length;i++){

          var oldFrame = parentDivs[i].firstElementChild;
          var parent =parentDivs[i];
          if(oldFrame!=null){
            parent.removeChild(oldFrame);
          }
          if(parent!=null){
            var newFrame = document.createElement("iframe");
            newFrame.id = 'hozWidgetChild';
            newFrame.style.width = '100%';
            newFrame.style.height ='250px';
            newFrame.style.border = '0px';
            newFrame.style.margin = '0px';
            newFrame.style.zIndex = '0';
            newFrame.frameBorder = '0';
            newFrame.scrolling = 'no';
            newFrame.setAttribute('allowtransparency', 'true');
            newFrame.style.display= 'block';
            newFrame.style.overflow= 'hidden';
            newFrame.src = this.srcLink;
            parent.appendChild(newFrame);
            this.firstCheckHoz=state;
          }
        }



      }

    }
  }
  private onWindowLoadOrResize(event) {
    var windowWidth = event.target.innerWidth;
    this.windowWidth = windowWidth;
  }
}
