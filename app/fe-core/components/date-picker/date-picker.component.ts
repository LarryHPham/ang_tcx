import {Component, ViewContainerRef, Input, Output, EventEmitter, AfterViewInit, forwardRef} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, NgModel } from '@angular/forms';
import {BoxScoresService} from '../../../services/box-scores.service';
import {GlobalFunctions} from '../../../global/global-functions';

declare var moment;

@Component({
  selector: 'datepicker[ngModel]',
  templateUrl: './app/fe-core/components/date-picker/date-picker.component.html'
})

/**
* Input tag is needed to create create this component
* Input tag has been turned transparent but above the fa-calendar
*/
export class DatePicker implements AfterViewInit {
  public isOpened: boolean;
  public dateValue: string;
  public days: Array<Object>;
  public dayNames: Array<string>;
  private el: any;
  private date: any;
  private viewContainer: ViewContainerRef;
  private onChange: Function;
  private onTouched: Function;
  private cd: any;
  private cannonical: number;
  private today:string;
  private monthlyDates: any;
  private curDateView:any;

  @Input('model-format') modelFormat: string;
  @Input('view-format') viewFormat: string;
  @Input('init-date') initDate: string;
  @Input('first-week-day-sunday') firstWeekDaySunday: boolean;
  @Input('static') isStatic: boolean;
  @Input('disabled-days') disabledDays: Array<Object>;
  @Input() viewValue: string;
  @Input() chosenParam: any;

  @Output() changed = new EventEmitter<Date>();

  constructor(cd: NgModel, viewContainer: ViewContainerRef, private _boxScores:BoxScoresService) {
    cd.valueAccessor = this;
    this.cd = cd;
    this.viewContainer = viewContainer;
    this.el = viewContainer.element.nativeElement;
    this.init();
  }

  ngOnChanges(event){
    if(event.chosenParam.previousValue.scope != null && event.chosenParam.currentValue.scope != event.chosenParam.previousValue.scope){// if route has changed
      this.monthlyDates = null;
    }
  }

  ngAfterViewInit() {
    this.curDateView = {scope: this.chosenParam.scope, teamId:this.chosenParam.teamId, date:this.chosenParam.date}
    this.callMonthApi(this.chosenParam)
    .subscribe( data => {
      this.generateDayNames();
      this.generateCalendar(this.date);
      this.initValue();
    })
  }

  private init(): void {
    this.isOpened = false;
    this.date = moment().tz('America/New_York');
    this.today = moment().tz('America/New_York').format('YYYY-MM-DD');
    this.firstWeekDaySunday = true;
    this.initMouseEvents();
  } // private init

  private initMouseEvents(): void {
    let body = document.getElementsByTagName('body')[0];

    body.addEventListener('click', (e) => {
      if (!this.isOpened || !e.target) return;
      if (this.el !== e.target && !this.el.contains(e.target)) {
        this.closeDatepicker();
      }
    }, false);
  } // initMouseEvents

  //makes mothly api call and sets reactive variables
  callMonthApi(params){
    // this.weeklyApi = null;// resets call to load loading Gif as it waits for data
    return this._boxScores.validateMonth(params.scope, params.date, params.teamId)
    .map(data=>{
      this.monthlyDates = this.monthFormat(params.date, data.data);
    });
  }

  //Below relys strongly on API whether or not it returns every correct day of the month or not
  monthFormat(dateChosen, monthData){
    var dateObj = {}
    //run through each of the Unix (UTC) dates and convert them to readable EST dates
    for(var date in monthData){
      let newDate = moment(Number(date)).tz('America/New_York').format('YYYY-MM-DD');
      //set each of the dates the EST from UTC and change format to respective format
      dateObj[newDate] = monthData[date];
    }
    return dateObj;
  }

  // write the days for calendar
  private generateDayNames(): void {
    this.dayNames = [];
    let date = this.firstWeekDaySunday === true ? moment('2015-06-07') : moment('2015-06-01');
    for (let i = 0; i < 7; i += 1) {
      this.dayNames.push(date.format('dd'));
      date.add('1', 'd');
    }
  }

  // build calendar
  private generateCalendar(date): void {
    let lastDayOfMonth = date.endOf('month').date();
    let month = date.month();
    let year = date.year();
    let n = 1;
    let firstWeekDay = null;
    this.dateValue = "<span class='text-heavy'>"+date.format('MMMM')+" </span><span> "+date.format('YYYY')+"</span>"; //designed wanted double spacing
    this.days = [];
    var days42 = 42;
    if (this.firstWeekDaySunday === true) {
      firstWeekDay = date.set('date', 2).day();
    } else {
      firstWeekDay = date.set('date', 1).day();
    }

    if (firstWeekDay !== 1) {
      n -= firstWeekDay - 1;
    }
    if(n > 0){
      n -= 7;
    }
    var finalDaysOfWeek = days42 - lastDayOfMonth;
    finalDaysOfWeek = finalDaysOfWeek - ((n-1)*(-1));
    for (let i = n; i <= (lastDayOfMonth + finalDaysOfWeek); i += 1) {
      let fullDate = moment(year + '-' + (Number(month)+1) + '-' + i, 'YYYY-MM-DD').format('YYYY-MM-DD');
      let today = (this.today == fullDate);
      if (i <= 0){
        let prevMonthLastDay = new moment().date(i).tz('America/New_York').format('D');
        this.days.push({ day: prevMonthLastDay, month: null, year: null, enabled: false, today: false });
      }else if (i > 0 && i <= lastDayOfMonth) {
        this.days.push({ day: i, month: month + 1, year: year, enabled: this.monthlyDates[fullDate], today: today});
      } else if (i > lastDayOfMonth){
        var dayAdd = i % lastDayOfMonth;
        let nextMonthFirstDay = new moment().add(1, 'months').date(dayAdd).tz('America/New_York').format('D');
        this.days.push({ day: nextMonthFirstDay, month: null, year: null, enabled: false, today: false });
      }
    }
  } // generateCalendar

  private initValue(): void {
    setTimeout(() => {
      if (!this.initDate) {
        this.setValue(moment().format(this.modelFormat || 'YYYY-MM-DD'));
      } else {
        this.setValue(moment(this.initDate, this.modelFormat || 'YYYY-MM-DD'));
      }
    });
  }

  writeValue(value: string): void {
    if (!value) return;
    this.setValue(value);
  }

  private setValue(value: any): void {
    let val = moment(value, this.modelFormat || 'YYYY-MM-DD');
    this.viewValue = val.format(this.viewFormat || 'Do MMMM YYYY');
    this.cd.viewToModelUpdate(val.format(this.modelFormat || 'YYYY-MM-DD'));
    this.cannonical = val.toDate().getTime();
  }

  registerOnChange(fn: (_: any) => {}): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: (_: any) => {}): void {
    this.onTouched = fn;
  }

  public openDatepicker(): void {
    if(this.isOpened == null || this.isOpened == false){
      this.isOpened = true;
    }else{
      this.isOpened = false;
    }
  } //openDatepicker

  public closeDatepicker(): void {
    this.isOpened = false;
  } //closeDatepicker

  // functions to navigate between years on calendar
  public prevYear(): void {
    this.date.subtract(1, 'Y');
    this.generateCalendar(this.date);
  }
  public nextYear(): void {
    this.date.add(1, 'Y');
    this.generateCalendar(this.date);
  }

  // functions to navigate between months on calendar
  public nextMonth(): void {
    this.date.add(1, 'M');
    this.curDateView.date = this.date.tz('America/New_York').format('YYYY-MM-DD');
    this.callMonthApi(this.curDateView)
    .subscribe( data => {
      this.generateDayNames();
      this.generateCalendar(this.date);
    })
    this.generateCalendar(this.date);
  }
  public prevMonth(): void {
    this.date.subtract(1, 'M');
    this.curDateView.date = this.date.tz('America/New_York').format('YYYY-MM-DD');
    this.callMonthApi(this.curDateView)
    .subscribe( data => {
      this.generateDayNames();
      this.generateCalendar(this.date);
    })
    this.generateCalendar(this.date);
  }

  // selecting date on calendar
  public selectDate(e, date): void {
    e.preventDefault();
    if (this.isSelected(date)) return;

    let selectedDate = moment(date.year + '-' + date.month + '-' + date.day, 'YYYY-MM-DD');
    this.setValue(selectedDate);
    this.changed.emit(selectedDate.toDate());
    this.closeDatepicker();
  }

  isSelected(date) {
    let selectedDate = moment(date.year + '-' + date.month + '-' + date.day, 'YYYY-MM-DD');
    return selectedDate.toDate().getTime() === this.cannonical;
  }




}
