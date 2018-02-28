
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/map';

// Globals
import { GlobalFunctions } from '../global/global-functions';
import {VerticalGlobalFunctions} from '../global/vertical-global-functions';
import {GlobalSettings} from '../global/global-settings';

import { CircleImageData } from "../fe-core/components/images/image-data";

declare var moment;

export interface boxScoresInterface {
  currentScope: string; //league
  aiContent?: any;
  previousGameDate: {
    event_date: string;
  };
  nextGameDate: {
    event_date: string;
  };
  data: Array<Object>
} // end boxscores interface

export interface gameDayInfoInterface {
  // GAME
  eventId: number;
  eventDate: string; // date of event
  eventStartTime: number; // event start time
  eventStatus: string; // pregame | live | postgame | delayed
  liveStatus?: string;
  segmentType: string; // innings | quarter | halves | periods
  leagueAbbreviation: string;
  lastUpdated?: string; //
  // TEAMS
  dataPoint1Label: string; // data point 1 label - [DP2]
  dataPoint2Label: string; // data point 2 label - [DP3]
  dataPoint3Label: string; // data point 3 label - [DP4]
  //HOME TEAM
  idHome: string; // home team id
  fullNameHome: string; // home team full name
  firstNameHome: string; // home team market
  lastNameHome: string; // home team name without market - [Home Team]
  abbreviationHome: string; // home team name abbreviated
  nicknameHome: string; // home team nickname
  logoUrlHome: string; // home team profile image - [image placeholder]
  winsHome: string; // home team record - [Home Record]
  lossHome: string; // home team record - [Home Record]
  tiesHome: string; // home team record - [Home Record]
  dataPoint1Home: string; // data point 1 value for team 1 - [DV2]
  dataPoint2Home: string; // data point 2 value for team 1 - [DV3]
  dataPoint3Home: string; // data point 3 value for team 1 - [DP4]
  //AWAY TEAM
  idAway: string; // away team id
  fullNameAway: string; // away team full name
  firstNameAway: string; // away team market
  lastNameAway: string; // away team name without market - [Away Team]
  abbreviationAway: string; // away team name abbreviated
  nicknameAway: string; // away team nickname
  logoUrlAway: string; // away team profile image - [image placeholder]
  winsAway: string; // home team record - [Home Record]
  lossAway: string; // home team record - [Home Record]
  tiesAway: string; // home team record - [Home Record]
  dataPoint1Away: string; // data point 1 value for team 2 - [DV2]
  dataPoint2Away: string; // data point 2 value for team 2 - [DV3]
  dataPoint3Away: string; // data point 3 value for team 2 - [DV4]
  aiContent: any;
  // LIVE DATA
  liveDataPoints: { // - [Vert Content]
    nfl: {
      liveSegmentNumber: number; // [Current Period]
      timeLeft: string; // [Time Left]
      teamInPossesion: any;
      liveYardLine: string; // needs to return what yard line and on which team's half (TN - 50)
      overTime: boolean; // if live game is in overtime
    },
    ncaaf: {
      liveSegmentNumber: number; // [Current Period]
      timeLeft: string; // [Time Left]
      teamInPossesion: string;
      liveYardLine: string; // needs to return what yard line and which team's yard line (TN - 50)
      overTime: boolean; // if live game is in overtime
    },
    mlb: {
      liveSegmentNumber: number;
      liveSegmentPosition: string; // top or bottom
      liveCount: string; // live balls and strikes
      baseCount: string; // which bases currently container runners (1, 12, 13, 123, 2, 23, 3) - RETURN 3 BOOLEAN DATA POINTS
      outs: string; // live number of outs in inning
    },
    ncaab: {
      liveSegmentNumber: number; // [Current Period]
      timeLeft: string; // [Time Left]
      teamInPossesion: string;
      overTime: boolean; // if live game is in overtime
    },
    nba: {
      liveSegmentNumber: number; // [Current Period]
      timeLeft: string; // [Time Left]
      teamInPossesion: string;
      overTime: boolean; // if live game is in overtime
    }
  }
} //export interface gameDayInfo

@Injectable()
export class BoxScoresService {

  private _apiUrl: string;//prob wont be used since each sport is so different
  private firstBoxScoresRun: boolean = true;

  constructor(public http: Http){}

  //Function to set custom headers
  setToken(){
    var headers = new Headers();
    //headers.append(this.headerName, this.apiToken);
    return headers;
  }

  // call to get data
  getBoxScoresService(scope, date, teamId?) {
    var headers = this.setToken();
    let chosenDate = date;
    var callURL;
    switch(scope){
      case 'ncaam':
        callURL = GlobalSettings.getTCXscope(scope).verticalApi +'/NBAHoops/call_controller.php?scope=ncaa&action=tcx&option=tcx_box_scores&date='+date;
      break;
      case 'nba':
        callURL = GlobalSettings.getTCXscope(scope).verticalApi +'/NBAHoops/call_controller.php?scope=' + scope + '&action=tcx&option=tcx_box_scores&date='+date;
      break;
      case 'mlb':
        callURL = GlobalSettings.getTCXscope(scope).verticalApi + '/tcx/' + scope + '/boxScores/' + date + '/addAi';
      break;
      case 'nfl':
        callURL = GlobalSettings.getTCXscope(scope).verticalApi +'/tcx/boxScores/league/'+scope+'/'+date+'/addAi';
      break;
      case 'ncaaf':
        callURL = GlobalSettings.getTCXscope(scope).verticalApi +'/tcx/boxScores/league/fbs/'+date+'/addAi';
      break;
      default:
      callURL = GlobalSettings.getTCXscope(scope).verticalApi +'/tcx/boxScores/league/'+scope+'/'+date+'/addAi';
      break;
    }
    var currentBoxScoresUrl;
    return this.http.get(callURL, {headers: headers})
      .map(res =>{
        currentBoxScoresUrl = res.url;
        return res.json()
      } )
      .map(data => {
        try{
          if(data){
            var transformedDate = this.transformBoxScores(data.data, scope);
            return {
              transformedDate: transformedDate.data,
              aiContent: data.data.aiContent,
              date: chosenDate,
              nextGameDate:transformedDate.nextGameDate,
              previousGameDate:transformedDate.previousGameDate
            }
          } else throw new Error("Failed API call at getBoxScoresService method : " + currentBoxScoresUrl );
        }catch(e){
            console.debug(e.message);
        }

      })
        .catch((error:any) => {
          return Observable.throw(new Error(error.status));
        })
  } //getBoxScoresService



  // form box scores data
  transformBoxScores(data, scope?) {
    var boxScoreObj = {};
    var newBoxScores = {};
    let currWeekGameDates = {};

    if( data != null ) {
      let boxScoresData = data.data;
      for ( var gameDate in boxScoresData ) {
        let gameDayInfo:gameDayInfoInterface = data.data[gameDate];
        let currGameDate = moment(Number(gameDate)).tz('America/New_York').format('YYYY-MM-DD');

        // game info
        if (gameDayInfo) {
          gameDayInfo['gameInfo'] = {
            eventId: gameDayInfo.eventId,
            timeLeft: gameDayInfo.liveDataPoints[scope] != null ? gameDayInfo.liveDataPoints[scope].timeLeft : null,
            live: gameDayInfo.liveStatus == 'Y'?true:false,
            startDateTime: gameDayInfo.eventDate,
            startDateTimestamp: gameDayInfo.eventStartTime,
            dataPointCategories:[
              gameDayInfo.dataPoint3Label,
              gameDayInfo.dataPoint2Label,
              gameDayInfo.dataPoint1Label
            ]
          }

          // home team info
          gameDayInfo['homeTeamInfo'] = {
            name: gameDayInfo.fullNameHome,
            id: gameDayInfo.idHome,
            firstName: gameDayInfo.firstNameHome,
            lastName: gameDayInfo.nicknameHome,
            abbreviation: gameDayInfo.abbreviationHome,
            logo: gameDayInfo.logoUrlHome,
            dataPoint1Home: gameDayInfo.dataPoint1Home,
            dataPoint2Home: gameDayInfo.dataPoint2Home,
            dataPoint3Home: gameDayInfo.dataPoint3Home,
            //dataP2:boxScoresData[gameDate].team1Possession != ''? boxScoresData[gameDate].team1Possession:null,
            wins: gameDayInfo.winsHome ? gameDayInfo.winsHome : null,
            losses: gameDayInfo.lossHome ? gameDayInfo.lossHome : null,
            ties: gameDayInfo.tiesHome ? gameDayInfo.tiesHome : null
          }

          // away team info
          gameDayInfo['awayTeamInfo'] = {
            name: gameDayInfo.fullNameAway,
            id: gameDayInfo.idAway,
            firstName: gameDayInfo.firstNameAway,
            lastName: gameDayInfo.nicknameAway,
            abbreviation: gameDayInfo.abbreviationAway,
            logo: gameDayInfo.logoUrlAway,
            dataPoint1Away: gameDayInfo.dataPoint1Away,
            dataPoint2Away: gameDayInfo.dataPoint2Away,
            dataPoint3Away: gameDayInfo.dataPoint3Away,
            //dataP2:boxScoresData[gameDate].team1Possession != ''? boxScoresData[gameDate].team1Possession:null,
            wins: gameDayInfo.winsAway ? gameDayInfo.winsAway : null,
            losses: gameDayInfo.lossAway ? gameDayInfo.lossAway : null,
            ties: gameDayInfo.tiesAway ? gameDayInfo.tiesAway : null
          }

          // LIVE DATA THAT NEEDS TO ADJUST BASED ON SPORT
          if(gameDayInfo.liveDataPoints[scope] != null){
            gameDayInfo['gameInfo']['verticalContent'] = {
              teamInPossesion:  "Possession: " + gameDayInfo.liveDataPoints[scope].teamInPossesion,
              liveSegmentNumber: gameDayInfo.liveDataPoints[scope].liveSegmentNumber,
              timeLeft: gameDayInfo.liveDataPoints[scope].timeLeft,
              liveYardLine: gameDayInfo.liveDataPoints[scope].liveYardLine,
              overTime: gameDayInfo.liveDataPoints[scope].liveYardLine
            }
          } else{
            gameDayInfo['gameInfo']['verticalContent'] = null
          }

          // organize games by date and put them into newVPWP' P PBoxScores
          if(typeof newBoxScores[currGameDate] == 'undefined'){
            newBoxScores[currGameDate] = [];
            newBoxScores[currGameDate].push(gameDayInfo);
          } else{
            newBoxScores[currGameDate].push(gameDayInfo);
          }
        } //if (boxScoresData[gameDate])
      } // END for ( var gameDate in data.data )
    } //if( data != null )

    var transformedData = {
      currentScope: scope,
      previousGameDate: data.previousGameDate,
      nextGameDate: data.nextGameDate,
      data: newBoxScores
    }
    return transformedData;
  }

  // function for BoxScoresService to grab the transformed dated and be used on profile pages
  getBoxScores(boxScoresData, profileName: string, dateParam, callback: Function) {
    let scopedDateParam = dateParam;
    if(boxScoresData == null) {
      boxScoresData = {};
      boxScoresData['transformedDate'] = {};
    }

    if ( boxScoresData == null || boxScoresData.transformedDate[scopedDateParam.date] == null ) {
      this.getBoxScoresService(scopedDateParam.scope, scopedDateParam.date)
        .subscribe(data => {
          if(data.transformedDate[data.date] != null && data.transformedDate[data.date][0] != null) {
            let currentBoxScores = {
              moduleTitle: this.moduleHeader(data.date, profileName),
              gameDate: data.date,
              gameInfo: this.formatGameInfo(data.transformedDate[data.date],scopedDateParam.scope, scopedDateParam.profile),
              // schedule: data.transformedDate[data.date] != null ? this.formatSchedule(data.transformedDate[data.date][0], scopedDateParam.scope, scopedDateParam.profile) : null, //UNUSED IN TCX
              aiContent: data.aiContent != null ? this.aiHeadLine(data.aiContent, scopedDateParam.scope) : null, //TODO
              nextGameDate:data.nextGameDate,
              previousGameDate:data.previousGameDate
            };

            currentBoxScores = currentBoxScores.gameInfo != null ? currentBoxScores :null;
            callback(data, currentBoxScores);
          } else {//if initial day fails then recall data
            let currentBoxScores = null;
            callback(data, currentBoxScores);
          }
        }) //subscribe
    }
    else {
      if( boxScoresData.transformedDate[dateParam.date] != null ){
        let currentBoxScores = {
          moduleTitle: this.moduleHeader(dateParam.date, profileName),
          gameDate: dateParam.date,
          gameInfo: this.formatGameInfo(boxScoresData.transformedDate[dateParam.date],dateParam.scope, dateParam.profile),
          // schedule: dateParam.profile != 'league' && boxScoresData.transformedDate[dateParam.date] != null? this.formatSchedule(boxScoresData.transformedDate[dateParam.date][0], dateParam.teamId, dateParam.profile) : null, //UNUSED IN TCX
          aiContent: boxScoresData.aiContent != null ? this.aiHeadLine(boxScoresData.aiContent, scopedDateParam.scope) : null, //TODO
          nextGameDate: boxScoresData.nextGameDate,
          previousGameDate: boxScoresData.previousGameDate
        };

        currentBoxScores = currentBoxScores.gameInfo != null ? currentBoxScores :null;
        callback(boxScoresData, currentBoxScores);
      }
    }
  } // END getBoxScores

  // modifies data to get header data for modules
  aiHeadLine(data, scope?) {
    var boxArray = [];
    // new
    if (data[0] != null && data[0].featuredReport) {
      data.forEach(function(val, index) {
        let aiContent = val.featuredReport['article']['data'];
        for(var p in aiContent) {
          var eventType = p ? p : null;
          var eventContent = aiContent[p] ? aiContent[p] : null;
          var eventId = eventContent.event_id ? eventContent.event_id : null;
          var title = eventContent.title ? eventContent.title : null;
          var teaser = eventContent.teaser ? eventContent.teaser : null;
          var date = eventContent.publication_date || eventContent.last_updated ? moment.unix(eventContent.publication_date, 'YYYY-MM-DD').format('MMMM D, YYYY') : moment.unix(eventContent.last_updated, 'YYYY-MM-DD').format('MMMM D, YYYY');
          var homeImage = eventContent.image_url != null ?
                          GlobalSettings.getImageUrl(aiContent[p].image_url, GlobalSettings._imgFullScreen) :
                          VerticalGlobalFunctions.getBackroundImageUrlWithStockFallback(null);
        } //for(var p in aiContent)
        if ( p ) {
          let urlRoute = VerticalGlobalFunctions.formatExternalArticleRoute(scope, p, val.event);
          urlRoute = GlobalSettings.getOffsiteLink(scope, "article", urlRoute);

          var Box = {
            eventType: eventType,
            eventId: p,
            keyword: p.replace('-', ' '),
            date: date,
            url: VerticalGlobalFunctions.formatAiArticleRoute(p, val.event),
            title: title,
            teaser: teaser,
            urlRouteArray: urlRoute,
            imageConfig:{
              imageClass: "image-320x180-sm",
              imageUrl: homeImage,
              hoverText: "View Article",
              urlRouteArray: urlRoute
            }
          }
          boxArray.push(Box);
        } //if ( p )
      }); //data.forEach
      return boxArray;
    }

    // older box scores article (THIS CAN BE REMOVED ONCE THE MLB ARTICLES ARE UPDATED)
    // else if ( data[0] != null && data[0].featuredReport ) {
    //   data.forEach(function(val, index) {
    //     var eventId = val.event ? val.event : null;
    //     var aiContent = val.featuredReport ? val.featuredReport : null;
    //     var homeImage = val.home.images[0] != null ?
    //                     val.home.images[0] :
    //                     VerticalGlobalFunctions.getBackroundImageUrlWithStockFallback(null);
    //     var awayImage = val.away.images[0] != null ?
    //                     val.away.images[0] :
    //                     VerticalGlobalFunctions.getBackroundImageUrlWithStockFallback(null);
    //     for ( var p in aiContent ) {
    //       var eventType = p ? p : null;
    //       var eventContent = aiContent[p] ? aiContent[p] : null;
    //       var title = eventContent.displayHeadline ? eventContent.displayHeadline : null;
    //       var teaser = eventContent.displayHeadline ? eventContent.displayHeadline : null;
    //       var date = eventContent.last_updated ?
    //                  moment(eventContent.last_updated, 'YYYY-MM-DD').format('MMMM D, YYYY') :
    //                  null; //no event date returned in this structure
    //     }
    //     if ( p ) {
    //       let urlRoute = VerticalGlobalFunctions.formatExternalArticleRoute(scope, p, val.event);
    //       urlRoute = GlobalSettings.getOffsiteLink(scope, "article", urlRoute);
    //
    //       var Box = {
    //         eventType: eventType,
    //         eventId: p,
    //         keyword: p.replace('-', ' '),
    //         date: date,
    //         url: VerticalGlobalFunctions.formatAiArticleRoute(p, val.event),
    //         title: title,
    //         teaser: teaser,
    //         urlRouteArray: urlRoute,
    //         imageConfig:{
    //           imageClass: "image-320x180-sm",
    //           imageUrl: index == 0 ? homeImage : awayImage,
    //           hoverText: "View Article",
    //           urlRouteArray: urlRoute
    //         }
    //       }
    //       boxArray.push(Box);
    //     } //if ( p )
    //   }); //data.forEach
    //   return boxArray;
    // }
    else {
      return null;
    } //if
  } //aiHeadLine

  // get data for mod header
  moduleHeader(date, scope?){
    var moduleTitle;
    var month = moment(date,"YYYY-MM-DD").tz('America/New_York').format("MMMM");
    var day = moment(date,"YYYY-MM-DD").tz('America/New_York').format("D");
    var ordinal = moment(date,"YYYY-MM-DD").tz('America/New_York').format("D");
    ordinal = '<sup>' + GlobalFunctions.Suffix(ordinal) + '</sup>';
    var year = moment(date,"YYYY-MM-DD").tz('America/New_York').format("YYYY");
    var convertedDate = month + ' ' + day + ordinal + ', ' + year;

    moduleTitle = "Box Scores <span class='mod-info'> - " + scope.toUpperCase() + ' : ' +convertedDate + '</span>';
    return {
      moduleTitle: moduleTitle,
      hasIcon: false,
      iconClass: '',
    };
  } // moduleHeader

  // get data for the week carousel
  weekCarousel(scope, date, teamId?) {
    //Configure HTTP Headers
    var headers = this.setToken();
    var callURL;
    switch(scope){
      case 'ncaam':
        callURL = GlobalSettings.getTCXscope(scope).verticalApi +'/NBAHoops/call_controller.php?scope=ncaa&action=tcx&option=tcx_game_dates_weekly&date='+date;
      break;
      case 'nba':
        callURL = GlobalSettings.getTCXscope(scope).verticalApi +'/NBAHoops/call_controller.php?scope='+scope+'&action=tcx&option=tcx_game_dates_weekly&date='+date;
      break;
      case 'nfl':
        callURL = GlobalSettings.getTCXscope(scope).verticalApi + '/league/gameDatesWeekly/'+scope+'/'+date; //TODO when TCX API is sestup
      break;
      case 'ncaaf':
        callURL = GlobalSettings.getTCXscope(scope).verticalApi + '/league/gameDatesWeekly/fbs/'+date; //TODO when TCX API is sestup
      break;
      case 'mlb':
        callURL = GlobalSettings.getTCXscope(scope).verticalApi + '/league/gameDatesWeekly/'+date; //TODO when TCX API is sestup
      break;
      default:
      callURL = GlobalSettings.getTCXscope(scope).verticalApi + '/league/gameDatesWeekly/'+scope+'/'+date; //TODO when TCX API is sestup
      break;
    }
    var currentWeekUrl;
    return this.http.get(callURL, {headers: headers})
      .map(res => {
        currentWeekUrl = res.url
        return res.json()
      })
      .map(data => {
        try{
          if(data){
            return data;
          } else throw new Error("Failed API call at weekCarousel method : " + currentWeekUrl );
        }catch(e){
          console.debug(e.message);
        }


      })
        .catch((error:any) => {
          return Observable.throw(new Error(error.status));
        })

  }

  // get data for monthly calendar dropdown
  validateMonth(scope, date, teamId?) {
    //Configure HTTP Headers
    var headers = this.setToken();

    var callURL;
    switch(scope){
      case 'ncaam':
        callURL = GlobalSettings.getTCXscope(scope).verticalApi +'/NBAHoops/call_controller.php?scope=ncaa&action=tcx&option=tcx_game_dates_monthly&date='+date;
      break;
      case 'nba':
        callURL = GlobalSettings.getTCXscope(scope).verticalApi +'/NBAHoops/call_controller.php?scope='+scope+'&action=tcx&option=tcx_game_dates_monthly&date='+date;
      break;
      case 'nfl':
        callURL = GlobalSettings.getTCXscope(scope).verticalApi + '/league/gameDates/'+scope+'/'+date; //TODO when TCX API is sestup
      break;
      case 'ncaaf':
        callURL = GlobalSettings.getTCXscope(scope).verticalApi + '/league/gameDates/fbs/'+date; //TODO when TCX API is sestup
      break;
      case 'mlb':
        callURL = GlobalSettings.getTCXscope(scope).verticalApi + '/league/gameDates/'+date; //TODO when TCX API is sestup
      break;
      default:
        callURL = GlobalSettings.getTCXscope(scope).verticalApi + '/league/gameDates/'+scope+'/'+date; //TODO when TCX API is sestup
      break;
    }
    var currentMonthUrl;
    return this.http.get(callURL, {headers: headers})
        .map(res => {
          currentMonthUrl = res.url;
          return res.json()
        })
        .map(data => {
          try{
            if(data){
              return data;
            } else throw new Error("Failed API call at weekCarousel method : " + currentMonthUrl);
          }catch(e){
            console.debug(e.message);
          }


        })
        .catch((error:any) => {
          return Observable.throw(new Error(error.status));
        })

  }

  // Format the date for each gameBox
  formatGameInfo(game, scope?, profile?) {
    var gameArray: Array<any> = [];
    let self = this;
    var twoBoxes = [];// used to put two games into boxes

    // Sort games by time
    let sortedGames = game.sort(function(a, b) {
      return Number(a.gameInfo.startDateTimestamp) - Number(b.gameInfo.startDateTimestamp);
    });
    sortedGames.forEach(function(data,i){
      //var info:GameInfoInput; //TODO
      var info;
      let awayData = data.awayTeamInfo;
      let homeData = data.homeTeamInfo;
      let gameInfo = data.gameInfo;
      let isPartner = GlobalSettings.getHomeInfo().isPartner;
      if(homeData.lastName != null){
        homeData.lastName = homeData.name.split(' ')[homeData.name.split(' ').length-1];
      }
      if(awayData.lastName != null){
        awayData.lastName = awayData.name.split(' ')[awayData.name.split(' ').length-1];
      }

         var homeLink =  self.formatTeamRelLinks(scope, data.fullNameHome, homeData.id, isPartner);
         var awayLink = self.formatTeamRelLinks(scope, data.fullNameAway, awayData.id, isPartner);
      var aiContent = data.aiContent != null ? self.formatArticle(data):null; //TODO
      if(scope == 'ncaam' || scope == 'nba'){
        var link1 = self.imageData('image-45', 'border-1', GlobalSettings.getSportsImageUrl('/'+homeData.logo, GlobalSettings._imgSmLogo), homeLink); //TODO
        var link2 = self.imageData('image-45', 'border-1', GlobalSettings.getSportsImageUrl('/'+awayData.logo, GlobalSettings._imgSmLogo), awayLink); //TODO
      }else{
        if(scope == 'mlb'){
          var link1 = self.imageData('image-45', 'border-1', GlobalSettings.getSportsImageUrl(homeData.logo, GlobalSettings._imgSmLogo), homeLink); //TODO
          var link2 = self.imageData('image-45', 'border-1', GlobalSettings.getSportsImageUrl(awayData.logo, GlobalSettings._imgSmLogo), awayLink); //TODO
        }else{
          var link1 = self.imageData('image-45', 'border-1', GlobalSettings.getImageUrl(homeData.logo, GlobalSettings._imgSmLogo), homeLink); //TODO
          var link2 = self.imageData('image-45', 'border-1', GlobalSettings.getImageUrl(awayData.logo, GlobalSettings._imgSmLogo), awayLink); //TODO
        }
      }

      let gameDate = data.gameInfo;
      let homeWins = homeData.wins != null ? homeData.wins : '#';
      let homeLosses = homeData.losses != null ? homeData.losses : '#';
      let homeTies = homeData.ties != null ? homeData.ties : '#';
      let homeRecord = homeData.ties != null ? homeWins+'-'+homeLosses+'-'+homeTies : homeWins+'-'+homeLosses;

      let awayWins = awayData.wins != null ? awayData.wins : '#';
      let awayLosses = awayData.losses != null ? awayData.losses : '#';
      let awayTies = awayData.ties != null ? awayData.ties : '#';
      let awayRecord = awayData.ties != null ? awayWins+'-'+awayLosses+'-'+awayTies : awayWins+'-'+awayLosses;

      //determine if a game is live or not and display correct game time
      var currentTime = new Date().getTime();
      var segmentTitle = '';
      var liveStatus;
      var liveStat1;
      var liveStat2;
      var liveStat3;
      var liveStat4;
      // live stats display above game info in box scores
      var verticalContentLive;
      if(gameInfo.live){
        verticalContentLive = gameInfo.verticalContent;
        liveStatus = true,
        liveStat1 = gameInfo.verticalContent.liveSegmentNumber != null ? "Quarter: " + gameInfo.verticalContent.liveSegmentNumber : null;
        liveStat2 = gameInfo.verticalContent.timeLeft != null ? "Time Left: " + gameInfo.verticalContent.timeLeft : null;
        liveStat3 = gameInfo.verticalContent.teamInPossesion != null ? gameInfo.verticalContent.teamInPossesion : null,
        liveStat4 = gameInfo.verticalContent.liveYardLine != null ? "@ " + gameInfo.verticalContent.liveYardLine : "@ " + gameInfo.verticalContent.liveYardLine, //TODO
        segmentTitle = gameInfo.segmentsPlayed != null ? gameInfo.segmentsPlayed +  GlobalFunctions.Suffix(gameInfo.segmentsPlayed) + " Quarter: " + "<span class='gameTime'>"+gameInfo.timeLeft+"</span>" : '';
      }
      else{
        verticalContentLive = "";
        liveStatus = false;
        if((currentTime < gameInfo.startDateTimestamp) && gameInfo.live == false){
          segmentTitle = moment(gameDate.startDateTimestamp).tz('America/New_York').format('h:mm A z');
        }else{
          segmentTitle = 'Final';
        }
      }

      info = {
        gameHappened:gameInfo.segmentsPlayed != null ?  true : false,
        //segment will display the segment the game is on otherwise if returning null then display the date Time the game is going to be played
        segment: segmentTitle,
        liveStatus: liveStatus,
        liveStat1: liveStat1,
        liveStat2: liveStat2,
        liveStat3: liveStat3,
        liveStat4: liveStat4,


        dataPointCategories:gameInfo.dataPointCategories,
        verticalContent:verticalContentLive,
        homeData:{
          homeTeamName: homeData.lastName,
          homeImageConfig:link1,
          homeLink: null,
          homeExternalURL: homeLink,
          homeRecord: homeRecord,
          dataPoint1:homeData.dataPoint1Home,
          dataPoint2:homeData.dataPoint2Home,
          dataPoint3:homeData.dataPoint3Home
        },
        awayData:{
          awayTeamName:awayData.lastName,
          awayImageConfig:link2,
          awayLink: null,
          awayExternalURL: awayLink,
          awayRecord: awayRecord,
          dataPoint1:awayData.dataPoint1Away,
          dataPoint2:awayData.dataPoint2Away,
          dataPoint3:awayData.dataPoint3Away
        }
      };  //info

      // push info into twoBoxes array for display
      twoBoxes.push({game:info});
      if(twoBoxes.length > 1 || (i+1) == game.length){// will push into main array once 2 pieces of info has been put into twoBoxes variable
        gameArray.push(twoBoxes);
        twoBoxes = [];
      }
      //incase it runs through entire loops and only 2 or less returns then push whatever is left
      if(game.length == (i+1)  && gameArray.length == 0){
        gameArray.push(twoBoxes);
      }
    })
    return gameArray;
  }

  formatSchedule(data, scope?, profile?) {}// so far unused on TCX

  formatArticle(data){}// so far unused on TCX

  formatScoreBoard(data){}// so far unused on TCX

  formatTeamRelLinks(scope, teamName, id, isPartner:boolean){
    teamName = teamName ? teamName.toLowerCase() : null;
    var relPath = {
      'nfl':{
        'vertical_link': teamName ? GlobalSettings.getOffsiteLink(scope,'team',teamName.split(' ').join('-'),id ): null,
        'partner_link': teamName ? GlobalSettings.getOffsiteLink(scope,'team',teamName.split(' ').join('-'),id ): null,//partner site eg: http://football.chicagotribune.com/nfl/team/detroit-lions/156
      },
      'ncaaf':{
        'vertical_link': teamName ? GlobalSettings.getOffsiteLink(scope,'team',teamName.split(' ').join('-'),id ): null,
        'partner_link': teamName ? GlobalSettings.getOffsiteLink(scope,'team',teamName.split(' ').join('-'),id ): null,
      },
      'mlb':{
        'vertical_link': teamName ? GlobalSettings.getOffsiteLink(scope,'team',teamName.split(' ').join('-'),id ): null,
        'partner_link': teamName ? GlobalSettings.getOffsiteLink(scope,'team',teamName.split(' ').join('-'),id ): null,
      },
      'nba':{
        'vertical_link': teamName ? GlobalSettings.getOffsiteLink(scope,'team',teamName.split(' ').join('-'),id ): null,
        'partner_link': teamName ? GlobalSettings.getOffsiteLink(scope,'t',teamName.split(' ').join('-'),id ): null, // partnersite eg: http://www.myhoopszone.com/chicagotribune.com/NBA/t/miami-heat/340
      },
      'ncaam':{
        'vertical_link': teamName ? GlobalSettings.getOffsiteLink(scope,'team',teamName.split(' ').join('-'),id ): null,
        'partner_link': teamName ? GlobalSettings.getOffsiteLink(scope,'t',teamName.split(' ').join('-'),id ): null,
      },
    };
    if(isPartner){
      return relPath[scope]['partner_link'];
    } else{
      return relPath[scope]['vertical_link'];

    }
  }
  //used to send into image component in the format it needs but per module it differs so each service will have its own imageData
  imageData(imageClass, imageBorder, mainImg, mainImgRoute?){
    if(typeof mainImg =='undefined' || mainImg == ''){
      mainImg = "/app/public/no-image.svg";
    }
    var image: CircleImageData = {//interface is found in image-data.ts
        imageClass: imageClass,
        mainImage: {
            imageUrl: mainImg,
            url: mainImgRoute,
            hoverText: "<i class='fa fa-mail-forward'></i>",
            imageClass: imageBorder,
        },
    };
    return image;
  } //imageData

}
