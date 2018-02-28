import { Component, OnInit, Input } from '@angular/core';
import { DeepDiveService } from '../../../services/deep-dive.service';
import { ArticleStackData, VideoStackData } from "../../../fe-core/interfaces/deep-dive.data";
import { BoxScoresService } from '../../../services/box-scores.service';
import { GlobalSettings } from "../../../global/global-settings";
import { VerticalGlobalFunctions } from "../../../global/vertical-global-functions";
import {GlobalFunctions} from "../../../global/global-functions";
import { NgClass } from '@angular/common';

declare var moment;
declare var jQuery: any;

@Component({
    selector: 'deep-dive-section-front',
    templateUrl: './app/ui-modules/deep-dive-blocks/deep-dive-section-front/deep-dive-section-front.module.html',
})

export class DeepDiveSectionFront implements OnInit {
    @Input() scope: string;
    @Input() geoLocation: string;
    @Input() category: string;
    @Input() deepDiveType: any;
    loadingShow:boolean;
    articleData: Array<ArticleStackData>;
    articleCallLimit: number = 31;
    callArticleApi: boolean = true;
    callVideoApi: boolean = true;
    blockIndex: number = 0;
    boxScoresData: any;
    boxScoresScroll: boolean = true;
    currentBoxScores: any;
    dateParam: any;
    articlesperPage:any;
    newArray: Array<any> = [];
    videoDataTop: Array<VideoStackData>;
    videoDataBatch: Array<VideoStackData>;
    videoCallLimit: number = 5;
    safeCounter: number = 0;
    searchData: any;
    routeSubscription: any;
    urlScope: any;
    searchBoxScope:string;
    constructor(private _boxScoresService: BoxScoresService, private _deepDiveData: DeepDiveService) { }

    private onScroll(event) {
        var bodyHeight = event.target.documentElement.scrollHeight?event.target.documentElement.scrollHeight:event.target.body.scrollHeight;
        var scrollTop = window.pageYOffset? window.pageYOffset: window.scrollY;
        var footer = document.getElementById('footer');
        var footerHeight=footer?footer.offsetHeight:0;

        if(window.innerHeight + scrollTop >= bodyHeight && this.callArticleApi){
            //fire when scrolled into footer
            this.blockIndex = this.blockIndex + 1;
            this.callModules(this.blockIndex);
        };
    } //onScroll

    callModules(pageNum) {
        //this.getDeepDiveVideo(pageNum);
        //this.getArticleStackData(pageNum);
        this.getSectionFrontContentPerScroll(pageNum);
        if (GlobalSettings.getTCXscope(this.scope).showBoxScores) {
            this.getBoxScores(this.dateParam);
        } else {
            this.dateParam = null;
        }
    }

    ngOnInit() {
        window.scrollTo(0, 0);
        //this.callModules(this.blockIndex);
        this.createSearchBox(this.scope);
        this.getDateParams();

    }

    ngOnChanges(event) {
        if (event.scope != null) {
            if (event.scope.currentValue != event.scope.previousValue) {// if route has changed
                window.scrollTo(0, 0);
                this.scope = event.scope.currentValue;
                this.urlScope = this.scope;
                this.boxScoresData = null;
                this.currentBoxScores = null;
                this.dateParam == null;
                this.getDateParams();
            }
            if (this.dateParam == null) {
                this.getDateParams();
            }
            this.newArray = [];
            this.blockIndex=0;
            this.callArticleApi = true;
            this.callVideoApi = true;
            this.articleData = null;
            this.createSearchBox(this.scope);
            this.callModules(this.blockIndex);
        }
    }

    //API for Box Scores
    private getBoxScores(dateParams?) {
        // if(this.safeCounter < 10){
        if (dateParams != null) {
            this.dateParam = dateParams;
        }
        this._boxScoresService.getBoxScores(this.boxScoresData, this.dateParam.scope, this.dateParam, (boxScoresData, currentBoxScores) => {

            this.boxScoresData = boxScoresData;
            this.currentBoxScores = currentBoxScores;
            // this.safeCounter = 0;
            if (this.currentBoxScores == null && boxScoresData.transformedDate[dateParams.date] == null) {
                if (boxScoresData.previousGameDate != null && boxScoresData.transformedDate[dateParams.date] == null) {
                    this.dateParam.date = this.dateParam.date ? boxScoresData.previousGameDate.event_date : null;
                    this.boxScoresData = null;
                    this.currentBoxScores = null;
                    this.safeCounter++;
                    // this.getBoxScores(this.dateParam);
                } else {
                    this.safeCounter = 0;
                }
                return;
            }
        });
        // }else{
        //   this.dateParam = null;
        //   this.boxScoresData = null;
        //   this.currentBoxScores = null;
        // }
    } //getBoxScores

    ngOnDestroy() {
        this.routeSubscription.unsubscribe();
    }

    navigateSearch(e) {
        this.urlScope= this.urlScope == "sports"? this.searchBoxScope : this.urlScope;
        if (e.key == "Enter") {
            if (e.target.value) {

                var rel_url = VerticalGlobalFunctions.createSearchLink(this.urlScope) + e.target.value;
                var fullSearchUrl = GlobalSettings.getOffsiteLink(this.urlScope, "search", rel_url);
                window.open(fullSearchUrl);
            }
        } else if (e.type == "click") {
            var inputVal = e.target.offsetParent.previousElementSibling.lastChild.value;
            if (inputVal) {
                var rel_url = VerticalGlobalFunctions.createSearchLink(this.urlScope) + inputVal;
                var fullSearchUrl = GlobalSettings.getOffsiteLink(this.urlScope, "search", rel_url);
                window.open(fullSearchUrl);
            }

        }

    }
    changeScope(event) {
        this.urlScope = event;
        var addTopScope=GlobalSettings.getTCXscope(event).topScope;
        this.searchData.searchModTitle = GlobalSettings.getTCXscope(event).searchTitle + " " + GlobalFunctions.toTitleCase(addTopScope);
        this.searchData.searchSubTitle = GlobalSettings.getTCXscope(event).searchSubTitle;
    }
    createSearchBox(scope) {

        this.searchBoxScope = scope=="sports"? "nfl":scope;

        var modSearchTitle;
        let sportsList;
        if (this.category == "sports") {
            var titlescope =GlobalSettings.getTCXscope(this.searchBoxScope).topScope;
            modSearchTitle = GlobalSettings.getTCXscope(this.searchBoxScope).searchTitle + " " + GlobalFunctions.toTitleCase(titlescope);
            sportsList = [
                {
                    key: 'NFL',
                    value: "NFL",
                },
                {
                    key: 'NCAAF',
                    value: "NCAAF",
                },
                {
                    key: 'NBA',
                    value: "NBA",
                },
                {
                    key: 'NCAAM',
                    value: "NCAAM",
                },
                {
                    key: 'MLB',
                    value: "MLB",
                }
            ];
        } else {
            sportsList = null;
            modSearchTitle = GlobalSettings.getTCXscope(this.searchBoxScope).searchTitle;
        }
        this.searchData = {
            category: this.searchBoxScope,
            searchModTitle: modSearchTitle,
            searchSubText: GlobalSettings.getTCXscope(this.searchBoxScope).searchSubTitle,
            searchPlaceHolderText: GlobalSettings.getTCXscope(this.searchBoxScope).placeHolderText,
            searchBackground: GlobalSettings.getTCXscope(this.searchBoxScope).searchBackground,
            searchScopeDropdown: sportsList
        };
    }

    getDateParams() {
        //Box Scores
        var currentUnixDate = new Date().getTime();
        //convert currentDate(users local time) to Unix and push it into boxScoresAPI as YYYY-MM-DD in EST using moment timezone (America/New_York)
        this.dateParam = {
            scope: this.scope,//current profile page
            teamId: '',
            date: moment.tz(currentUnixDate, 'America/New_York').format('YYYY-MM-DD')
        }
    } //getDateParams

    //section front content
    getSectionFrontContentPerScroll(pageNum){
       this.loadingShow=true;
        var currentPageObject = new Object();
        var passPage=pageNum + 1;
        let callLimit = pageNum == 0 ? 13 : this.articleCallLimit;
        if(this.callVideoApi){
            this._deepDiveData.getDeepDiveVideoBatchService(this.scope, this.videoCallLimit, passPage, this.geoLocation).subscribe(
                data => {
                    try{
                        if (data) {
                            if(pageNum!=1){
                                currentPageObject['videoStack'] = this._deepDiveData.transformSportVideoBatchData(data, this.scope);
                                this.callVideoApi = true;
                            } else {
                                currentPageObject['videoStack']=null
                            }

                        } else throw new Error(' No video articles for this category')
                    }catch(e){
                        this.callVideoApi = false;
                        currentPageObject['videoStack']=null;
                    }

                });
        }

        if(this.callArticleApi){
            this.routeSubscription=this._deepDiveData.getDeepDiveBatchService(this.scope, callLimit, passPage)
                .subscribe(data => {
                    try{
                        if (data) {
                           this.loadingShow=true;
                            this.articleData = this._deepDiveData.transformToArticleStack(data, this.category);
                            currentPageObject['stackTop1'] = this.articleData.length && pageNum != 1 ? this.articleData.splice(0, 1) : null;
                            currentPageObject['stackRow1'] = this.articleData.length && pageNum != 1 ? this.articleData.splice(0, 6) : null;
                            currentPageObject['recData1'] =  this.articleData.length > 3 && pageNum != 1 ? this.articleData.length < 6 && pageNum != 1 ? this.articleData.splice(0, 3) : this.articleData.splice(0, 6) : null;
                            currentPageObject['stackTop2'] =  this.articleData.length ? this.articleData.splice(0, 1) : null;
                            currentPageObject['stackRow2'] = this.articleData.length ? this.articleData.splice(0, 6) : null;
                            currentPageObject['stackTop3'] =  this.articleData.length ? this.articleData.splice(0, 1) : null;
                            currentPageObject['stackRow3'] =  this.articleData.length ? this.articleData.splice(0, 4) : null;
                            currentPageObject['recData2'] = this.articleData.length > 3 ? this.articleData.length >= 3 && this.articleData.length < 6 ? this.articleData.splice(0, 3) : this.articleData.splice(0, 6):null;
                            this.newArray.push(currentPageObject);
                            if(data.length < callLimit){
                                this.callArticleApi = false;
                                this.loadingShow=false;
                            }
                        }else throw new Error('Article stack have no articles');
                    }catch(e){
                        this.loadingShow=false;
                        this.callArticleApi = false;
                        console.log(e.message);
                    }

                });
        }

    }
}
