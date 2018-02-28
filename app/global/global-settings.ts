import { GeoLocation } from "./global-service";
import { GlobalFunctions } from "./global-functions";

export class GlobalSettings {
    private static _env = window.location.hostname.split('.')[0];
    private static _proto = window.location.protocol;
    private static _partnerId:string;

    private static _newsUrl:string = 'newsapi.synapsys.us';

    private static _apiUrl:string = '-article-library.synapsys.us';
    private static _financeUrl:string = '-finance-api.synapsys.us';
    private static _weatherUrl:string = '-weather.synapsys.us/tcx';
    private static _searchAPIUrl:string ='-search-api.synapsys.us';


    private static _articleBatchUrl:string= "-article-library.synapsys.us/articles";
    private static _domainApiUrl:string= "w1.synapsys.us/widgets/deepdive/bar/domain_api.php?dom=";

    // private static _partnerApiUrl: string = 'apireal.synapsys.us/listhuv/?action=get_partner_data&domain=';
    private static _partnerApiUrl: string = 'synapview.synapsys.us/synapview/?action=get_header_data&vertical=sports&domain='; // sports being passed into vertical to only grab sports

    //two different api since there is a possibility that these urls are going to change
    private static _widgetUrl: string = 'w1.synapsys.us';
    private static _geoUrl: string = 'waldo.synapsys.us';
    // private static _geoUrl: string = 'w1.synapsys.us';

    //main domain for all our images
    public static _imageUrl:string = 'images.synapsys.us';
    public static _sportsimageUrl:string = 'sports-images.synapsys.us';
    public static _financeImageUrl:string = 'images.investkit.com';

    //this changes per vertical
    private static _homepageUrl:string = '.tcxmedia.com';
    private static _homepageLinkName:string = 'tcxmedia';
    private static _partnerHomepageUrl:string = '.tcxzone.com';
    private static _partnerHomepageLinkName:string = 'tcxzone';

    //links from our share providers that do not change
    private static _siteTwitterUrl:string = '//twitter.com/home?status=';
    private static _siteFacebookUrl:string = '//www.facebook.com/sharer/sharer.php?u=';
    private static _siteLinkedinUrl:string = '//www.linkedin.com/shareArticle?mini=true&url=&title=&summary=&source=';
    private static _siteGoogleUrl:string = '//plus.google.com/share?url=';
    private static _verticalFacebook: string = '//www.facebook.com/TCX-382018522187919';
    private static _verticalTwitter: string = '//twitter.com/tcxmedia';


    //base titles that will be used to displayed different when on white labeled partner domains
    private static _baseTitle: string = "TCX";
    private static _basePartnerTitle: string = "MyTCX";

    //copyright info that is to be manually change whenever a copyright info is needed to be updated
    private static _estYear: string = " 2017";
    private static _copyrightInfo: string = "USA Today Sports Images";

    //this is proned to be removed but used as dummy data
    private static _tdlAPI: string = '-touchdownloyal-api.synapsys.us/tcx';
    private static _hrlAPI: string = '-homerunloyal-api.synapsys.us/tcx';
    private static _tcxAPI: string = '-article-library.synapsys.us/tcx';
    static _imgSmLogo: number = 45;
    static _imgMdLogo: number = 70;
    static _imgLgLogo: number = 85;
    static _imgMobile: number = 400;
    static _imgFullScreen: number = 768;
    static _imgMdScreen: number = 993;
    static _imgLgScreen: number = 1240;
    static _imgWideScreen: number = 1920;

    static getEnv(env:string):string {
      if(env == "localhost" || env == "dev"){
          env = "dev";
      }else if(env == "qa"){
          env = "qa";
      }else{
          env = "prod";
      }
      return env;
    }

    static synapsysENV(env:string):string {
      if (env == "localhost" || env == 'dev' || env == 'qa'){//remove qa when we have qa env setup
          env = "dev-";
      }else{
        env = '';
      }
      return env;
    }

    static isProd():boolean {
      if( this.getEnv(this._env) == "prod" ){
        return true;
      }else{
        return false;
      }
    }
    /**
      Get Env. for Offsite Link
    **/
    static offSiteEnv(scope: string, partnerCode?: string): string{
      var e;
      if(this.isProd()){//if prod and is not a special domain
        e = "www";
        if(partnerCode){
          e = this.checkPartnerDomain(partnerCode) ? "" : "www";
        }
      } else {
        if(scope.toLowerCase() != "nba" || scope.toLowerCase() != "ncaam" || scope.toLowerCase() != "basketball"){//basketball doesn't have qa environment
          e = this.getEnv(this._env);
        } else {
          e = "dev";
        }
      }
      return e;
    }

    static getTCXscope(section){
      var category = {
        //BELOW are categories SNTMedia actually has Verticals built specifically for that category
        'nfl':{
          parentScope: 'sports',
          scope:'nfl',
          scopeList: ["MLB", "NCAAM", "NBA", "NCAAF", "NFL", "All"],
          topScope: 'football',
          displayName: 'NFL',
          verticalApi: this.getVerticalEnv('-touchdownloyal-api.synapsys.us'),
          aiApi:this.getVerticalEnv('-touchdownloyal-ai.synapsys.us'),
          tcxApi: this.getApiUrl(),
          showEventSlider: true,
          showBoxScores:true,
          showSFTopNav: true,
          icon:'fa-tdl-football',
          pageType: 1,
          searchTitle:'Discover The Latest In',
          searchSubTitle:"Find the players and teams you love",
          placeHolderText:'Search for a Team or a Player...',
          searchBackground:"../app/public/Sports_Search-Module-Image.jpg",
          color:'#2d3e50',
          hoverColor: "rgba(45, 62, 80, 0.75)"
        },
        'ncaaf':{
          parentScope: 'sports',
          scope:'ncaaf',
          scopeList: ["MLB", "NCAAM", "NBA", "NCAAF", "NFL", "All"],
          topScope: 'football',
          displayName: 'NCAAF',
          verticalApi: this.getVerticalEnv('-touchdownloyal-api.synapsys.us'),
          aiApi:this.getVerticalEnv('-touchdownloyal-ai.synapsys.us'),
          tcxApi: this.getApiUrl(),
          showEventSlider: true,
          showBoxScores:true,
          showSFTopNav: true,
          icon:'fa-tdl-football',
          pageType: 1,
          searchTitle:'Discover The Latest In',
          searchSubTitle:"Find the players and teams you love",
          placeHolderText:'Search for a Team or a Player...',
          searchBackground:"../app/public/Sports_Search-Module-Image.jpg",
          color:'#2d3e50',
          hoverColor: "rgba(45, 62, 80, 0.75)"
        },
        'fbs':{
          parentScope: 'sports',
          scope:'ncaaf',
          scopeList: ["MLB", "NCAAM", "NBA", "NCAAF", "NFL", "All"],
          topScope: 'football',
          displayName: 'NCAAF',
          verticalApi: this.getVerticalEnv('-touchdownloyal-api.synapsys.us'),
          aiApi:this.getVerticalEnv('-touchdownloyal-ai.synapsys.us'),
          tcxApi: this.getApiUrl(),
          showEventSlider: true,
          showBoxScores:true,
          showSFTopNav: true,
          icon:'fa-tdl-football',
          pageType: 1,
          searchTitle:'Discover The Latest In',
          searchSubTitle:"Find the players and teams you love",
          placeHolderText:'Search for a Team or a Player...',
          searchBackground:"../app/public/Sports_Search-Module-Image.jpg",
          color:'#2d3e50',
          hoverColor: "rgba(45, 62, 80, 0.75)"
        },
        'mlb':{
          parentScope: 'sports',
          scope:'mlb',
          scopeList: ["MLB", "NCAAM", "NBA", "NCAAF", "NFL", "All"],
          topScope: 'baseball',
          displayName: 'MLB',
          verticalApi: this.getVerticalEnv('-homerunloyal-api.synapsys.us'),
          aiApi:this.getVerticalEnv('-homerunloyal-ai.synapsys.us'),
          tcxApi: this.getApiUrl(),
          showEventSlider: true,
          showBoxScores:true,
          showSFTopNav: true,
          icon:'fa-strikeouts',
          pageType: 1,
          searchTitle:'Discover The Latest In',
          searchSubTitle:"Find the players and teams you love",
          placeHolderText:'Search for a Team or a Player...',
          searchBackground:"../app/public/Sports_Search-Module-Image.jpg",
          color:'#bc2027',
          hoverColor: "rgba(188, 32, 39, 0.75)"
        },
        'nba':{
          parentScope: 'sports',
          scope:'nba',
          scopeList: ["MLB", "NCAAM", "NBA", "NCAAF", "NFL", "All"],
          topScope: 'basketball',
          displayName: 'NBA',
          verticalApi: this.getVerticalEnv('-sports-api.synapsys.us'),
          aiApi:this.getVerticalEnv('-sports-ai'),
          tcxApi: this.getApiUrl(),
          showEventSlider: true,
          showBoxScores:true,
          showSFTopNav: true,
          icon:'fa-dribble',
          pageType: 1,
          searchTitle:'Discover The Latest In',
          searchSubTitle:"Find the players and teams you love",
          placeHolderText:'Search for a Team or a Player...',
          searchBackground:"../app/public/Sports_Search-Module-Image.jpg",
          color:'#f26f26',
          hoverColor: "rgba(242, 111, 38, 0.75)"
        },
        'ncaam':{
          parentScope: 'sports',
          scope:'ncaam',
          scopeList: ["MLB", "NCAAM", "NBA", "NCAAF", "NFL", "All"],
          topScope:'basketball',
          displayName:'NCAAM',
          verticalApi:this.getVerticalEnv('-sports-api.synapsys.us'),
          aiApi: this.getVerticalEnv('-sports-ai'),
          tcxApi: this.getApiUrl(),
          showEventSlider: true,
          showBoxScores:true,
          showSFTopNav: true,
          icon:'fa-dribble',
          pageType: 1,
          searchTitle:'Discover The Latest In',
          searchSubTitle:"Find the players and teams you love",
          placeHolderText:'Search for a Team or a Player...',
          searchBackground:"../app/public/Sports_Search-Module-Image.jpg",
          color:'#f26f26',
          hoverColor: "rgba(242, 111, 38, 0.75)"
        },
        'nhl':{
          parentScope: 'sports',
          scope:'nhl',
          topScope: 'hockey',
          displayName: 'NHL',
          verticalApi: this.getApiUrl() + '/tcx',
          aiApi: null,
          tcxApi: this.getApiUrl(),
          showEventSlider: false,
          showBoxScores:false,
          icon:'fa-icon-nhl',
          pageType: 3,
          color:'#00b9e3',
          hoverColor: "rgba(0, 185, 227, 0.75)"
        },
        'nascar':{
          parentScope: 'sports',
          scope:'nascar',
          topScope: 'nascar',
          displayName: 'NASCAR',
          verticalApi: this.getApiUrl() + '/tcx',
          aiApi: null,
          tcxApi: this.getApiUrl(),
          showEventSlider: false,
          showBoxScores:false,
          icon:'fa-news',
          pageType: 3,
          color:'#00b9e3',
          hoverColor: "rgba(0, 185, 227, 0.75)"
        },
        'business':{
          parentScope: null,
          scope:'all',
          scopeList: ["AMEX", "NYSE", "NASDAQ", "ALL"],
          topScope: 'business',
          displayName: 'Business',
          verticalApi: this.getVerticalEnv('-finance-api.synapsys.us'),
          aiApi: null,
          tcxApi: this.getApiUrl(),
          showEventSlider: true,
          showBoxScores:false,
          icon:'fa-fontawesome-webfont-3',
          pageType: 2,
          searchTitle:'Discover Your Next Investment',
          searchSubTitle:"Find the stocks you can invest in right in your neighborhood",
          placeHolderText:'Search for a Company, Executive or DMA',
          searchBackground:"../app/public/Finance_Search-Module-Image.jpg",
          color:'#009dfb',
          hoverColor: "rgba(48, 152, 255, 0.75)"
        },
        'real estate':{
          parentScope: null,
          scope:'real estate',
          topScope: 'real estate',
          displayName: 'Real Estate',
          verticalApi: this.getVerticalEnv('-joyfulhome-api.synapsys.us'),//dev api is maybe api2.joyfulhome.com
          aiApi: null,
          tcxApi: this.getApiUrl(),
          showEventSlider: false,
          showBoxScores:false,
          icon:'fa-home',
          pageType: 2,
          searchTitle:'Discover Homes For Sale In Your Area',
          searchSubTitle:" ",
          placeHolderText:'Search for a location or address...',
          searchBackground:"../app/public/Real-Estate_Search-Module-Image.jpg",
          color:'#44b224',
          hoverColor: "rgba(68, 178, 36, 0.75)"
        },
        //ABOVE are categories SNTMedia actually has Verticals built specifically for that category

        //BELOW are categories SNTMedia do no have specific verticals for therefore will not have anything linking to a category specific site
        'sports':{
          parentScope: null,
          scope:'sports',
          scopeList: ["MLB", "NCAAM", "NBA", "NCAAF", "NFL", "All"],
          topScope: 'sports',
          displayName: 'Sports',
          verticalApi: this.getApiUrl() + '/tcx',
          aiApi: null,
          tcxApi: this.getApiUrl(),
          showEventSlider: false,
          showBoxScores:false,
          showSFTopNav: true,
          icon:'fa-futbol-o',
          pageType: 1,
          color:'#00b9e3',
          hoverColor: "rgba(0, 185, 227, 0.75)"
        },
        // 'weather':{
        //   parentScope: null,
        //   scope:'hourly',
        //   scopeList: ["10 Day", "5 Day", "Hourly"],
        //   topScope: 'weather',
        //   displayName: 'Weather',
        //   verticalApi: this.getVerticalEnv('-weather.synapsys.us'),
        //   aiApi: null,
        //   tcxApi: this.getApiUrl(),
        //   showEventSlider: true,
        //   showBoxScores:false,
        //   icon:'fa-cloud',
        //   pageType: 2,
        //   color:'#ffdf30',
        //   hoverColor: "rgba(255, 223, 48, 0.75)"
        // },
        'trending':{
          parentScope: null,
          scope:'trending',
          topScope: 'trending',
          displayName: 'Trending News',
          verticalApi: null,
          aiApi: null,
          tcxApi: this.getApiUrl(),
          showEventSlider: false,
          showBoxScores:false,
          icon:'fa-clock',
          pageType: 3,
          color:'#00b9e3',
          hoverColor: "rgba(0, 185, 227, 0.75)"
        },
       /* 'breaking':{
          parentScope: null,
          scope:'breaking',
          topScope: 'breaking',
          displayName: 'Breaking News',
          verticalApi: null,
          aiApi: null,
          tcxApi: this.getApiUrl(),
          showEventSlider: false,
          showBoxScores:false,
          icon:'fa-clock',
          pageType: 3,
          color:'#00b9e3',
          hoverColor: "rgba(0, 185, 227, 0.75)"
        },*/
        'entertainment':{
          parentScope: null,
          scope:'entertainment',
          // scopeList: ["Music", "Movies", "Television", "All"],
          topScope: 'entertainment',
          displayName: 'Entertainment',
          verticalApi: null,
          aiApi: null,
          tcxApi: this.getApiUrl(),
          showEventSlider: false,
          showBoxScores:false,
          showSFTopNav: true,
          icon:'fa-film',
          pageType: 3,
          color:'#00b9e3',
          hoverColor: "rgba(0, 185, 227, 0.75)"
        },
        // 'television':{
        //   parentScope: 'entertainment',
        //   scope:'television',
        //   scopeList: ["Music", "Movies", "Television", "All"],
        //   topScope: 'entertainment',
        //   displayName: 'Television',
        //   verticalApi: null,
        //   aiApi: null,
        //   tcxApi: this.getApiUrl(),
        //   showEventSlider: false,
        //   showBoxScores:false,
        //   showSFTopNav: true,
        //   icon:'fa-film',
        //   pageType: 3,
        //   color:'#00b9e3',
        //   hoverColor: "rgba(0, 185, 227, 0.75)"
        // },
        // 'movies':{
        //   parentScope: 'entertainment',
        //   scope:'movies',
        //   scopeList: ["Music", "Movies", "Television", "All"],
        //   topScope: 'entertainment',
        //   displayName: 'Movies',
        //   verticalApi: null,
        //   aiApi: null,
        //   tcxApi: this.getApiUrl(),
        //   showEventSlider: false,
        //   showBoxScores:false,
        //   showSFTopNav: true,
        //   icon:'fa-film',
        //   pageType: 3,
        //   color:'#00b9e3',
        //   hoverColor: "rgba(0, 185, 227, 0.75)"
        // },
        // 'music':{
        //   parentScope: 'entertainment',
        //   scope:'music',
        //   scopeList: ["Music", "Movies", "Television", "All"],
        //   topScope: 'entertainment',
        //   displayName: 'Music',
        //   verticalApi: null,
        //   aiApi: null,
        //   tcxApi: this.getApiUrl(),
        //   showEventSlider: false,
        //   showBoxScores:false,
        //   showSFTopNav: true,
        //   icon:'fa-film',
        //   pageType: 3,
        //   color:'#00b9e3',
        //   hoverColor: "rgba(0, 185, 227, 0.75)"
        // },
        'lifestyle':{
          parentScope: null,
          scope:'lifestyle',
          topScope: 'lifestyle',
          displayName: 'Lifestyle',
          verticalApi: null,
          aiApi: null,
          tcxApi: this.getApiUrl(),
          showEventSlider: false,
          showBoxScores:false,
          icon:'fa-diamond',
          pageType: 3,
          color:'#00b9e3',
          hoverColor: "rgba(0, 185, 227, 0.75)"
        },
        'food':{
          parentScope: null,
          scope:'food',
          topScope: 'food',
          displayName: 'Food',
          verticalApi: null,
          aiApi: null,
          tcxApi: this.getApiUrl(),
          showEventSlider: false,
          showBoxScores:false,
          icon:'fa-icon-food',
          pageType: 3,
          color:'#00b9e3',
          hoverColor: "rgba(0, 185, 227, 0.75)"
        },
        'travel':{
          parentScope: null,
          scope:'travel',
          topScope: 'travel',
          displayName: 'Travel',
          verticalApi: null,
          aiApi: null,
          tcxApi: this.getApiUrl(),
          showEventSlider: false,
          showBoxScores:false,
          icon:'fa-plane',
          pageType: 3,
          color:'#00b9e3',
          hoverColor: "rgba(0, 185, 227, 0.75)"
        },
        'politics':{
          parentScope: null,
          scope:'politics',
          topScope: 'politics',
          displayName: 'Politics',
          verticalApi: null,
          aiApi: null,
          tcxApi: this.getApiUrl(),
          showEventSlider: false,
          showBoxScores:false,
          icon:'fa-university',
          pageType: 3,
          color:'#ff0101',
          hoverColor: "rgba(255, 1, 1, 0.75)"
        },
        // 'health':{
        //   parentScope: null,
        //   scope:'health',
        //   topScope: 'health',
        //   displayName: 'Health',
        //   verticalApi: null,
        //   aiApi: null,
        //   tcxApi: this.getApiUrl(),
        //   showEventSlider: false,
        //   showBoxScores:false,
        //   icon:'fa-heartbeat',
        //   pageType: 3,
        //   color:'#00b9e3',
        //   hoverColor: "rgba(0, 185, 227, 0.75)"
        // },
        'automotive':{
          parentScope: null,
          scope:'automotive',
          topScope: 'automotive',
          displayName: 'Automotive',
          verticalApi: null,
          aiApi: null,
          tcxApi: this.getApiUrl(),
          showEventSlider: false,
          showBoxScores:false,
          icon:'fa-auto-shape',
          pageType: 3,
          color:'#00b9e3',
          hoverColor: "rgba(0, 185, 227, 0.75)"
        },
        'all':{
          parentScope: null,
          scope:'news-feed',
            weatherscope:'hourly',
            scopeList: ["10 Day", "5 Day", "Hourly"],
          topScope: 'all',
          displayName: null,
          verticalApi: null,
          aiApi: null,
          tcxApi: this.getApiUrl(),
          showEventSlider: true,
          showBoxScores:false,
          icon:'fa-news',
          pageType: 'all',
          color:'#00b9e3',
          hoverColor: "rgba(0, 185, 227, 0.75)",
          weatherverticalApi:this.getVerticalEnv('-weather.synapsys.us'),

        },
        //ABOVE are categories SNTMedia do no have specific verticals for therefore will not have anything linking to a category specific site
      }
      if(category[section] == null){// default return
        return {
          parentScope: null,
          scope:'news-feed',
          topScope: null,
          displayName: section ? GlobalFunctions.toTitleCase(section) : null,
          verticalApi: null,
          aiApi: null,
          tcxApi: this.getApiUrl(),
          showEventSlider: false,
          showBoxScores:false,
          icon: 'fa-news',
          pageType: 3,
          color:'#00b9e3',
          hoverColor: "rgba(0, 185, 227, 0.75)"
        };
      }else{
        return category[section];
      }
    }

    static checkPartnerDomain (partnerCode) {
      var result = false;
      var specialDomains = [
        "latimes.com",
        "orlandosentinel.com",
        "sun-sentinel.com",
        "baltimoresun.com",
        "mcall.com",
        "courant.com",
        "dailypress.com",
        "southflorida.com",
        "citypaper.com",
        "themash.com",
        "coastlinepilot.com",
        "sandiegouniontribune.com",
        "ramonasentinel.com",
        "capitalgazette.com",
        "chicagotribune.com"
      ];
      for (var i = 0; i < specialDomains.length; i++) {
        if (specialDomains[i] == partnerCode) {
          result = true;
          return result;
        }
      }
      return result;
    }
    /*
      scope: vertical scope/category, ex: NBA, mlb, nfl, etc.
      key: page type to link, ex: team for team pages, article for article pages, etc.
      str1: required, use for path of url, ex: team name, company name, search string, etc.
      id: event id or article id if needed, not required
      str2: addition to use for url path if needed, not required
      str3, str4,...: not added but can if needed in the future
    */
    static getOffsiteLink(scope, key: string, str1: string, id?: string | number, str2?: string){
      var link = null;
      var siteVars = this.getHomeInfo();
      var partnerCode;
      if (siteVars.isPartner) {
        partnerCode = siteVars.partnerName;
      }
      switch(scope){
        case 'nba':
        case 'ncaam':
        case 'nfl':
        case 'ncaaf':
        case 'mlb':
          if (partnerCode != null && (this.checkPartnerDomain(partnerCode) && (scope != "nfl" && scope != "ncaaf" && scope != "mlb"))) {// only replace team to t or search to s only if this.checkPartnerDomain(partnerCode) is true and on nfl/ncaaf/mlb pages only
            key = key.replace(/team/g, "t").replace(/search/g, "s");
          }
          if(key == "team" || key == "t"){//team link
            if(scope != "mlb"){//if not baseball then add scope
              if (scope == "nba") {
                link = "NBA/";//exception: need nba scope to be uppercase
              }else if (scope=="ncaam"){
                link = "ncaa/";
              }
              else {
                link = scope + "/";
              }
            }else if(scope == "mlb"){
              link="/";
            }
            link += key + "/" + str1 + "/" + id;
          } else {
            link = str1;
          }
          break;
        case 'business':
          if (partnerCode != null) {
            if(key == "company"){// str1: symbol, id: company id, str2: company name
              key = key ? key.replace(/company/g, "c") : null;
              link = str2 + "/" + str1 + "/" + key + "/" + id;
            } else if(key == "search"){
              link = str1.replace("search", "s");
            }
          } else {
            if(key == "company"){
              link = str1 + "/" + str2 + "/" + key + "/" + id;
            }else if(key == "search"){
              link = str1;
            }
          }
          break;
        //REALESTATE URL
        case 'real estate':
          if (partnerCode != null) {
              key = key ? key.replace(/listing/g, "index") : null;
              if(key == "search"){
                link = str1.replace("search", "s");
              }
          } else {
            if(key == "search"){
              link = str1;
            } else {
              link = key + "/" + str1;
            }
          }
          break;
      }// end switch
      if(key != "article"){
        link = "/" + link;
      }
      link = this.partnerUrlTransform(scope, link);
      return link;
    }
    static partnerUrlTransform(scope, relativeUrl){
      var link = "";
      var siteVars = this.getHomeInfo();
      var partnerCode;
      if (siteVars.isPartner) {
        partnerCode = siteVars.partnerName;
      }
      switch(scope){
        //FOOTBALL URL
        case 'nfl':
        case 'ncaaf':
          if (partnerCode != null) {
            if (this.checkPartnerDomain(partnerCode)) {
              link = "http://football." + partnerCode + relativeUrl;
            }
            else {
              link = "http://" + this.offSiteEnv(scope) + ".mytouchdownzone.com/" + partnerCode + relativeUrl;
            }
          }
          else {
            link = "http://" + this.offSiteEnv(scope) + ".touchdownloyal.com" + relativeUrl;
          }
          break;
        //BASKETBALL URL
        case 'nba':
        case 'ncaam':
          if (partnerCode != null) {
            link = "http://" + this.offSiteEnv(scope) + ".myhoopszone.com/" + partnerCode + relativeUrl;
          }
          else {
            link = "http://" + this.offSiteEnv(scope) + ".hoopsloyal.com" + relativeUrl;
          }
          break;
        //BASEBALL URL
        case 'mlb':
          if (partnerCode != null) {
            if (this.checkPartnerDomain(partnerCode)) {
              link = "http://baseball." + partnerCode + relativeUrl;
            }
            else {
              link = "http://" + this.offSiteEnv(scope) + ".myhomerunzone.com/" + partnerCode + relativeUrl;
            }
          }
          else {
            link = "http://" + this.offSiteEnv(scope) + ".homerunloyal.com" + relativeUrl;
          }
          break;
        //FINANCE URL
        case 'business':

          if (partnerCode != null) {
            link = "http://" + this.offSiteEnv(scope) + ".myinvestkit.com/" + partnerCode + relativeUrl;
          }
          else {

            link = "http://" + this.offSiteEnv(scope) + ".investkit.com" + relativeUrl;

          }
          break;
        //REALESTATE URL
        case 'real estate':
          if (partnerCode != null) {
            link = "http://" + this.offSiteEnv(scope) + ".myhousekit.com/" + partnerCode + relativeUrl;
          }
          else {
            link = "http://" + this.offSiteEnv(scope) + ".joyfulhome.com" + relativeUrl;
          }
          break;
      }
      return link;
    }

    static getVerticalEnv(api){
      return this._proto + "//" + this.getEnv(this._env) + api
    }

    static getCategoryAPI(category:string): string{
      var _apiURL;
      switch(category){
        //FOOTBALL URL
        case 'nfl':
        case 'ncaaf':
          _apiURL = this._proto + "//" + this.getEnv(this._env) + this._tdlAPI;
          break;
        //BASKETBALL URL
        case 'nba':
        case 'ncaam':
          _apiURL = this._proto + "//" + this.getEnv(this._env) + this._tcxAPI;
          break;
        //BASEBALL URL
        case 'mlb':
          _apiURL = this._proto + "//" + this.getEnv(this._env) + this._hrlAPI;
          break;
        //OTHERS TCX URL
        default:
          _apiURL = this._proto + "//" + this.getEnv(this._env) + this._tcxAPI;
          break;
      }
      return _apiURL;
    }

    static storedPartnerId(partnerId?) {
      if(partnerId != null){
        this._partnerId = partnerId;
      }
      return this._partnerId;
    }

    static getApiUrl():string {
        return this._proto + "//" + this.getEnv(this._env) + this._apiUrl;
    }
  static getSearchAPIUrl():string {
    return this._proto + "//" + this.getEnv(this._env) + this._searchAPIUrl;
  }

    static getPartnerApiUrl(partnerID):string {
        return this._proto + "//"+ this.synapsysENV(this._env) + this._partnerApiUrl + partnerID;
    }

    static getWeatherUrl():string {
        return this._proto + "//" + this.getEnv(this._env) + this._weatherUrl;
    }

    static getFinanceUrl():string {
        return this._proto + "//" + this.getEnv(this._env) + this._financeUrl;
    }

    static getFinanceImgUrl():string {
        return this._proto + "//" + this._financeImageUrl + "/images";
    }

    static getGeoLocation():string {
        return this._proto + "//" + this.synapsysENV(this._env) + this._geoUrl;
        // return this._proto + "//" + this._geoUrl;
    }

    static widgetUrl():string {
        return this._proto + "//" + this._widgetUrl;
    }

    static resizeImage(width:number){
      var resizePath;
      let r = window.devicePixelRatio;
      width = width > 1920 ? 1920 : width;//width limit to 1920 if larger
      width = width * r;
      resizePath = "?width=" + width;
      if(width < 100){//increase quality if smaller than 100, default is set to 70
        resizePath += "&quality=90";
      }
      return resizePath;
    }

    static getImageUrl(relativePath, width:number=1920):string {
      var relPath;
      var domain_env = this.getEnv(this._env);
      if(domain_env =="dev" || domain_env =="qa" ){
        domain_env = "dev";
        relPath = relativePath != null && relativePath != "" ? this._proto + "//" + domain_env  +'-'+ this._imageUrl + relativePath: '/app/public/no-image.png';
      }else{
        relPath = relativePath != null && relativePath != "" ? this._proto + "//" + this._imageUrl + relativePath: '/app/public/no-image.png';
      }
      relPath += this.resizeImage(width);
      return relPath;
    }

    static getSportsImageUrl(relativePath, width?:number):string {
        // var relPath = relativePath != null && relativePath != "" ? this._proto + "//" + this.getEnv(this._env) +  "-" + this._sportsimageUrl + relativePath: '/app/public/no-image.svg';
        //todo: when the dev and qa sports image servers are made change this from hardcoded prod to dynamic
        var relPath = relativePath != null && relativePath != "" ? this._proto + "//" + "prod" +  "-" + this._sportsimageUrl + '/' + relativePath: '/app/public/no-image.png';
        width = width ? width : 1920;//if null, set limit to 1920 because it should not be over 1920 width
        relPath += this.resizeImage(width);
        return relPath;
    }

    static getHeadlineUrl():string {
        return this._proto + "//" + this.getEnv(this._env) + this._tcxAPI;
    }

    static getNewsUrl():string {
        //[https:]//[prod]-homerunloyal-api.synapsys.us
        return this._proto + "//" + this._newsUrl;
    }

    static getHomePage(partnerId: string, includePartnerId?: boolean) {
      var linkEnv = this._env != 'localhost' && this._env != "touchdownloyal" && this._env != "mytouchdownzone" && this._env != "football" ? this._env:'www';
        if ( partnerId ) {
            return this._proto + "//" + linkEnv + this._partnerHomepageUrl + (includePartnerId ? "/" + partnerId : "");
        }
        else {
            return this._proto + "//" + linkEnv + this._homepageUrl;
        }
    }

    static getHomeInfo(){
      //grabs the domain name of the site and sees if it is our partner page
      var partner = this.storedPartnerId() != null ? true : false;
      var isHome = false;
      var hide = false;
      var hostname = window.location.hostname;
      var partnerPage = /mytcxzone/.test(hostname) || /^newspaper\./.test(hostname) || this.storedPartnerId() != null; //todo: change to correct domain not localhost
      var urlSplit = window.location.pathname.split('/');
      var name = "";
      var partnerName = "";
      var isSubdomainPartner = /^newspaper\./.test(hostname);
      if(partnerPage){
        partner = partnerPage;
        partnerName = this.storedPartnerId();
        name = urlSplit[2];
      }
      else {
        name = urlSplit[1];
      }
      //PLEASE REVISIT and change
      if(partnerPage && (name == '' || name == 'news')){
        hide = true;
        isHome = true;
      }else if(!partnerPage && (name == '' || name == 'news-feed')){
        hide = false;
        isHome = true;
      }else{
        hide = false;
        isHome = false;
      }

      return {
        isPartner: partner,
        hide:hide,
        isHome:isHome,
        partnerName: partnerName,
        isSubdomainPartner: isSubdomainPartner
      };
    }

    static getSiteLogoUrl():string {
        return "/app/public/mainLogo.jpg";
    }

    static getPageTitle(subtitle?: string, profileName?: string) {
      if(this.getHomeInfo().isPartner){
        this._baseTitle = this._basePartnerTitle;
      }
        return this._baseTitle +
            (profileName && profileName.length > 0 ? " - " + profileName : "") +
            (subtitle && subtitle.length > 0 ? " - " + subtitle : "");
    }

    static getBaseTitle() {
      return this._baseTitle;
    }

    static getBasePartnerTitle() {
      return this._basePartnerTitle;
    }

    static getCopyrightInfo() {
        return this._copyrightInfo;
    }
    static getVerticalFB() {
        return this._verticalFacebook;
    }
    static getVerticalTwitter() {
        return this._verticalTwitter;
    }
    static getSiteTwitterUrl(shareUrl: string) {
      return this._siteTwitterUrl + shareUrl;
    }
    static getSiteFacebookUrl(shareUrl: string) {
      return this._siteFacebookUrl + shareUrl;
    }
    static getLinkedInUrl(shareUrl: string) {
      return this._siteLinkedinUrl + shareUrl;
	  }
    static getSiteGoogleUrl(shareUrl: string) {
      return this._siteGoogleUrl + shareUrl;
	  }

    static getSocialMedia(shareUrl: string){
      let socialMediaItems = [
        {
          type:'facebook',
          url: this._siteFacebookUrl + shareUrl,
          target: '_blank',
          iconClass: 'fa fa-_siteFacebookUrl-1',
        },
        {
          type:'twitter',
          url: this._siteFacebookUrl + shareUrl,
          target: '_blank',
          iconClass: 'fa fa-twitter',
        },
        {
          type:'linkedin',
          url: this._siteLinkedinUrl + shareUrl,
          target: '_blank',
          iconClass: 'fa fa-linkedin',
        },
        {
          type:'google',
          url: this._siteGoogleUrl + shareUrl,
          target: '_blank',
          iconClass: 'fa fa-g-plus',
        },
      ];
      return socialMediaItems;
    }

    static getEstYear() {
      return this._estYear;
    }
    static getHomePageLinkName() {
      return this._homepageLinkName;
    }
    static getDomainAPI(partnerID) {
      return this._domainApiUrl + partnerID;
    }
    static getArticleBatchUrl(){
        return this._proto + "//" + this.getEnv(this._env) + this._articleBatchUrl;
    }

}
