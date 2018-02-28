import {Component, OnInit, Output, Input, EventEmitter} from '@angular/core';

import {BoxScoresService} from '../../../../services/box-scores.service';
import {GlobalFunctions} from '../../../../global/global-functions';
import {GlobalSettings} from '../../../../global/global-settings';

declare var moment;

export interface weekDate {
  unixDate:any;
  fullDate:string;
  active:boolean;
  clickable:boolean;
  year:any;
  month:any;
  day:any;
  weekDay:string;
  ordinal:string;
}

@Component({
    selector: 'calendar-carousel',
    templateUrl: './app/fe-core/components/carousels/calendar/calendar-carousel.component.html'
})

export class CalendarCarousel implements OnInit {
  @Input() chosenParam:any;
  @Output() dateEmit = new EventEmitter();
  @Output() checkForLastGame = new EventEmitter();

  public currDateView:any;
  public weeklyApi:any;
  public weeklyDates: Array<any>;
  public failSafe: number = 0;
  public windowWidth: number = 10;
  public lastAvailableGame: boolean;

  constructor(private _boxScores:BoxScoresService){}

  ngOnInit() {
    this.windowWidth = window.innerWidth;
    //on load grab the input chosenParam and set new variable for currently viewing dates that is used for any changes without changing initial input while it goes through validation
    var params = this.chosenParam;
    this.currDateView = {scope: params.scope, teamId: params.teamId, date: params.date};

    // console.log(this.chosenParam);
    //make call to week api to grab to see if any games are available (true/false)
    this.callWeeklyApi(this.chosenParam)
    .subscribe( data => {
      //then run through validation and set firstRun? option parameter to true
      //validateDate(selectedDate, dateArray, firstRun?)
      this.validateDate(this.chosenParam.date, this.weeklyDates, true);
    })
  } //ngOnInit



  ngOnChanges(event){
    //any changes made to the input from outside will cause the fuction to rerun
    // console.log(this.chosenParam);
    if(event.chosenParam.previousValue.scope != null && event.chosenParam.currentValue.scope != event.chosenParam.previousValue.scope){// if route has changed
      var currentUnixDate = new Date().getTime();
      this.chosenParam.date = moment.tz( currentUnixDate , 'America/New_York' ).format('YYYY-MM-DD');
      this.weeklyDates = null;
      this.callWeeklyApi(this.chosenParam)
      .subscribe( data => {
        this.validateDate(this.chosenParam.date, this.weeklyDates, true);
      })
    }else{
      if(this.chosenParam != null){
        this.callWeeklyApi(this.chosenParam)
        .subscribe( data => {
          this.validateDate(this.chosenParam.date, this.weeklyDates);
        })
      }
    }
  } //ngOnChanges



  private onWindowLoadOrResize(event) {
    this.windowWidth = event.target.innerWidth;
  }

  //datepicker that chooses the monthly calendar and update all the necessary functions for the rest of the components
  datePicker(event) {
    this.chosenParam.date = moment(event).tz('America/New_York').format('YYYY-MM-DD');
    var params = this.chosenParam;
    this.currDateView = {scope: params.scope, teamId: params.teamId, date: params.date};
    this.callWeeklyApi(this.chosenParam)
    .subscribe( data => {
      this.validateDate(this.chosenParam.date, this.weeklyDates);
    })
    this.checkForLastGame.emit(moment(event).tz('America/New_York').format('YYYY-MM-DD'));
    this.dateEmit.emit(this.chosenParam);//sends through output so date can be used outside of component
  }

  left(){
    //take parameters and convert using moment to subtract a week from it and recall the week api
    var curParams = this.currDateView;
    curParams.date = moment(curParams.date).subtract(7, 'days').format('YYYY-MM-DD');
    this.callWeeklyApi(curParams).subscribe(data=>{this.validateDate(this.chosenParam.date, this.weeklyDates)});
    this.currDateView.date = curParams.date;//resets current date to the new parameter so that all functions are updated with new date
  }

  right(){
    //take parameters and convert using moment to add a week from it and recall the week api
    var curParams = this.currDateView;
    curParams.date = moment(curParams.date).add(7, 'days').format('YYYY-MM-DD');
    this.callWeeklyApi(curParams).subscribe(data=>{this.validateDate(this.chosenParam.date, this.weeklyDates)});
    this.currDateView.date = curParams.date;//resets current date to the new parameter so that all functions are updated with new date
  }

  leftDay(){
    if(this.failSafe <= 12){
      //take parameters and convert using moment to add a week from it and recall the week api
      var curParams = this.currDateView;
      curParams.date = moment(curParams.date).subtract(1, 'days').format('YYYY-MM-DD');
      var dayNum = 0;

      this.weeklyDates.forEach(function(val,index){
        if(val.fullDate == curParams.date){
          dayNum = index;
        }
      })

      if(dayNum == 0 && curParams.date != this.weeklyDates[dayNum].fullDate){
        this.currDateView.date = curParams.date;
        this.callWeeklyApi(curParams).subscribe(data=>{
          this.failSafe++;
          this.leftDay();
          return;
        });
      } else {
        if(this.weeklyDates[dayNum].clickable){
          this.failSafe = 0;
          this.callWeeklyApi(curParams).subscribe(data=>{
            this.validateDate(this.chosenParam.date, this.weeklyDates);
            this.currDateView.date = curParams.date;//resets current date to the new parameter so that all functions are updated with new date
            this.setActive(this.weeklyDates[dayNum]);
            return;
          });
        }else{
          this.failSafe++;
          this.leftDay();
        }
      }
      this.checkForLastGame.emit(curParams.date);
    }
    else {
      this.checkForLastGame.emit(null);
    }
  } //leftDay

  rightDay(){
    if(this.failSafe <= 12){
      //take parameters and convert using moment to add a week from it and recall the week api

      var curParams = this.currDateView;
      curParams.date = moment(curParams.date).add(1, 'days').format('YYYY-MM-DD');
      var dayNum = 0;
      this.weeklyDates.forEach(function(val,index){
        if(val.fullDate == curParams.date){
          dayNum = index;
        }
      })

      if(dayNum == 0 && curParams.date != this.weeklyDates[dayNum].fullDate){
        this.currDateView.date = curParams.date;
        this.callWeeklyApi(curParams).subscribe(data=>{
          this.failSafe++;
          this.rightDay();
          return;
        });

      } else {
        if(this.weeklyDates[dayNum].clickable){
          this.failSafe = 0;
          this.callWeeklyApi(curParams).subscribe(data=>{
            this.validateDate(this.chosenParam.date, this.weeklyDates);
            this.currDateView.date = curParams.date;//resets current date to the new parameter so that all functions are updated with new date
            this.setActive(this.weeklyDates[dayNum]);
            return;
          });
        }else{
          this.failSafe++;
          this.rightDay();
        }
      }

      this.checkForLastGame.emit(curParams.date);
    }
    else {
      this.checkForLastGame.emit(null); //if no dates are found send null
    }
  } //rightDay





  //whatever is clicked on gets emitted and highlight on the carousel
  setActive(event){
      var resetState = this.weeklyDates;
      resetState.forEach(function(val,i){
        val.active = false;
      })
      event.active = true;
      this.chosenParam.date = event.fullDate;
      this.dateEmit.emit(this.chosenParam);//sends through output so date can be used outside of component
  }

  //makes weekly api call and sets reactive variables
  callWeeklyApi(params){
    // // console.log('4. calendar-carousel - callWeeklyApi - params - ',params);
    // this.weeklyApi = null;// resets call to load loading Gif as it waits for data
    return this._boxScores.weekCarousel(params.scope, params.date, params.teamId)
    .map(data=>{
      this.weeklyApi = data.data;
      this.weeklyDates = this.weekFormat(params.date, this.weeklyApi);
    });
  }

  //week format to grab week call from api and format the data to what is needed for the HTML
  weekFormat(dateChosen, weekData){
    var formattedArray = [];
    //run through each of the Unix (UTC) dates and convert them to readable EST dates
    for(var date in weekData){

      //set each of the dates the EST from UTC and change format to respective format
      let year =  moment(Number(date)).tz('America/New_York').format('YYYY');
      let month = moment(Number(date)).tz('America/New_York').format('MMM');
      let day = moment(Number(date)).tz('America/New_York').format('D');
      let weekDay = moment(Number(date)).tz('America/New_York').format('ddd');
      let fullDate = moment(Number(date)).tz('America/New_York').format('YYYY-MM-DD');
      let ordinal = GlobalFunctions.Suffix(Number(day));
      var dateObj:weekDate = {
        unixDate:date,
        fullDate:fullDate,
        active:false,
        clickable:weekData[date],
        year:year,
        month:month,
        day:day,
        weekDay:weekDay,
        ordinal:ordinal
      }
      //push all dateObj into array
      formattedArray.push(dateObj);
    }
    return formattedArray;
  }

  validateDate(selectedDate, dateArray, firstRun?) {
    var curUnix = moment(selectedDate,"YYYY-MM-DD").unix()*1000;
    var validatedDate = 0;
    var minDateUnix =  dateArray.length > 0 ? Number(dateArray[0].unixDate) : dateArray;
    var maxDateUnix = dateArray.length > 0 ? Number(dateArray[dateArray.length - 1].unixDate) : dateArray;
    var activeIndex;
    var mostRecent;
    dateArray.forEach(function(date, i){
      var dateUnix = Number(date.unixDate);//converts chosen date to unix (in seconds) for comparison
      var dateTime = moment(dateUnix).tz('America/New_York').format('YYYY-MM-DD');
      //grab highest and lowest number in the array to know the beginning and end of the week
      if((minDateUnix > dateUnix)){//get lowest number in dateArray
        minDateUnix = dateUnix;
      }else if(dateUnix > maxDateUnix){//get highest number in dateArray
        maxDateUnix = dateUnix;
      }

      //FIRST RUN
      if(firstRun != null){
        if( (selectedDate == date.fullDate) && date.clickable){
          mostRecent = dateUnix;
          validatedDate = dateUnix;
          activeIndex = i;//SETS POSITION IN ARRAY THAT CURRENT DATE IS SET TO if the curUnix date exists within the current dateArray
        }else{
          //sets most recent game before the curUnix date and index if they havent been found, while the validatedDate and clickability still hasn't been found
          if( ((mostRecent < date.unixDate && date.unixDate <= curUnix) && activeIndex == null) || (date.unixDate <= curUnix && date.clickable && validatedDate == 0)){
            mostRecent = date.unixDate;
            activeIndex = i;
          }
        }
      }else{//NOT FIRST RUN
        //run through the array and set the valid date that has a game as the active key in the dateArray (attached to weeklyDates)
        if( (selectedDate == date.fullDate) && date.clickable){
          validatedDate = dateUnix;
          activeIndex = i;
          dateArray[activeIndex].active = true;
        }
      }
    });
    if(firstRun != null && dateArray.length > 0 && this.failSafe <= 12){

      // run a loop 12 times(12 weeks) to try to grab the nearest most recently played game
      //if no clickable date has been found and the 12 week check still works
      if(mostRecent == null && validatedDate == 0 && this.failSafe < 12){
        this.failSafe++;

        //set new curent date and chosent parameter to the last day of previous week and make that as the new view
        var curDate = moment(minDateUnix).subtract(1, 'days').tz('America/New_York').format('YYYY-MM-DD');
        this.chosenParam.date = curDate;

        var params = this.chosenParam;
        this.currDateView = {scope: params.scope, teamId: params.teamId, date: params.date};

        //recall function with same chosenParam for validating
        this.callWeeklyApi(this.chosenParam)
        .subscribe( data => {
          this.validateDate(this.chosenParam.date, this.weeklyDates, true);
          return;
        })
      }else{
        if(activeIndex != null){
          //reset failsafe
          this.failSafe = 0;
          //make sure to only set new params if new number has been validatedDated
          //otherwise set the new chosenParam to the mostRecent date that has been found
          if(validatedDate != 0){
            validatedDate = moment(Number(validatedDate)).tz('America/New_York').format('YYYY-MM-DD');
            this.chosenParam.date = validatedDate;
            dateArray[activeIndex].active = true;
          }else{
            validatedDate = moment(Number(mostRecent)).tz('America/New_York').format('YYYY-MM-DD');
            this.chosenParam.date = validatedDate;
            dateArray[activeIndex].active = true;
          }

          //sets new params and emit the date
          let params = this.chosenParam;
          this.currDateView = {scope: params.scope, teamId: params.teamId, date: params.date};
          this.dateEmit.emit({scope: params.scope, teamId: params.teamId, date: params.date});//esmit variable that has been validated
          this.setActive(this.weeklyDates[activeIndex]);
          return;
        }else{
          this.failSafe = 0;
          return;
        }
      }
    }else{
      return;
    }
   }
}
