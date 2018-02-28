import {Component, Input, OnInit, DoCheck, Output, EventEmitter, OnChanges} from '@angular/core';

import {SliderCarousel, SliderCarouselInput} from '../carousels/slider-carousel/slider-carousel.component';
import {Tabs} from '../tabs/tabs.component';
import {Tab} from '../tabs/tab.component';
import {CustomTable} from '../custom-table/custom-table.component';
import {TableModel, TableColumn} from '../custom-table/table-data.component';
import {DropdownComponent} from '../../components/dropdown/dropdown.component';
import {LoadingComponent} from '../../components/loading/loading.component';
import {NoDataBox} from '../../components/error/data-box/data-box.component';
import {GlossaryComponent} from "../glossary/glossary.component";




export interface StatsTableTabData<T> {
    tabTitle: string;
    isActive: boolean;
    isLoaded: boolean;
    hasError: boolean;

    tableData: TableModel<T>;
    seasonIds: Array<{key: string, value: string}>;
    glossary: Array<{key: string, value: string}>;
    convertToCarouselItem(item:T, index:number,tabName):SliderCarouselInput
}

@Component({
    selector: "player-stats-component",
    templateUrl: "./app/fe-core/components/player-stats/player-stats.component.html",
})
export class PlayerStatsComponent implements DoCheck,OnChanges,OnInit{
    private initialSeasonId: string=new Date().getFullYear().toString();
    public selectedIndex;
    public GlossaryData;
    isCarousel: boolean;
    public rowCount;
    isLessThanTen:boolean;

    public carouselData: Array<SliderCarouselInput> = [];
    @Input() tabName;
    @Input() tabs: Array<StatsTableTabData<any>>;
    @Input() showGlossary: boolean;

    @Output("tabSelected") tabSelectedListener = new EventEmitter();
    private isSpecialTeam:boolean;
    private selectedTabTitle: string;
    private tabsLoaded: {[key: string]: string};
    private selectedSeasonId: string;
    private noDataMessage = "Sorry, there is no data available.";
    private selectedSubTab:string;

    constructor() {}

    ngDoCheck() {

        if ( this.tabs && this.tabs.length > 0 ) {
            if ( !this.tabsLoaded  ) {
                this.tabsLoaded = {};
                var selectedTitle = this.tabs[0].tabTitle;
                this.tabs.forEach(tab => {
                    if ( tab.isActive ) {
                        selectedTitle = tab.tabTitle;
                    }
                });
                this.tabSelected(selectedTitle);
            }
            else {
                for ( var i = 0; i < this.tabs.length; i++ ) {
                    if ( this.tabs[i].isLoaded && !this.tabsLoaded[i] ) {
                      this.updateCarousel();
                      this.tabsLoaded[i] = "1";
                    }
                }
            }
        }
    }
    dropdown2Changed($event) {
        this.selectedSubTab = $event;
        //this.tabSelectedListener.emit(this.selectedSubTab);
        let matchingTabs = this.tabs.filter(value => value.tabTitle === this.selectedTabTitle);

        if ( matchingTabs.length > 0 && matchingTabs[0] !== undefined ) {
            let selectedTab = matchingTabs[0];
            this.tabSelectedListener.next([selectedTab, $event]);
            this.updateCarousel();
        }
    }
    dropdownChanged($event) {
        this.selectedSeasonId = $event;
        let matchingTabs = this.tabs.filter(value => value.tabTitle === this.selectedTabTitle);
        if ( matchingTabs.length > 0 && matchingTabs[0] !== undefined ) {
            let selectedTab = matchingTabs[0];
            this.tabSelectedListener.next([selectedTab, $event]);
            this.updateCarousel();
        }
        //this.initialSeasonId=new Date().getFullYear().toString();
    }

    getSelectedTab(): StatsTableTabData<any> {
        var matchingTabs = this.tabs.filter(value => value.tabTitle === this.selectedTabTitle);
        if ( matchingTabs.length > 0 && matchingTabs[0] !== undefined ) {
            return matchingTabs[0];
        }
        else {
            return null;
        }
    }

    tabSelected(newTitle) {
        this.initialSeasonId= new Date().getFullYear().toString();
        this.selectedTabTitle = newTitle;
        this.isSpecialTeam = newTitle == "Special Teams" ? true : false;
        this.noDataMessage = "Sorry, there are no " + newTitle + " stats available.";


        if (this.selectedSeasonId != this.initialSeasonId) {
            this.selectedSeasonId=this.initialSeasonId;
            //this.initialSeasonId=this.selectedSeasonId;
        }
        this.tabSelectedListener.next([this.getSelectedTab(), this.initialSeasonId]);
        this.updateCarousel();
        //console.log(this.initialSeasonId,"initial seasonID")
        //this.initialSeasonId=new Date().getFullYear().toString();

    }

    indexNum($event) {
        let selectedIndex = Number($event);
        let matchingTabs = this.tabs.filter(value => value.tabTitle === this.selectedTabTitle);
        if ( matchingTabs.length > 0 && matchingTabs[0] !== undefined ) {
            let selectedTab = matchingTabs[0];
            if ( selectedTab.tableData ) {
                selectedTab.tableData.setRowSelected(selectedIndex);
            }
        }
    }

    updateCarousel(sortedRows?) {
        var selectedTab = this.getSelectedTab();
        if ( !selectedTab.tableData ) {
            this.isCarousel=false;
            return;
        }else {

            let carouselData: Array<SliderCarouselInput> = [];
            let index = 0;
            let selectedIndex = -1;
            this.rowCount = selectedTab.tableData.rows.length;
            this.rowCount < 10 ? this.isLessThanTen = true : this.isLessThanTen = false;

            selectedTab.tableData.rows.map((value) => {
                let item = selectedTab.convertToCarouselItem(value, index, this.tabName);

                if (selectedTab.tableData.isRowSelected(value, index)) {
                    selectedIndex = index;
                }
                index++;
                return item;
            })
                .forEach(value => {
                    carouselData.push(value);
                });

            this.selectedIndex = selectedIndex < 0 ? 0 : selectedIndex;
            this.carouselData = carouselData;
            this.isCarousel=true;
        }
    }

    getGlossary(tabName){
    return {
        Passing:[
                {key: "ATT", value: "Passing Attempts"},
                {key: "COMP", value: "Completions"},
                {key: "YDS", value: "Passing Yards"},
                {key: "AVG", value: "Yards Per Pass Attempt"},
                {key: "TD", value: "Passing Touchdowns"},
                {key: "INT", value: "Interceptions"},
                {key: "RATE", value: "Passer Rating"}
            ],

        Rushing:[
                {key: "ATT", value: "Rushing Attempts"},
                {key: "YDS", value: "Yards Per Rush Attempt"},
                {key: "AVG", value: "Average Yards Per Rush Attempt"},
                {key: "TD", value: "Rushing Touchdowns"},
                {key: "YDS/G", value: "Yards per Game"},
                {key: "FUM", value: "Rushing Fumbles"},
                {key: "1DN", value: "Rushing First Downs"}
            ],

        Receiving:[
                {key: "REC", value: "Receptions"},
                {key: "TAR", value: "Receiving Targets"},
                {key: "YDS", value: "Average Yards Per Reception"},
                {key: "AVG", value: "Average Yards Per Reception"},
                {key: "TD", value: "Receiving Touchdowns"},
                {key: "YDS/G", value: "Receiving Yards Per Game"},
                {key: "1DN", value: "Receiving First Downs"}
            ],

        Defense:[
                {key: "SOLO", value: "Solo Tackles"},
                {key: "AST", value: "Assisted Tackles"},
                {key: "TOT", value: "Total Tackles"},
                {key: "SACK", value: "Sacks"},
                {key: "PD", value: "Passes Defended"},
                {key: "INT", value: "Interceptions"},
                {key: "FF", value: "Forced Fumbles"}
            ],

        Special:[
                {key: "FGM", value: "Field Goals Made"},
                {key: "FGA", value: "Field Goal Attempts"},
                {key: "FG%", value: "Percentage of Field Goals Made"},
                {key: "XPA", value: "Extra Point Attempts"},
                {key: "PNTS", value: "Total Points Scored From Field Goals + Extra Point Kicks"},
                {key: "XP%", value: "Percentage of Extra Points Made"},
                {key: "XPM", value: "Extra Points Made"}
            ],


        Returning:[
                {key: "K.ATT", value: "Kickoff Return Attempts"},
                {key: "K.YDS", value: "Total Kickoff Return Yards"},
                {key: "K.AVG", value: "Kickoff Return Average"},
                {key: "P.ATT", value: "Punt Return Attempts"},
                {key: "P.YDS", value: "Total Punt Return Yards"},
                {key: "P.AVG", value: "Punt Return Average"},
                {key: "TD", value: "Total Kickoff and Punt Return Touchdowns"}
            ],


        Kicking:[
                {key: "FGM", value: "Field Goals Made"},
                {key: "FGA", value: "Field Goal Attempts"},
                {key: "FG%", value: "Percentage of Field Goals Made"},
                {key: "XPA", value: "Extra Point Attempts"},
                {key: "PNTS", value: "Total Points Scored From Field Goals + Extra Point Kicks"},
                {key: "XP%", value: "Percentage of Extra Points Made"},
                {key: "XPM", value: "Extra Points Made"}
            ],


        Punting:[
                {key: "PUNTS", value: "Total Punts"},
                {key: "YDS", value: "Gross Punting Yards"},
                {key: "AVG", value: "Gross Punting Average"},
                {key: "NET", value: "Net Punting Average"},
                {key: "IN20", value: "Punts Inside the 20 Yard Line"},
                {key: "LONG", value: "Longest Punt"},
                {key: "BP", value: "Blocked Punts"}
            ],


    }[tabName];
}


    ngOnInit(){
        this.GlossaryData=this.getGlossary("Passing");
    }
    ngOnChanges(){

        this.GlossaryData=this.getGlossary(this.tabName);

    }

}
