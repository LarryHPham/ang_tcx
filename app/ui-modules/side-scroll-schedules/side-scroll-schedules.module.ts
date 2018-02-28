import {Component, Input, Output, EventEmitter, Renderer} from '@angular/core';
import { SchedulesService } from '../../services/schedules.service';
declare var jQuery:any;

@Component({
    selector: 'side-scroll-schedules',
    templateUrl: './app/ui-modules/side-scroll-schedules/side-scroll-schedules.module.html',
    outputs: ['count']
})

export class SideScrollSchedule{
  @Input() sideScrollData: any;
  @Input() scrollLength: any;
  @Input() topScope:string;
  @Input() topNav:string;
  @Input() pageScope:string;
  @Input() scope:string;
  @Input() scopeList:string;
  @Output() changeScope = new EventEmitter();
  @Output() changeLocation = new EventEmitter();
  titleText:string = "";
  titleIcon:string = "";
  localTopScope: string;
  scrollerRefresh: string = "";
  originalBlocks: any;
  usableData:any;

  public count = new EventEmitter();
  public curCount = 0;
  keyPressReady: boolean = true;
  autocompleteItems: Array<any> = [];
  showError: boolean = false;

  constructor(private _schedulesService:SchedulesService, private _render:Renderer) {}
  reloadSame() {
    let usableData = Object.assign({},this.usableData);
    for (var i = 0; i < this.originalBlocks.length; i++) {
      usableData.blocks.push(this.originalBlocks[i]);
    }
    this.usableData = Object.assign({},usableData);
    this.scrollLength = this.usableData.blocks.length;
  }
  counter(event){
    this.curCount = event;
    this.count.emit(event);
  }

  scopeChange(selection) {
    this.changeScope.next(selection.replace(/ /g, "-").toLowerCase());
  }
  keypress(event) {
    var activeDropDown = document.getElementById('active-dropdown');
    this._render.setElementStyle(activeDropDown,'display','block');
    var textEntered = event.target.value.replace(/ /g, "%20"); // handle spaces in the text for URL safe entry
    if (event.code != "Enter") {
      if (this.keyPressReady == true && event.target.value != "") { //only fire if we have not fired in the last n miliseconds
        this.keyPressReady = false;
        // call api now
        this._schedulesService.getLocationAutocomplete(textEntered, (data) => {
          if (data.success == true) {
            this.showError = false;
            this.autocompleteItems = data.data;
          }
          else {
            this.autocompleteItems = [];
            this.showError = true;
          }
        })
        setTimeout(() => {
          this.keyPressReady = true;
          this.scrollerRefresh += " ";
        }, 500); // sets the timout to fire within n miliseconds
      }
    }
    else { // when enter is presse execute first search result and close dropdown
      var weatherSearch = document.getElementById("weather-search");
      var searchResults = weatherSearch.getElementsByClassName("dropdown-item");
      if (searchResults != null && searchResults.length > 0) {
        this.changeLocation.next(searchResults[0].id);
        this.autocompleteItems = [];
      }
      event.target.value = "";
    }
    if (event.target.value == "") { // if nothing entered in searchbox, clear the dropdown and hide it
      this.showError = false;
      this.autocompleteItems = [];
    }
  }
  selectCity(event) {
    //return the zip code for the clicked on city
    this.changeLocation.next(event.target.id);
    this.autocompleteItems = [];
    document.getElementsByClassName("weather-search-input")[0]["value"] = "";
  }
  ngOnChanges(event) {
    if (event.sideScrollData && event.sideScrollData.currentValue.blocks.length > 0) { // only fire this if the actual data is changing
      this.originalBlocks = this.sideScrollData.blocks.slice(0);
      this.usableData = Object.assign({},this.sideScrollData);
      this.localTopScope = this.topScope=="all"?'weather':this.topScope;
      switch(this.localTopScope) {
      case "weather":
        this.titleText = "<span class='hide-mobile'>" + this.sideScrollData.current.current_temperature + "°<span class='weather-divider'>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;</span></span>" + this.sideScrollData.current.city + ", " + this.sideScrollData.current.state;
        this.titleIcon = this.sideScrollData.current.current_icon;
          break;
      case "business":
        this.titleText = "Today's Gainers<span class='hide-mobile'>: All Exchanges</span>";
        this.titleIcon = "fa-briefcase-case-two";
          break;
      case "football":
      case "basketball":
      case "baseball":
        this.titleIcon = "fa-calendar";
        this.titleText = "Upcoming Games";
        break;
      default:
      }
    }
  }

  ngOnInit() {
    //Shhhh easter egg here. To activate: type "window.createSharknado()" in your browser console
    if (this.topScope == "all") {
      window['createSharknado'] = function() {
          //console.log("Preparing your sharknado...");
          var image = document.getElementsByClassName("condition-image");
          for (var i = 0; i < image.length; i++) {
            image[i]['src'] = "//images.synapsys.us/weather/icons/sharknado_n.svg";
          }
          var condition = document.getElementsByClassName("condition");
          for (var u = 0; u < condition.length; u++) {
            condition[u]['innerHTML'] = "Sharknado!";
          }
          var temp = document.getElementsByClassName("temp");
          for (var v = 0; v < temp.length; v++) {
            temp[v]['innerHTML'] = "9001&#176;";
          }
      };
    }
  }
}
