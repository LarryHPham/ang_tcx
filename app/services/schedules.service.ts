import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {Http, Headers} from '@angular/http';
import {GlobalFunctions} from '../global/global-functions';
import {CircleImageData} from '../fe-core/components/images/image-data';
import {VerticalGlobalFunctions} from '../global/vertical-global-functions';
import {GlobalSettings} from '../global/global-settings';
import {Conference, Division, SportPageParameters} from '../global/global-interface';
import {scheduleBoxInput} from '../fe-core/components/schedule-box/schedule-box.component';

declare var moment: any;

@Injectable()
export class SchedulesService {
    private _apiUrl: string = GlobalSettings.getApiUrl();
    // private _apiToken: string = 'BApA7KEfj';
    // private _headerName: string = 'X-SNT-TOKEN';

    constructor(public http: Http) {}

    //Function to set custom headers
    setToken() {
        var headers = new Headers();
        //headers.append(this.headerName, this.apiToken);
        return headers;
    }

    //possibly simpler version of getting schedules api call
    getSchedule(scope, profile, eventStatus, limit, pageNum, id?, year?, week?) {
        //Configure HTTP Headers
        var headers = this.setToken();

        var callURL = this._apiUrl + '/schedule/mlb';
        if (typeof year == 'undefined') {
            year = null;
        }

        if (profile == 'league') {//if league call then add scope
            callURL += '/' + scope;
        }

        if (typeof id != 'undefined' && profile != 'league') {//if team id is being sent through
            callURL += '/' + id;
        }
        if (year == 'all') {
            year = null;
        }
        callURL += '/' + eventStatus + '/' + year + '/' + limit + '/' + pageNum;  //default pagination limit: 5; page: 1
        //optional week parameters
        if (week != null) {
            callURL += '/' + week;
        }
        return this.http.get(callURL, { headers: headers })
            .map(res => res.json())
            .map(data => {
                try{
                    if(data){
                        return data;
                    } else throw new Error(" Failed API call at getSchedule method : " + callURL);
                } catch(e){
                    console.debug(e.message);
                }
            })
            .catch((error:any) => {
                return Observable.throw(new Error(error.status));
            });
    }

    //Call made for slider carousel using BoxScore scheduler
    getBoxSchedule(scope, profile, eventStatus, limit, pageNum, id?) {
        //Configure HTTP Headers
        var headers = this.setToken();
        // var callURL = GlobalSettings.getVerticalEnv('-touchdownloyal-api.synapsys.us') + '/boxScores/schedule/' + profile;
        var callURL = GlobalSettings.getTCXscope(scope).verticalApi + '/boxScores/schedule/' + profile;

        if (profile == 'league') {//if league call then add scope
            callURL += '/' + scope;
        }

        if (typeof id != 'undefined' && profile != 'league') {//if team id is being sent through
            callURL += '/' + id;
        }

        callURL += '/' + limit + '/' + pageNum;  //default pagination limit: 5; page: 1
        //optional week parameters
        return this.http.get(callURL, { headers: headers })
            .map(res => res.json())
            .map(data => {
                try{
                    if(data){
                        return data;
                    } else throw new Error(" Failed API call at getBoxSchedule method : " + callURL);
                } catch(e){
                    console.debug(e.message);
                }
            })
            .catch((error:any) => {
                return Observable.throw(new Error(error.status));
            });
    }
    // getWeatherCarousel(scope, selectedLocation) {
    //     //Configure HTTP Headers
    //     var headers = this.setToken();
    //     var callURL = GlobalSettings.getTCXscope('weather').verticalApi + "/tcx/sidescroll/weather/" + selectedLocation + "/" + scope.toLowerCase();
    //     //optional week parameters
    //     return this.http.get(callURL, { headers: headers })
    //         .map(res => res.json())
    //         .map(data => {
    //             var output = { scopeList: [], blocks: [], current: {} };
    //             if (data.data != null) {
    //                 output.current['location'] = data.city + ', ' + data.state;
    //                 output.current['city'] = data.city;
    //                 output.current['current_condition'] = data.current_condition;
    //                 output.current['current_icon'] = data.current_icon ? GlobalSettings.getImageUrl(data.current_icon, GlobalSettings._imgLgLogo).replace(".svg","_light.svg") : null;
    //                 output.current['current_scope'] = data.current_scope;
    //                 output.current['description'] = "<span class='text-heavy'>"+data.current_condition+"</span> until "+ moment(data.data[1].unix_timestamp).format("h A z");
    //                 output.current['current_time'] = moment().format("dddd h:mm A");
    //                 output.current['current_temperature'] = ((data.current_temperature * (9 / 5)) - 459.67).toFixed(0);
    //                 output.current['temperature_low'] = data.temperature_low != null ? ((data.temperature_low * (9 / 5)) - 459.67).toFixed(0) : null;
    //                 output.current['temperature_high'] = data.temperature_high != null ? ((data.temperature_high * (9 / 5)) - 459.67).toFixed(0) : null;
    //                 output.current['state'] = data.state;
    //                 output.current['zipcode'] = data.zipcode;
    //                 output.current['background'] = GlobalSettings.getImageUrl(data.background, GlobalSettings._imgWideScreen);
    //                 for (var n = 0; n < data.data.length; n++) {
    //                     //convert from kelvin to farenheight
    //                     let x = Number(data.data[n].unix_timestamp);
    //                     let y = Number((data.data[n].temperature * (9 / 5)) - 459.67).toFixed(0);
    //                     output.blocks.push({
    //                         x: x,
    //                         y: Number(y)
    //                     });
    //                 }
    //                 output.current['options'] = {
    //                     chart: {
    //                         backgroundColor: 'transparent',
    //                         type: 'areaspline',
    //                         marginLeft: 0,
    //                         marginRight: 0,
    //                         marginTop: 0,
    //                         marginBottom: 0,
    //                     },
    //                     title: {
    //                         text: null
    //                     },
    //                     legend: {
    //                         enabled: false
    //                     },
    //                     credits: {
    //                         enabled: false
    //                     },
    //                     xAxis: {
    //                         visible: false,
    //                     },
    //                     yAxis: {
    //                         visible: false,
    //                     },
    //                     tooltip: {
    //                         enabled: false
    //                     },
    //                     plotOptions: {
    //                         areaspline: {
    //                             pointStart: 1940,
    //                             fillColor: 'rgba(252, 209, 48, 0.25)',
    //                             lineColor: '#ffdf30',
    //                             lineWidth: 3,
    //                             marker: {
    //                                 enabled: false,
    //                                 states: {
    //                                     hover: {
    //                                         enabled: false
    //                                     }
    //                                 }
    //                             },
    //                             dataLabels: {
    //                                 enabled: true,
    //                                 useHTML: true,
    //                                 formatter: function() {
    //                                     return '<span class="weather-graph-text">' + this.y + '&deg;</span';
    //                                 }
    //                             },
    //                         }
    //                     },
    //                     series: [{
    //                         data: output.blocks,
    //                     }]
    //                 };
    //
    //                 return output;
    //             }
    //             else { // gracefully error if no data is returned
    //                 output = this.getDummyGraphResult();
    //                 return output;
    //             }
    //         })
    // }

    //Call made for slider carousel using BoxScore scheduler
    getFinanceData(scope, profile, eventStatus, limit, pageNum, id?) {
        //Configure HTTP Headers
        var headers = this.setToken();
        var callURL = GlobalSettings.getFinanceUrl() + "/call_controller.php?action=tcx&option=tcx_side_scroll";
        //optional week parameters
        return this.http.get(callURL, { headers: headers })
            .map(res => res.json())
            .map(data => {
              if(data){
                var output = { scopeList: [], blocks: [] }
                if(scope != 'all'){
                  scope = scope.toUpperCase();
                  data.data[scope].length = 50;
                }
                for (var n = 0; n < data.data[scope].length; n++) {
                    data.data[scope][n].currentStockValue = Number(data.data[scope][n].currentStockValue).toFixed(2);
                    data.data[scope][n].stockChangeAmount = Number(data.data[scope][n].stockChangeAmount).toFixed(2);
                    data.data[scope][n].stockChangePercent = Number(data.data[scope][n].stockChangePercent).toFixed(2);
                    if (data.data[scope][n].exchangeName == 'OTC') {
                        data.data[scope][n].profileUrl = "";
                    } else {
                        data.data[scope][n].profileUrl = GlobalSettings.getOffsiteLink("business", "company", data.data[scope][n].companySymbol, data.data[scope][n].companyId, data.data[scope][n].fullCompanyName.replace(/ /g, "-"));
                    }
                    if (data.data[scope][n].logoUrl == "" || data.data[scope][n].logoUrl == null) {
                        data.data[scope][n].logoUrl = '/app/public/no-image.png';
                    } else {
                        data.data[scope][n].logoUrl = GlobalSettings.getFinanceImgUrl() + "/" + data.data[scope][n].logoUrl;
                    }
                    data.data[scope][n].imageConfig = {
                        imageClass: "image-70",
                        mainImage: {
                            url: data.data[scope][n].profileUrl,
                            imageUrl: data.data[scope][n].logoUrl + "?width=" + GlobalSettings._imgMdLogo + "&quality=90",
                            imageClass: "border-1",
                            hoverText: "<p>View</p> Profile"
                        }
                    };
                    output.blocks.push(data.data[scope][n]);
                }
                output.blocks.push(
                    {
                        eos: "true",
                        icon: "app/public/eos.svg",
                        mainMessage: "END OF LIST",
                        subMessage: "The list will now start over."
                    });
                return output;
              } else {
                return null;
              }
            })
            .catch((error:any) => {
                return Observable.throw(new Error(error.status));
            });
    }

    getWeatherData(scope,selectedLocation){
        var headers = this.setToken();
        var callURL = GlobalSettings.getTCXscope('all').weatherverticalApi + "/tcx/sidescroll/weather/" + selectedLocation + "/" + scope.toLowerCase();
        return this.http.get(callURL, { headers: headers }).retry(2)
            .map(res => res.json())
            .map(data=>{
                try{
                    if(data){
                        return data;
                    } else throw new Error(" Failed API call at getWeatherData method : " + callURL);
                } catch(e){
                    console.debug(e.message);
                }
            })
            .catch((error:any) => {
                return Observable.throw(new Error(error.status));
            })

    }

    transformWeatherData(data,scope){
        var output = { scopeList: [], blocks: [], current: {} }
        if (data.data != null) {
            output.current['city'] = data.city;
            output.current['current_condition'] = data.current_condition;
            output.current['current_icon'] = GlobalSettings.getImageUrl(data.current_icon, GlobalSettings._imgLgLogo);
            output.current['current_scope'] = data.current_scope;
            output.current['current_temperature'] = ((data.current_temperature * (9 / 5)) - 459.67).toFixed(0);
            output.current['state'] = data.state;
            output.current['zipcode'] = data.zipcode;
           /* if(scope.toLowerCase()=='hourly') {
                output.blocks.push(
                    {
                        eos: "false",
                        unix_timestamp: "NOW",
                        temperature: output.current['current_temperature'] + "&deg;",
                        icon: output.current['current_icon'],
                        condition: output.current['current_condition']
                    }
                );
            }*/
            for (var n = 0; n < data.data.length; n++) {
                data.data[n]['eos'] = "false";
                data.data[n]['icon'] = GlobalSettings.getImageUrl(data.data[n]['icon']);
                //convert from kelvin to farenheight
                if (scope.toLowerCase() == "hourly") {
                    if(n==0){
                        data.data[n].unix_timestamp = "NOW";
                        data.data[n].temperature = ((data.data[n].temperature * (9 / 5)) - 459.67).toFixed(0) + "&deg;";
                    }else{
                        data.data[n].unix_timestamp = moment.unix(data.data[n].unix_timestamp).format("h:mm A z");
                        data.data[n].temperature = ((data.data[n].temperature * (9 / 5)) - 459.67).toFixed(0) + "&deg;";
                    }


                }
                else {
                    if(n==0){
                            data.data[n].unix_timestamp = "TODAY";
                            data.data[n].temperature = ((data.data[n].temperature_high * (9 / 5)) - 459.67).toFixed(0) + "&deg; <span class='small-temp'>/ " + ((data.data[n].temperature_low * (9 / 5)) - 459.67).toFixed(0) + "&deg;</span>";

                    }else{
                        data.data[n].unix_timestamp = moment.unix(data.data[n].unix_timestamp).format("dddd, MMM. DD, YYYY").toUpperCase();
                        data.data[n].temperature = ((data.data[n].temperature_high * (9 / 5)) - 459.67).toFixed(0) + "&deg; <span class='small-temp'>/ " + ((data.data[n].temperature_low * (9 / 5)) - 459.67).toFixed(0) + "&deg;</span>";
                    }
                }
                output.blocks.push(data.data[n]);
            }
            output.blocks.push(
                {
                    eos: "true",
                    icon: "app/public/eos.svg",
                    mainMessage: "END OF LIST",
                    subMessage: "The list will now start over."
                });
            return output;
        }
        else { // gracefully error if no data is returned
            output = {
                scopeList: [], blocks: [
                    {
                        unix_timestamp: "UH OH!",
                        condition: "ERROR",
                        icon: GlobalSettings.getImageUrl("/weather/icons/sharknado_n.svg")
                    }
                ], current: {
                    current_condition: "N/A",
                    current_icon: GlobalSettings.getImageUrl("/weather/icons/sharknado_n.svg"),
                    current_temperature: "N/A",
                    current_scope: "",
                    state: "N/A",
                    city: "N/A",
                }
            }
            return output;
        }
    }

/*    getWeatherData(scope, selectedLocation) {
        //Configure HTTP Headers
        var headers = this.setToken();
        // var callURL = GlobalSettings.getVerticalEnv('-tcxmedia-api.synapsys.us') + "/sidescroll/weather/" + selectedLocation + "/" + scope.toLowerCase();
        var callURL = GlobalSettings.getTCXscope('all').weatherverticalApi + "/tcx/sidescroll/weather/" + selectedLocation + "/" + scope.toLowerCase();

        console.log(callURL);
        //optional week parameters
        return this.http.get(callURL, { headers: headers })
            .map(res => res.json())
            .map(data => {
                var output = { scopeList: [], blocks: [], current: {} }
                if (data.data != null) {
                    output.current['city'] = data.city;
                    output.current['current_condition'] = data.current_condition;
                    output.current['current_icon'] = GlobalSettings.getImageUrl(data.current_icon, GlobalSettings._imgLgLogo);
                    output.current['current_scope'] = data.current_scope;
                    output.current['current_temperature'] = ((data.current_temperature * (9 / 5)) - 459.67).toFixed(0);
                    output.current['state'] = data.state;
                    output.current['zipcode'] = data.zipcode;
                    output.blocks.push(
                        {
                            eos: "false",
                            unix_timestamp: "NOW",
                            temperature: output.current['current_temperature'] + "&deg;",
                            icon: output.current['current_icon'],
                            condition: output.current['current_condition']
                        }
                    );
                    for (var n = 0; n < data.data.length; n++) {
                        data.data[n]['eos'] = "false";
                        data.data[n]['icon'] = GlobalSettings.getImageUrl(data.data[n]['icon']);
                        //convert from kelvin to farenheight
                        if (scope.toLowerCase() == "hourly") {
                            data.data[n].unix_timestamp = moment.unix(data.data[n].unix_timestamp).format("h:mm A z");
                            data.data[n].temperature = ((data.data[n].temperature * (9 / 5)) - 459.67).toFixed(0) + "&deg;";
                        }
                        else {
                            data.data[n].unix_timestamp = moment.unix(data.data[n].unix_timestamp).format("dddd, MMM. DD, YYYY").toUpperCase();
                            data.data[n].temperature = ((data.data[n].temperature_high * (9 / 5)) - 459.67).toFixed(0) + "&deg; <span class='small-temp'>/ " + ((data.data[n].temperature_low * (9 / 5)) - 459.67).toFixed(0) + "&deg;</span>";
                        }
                        output.blocks.push(data.data[n]);
                    }
                    output.blocks.push(
                        {
                            eos: "true",
                            icon: "app/public/eos.svg",
                            mainMessage: "END OF LIST",
                            subMessage: "The list will now start over."
                        });
                    return output;
                }
                else { // gracefully error if no data is returned
                    output = {
                        scopeList: [], blocks: [
                            {
                                unix_timestamp: "UH OH!",
                                condition: "ERROR",
                                icon: GlobalSettings.getImageUrl("/weather/icons/sharknado_n.svg")
                            }
                        ], current: {
                            current_condition: "N/A",
                            current_icon: GlobalSettings.getImageUrl("/weather/icons/sharknado_n.svg"),
                            current_temperature: "N/A",
                            current_scope: "",
                            state: "N/A",
                            city: "N/A",
                        }
                    }
                    return output;
                }
            })
    }*/

    //Call made for slider carousel using BoxScore scheduler
    getBasketballSchedule(scope, profile, eventStatus, limit, pageNum, id?) {
        //Configure HTTP Headers
        var headers = this.setToken();
        // var callURL = GlobalSettings.getVerticalEnv('-sports-api.synapsys.us') + "/NBAHoops/call_controller.php?scope=" + scope.toLowerCase() + "&action=tcx&option=tcx_side_scroll&perPage=50&pageNum=1";
        var callURL = GlobalSettings.getTCXscope(scope).verticalApi + "/NBAHoops/call_controller.php?scope=" + scope.toLowerCase() + "&action=tcx&option=tcx_side_scroll&perPage=50&pageNum=1";
        //optional week parameters
        return this.http.get(callURL, { headers: headers })
            .map(res => res.json())
            .map(data => {
                data = data.data;
                var output = { scopeList: [], blocks: [] }
                for (var i = 0; i < data.scopeList.length; i++) {
                    output.scopeList.push(data.scopeList[i].toUpperCase());
                }
                for (var n = 0; n < data.data.length; n++) {
                    data.data[n].extUrl = true;
                    switch (data.data[n].eventStatus) {
                        case "pre-event":
                            data.data[n].reportDisplay = "PRE GAME REPORT";
                            data.data[n].reportLink = GlobalSettings.getOffsiteLink(scope, "article", VerticalGlobalFunctions.formatExternalArticleRoute(scope, 'pregame-report', data.data[n].eventId));
                            break;
                        case "post-event":
                            data.data[n].reportDisplay = "POST GAME REPORT";
                            data.data[n].reportLink = GlobalSettings.getOffsiteLink(scope, "article", VerticalGlobalFunctions.formatExternalArticleRoute(scope, 'postgame', data.data[n].eventId));
                            break;
                        case "cancelled":
                            data.data[n].reportDisplay = "GAME IS CANCELED";
                            break;
                        case "postponed":
                            data.data[n].reportDisplay = "GAME IS POSTPONED";
                            data.data[n].reportLink = GlobalSettings.getOffsiteLink(scope, "article", VerticalGlobalFunctions.formatExternalArticleRoute(scope, 'pregame-report', data.data[n].eventId));
                            break;
                        default:
                            data.data[n].reportDisplay = "GAME REPORT";
                    }
                    let date = moment(Number(data.data[n].startTime)).format('dddd, MMM. D').toUpperCase();
                    let time = moment(Number(data.data[n].startTime)).format('h:mm A z');

                    data.data[n].date = date + " &bull; " + time;
                    data.data[n].homeTeamName = data.data[n].lastNameHome;

                    data.data[n].awayTeamName = data.data[n].lastNameAway;
                    var divCheck = data.data[n].awayDiv ? (data.data[n].awayDiv == "d2" ? false : true) : true;
                    let fullNameAway = data.data[n].fullNameAway ? data.data[n].fullNameAway.replace(/ /g, "-") : null;
                    let fullNameHome = data.data[n].fullNameHome ? data.data[n].fullNameHome.replace(/ /g, "-"): null;
                    data.data[n].awayLink = data.data[n].fullNameAway && divCheck ? GlobalSettings.getOffsiteLink(scope, "team", fullNameAway, data.data[n].idAway) : null;
                    data.data[n].homeLink = data.data[n].fullNameHome ? GlobalSettings.getOffsiteLink(scope, "team", fullNameHome, data.data[n].idHome) : null;
                    if (data.data[n].logoUrlAway == "" || data.data[n].logoUrlAway == null) {
                        data.data[n].logoUrlAway = '/app/public/no-image.png';
                    }
                    else {
                        data.data[n].logoUrlAway = GlobalSettings.getSportsImageUrl("/" + data.data[n].logoUrlAway, GlobalSettings._imgMdLogo);
                    }
                    if (data.data[n].logoUrlHome == "" || data.data[n].logoUrlHome == null) {
                        data.data[n].logoUrlHome = '/app/public/no-image.png';
                    }
                    else {
                        data.data[n].logoUrlHome = GlobalSettings.getSportsImageUrl("/" + data.data[n].logoUrlHome, GlobalSettings._imgMdLogo);
                    }
                    data.data[n].awayImageConfig = {
                        imageClass: "image-70",
                        mainImage: {
                            url: divCheck ? GlobalSettings.getOffsiteLink(scope, "team", fullNameAway, data.data[n].idAway) : null,
                            imageUrl: data.data[n].logoUrlAway + "?width" + GlobalSettings._imgMdLogo,
                            imageClass: "border-1",
                            hoverText: "<p>View</p> Profile"
                        }
                    };
                    data.data[n].homeImageConfig = {
                        imageClass: "image-70",
                        mainImage: {
                            url: GlobalSettings.getOffsiteLink(scope, "team", fullNameHome, data.data[n].idHome),
                            imageUrl: data.data[n].logoUrlHome + "?width=" + GlobalSettings._imgMdLogo,
                            imageClass: "border-1",
                            hoverText: "<p>View</p> Profile"
                        }
                    };
                    output.blocks.push(data.data[n]);
                }
                output.blocks.push(
                    {
                        eos: "true",
                        icon: "app/public/eos.svg",
                        mainMessage: "END OF LIST",
                        subMessage: "The list will now start over."
                    });
                return output;
            })
            .catch((error:any) => {
                return Observable.throw(new Error(error.status));
            });
    }

    //Call made for slider carousel using BoxScore scheduler
    getBaseballSchedule(scope, profile, eventStatus, limit, pageNum, id?) {
        //Configure HTTP Headers
        var headers = this.setToken();
        // var callURL = GlobalSettings.getVerticalEnv('-homerunloyal-api.synapsys.us') + "/tcx/league/schedule/pre-event/50/1";
        var callURL = GlobalSettings.getTCXscope(scope).verticalApi + "/tcx/" + scope + "/schedule/pre-event/50/1";
        //optional week parameters
        return this.http.get(callURL, { headers: headers })
            .map(res => res.json())
            .map(data => {
                var output = { scopeList: [], blocks: [] }
                output.scopeList.push("mlb");
                for (var n = 0; n < data.data.length; n++) {
                    switch (data.data[n].eventStatus) {
                        case "pre-event":
                            data.data[n].reportDisplay = "PRE GAME REPORT";
                            data.data[n].reportLink = GlobalSettings.getOffsiteLink(scope, "article", VerticalGlobalFunctions.formatExternalArticleRoute(scope, 'pre-game-report', data.data[n].eventId));
                            break;
                        case "post-event":
                            data.data[n].reportDisplay = "POST GAME REPORT";
                            data.data[n].reportLink = GlobalSettings.getOffsiteLink(scope, "article",  VerticalGlobalFunctions.formatExternalArticleRoute(scope, 'post-game-report', data.data[n].eventId));
                            break;
                        case "cancelled":
                            data.data[n].reportDisplay = "GAME IS CANCELED";
                            break;
                        case "postponed":
                            data.data[n].reportDisplay = "GAME POSTPONED";
                            data.data[n].reportLink = GlobalSettings.getOffsiteLink(scope, "article", VerticalGlobalFunctions.formatExternalArticleRoute(scope, 'pre-game-report', data.data[n].eventId));
                            break;
                        default:
                            data.data[n].reportDisplay = "GAME REPORT";
                    }
                    let date = moment(Number(data.data[n].eventDate)).format('dddd, MMM. D').toUpperCase();
                    let time = moment(Number(data.data[n].eventDate)).format('h:mm A z');
                    let fullNameAway = data.data[n].fullNameAway ? data.data[n].fullNameAway.replace(/\s+/g, '-') : null;
                    let fullNameHome = data.data[n].fullNameHome ? data.data[n].fullNameHome.replace(/\s+/g, '-') : null;
                    data.data[n].date = date + " &bull; " + time;
                    data.data[n].homeTeamName = data.data[n].lastNameHome;
                    data.data[n].awayTeamName = data.data[n].lastNameAway;
                    data.data[n].awayProfileUrl = data.data[n].fullNameAway ? GlobalSettings.getOffsiteLink("mlb", "team", fullNameAway, data.data[n].idAway) : null;
                    data.data[n].homeProfileUrl = data.data[n].fullNameHome ? GlobalSettings.getOffsiteLink("mlb", "team", fullNameHome, data.data[n].idHome) : null;
                    if (data.data[n].logoUrlAway == "" || data.data[n].logoUrlAway == null) {
                        data.data[n].logoUrlAway = '/app/public/no-image.png';
                    }
                    else {
                        data.data[n].logoUrlAway = GlobalSettings.getSportsImageUrl(data.data[n].logoUrlAway, GlobalSettings._imgMdLogo);
                    }
                    if (data.data[n].logoUrlHome == "" || data.data[n].logoUrlHome == null) {
                        data.data[n].logoUrlHome = '/app/public/no-image.png';
                    }
                    else {
                        data.data[n].logoUrlHome = GlobalSettings.getSportsImageUrl(data.data[n].logoUrlHome, GlobalSettings._imgMdLogo);
                    }
                    data.data[n].awayImageConfig = {
                        imageClass: "image-70",
                        mainImage: {
                            url: data.data[n].awayProfileUrl,
                            imageUrl: data.data[n].logoUrlAway + "?width=" + GlobalSettings._imgMdLogo,
                            imageClass: "border-1",
                            hoverText: "<p>View</p> Profile"
                        }
                    };
                    data.data[n].homeImageConfig = {
                        imageClass: "image-70",
                        mainImage: {
                            url: data.data[n].homeProfileUrl,
                            imageUrl: data.data[n].logoUrlHome + "?width=" + GlobalSettings._imgMdLogo,
                            imageClass: "border-1",
                            hoverText: "<p>View</p> Profile"
                        }
                    };
                    output.blocks.push(data.data[n]);
                }
                output.blocks.push(
                    {
                        eos: "true",
                        icon: "app/public/eos.svg",
                        mainMessage: "END OF LIST",
                        subMessage: "The list will now start over."
                    });
                return output;
            })
            .catch((error:any) => {
                return Observable.throw(new Error(error.status));
            });
    }


    setupSlideScroll(topScope, data, scope, profile, eventStatus, limit, pageNum, selectedLocation, callback: Function, year?, week?) {
        if (topScope == "business") {
            //(scope, profile, eventStatus, limit, pageNum, id?)
            this.getFinanceData(scope, 'league', eventStatus, limit, pageNum)
                .subscribe(data => {
                    callback(data);
                })
        }
        else if (topScope == "football") {
            //(scope, profile, eventStatus, limit, pageNum, id?)
            this.getBoxSchedule(scope, 'league', eventStatus, limit, 1)
                .subscribe(data => {
                    var formattedData = this.transformSlideScroll(scope, data.data);
                    callback(formattedData);
                })
        }
        else if (topScope == "basketball") {
            //(scope, profile, eventStatus, limit, pageNum, id?)
            this.getBasketballSchedule(scope, 'league', eventStatus, limit, pageNum)
                .subscribe(data => {
                    callback(data);
                })
        }
        else if (topScope == "baseball") {
            //(scope, profile, eventStatus, limit, pageNum, id?)
            this.getBaseballSchedule(scope, 'league', eventStatus, limit, pageNum)
                .subscribe(data => {
                    callback(data);
                })
        }
        else if (topScope == "all") {
            this.getWeatherData(scope, selectedLocation)
                .subscribe(data => {
                    try{
                        if(data){
                            var last_updated= data.last_updated;
                            var getToday = new Date().getTime()/1000;
                            var current_difference = GlobalFunctions.compareTimestamps(getToday,last_updated);
                            if(Number(current_difference)<12){
                                var weatherData = this.transformWeatherData(data,scope);
                                callback(weatherData);
                            } else throw new Error("Weather data is not updated since 12 hours! Last updated" + " " + current_difference + " hours ago")

                      } else throw new Error("No weather data available");
                    } catch(e){
                        console.log(e.message);
                    }


                })
        }

    }

    getLocationAutocomplete(query, callback: Function) {
        this.callLocationAutocomplete(query)
            .subscribe(data => {
                callback(data);
            })
    }

    callLocationAutocomplete(query) {
        //Configure HTTP Headers
        var headers = this.setToken();
        var callURL = GlobalSettings.getWeatherUrl() + "/sidescroll/weather/availableLocations/" + query;
        //optional week parameters
        return this.http.get(callURL, { headers: headers })
            .map(res => res.json())
            .map(data => {
              if(data){
                return data;
              } else {
                return null;
              }
            })
            .catch((error:any) => {
                return Observable.throw(new Error(error.status));
            });
    }

    transformSlideScroll(scope, data) {
        if (scope == "fbs") {
            scope = "ncaaf";
        }
        let self = this;
        var modifiedArray = { blocks: [] };
        var newData;
        //run through and convert data to what is needed for the component
        data.forEach(function(val, index) {
            let reportText = 'GAME REPORT';
            let partner = GlobalSettings.getHomeInfo();
            var reportLink;
            let reportUrl;

            if (val.eventStatus == 'inprogress') {
                if (Number(val.eventQuarter) > 1) {// so that ai gets a chance to generate an article and no one really needs an article created for first quarter
                    reportUrl = GlobalSettings.getOffsiteLink(scope, "article", VerticalGlobalFunctions.formatExternalArticleRoute(scope, 'in-game-report', val.eventId));
                    reportText = 'LIVE GAME REPORT';
                } else {// link if game is inprogress and still 1st quarter
                    reportUrl = GlobalSettings.getOffsiteLink(scope, "article", VerticalGlobalFunctions.formatExternalArticleRoute(scope, 'pregame-report', val.eventId));
                    reportText = 'PRE GAME REPORT'
                }
            } else {
                if (val.eventStatus = 'pregame') {
                    reportUrl = GlobalSettings.getOffsiteLink(scope, "article", VerticalGlobalFunctions.formatExternalArticleRoute(scope, 'pregame-report', val.eventId));
                    reportText = 'PRE GAME REPORT'
                } else if (val.eventStatus == 'postgame') {
                    reportUrl = GlobalSettings.getOffsiteLink(scope, "article", VerticalGlobalFunctions.formatExternalArticleRoute(scope, 'postgame-report', val.eventId));
                    reportText = 'POST GAME REPORT';
                } else {
                    reportUrl = GlobalSettings.getOffsiteLink(scope, "article", VerticalGlobalFunctions.formatExternalArticleRoute(scope, 'postgame-report', val.eventId));
                    reportText = 'POST GAME REPORT';
                }
            }
            let date = moment(Number(val.eventStartTime)).format('dddd, MMM. D').toUpperCase();
            let time = moment(Number(val.eventStartTime)).format('h:mm A z');
            let team1FullName = val.team1FullName ? val.team1FullName.replace(/\s+/g, '-') : null;
            let team2FullName = val.team2FullName ? val.team2FullName.replace(/\s+/g, '-') : null;
            let homeTeamName = val.team1FullName ? val.team1FullName.replace(val.team1Market + " ", '') : null;
            let awayTeamName = val.team2FullName ? val.team2FullName.replace(val.team2Market + " ", '') : null;

            let team1FBSName = val.team1FullName ? val.team1Abbreviation + " " + homeTeamName : null;
            let team2FBSName = val.team2FullName ? val.team2Abbreviation + " " + awayTeamName : null;

            if (team1FBSName && team1FBSName.length > 13) {
                team1FBSName = val.team1Abbreviation;
            }
            if (team2FBSName && team2FBSName.length > 13) {
                team2FBSName = val.team2Abbreviation;
            }

            newData = {
                date: date + " &bull; " + time,
                awayImageConfig: {
                    imageClass: "image-70",
                    mainImage: {
                        url: GlobalSettings.getOffsiteLink(scope, "team", team2FullName, val.team2Id),
                        imageUrl: GlobalSettings.getImageUrl(val.team2Logo, GlobalSettings._imgMdLogo),
                        imageClass: "border-1",
                        hoverText: "<p>View</p> Profile"
                    }
                },
                homeImageConfig: {
                    imageClass: "image-70",
                    mainImage: {
                        url: GlobalSettings.getOffsiteLink(scope, "team", team1FullName, val.team1Id),
                        imageUrl: GlobalSettings.getImageUrl(val.team1Logo, GlobalSettings._imgMdLogo),
                        imageClass: "border-1",
                        hoverText: "<p>View</p> Profile"
                    }
                },
                awayTeamName: scope == 'ncaaf' ? team2FBSName : awayTeamName,
                homeTeamName: scope == 'ncaaf' ? team1FBSName : homeTeamName,
                awayLink: GlobalSettings.getOffsiteLink(scope, "team", team2FullName, val.team2Id),
                homeLink: GlobalSettings.getOffsiteLink(scope, "team", team1FullName, val.team1Id),
                reportDisplay: reportText,
                reportLink: reportUrl,
                extUrl:true,
                isLive: val.eventStatus == 'inprogress' ? 'schedule-live' : '',
                inning: val.eventQuarter != null ? "Current: Quarter " + Number(val.eventQuarter) + "<sup>" + GlobalFunctions.Suffix(Number(val.eventQuarter)) + "</sup>" : null
            }
            modifiedArray.blocks.push(newData);
        });
        modifiedArray.blocks.push(
            {
                eos: "true",
                icon: "app/public/eos.svg",
                mainMessage: "END OF LIST",
                subMessage: "The list will now start over."
            });
        return modifiedArray;
    }

    getDummyGraphResult(){
      var output = {
          scopeList: [], blocks: [
              {
                  unix_timestamp: "UH OH!",
                  condition: "ERROR",
                  icon: GlobalSettings.getImageUrl("/weather/icons/sharknado_n.svg")
              }
          ], current: {
              description: "<span class='text-heavy'>Partly cloudy</span> with a chance of sharky meatballs until 12PM CT.",
              current_condition: "Sharknado",
              current_icon: GlobalSettings.getImageUrl("/weather/icons/sharknado_n.svg"),
              current_temperature: 76,
              current_time: moment().format("dddd h:mm A"),
              temperature_low: ((262 * (9 / 5)) - 459.67).toFixed(0),
              temperature_high: ((300 * (9 / 5)) - 459.67).toFixed(0),
              current_scope: "hourly",
              state: "N/A",
              city: "N/A",
              location: "Hurricane of Sharks",
              zipcode:67260,
              background: GlobalSettings.getImageUrl("/weather/icons/light_rain.jpg"),
              options:{
                  chart: {
                      backgroundColor: 'transparent',
                      type: 'areaspline',
                      marginLeft: 0,
                      marginRight: 0,
                      marginTop: 0,
                      marginBottom: 0,
                  },
                  title: {
                      text: null
                  },
                  legend: {
                      enabled: false
                  },
                  credits: {
                      enabled: false
                  },
                  xAxis: {
                      visible: false,
                  },
                  yAxis: {
                      visible: false,
                  },
                  tooltip: {
                      enabled: false
                  },
                  plotOptions: {
                      areaspline: {
                          hover:false,
                          pointStart: 1940,
                          fillColor: 'rgba(252, 209, 48, 0.25)',
                          lineColor: '#ffdf30',
                          lineWidth: 3,
                          marker: {
                              enabled: false,
                              states: {
                                  hover: {
                                      enabled: false
                                  }
                              }
                          },
                          dataLabels: {
                              enabled: true,
                              useHTML: true,
                              formatter: function() {
                                  return '<span class="weather-graph-text">' + this.y + '&deg;</span';
                              }
                          },
                      }
                  },
                  series: [{
                      data: [
                        {x:1476122400,y:60},
                        {x:1476132400,y:74},
                        {x:1476142400,y:82},
                        {x:1476152400,y:68},
                        {x:1476162400,y:52},
                        {x:1476172400,y:47},
                      ],
                  }]
              }


          }
      }
      return output;
    }

    imageData(imageClass, imageBorder, mainImg, mainImgRoute?) {
        if (typeof mainImg == 'undefined' || mainImg == '') {
            mainImg = "/app/public/no-image.svg";
        }
        var image: CircleImageData = {//interface is found in image-data.ts
            imageClass: imageClass,
            mainImage: {
                imageUrl: mainImg,
                urlRouteArray: mainImgRoute,
                hoverText: "<i class='fa fa-mail-forward'></i>",
                imageClass: imageBorder,
            },
        };
        return image;
    }
}
