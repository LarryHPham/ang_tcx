import {Component, Input, OnInit, OnChanges} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

//globals
import {GlobalSettings} from "../../../global/global-settings";
import {GlobalFunctions} from '../../../global/global-functions';
import {VerticalGlobalFunctions} from "../../../global/vertical-global-functions";

//libraries
declare var moment:any;
declare var jQuery:any;

@Component({
    selector: 'articles-module',
    templateUrl: './app/fe-core/modules/articles/articles.module.html'
})

export class ArticlesModule implements OnInit {
    @Input() headlineData:Array<any>;
    @Input() isLeague:boolean;
    @Input() headlineError:boolean;
    articleUrl:Array<any>;
    awayData:Array<any>;
    homeData:Array<any>;
    moduleData:Array<any>;
    randomArticles:Array<any>;
    scheduleAwayData:Array<any>;
    scheduleHomeData:Array<any>;
    subImages:Array<any>;
    eventType:string;
    keyword:string;
    mainContent:string;
    mainImage:string;
    mainTitle:string;
    scope:string;
    teamID:string;
    timeStamp:string;
    eventID:number;
    isSmall:boolean = false;
    league:boolean = false;
    public _collegeDivisonFullAbbrv:string = GlobalSettings.getCollegeDivisionFullAbbrv();
    public headerInfo = {
        moduleTitle: "",
        hasIcon: false,
        iconClass: ""
    };
    public mainHeadlineId:number;
    public params;

    constructor(private _activateRoute:ActivatedRoute) {
        this.params = this._activateRoute.params.subscribe(
            (param:any)=> {
                this.scope = param['scope'];
                this.teamID = param['teamID'] ? param['teamID'] : null;
            }
        );
    }

    getArticles(data) {
        //Checks to see if data.featuredReport object has properties, previously featuredReport was an array
        this.headlineError = false;
        let objNotEmpty:boolean;
        try {
            for (var prop in data.featuredReport) {
                objNotEmpty = true;
            }
            if (!this.isLeague && data != null && data.featuredReport != null && objNotEmpty == true) {
                this.eventID = data.event;
                this.scheduleHomeData = data.home;
                this.scheduleAwayData = data.away;
                this.moduleData = data;
                this.getHeaderData(data);
                this.getSchedule(this.scheduleHomeData, this.scheduleAwayData);
                this.getMainArticle(data);
                this.getSubArticles(data, this.eventID);
            } else if (this.isLeague) {
                this.getHeaderData(data);
                this.getMainArticle(data);
                this.getSubArticles(data, this.eventID);
            }
            else {
                this.headlineError = true;
                console.log('headline error');
            }
        } catch (e) {
            this.headlineError = true;
            console.log('headline error ', e);
        }
    }

    getHeaderData(header) {
        if (!this.isLeague && ArticlesModule.checkData(header)) {
            moment.tz.add('America/New_York|EST EDT|50 40|0101|1Lz50 1zb0 Op0');
            this.timeStamp = GlobalFunctions.sntGlobalDateFormatting(header.timestamp, "defaultDate");
            var dateString = GlobalFunctions.sntGlobalDateFormatting(header.timestamp, "shortDate");
            var isToday = moment(dateString).isSame(moment().tz('America/New_York'), 'day');
            var isPost = moment(dateString).isBefore(moment().tz('America/New_York'), 'day');
            if (isPost) {
                this.headerInfo.moduleTitle = !this.isSmall ? "Post Gameday Matchup Against the " + (this.teamID == header.home.id ? ' ' + header.away.name : ' ' + header.home.name) : "Post Gameday Matchup";
            } else {
                this.headerInfo.moduleTitle = !this.isSmall ? (isToday ? "Today's" : moment(header.timestamp).format("dddd") + "'s") + " Gameday Matchup Against the " + (this.teamID == header.home.id ? ' ' + header.away.name : ' ' + header.home.name) :
                (isToday ? "Today's" : moment(header.timestamp).format("dddd") + "'s" + " Gameday") + " Matchup";
            }
        } else {
            this.headerInfo.moduleTitle = "Headlines<span class='mod-info'> - " + (this.scope.toLowerCase() != 'nfl' ? this._collegeDivisonFullAbbrv : 'NFL') + "</span>";
        }
    } //getHeaderData(header)

    static setImageLogo(data, isHome):any {
        if (isHome) {
            return {
                imageClass: "image-66",
                mainImage: {
                    imageUrl: GlobalSettings.getImageUrl(data),
                    imageClass: "border-logo"
                }
            }
        } else {
            return {
                imageClass: "image-66",
                mainImage: {
                    imageUrl: GlobalSettings.getImageUrl(data[0]),
                    urlRouteArray: data[1],
                    hoverText: "<i class='fa fa-mail-forward'></i>",
                    imageClass: "border-logo"
                }
            }
        }
    }

    getSchedule(homeData, awayData) {
        this.homeData = [];
        this.awayData = [];
        var val = [];
        val['homeID'] = homeData.id;
        val['homeName'] = homeData.name;
        val['homeLocation'] = homeData.location;
        val['homeHex'] = homeData.hex;
        if (this.teamID == homeData.id) {
            val['homeLogo'] = ArticlesModule.setImageLogo(homeData.logo, true);
        } else {
            let homeLink = VerticalGlobalFunctions.formatTeamRoute(this.scope, homeData.location + ' ' + homeData.name, homeData.id);
            val['url'] = homeLink;
            val['homeLogo'] = ArticlesModule.setImageLogo([homeData.logo, homeLink], false);
        }
        val['homeWins'] = homeData.wins;
        val['homeLosses'] = homeData.losses;
        this.homeData.push(val);
        val = [];
        val['awayID'] = awayData.id;
        val['awayName'] = awayData.name;
        val['awayLocation'] = awayData.location;
        val['awayHex'] = awayData.hex;
        if (this.teamID == awayData.id) {
            val['awayLogo'] = ArticlesModule.setImageLogo(awayData.logo, true);
        } else {
            let awayLink = VerticalGlobalFunctions.formatTeamRoute(this.scope, awayData.location + ' ' + awayData.name, awayData.id);
            val['url'] = awayLink;
            val['awayLogo'] = ArticlesModule.setImageLogo([awayData.logo, awayLink], false);
        }
        val['awayWins'] = awayData.wins;
        val['awayLosses'] = awayData.losses;
        this.awayData.push(val);
    }

    static setFeatureType(pageIndex) {
        switch (pageIndex) {
            case'pregame-report':
                return 'PREGAME';
            case'postgame-report':
                return 'POSTGAME';
            default:
                return 'LIVE';
        }
    }

    getMainArticle(headlineData) {
        var pageIndex = !this.isLeague ? Object.keys(headlineData['featuredReport'])[0] : "postgame-report";
        this.keyword = !this.isLeague ? ArticlesModule.setFeatureType(pageIndex) : "POSTGAME";
        this.mainTitle = !this.isLeague ? headlineData['featuredReport'][pageIndex][0].title : headlineData['data'][0].title;
        this.eventType = pageIndex;
        var articleContent = !this.isLeague ? headlineData['featuredReport'][pageIndex][0].teaser : headlineData['data'][0].teaser;
        var trimmedArticle = articleContent.substring(0, 1000);
        this.mainContent = trimmedArticle.substr(0, Math.min(trimmedArticle.length, trimmedArticle.lastIndexOf(" ")));
        this.mainImage = VerticalGlobalFunctions.getBackroundImageUrlWithStockFallback(!this.isLeague ?
            headlineData['featuredReport'][pageIndex][0].image_url : headlineData['data'][0].image_url);
        this.articleUrl = VerticalGlobalFunctions.formatArticleRoute(this.scope, pageIndex, !this.isLeague ?
            headlineData['featuredReport'][pageIndex][0].event_id : headlineData['data'][0].event_id);
        this.mainHeadlineId = this.isLeague ? headlineData['data'][0].event_id : null;
    }

    getSubArticles(data, eventID) {
        var articles;
        var articleArr = [];
        var self = this;
        var dataSet = !this.isLeague ? Object.keys(data['otherReports']) : data['data'];
        dataSet.forEach(function (val) {
            if (self.mainHeadlineId != (self.isLeague ? val.event_id : 0)) {
                articles = {
                    title: !self.isLeague ? data['otherReports'][val].title : val.title,
                    eventType: !self.isLeague ? val : "postgame-report",
                    eventID: !self.isLeague ? (val != "player-fantasy" ? eventID : data['otherReports'][val].article_id) : val.event_id,
                    images: VerticalGlobalFunctions.getBackroundImageUrlWithStockFallback(!self.isLeague ? data['otherReports'][val].image_url : val.image_url),
                    articleUrl: VerticalGlobalFunctions.formatArticleRoute(self.scope, !self.isLeague ? val : "postgame-report", !self.isLeague ?
                        (val != "player-fantasy" ? eventID : data['otherReports'][val].article_id) : val.event_id)
                };
                articleArr.push(articles);
            }
        });
        articleArr.sort(function () {
            return 0.5 - Math.random()
        });
        this.randomArticles = articleArr;
    }

    fitText() {
        try {
            var text = !this.isSmall ? jQuery('.main-article-container-content-text') : jQuery('.main-article-container-content-text-small');
            if (text[0].scrollHeight > text[0].clientHeight) {
                var original = text[0].innerHTML.substring(0, 400),
                    index = 0;
                while (index < 500 && text[0].scrollHeight > text[0].clientHeight) {
                    index++;
                    original = original.substring(0, original.lastIndexOf(" "));
                    if (!this.isSmall) {
                        text[0].innerHTML = original + '...<span class="main-article-container-content-read-more">Read More</span>';
                    } else {
                        text[0].innerHTML = original + '...';
                    }
                }
            }
        } catch (e) {
        }
    }

    static checkData(data) {
        return data
    }

    onResize(event) {
        this.isSmall = event.target.innerWidth <= 639;
        this.fitText();
        if (this.moduleData != null) {
            this.getHeaderData(this.moduleData);
        }
    }

    ngOnInit() {
        this.isSmall = window.innerWidth <= 639;
    }

    ngOnChanges() {
        if (ArticlesModule.checkData(this.headlineData)) {
            this.getArticles(this.headlineData);
            this.fitText();
        }
    }
}