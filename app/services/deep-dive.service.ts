import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Http, Headers, URLSearchParams, RequestOptions } from '@angular/http';

import { VideoStackData, ArticleStackData } from "../fe-core/interfaces/deep-dive.data";
import { GlobalFunctions } from "../global/global-functions";
import { GlobalSettings } from "../global/global-settings";
import { VerticalGlobalFunctions } from "../global/vertical-global-functions";
import { getResponseURL } from "@angular/http/src/http_utils";


declare var moment;

@Injectable()
export class DeepDiveService {
  private options = new RequestOptions({ headers: new Headers() });


  constructor(public http: Http) { }

  //Function to set custom headers
  setToken() {
    var headers = new Headers();
    return headers;
  }

  getDeepDiveBatchService(category: string, limit: number, page: number, state?: string) {

    category = category.replace(/--/g, " ");
    let params: URLSearchParams = new URLSearchParams();
    var checkCategory = GlobalSettings.getTCXscope(category).topScope;
    if (checkCategory == 'basketball' || checkCategory == 'football' || checkCategory == 'baseball') {
      params.set("category", "sports");
      params.set("subCategory", category);
    } else if (checkCategory != null) {
      params.set("category", category)
    } else {
      params.set("keyword[]", category)
    };
    params.set("count", limit.toString());
    params.set("page", page.toString());
    params.set("metaDataOnly", "1");
    this.options.search = params;

    // NOTE: DUMMY DATA
    var ddata = this.dummyData();

    return new Observable(observer => {
        //TODO TEST
        observer.next(ddata);
        observer.complete();
    });

    // let callURL = GlobalSettings.getArticleBatchUrl() + "?&source[]=snt_ai&source[]=tca-curated&source[]=tronc";
    // var currentUrl;
    // return this.http.get(callURL, this.options).retry(3)
    //   .map(res => {
    //     currentUrl = res.url;
    //     return res.json()
    //   })
    //   .map(data => {
    //     try {
    //       if (data.data) {
    //         if (data.data.length > 0) {
    //           return data.data;
    //         } else {
    //           return null;
    //         }
    //       } else throw new Error("Failed API call at getDeepDiveBatchService method :" + " " + currentUrl)
    //     } catch (e) {
    //       console.debug(e.message);
    //     }
    //   })
    //
    //   .catch((error: any) => {
    //     return Observable.throw(new Error(error.status));
    //   })

  }

  getCarouselData(scope, data, limit, batch, state, callback: Function) {
    var carouselData = {};
    return carouselData;
  }

  getDeepDiveVideoBatchService(category: string, limit?: number, page?: number, location?: string) {
    category = category.replace(/--/g, " ");
    var headers = this.setToken();
    var callURL;
    if (limit === null || typeof limit == 'undefined') {
      limit = 5;
      page = 1;
    }
    if (category.toLowerCase() == "ncaaf") { category = "fbs"; }
    if (GlobalSettings.getTCXscope(category).topScope == "football" || GlobalSettings.getTCXscope(category).topScope == "baseball") {
      callURL = GlobalSettings.getTCXscope(category).verticalApi + '/tcx';
    } else {
      callURL = GlobalSettings.getHeadlineUrl();
    }
    callURL += '/videoBatch/' + category;
    //http://dev-article-library.synapsys.us/tcx/videoBatch/sports/10/1
    //http://qa-homerunloyal-api.synapsys.us/tcx/videoBatch/mlb/5/1
    //http://qa-touchdownloyal-api.synapsys.us/tcx/videoBatch/nfl/5/1
    //http://qa-touchdownloyal-api.synapsys.us/tcx/videoBatch/fbs/5/1
    if (GlobalSettings.getTCXscope(category).topScope == "basketball") {
      callURL += '/' + page + '/' + limit;
    } else {
      callURL += '/' + limit + '/' + page;
      if (GlobalSettings.getTCXscope(category).topScope == "nfl" && location !== null) {
        callURL += '/' + location;
      }
    }

    // NOTE: DUMMY DATA
    var ddata = this.dummyData();

    return new Observable(observer => {
        observer.next(ddata);
        observer.complete();
    });

    // var currentVideoURL;
    // return this.http.get(callURL, { headers: headers })
    //   .map(res => {
    //     currentVideoURL = res.url;
    //     return res.json();
    //   })
    //   .map(data => {
    //     try {
    //       if (data.success) {
    //         if (data.data.length > 0) {
    //           return data.data;
    //         } else {
    //           return null;
    //         }
    //       } else throw new Error("Failed API call at getDeepDiveVideoBatchService method :" + " " + currentVideoURL);
    //     } catch (e) {
    //       console.debug(e.message);
    //     }
    //   })
    //   .catch((error: any) => {
    //     return Observable.throw(new Error(error.status));
    //   })

  }// getDeepDiveVideoBatchService ENDS

  // transformSportVideoBatchData(data: Array<VideoStackData>, scope?) {
  transformSportVideoBatchData(data, scope?) {
    if (data == null || typeof data == "undefined" || data.length == 0) {
      return null;
    }
    var sampleImage = "/app/public/placeholder_XL.png";
    var videoBatchArray = [];
    scope = scope ? scope : "sports";
    data.forEach(function(val, index) {
      if (val.time_stamp) {
        var date = moment(Number(val.time_stamp));
        date = date.format('dddd') + ', ' + date.format('MMM') + date.format('. DD, YYYY');
      }else{
        var date = moment();
        date = date.format('dddd') + ', ' + date.format('MMM') + date.format('. DD, YYYY');
      }
      var keywords = val.keyword ? val.keyword : scope;
      var keyHyphen = keywords.replace(/ /g, "--");
      var keyLink = true;
      if (keywords.toLowerCase() === scope.toLowerCase()) {
        keyLink = false;
      }
      var d = {
        id: val.id ? val.id : 0,
        keyLink: keyLink,
        keyword: keywords,
        title: val.title ? val.title : "Headline Title",
        time_stamp: date ? date : "",
        video_thumbnail: val.video_thumbnail ? val.video_thumbnail : sampleImage,
        embed_url: val.video_url != null ? val.video_url : null,
        video_url: VerticalGlobalFunctions.formatArticleRoute(scope, keyHyphen, val.id, "video"),
        keyUrl: VerticalGlobalFunctions.formatSectionFrontRoute(keyHyphen),
        teaser: val.teaser ? val.teaser : "Delectus suavitate et eum. Qui vide ipsum an. Cum ut autem vitae hendrerit, sit simul soleat deserunt at. Nonumes maiestatis ei vel. Civibus explicari an cum, sed te movet commodo saperet, has eu unum vocibus."
      };
      videoBatchArray.push(d);
    });
    return videoBatchArray;
  }// transformDeepDiveVideoBatchData ENDS

  // Article Batch Transformed Data
  // transformToArticleStack(data: Array<ArticleStackData>, topcategory?, imageSize?) {
  transformToArticleStack(data, topcategory?, imageSize?) {
    if (data == null) { return null; }
    var sampleImage = "/app/public/placeholder_XL.png";
    var articleStackArray = [];
    let route = VerticalGlobalFunctions.getWhiteLabel();
    imageSize = imageSize ? imageSize : GlobalSettings._imgFullScreen;
    data.forEach(function(val, index) {
      // if (val.article_id != null && typeof val.article_id != 'undefined') {
        if (val.publication_date || val.last_updated) {
          let d = val.publication_date ? val.publication_date : val.last_updated;
          var date = moment.unix(Number(d));
          date = '<span class="hide-320">' + date.format('dddd') + ', </span>' + date.format('MMM') + date.format('. DD, YYYY');
        }
        var key;
        var routeLink;
        var extLink;
        var author = null;
        var publisher = null;
        var category = val.article_sub_type ? val.article_sub_type : val.article_type;
        //keywords note: For articles, get the second keyword if possible, second keyword should be the subcategory for curated articles.
        if (val.keywords.length > 0 && val.keywords[0] != "none" && val.keywords[0]) {
          if (val.keywords.length > 1 && val.keywords[1] != "none" && val.keywords[1] && val.source != "snt_ai") {
            key = val.keywords[1];
          } else {
            key = val.keywords[0];
          }
        } else {
          if (val.subcategory) {
            key = val.subcategory;
          } else {
            key = val.category;
          }
        }
        var keyhyphen = key.replace(/ /g, "--");
        if (val.source == "snt_ai") {// If AI article then redirect to the corresponding vertical
          routeLink = GlobalSettings.getOffsiteLink(val.scope, "article", VerticalGlobalFunctions.formatExternalArticleRoute(val.scope, category, val.event_id));
          extLink = true;
        } else {
          if (val.keywords.length > 0) {
            if (topcategory != val.keywords[0] && val.keywords[0]) {
              topcategory = val.keywords[0].replace(/ /g, "--");
            } else {
              topcategory = topcategory.replace(/ /g, "--");
            }
          }
          routeLink = topcategory ? VerticalGlobalFunctions.formatArticleRoute(topcategory, keyhyphen.toLowerCase(), val.article_id, "story") : null;
          extLink = false;
          author = val.author ? val.author.replace(/by/gi, "") + ", " : null;
          publisher = author ? val.publisher : "Published by: " + val.publisher;
        }
        if (val.teaser) {
          var limitDesc = val.teaser.substr(0, 360);// limit teaser character to 360 count
          limitDesc = limitDesc.substr(0, Math.min(limitDesc.length, limitDesc.lastIndexOf(" ")));// and not cutting the word
          if (val.teaser.length > 360 || limitDesc.length < val.teaser.length) {
            limitDesc += "...";
          }
        }
        if (val.title) {
          var limitTitle = val.title.substr(0, 200);//// limit title character to 200 count
          if (val.title.length > 200 || limitTitle.length < val.title.length) {
            limitTitle += "...";
          }
        }
        var articleStackData = {
          id: val.article_id,
          articleUrl: routeLink != "" ? routeLink : route,
          extUrl: extLink,
          keyword: key,
          timeStamp: date ? date : "",
          title: val.title ? limitTitle : "No title available",
          author: author,
          publisher: val.publisher && val.author ? "Written By: " + "<b class='text-master'>" + author + publisher + "</b>" : null,
          teaser: val.teaser ? limitDesc : "No teaser available",
          imageConfig: {
            imageClass: "embed-responsive-16by9",
            imageUrl: val.image_url ? GlobalSettings.getImageUrl(val.image_url, imageSize) : sampleImage,
            urlRouteArray: routeLink,
            extUrl: extLink
          },
          image_source: val.image_source ? val.image_source : null,
          citationInfo: {
            url: val.image_origin_url ? val.image_origin_url : "/",
            info: (val.image_title ? val.image_title : "") + (val.image_title && val.image_owner ? "/" : "") + (val.image_owner ? val.image_owner : "")
          },
          keyUrl: key != "all" && key && typeof key != "underfined" ? VerticalGlobalFunctions.formatSectionFrontRoute(keyhyphen.toLowerCase()) : [route]
        }
        articleStackArray.push(articleStackData);
      // }
    });
    return articleStackArray;
  }// transformToArticleStack ENDS

  carouselTransformData(arrayData: Array<ArticleStackData>, scope) {
    if (arrayData == null || typeof arrayData == 'undefined' || arrayData.length == 0 || arrayData === undefined) {
      return null;
    }
    var setScope = scope;
    var sampleImage = "/app/public/placeholder_XL.png";
    let route = VerticalGlobalFunctions.getWhiteLabel();
    var transformData = [];
    arrayData.forEach(function(val, index) {
      var curdate = new Date();
      var curmonthdate = curdate.getDate();
      let d = val.publication_date ? val.publication_date : val.last_updated;
      if (d) {
        var timeStamp = moment(Number(d)).format("MMMM Do, YYYY h:mm:ss a");
      }

      var routeLink;
      var extLink;
      var category = val.article_sub_type ? val.article_sub_type : val.article_type;
      var key;
      if (val.keywords.length > 0 && val.keywords[0] != "none" && val.keywords[0]) {
        if (val.keywords.length > 1 && val.keywords[1] != "none" && val.keywords[1] && val.source != "snt_ai") {
          key = val.keywords[1];
        } else {
          key = val.keywords[0];
        }
      } else {
        if (val.subcategory) {
          key = val.subcategory;
        } else {
          key = val.category;
        }
      }
      var keyhyphen = key.replace(/ /g, "--");

      if (val.source == "snt_ai") {
        routeLink = GlobalSettings.getOffsiteLink(val.scope, "article", VerticalGlobalFunctions.formatExternalArticleRoute(val.scope, category, val.event_id));
        extLink = true;
      } else {
        if (val.keywords.length > 0) {
          if (scope != val.keywords[0] && val.keywords[0]) {
            scope = val.keywords[0].replace(/ /g, "--");
          } else {
            scope = scope.replace(/ /g, "--");
          }
        }

        routeLink = VerticalGlobalFunctions.formatArticleRoute(scope, keyhyphen.toLowerCase(), val.article_id, "story");
        extLink = false;
      }
      var teaserTrim = val['teaser'];
      var titleTrim = val['title'];
      if (teaserTrim.length >= 200) {
        teaserTrim = val['teaser'].substr(0, 200) + '...';
      }
      if (titleTrim.length >= 90) {
        titleTrim = val['title'].substr(0, 90) + '...';
      }
      var keyLink = true;
      if (key.toLowerCase() === setScope.toLowerCase()) {
        keyLink = false;
      }
      let carData = {
        articlelink: routeLink != "" ? routeLink : route,
        keyLink: keyLink,
        extUrl: extLink,
        source: val.source,
        report_type: val.report_type,
        image_url: val['image_url'] ? GlobalSettings.getImageUrl(val['image_url'], GlobalSettings._imgWideScreen) : sampleImage,
        title: "<span> Today's News: </span>",
        headline: titleTrim ? titleTrim : "",
        keywords: key ? key : "NEWS",
        keyUrl: val['keywords'][0] ? VerticalGlobalFunctions.formatSectionFrontRoute(keyhyphen.toLowerCase()) : ["/news-feed"],
        teaser: teaserTrim ? teaserTrim.replace('_', ': ').replace(/<p[^>]*>/g, "") : "",
        article_id: val['article_id'],
        article_url: val['article_url'],
        last_updated: val.publication_date,
        image_source: val.image_source ? val.image_source : null,
        citationInfo: {
          url: val.image_origin_url ? val.image_origin_url : "/",
          info: (val.image_title ? val.image_title : "") + (val.image_title && val.image_owner ? "/" : "") + (val.image_owner ? val.image_owner : "")
        }
      };
      transformData.push(carData);
    });
    return transformData;
  }

  carouselDummyData() {
    let route = VerticalGlobalFunctions.getWhiteLabel();
    var sampleImage = "/app/public/placeholder_XL.png";
    var articleStackData = {
      article_id: 88,
      article_url: route,
      keywords: ['Deep Dive'],
      source: 'test',
      report_type: 'report type',
      image_url: sampleImage,
      last_updated: moment().format("MMMM Do, YYYY h:mm:ss a"),
      title: "No title available",
      author: "",
      publisher: "",
      teaser: "No teaser available",
      imageConfig: {
        imageClass: "embed-responsive-16by9",
        imageUrl: sampleImage,
        urlRouteArray: [route]
      },
    }
    return [articleStackData];
  }

  dummyData(){
    var ddata = [
      {
        id: 0,
        title: 'Lorem ipsum dolor sit amet',
        keywords:['keyword', 'key', 'keyword'],
        last_updated: moment().unix(),
        author: 'author',
        publisher: 'publisher',
        scope: 'sports',
        teaser: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Haec para/doca illi, nos admirabilia dicamus. Tria genera bonorum; Nihilo magis. Illud non continuo, ut aeque incontentae. Si quae forte-possumus. Duo Reges: constructio interrete. Dat enim intervalla et relaxat. Estne, quaeso, inquam, sitienti in bibendo voluptas?',
        image_url: '',
      },{
        id: 0,
        title: 'Tria genera bonorum',
        keywords:['keyword', 'key', 'keyword'],
        last_updated: moment().unix(),
        author: 'author',
        publisher: 'publisher',
        scope: 'sports',
        teaser: 'Sed nunc, quod agimus; Quia dolori non voluptas contraria est, sed doloris privatio. Scrupulum, inquam, abeunti; Quid censes in Latino fore? Iubet igitur nos Pythius Apollo noscere nosmet ipsos. Prave, nequiter, turpiter cenabat;',
        image_url: '',
      },{
        id: 0,
        title: 'Nihilo magis',
        keywords:['keyword', 'key', 'keyword'],
        last_updated: moment().unix(),
        author: 'author',
        publisher: 'publisher',
        scope: 'sports',
        teaser: 'Que Manilium, ab iisque M. Non quam nostram quidem, inquit Pomponius iocans; Si longus, levis. Haec dicuntur inconstantissime. Mihi quidem Antiochum, quem audis, satis belle videris attendere. Unum est sine dolore esse, alterum cum voluptate.',
        image_url: '',
      },{
        id: 0,
        title: 'Dat enim intervalla et relaxat',
        keywords:['keyword', 'key', 'keyword'],
        last_updated: moment().unix(),
        author: 'author',
        publisher: 'publisher',
        scope: 'sports',
        teaser: 'Delectus suavitate et eum. Qui vide ipsum an. Cum ut autem vitae hendrerit, sit simul soleat deserunt at. Nonumes maiestatis ei vel. Civibus explicari an cum, sed te movet commodo saperet, has eu unum vocibus',
        image_url: '',
      },{
        id: 0,
        title: 'Aufert enim sensus actionemque tollit omnem Quae contraria sunt his, malane?',
        keywords:['keyword', 'key', 'keyword'],
        last_updated: moment().unix(),
        author: 'author',
        publisher: 'publisher',
        scope: 'sports',
        teaser: 'Animum autem reliquis rebus ita perfecit, ut corpus; Frater et T. Quae contraria sunt his, malane? Aliter enim nosmet ipsos nosse non possumus. Graccho, eius fere, aequalí? Verum hoc idem saepe faciamus.',
        image_url: '',
      },{
        id: 0,
        title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        keywords:['keyword', 'key', 'keyword'],
        last_updated: moment().unix(),
        author: 'author',
        publisher: 'publisher',
        scope: 'sports',
        teaser: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Haec para/doca illi, nos admirabilia dicamus. Tria genera bonorum; Nihilo magis. Illud non continuo, ut aeque incontentae. Si quae forte-possumus. Duo Reges: constructio interrete. Dat enim intervalla et relaxat. Estne, quaeso, inquam, sitienti in bibendo voluptas?',
        image_url: '',
      },{
        id: 0,
        title: 'Tria genera bonorum Iubet igitur nos Pythius Apollo noscere nosmet ipsos.',
        keywords:['keyword', 'key', 'keyword'],
        last_updated: moment().unix(),
        author: 'author',
        publisher: 'publisher',
        scope: 'sports',
        teaser: 'Sed nunc, quod agimus; Quia dolori non voluptas contraria est, sed doloris privatio. Scrupulum, inquam, abeunti; Quid censes in Latino fore? Iubet igitur nos Pythius Apollo noscere nosmet ipsos. Prave, nequiter, turpiter cenabat;',
        image_url: '',
      },{
        id: 0,
        title: 'Nihilo magis Que Manilium, ab iisque M. Non quam nostram quidem',
        keywords:['keyword', 'key', 'keyword'],
        last_updated: moment().unix(),
        author: 'author',
        publisher: 'publisher',
        scope: 'sports',
        teaser: 'Que Manilium, ab iisque M. Non quam nostram quidem, inquit Pomponius iocans; Si longus, levis. Haec dicuntur inconstantissime. Mihi quidem Antiochum, quem audis, satis belle videris attendere. Unum est sine dolore esse, alterum cum voluptate.',
        image_url: '',
      },{
        id: 0,
        title: 'Dat enim intervalla et relaxat Delectus suavitate et eum. Qui vide ipsum an.',
        keywords:['keyword', 'key', 'keyword'],
        last_updated: moment().unix(),
        author: 'author',
        publisher: 'publisher',
        scope: 'sports',
        teaser: 'Delectus suavitate et eum. Qui vide ipsum an. Cum ut autem vitae hendrerit, sit simul soleat deserunt at. Nonumes maiestatis ei vel. Civibus explicari an cum, sed te movet commodo saperet, has eu unum vocibus',
        image_url: '',
      },{
        id: 0,
        title: 'Aufert enim sensus actionemque tollit omnem ipsos nosse non possumus',
        keywords:['keyword', 'key', 'keyword'],
        last_updated: moment().unix(),
        author: 'author',
        publisher: 'publisher',
        scope: 'sports',
        teaser: 'Animum autem reliquis rebus ita perfecit, ut corpus; Frater et T. Quae contraria sunt his, malane? Aliter enim nosmet ipsos nosse non possumus. Graccho, eius fere, aequalí? Verum hoc idem saepe faciamus.',
        image_url: '',
      },{
        id: 0,
        title: 'Lorem ipsum dolor sit amet Illud non continuo',
        keywords:['keyword', 'key', 'keyword'],
        last_updated: moment().unix(),
        author: 'author',
        publisher: 'publisher',
        scope: 'sports',
        teaser: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Haec para/doca illi, nos admirabilia dicamus. Tria genera bonorum; Nihilo magis. Illud non continuo, ut aeque incontentae. Si quae forte-possumus. Duo Reges: constructio interrete. Dat enim intervalla et relaxat. Estne, quaeso, inquam, sitienti in bibendo voluptas?',
        image_url: '',
      },{
        id: 0,
        title: 'Tria genera bonorum Iubet igitur nos Pythius Apollo',
        keywords:['keyword', 'key', 'keyword'],
        last_updated: moment().unix(),
        author: 'author',
        publisher: 'publisher',
        scope: 'sports',
        teaser: 'Sed nunc, quod agimus; Quia dolori non voluptas contraria est, sed doloris privatio. Scrupulum, inquam, abeunti; Quid censes in Latino fore? Iubet igitur nos Pythius Apollo noscere nosmet ipsos. Prave, nequiter, turpiter cenabat;',
        image_url: '',
      },{
        id: 0,
        title: 'Nihilo magis Non quam nostram quidem, inquit Pomponius iocans',
        keywords:['keyword', 'key', 'keyword'],
        last_updated: moment().unix(),
        author: 'author',
        publisher: 'publisher',
        scope: 'sports',
        teaser: 'Que Manilium, ab iisque M. Non quam nostram quidem, inquit Pomponius iocans; Si longus, levis. Haec dicuntur inconstantissime. Mihi quidem Antiochum, quem audis, satis belle videris attendere. Unum est sine dolore esse, alterum cum voluptate.',
        image_url: '',
      },{
        id: 0,
        title: 'Dat enim intervalla et relaxat',
        keywords:['keyword', 'key', 'keyword'],
        last_updated: moment().unix(),
        author: 'author',
        publisher: 'publisher',
        scope: 'sports',
        teaser: 'Delectus suavitate et eum. Qui vide ipsum an. Cum ut autem vitae hendrerit, sit simul soleat deserunt at. Nonumes maiestatis ei vel. Civibus explicari an cum, sed te movet commodo saperet, has eu unum vocibus',
        image_url: '',
      },{
        id: 0,
        title: 'Aufert enim sensus actionemque tollit omnem Non quam nostram quidem, inquit Pomponius iocans',
        keywords:['keyword', 'key', 'keyword'],
        last_updated: moment().unix(),
        author: 'author',
        publisher: 'publisher',
        scope: 'sports',
        teaser: 'Animum autem reliquis rebus ita perfecit, ut corpus; Frater et T. Quae contraria sunt his, malane? Aliter enim nosmet ipsos nosse non possumus. Graccho, eius fere, aequalí? Verum hoc idem saepe faciamus.',
        image_url: '',
      },{
        id: 0,
        title: 'Lorem ipsum dolor sit amet',
        keywords:['keyword', 'key', 'keyword'],
        last_updated: moment().unix(),
        author: 'author',
        publisher: 'publisher',
        scope: 'sports',
        teaser: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Haec para/doca illi, nos admirabilia dicamus. Tria genera bonorum; Nihilo magis. Illud non continuo, ut aeque incontentae. Si quae forte-possumus. Duo Reges: constructio interrete. Dat enim intervalla et relaxat. Estne, quaeso, inquam, sitienti in bibendo voluptas?',
        image_url: '',
      },{
        id: 0,
        title: 'Tria genera bonorum  Qui vide ipsum an. Cum ut autem vitae hendrerit',
        keywords:['keyword', 'key', 'keyword'],
        last_updated: moment().unix(),
        author: 'author',
        publisher: 'publisher',
        scope: 'sports',
        teaser: 'Sed nunc, quod agimus; Quia dolori non voluptas contraria est, sed doloris privatio. Scrupulum, inquam, abeunti; Quid censes in Latino fore? Iubet igitur nos Pythius Apollo noscere nosmet ipsos. Prave, nequiter, turpiter cenabat;',
        image_url: '',
      },{
        id: 0,
        title: 'Nihilo magis Non quam nostram quidem, inquit Pomponius iocans',
        keywords:['keyword', 'key', 'keyword'],
        last_updated: moment().unix(),
        author: 'author',
        publisher: 'publisher',
        scope: 'sports',
        teaser: 'Que Manilium, ab iisque M. Non quam nostram quidem, inquit Pomponius iocans; Si longus, levis. Haec dicuntur inconstantissime. Mihi quidem Antiochum, quem audis, satis belle videris attendere. Unum est sine dolore esse, alterum cum voluptate.',
        image_url: '',
      },{
        id: 0,
        title: 'Dat enim intervalla et relaxat  Qui vide ipsum an. Cum ut autem vitae hendrerit',
        keywords:['keyword', 'key', 'keyword'],
        last_updated: moment().unix(),
        author: 'author',
        publisher: 'publisher',
        scope: 'sports',
        teaser: 'Delectus suavitate et eum. Qui vide ipsum an. Cum ut autem vitae hendrerit, sit simul soleat deserunt at. Nonumes maiestatis ei vel. Civibus explicari an cum, sed te movet commodo saperet, has eu unum vocibus',
        image_url: '',
      },{
        id: 0,
        title: 'Aufert enim sensus actionemque tollit omnem',
        keywords:['keyword', 'key', 'keyword'],
        last_updated: moment().unix(),
        author: 'author',
        publisher: 'publisher',
        scope: 'sports',
        teaser: 'Animum autem reliquis rebus ita perfecit, ut corpus; Frater et T. Quae contraria sunt his, malane? Aliter enim nosmet ipsos nosse non possumus. Graccho, eius fere, aequalí? Verum hoc idem saepe faciamus.',
        image_url: '',
      }];
      return ddata;
  }
}// DeepDiveService ENDS
