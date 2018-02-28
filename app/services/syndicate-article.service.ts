import { VerticalGlobalFunctions } from "../global/vertical-global-functions";
import {Http, Headers, URLSearchParams, RequestOptions} from "@angular/http";
import { GlobalSettings } from "../global/global-settings";
import { Injectable } from "@angular/core";
import {GlobalFunctions} from "../global/global-functions";
import {Observable} from 'rxjs/Rx';

declare var moment;

@Injectable()
export class SyndicateArticleService {
    private _syndicateUrl: string = GlobalSettings.getArticleBatchUrl();
    private headerOptions = new RequestOptions({headers:new Headers()});


    constructor(public _http: Http) { }

    setToken() {
        var headers = new Headers({ 'content-type': 'application/json' });
        //headers.append(this.headerName, this.apiToken);
        return headers;
    }
    getSyndicateArticleService(articleID) {
        let params:URLSearchParams=new URLSearchParams();
        params.set("articleID", articleID.toString());
        this.headerOptions.search=params;
        var callURL = this._syndicateUrl;
        var mainArticleUrl;
        return this._http.get(callURL, this.headerOptions).retry(2)
            .map(res => {
               mainArticleUrl = res.url;
               return res.json()
            })
            .map(data => {
             try{
                 if(data){
                     return data
                 }else throw new Error ("Failed API call at getSyndicateArticleService method : " + mainArticleUrl );

             }catch(e){
                 console.debug(e.message);
             }
            })
            .catch((error:any) => {
                return Observable.throw(new Error(error.status));
            })
    }

    transformMainArticle(data,c,sc,ai,et){
        data = data[0];
        var imageData=[];
        var imageTitle=[];
        var copyright=[];
        var mainArticleData = new Object();
        mainArticleData['url'] = VerticalGlobalFunctions.formatArticleRoute(c, sc, ai, et);
        mainArticleData['title'] = data.title.replace(/\'/g, "'");
        mainArticleData['author'] = data.author ? data.author.replace(/by/gi, "") + ", ": null;
        mainArticleData['publisher'] = data.publisher? data.publisher:null;
        mainArticleData['publishedDate'] = data.publication_date?GlobalFunctions.sntGlobalDateFormatting(data.publication_date, 'timeZone'):null;
        var imageLength = data.article_data.images && Array.isArray(data.article_data.images)?data.article_data.images.length:0;
        if(imageLength > 0){
          for (var i = 0; i < imageLength; i++) {
            imageData[imageData.length] = GlobalSettings.getImageUrl(data.article_data.images[i].image_url, GlobalSettings._imgLgScreen);
            copyright[copyright.length] = data.article_data.images[i].image_copyright;
            imageTitle[imageTitle.length] = data.article_data.images[i].image_title;
          }
        }else if(imageLength==0){
            imageData[0] = data.image_url? GlobalSettings.getImageUrl(data.image_url, GlobalSettings._imgLgScreen): null;
            copyright[0] = data.image_copyright? data.image_copyright:null;
            imageTitle[0] = data.image_title? data.image_title:null;
        }
        mainArticleData['imageData'] = imageData.length>0 ? imageData : null;
        mainArticleData['imageTitle'] = imageTitle.length>0 ? imageTitle : null;
        mainArticleData['copyright'] = copyright.length>0 ? copyright : null;
        mainArticleData['article'] = data.article_data.article && Array.isArray(data.article_data.article)? data.article_data.article : null;
        mainArticleData['istronc'] = data.source=='tronc'?true:false;
        mainArticleData['linkback_url'] = data.article_data.linkback_url?data.article_data.linkback_url:null;
        return mainArticleData;
    }
    getSyndicateVideoService(subcategory, articleID){
        //Configure HTTP Headers
        /*var headers = this.setToken();*/
        var callURL = GlobalSettings.getApiUrl() + '/tcx/videoSingle/' +subcategory +'/'+ articleID;
        return this._http.get(callURL)
            .map(res => {
                return res.json()
            })
            .map(data => {
                try{
                    if(data){
                        return data;
                    } else throw new Error(" Failed API call at getSyndicateVideoService : " + callURL);
                }catch(e){
                    console.debug(e.message);
                }

            })
            .catch((error:any) => {
                return Observable.throw(new Error(error.status));
            })
    }

    getArticleBatch(category, subcategory,count,trending?,page?){
        category = category.replace(/--/g," ");
        subcategory= subcategory.replace(/--/g," ");
        let params:URLSearchParams=new URLSearchParams();

        if(GlobalSettings.getTCXscope(subcategory).topScope == 'basketball' || GlobalSettings.getTCXscope(subcategory).topScope == 'football'||GlobalSettings.getTCXscope(subcategory).topScope == 'baseball'){
            params.set("category", "sports");
            params.set("subCategory",subcategory);
        }else{
            params.set("category", category)
        };
        params.set("count", count.toString());
        params.set("metaDataOnly","1");

        let callURL = GlobalSettings.getArticleBatchUrl()+"?&source[]=snt_ai&source[]=tca-curated&source[]=tronc";
        var currentRecUrl;
        var currentTrenUrl;
        if(typeof trending==='undefined') {
            this.headerOptions.search = params;
            return this._http.get(callURL, this.headerOptions)
                .map(res =>{
                    currentRecUrl = res.url;
                    return res.json()
                })
                .map(data => {
                    try{
                        if(data.data){
                            return data.data
                        } else throw new Error ("Failed API call at getArticleBatch method in recommended article section : " + currentRecUrl);
                    }catch(e){
                        console.debug(e.message);
                    }
                })
                .catch((error:any) => {
                    return Observable.throw(new Error(error.status));
                })
        } else{
            params.set("trending","1");
            params.set("page",page.toString());
            this.headerOptions.search = params;
            return this._http.get(callURL, this.headerOptions)
                .map(res =>{
                    currentTrenUrl = res.url;
                    return res.json()
                })
                .map(data => {
                    try{
                        if(data.data){
                            return data.data;
                        } else throw new Error("Failed API call at getArticleBatch method in Trending article section : " + currentTrenUrl);
                    }catch(e){
                        console.debug(e.message);
                    }

                })
                .catch((error:any) => {
                    return Observable.throw(new Error(error.status));
                })
        }
    }

    transformToRecArticles(data, c, scope, articleType, currentArticleId) {
        articleType = "story";
        var sampleImage = "/app/public/placeholder_XL.png";
        var articleStackArray = [];
        data.forEach(function(val, index) {
            if (val.article_id != currentArticleId){
                var category = val.article_sub_type ? val.article_sub_type : val.article_type;
                var date = GlobalFunctions.sntGlobalDateFormatting(val.publication_date, 'dayOfWeek');
                var s = {
                    imageConfig: {
                        imageClass: "embed-responsive-16by9",
                        imageUrl: val.image_url != null ? GlobalSettings.getImageUrl(val.image_url, GlobalSettings._imgFullScreen) : sampleImage,
                        extUrl: val.source != "snt_ai" ? false : true,
                        urlRouteArray: val.source != "snt_ai" ? VerticalGlobalFunctions.formatArticleRoute(c, scope, val.article_id, articleType) : GlobalSettings.getOffsiteLink(val.scope, "article", VerticalGlobalFunctions.formatExternalArticleRoute(val.scope, category, val.event_id)),
                        imageDesc: "",
                    },
                    citationInfo: {
                      url: val.image_origin_url ? val.image_origin_url : "/",
                      info: (val.image_title ? val.image_title : "") + (val.image_title && val.image_owner ? "/" : "") + (val.image_owner ? val.image_owner : "")
                    },
                    keyword: val.keywords.length>0? val.keywords[0].toUpperCase():scope,
                    timeStamp: date,
                    title: val.title? val.title.replace(/\'/g, "'"): "",
                    extUrl:val.source != "snt_ai" ? false : true,
                    keyUrl: val['keywords'][0] ? VerticalGlobalFunctions.formatSectionFrontRoute(val['keywords'][0]) : ["/news-feed"],
                    articleUrl: val.source != "snt_ai" ? VerticalGlobalFunctions.formatArticleRoute(c, scope, val.article_id, articleType) : GlobalSettings.getOffsiteLink(val.scope, "article", VerticalGlobalFunctions.formatExternalArticleRoute(val.scope, articleType, val.event_id)),

                }
                articleStackArray.push(s);
            }
        });
        if(articleStackArray.length==3){ return articleStackArray;}
        else if(articleStackArray.length>3){return articleStackArray.slice(1)}

    }

    transformTrending(data, c, scope, articleType, currentArticleId) {
        articleType = "story";
        var placeholder = "/app/public/placeholder_XL.png";
        data.forEach(function(val, index) {
            var category = val.article_sub_type ? val.article_sub_type : val.article_type;
            val["date"] = GlobalFunctions.sntGlobalDateFormatting(val.publication_date, 'timeZone');
            val['extUrl']=val.source!="snt_ai"?false:true;
            val["content"]=val.teaser;
            val["url"] = val.source!="snt_ai"?VerticalGlobalFunctions.formatArticleRoute(c, scope, val.article_id, articleType):GlobalSettings.getOffsiteLink(val.scope,"article", VerticalGlobalFunctions.formatExternalArticleRoute(val.scope, category, val.event_id));
            val['teaser']=val.teaser?val.teaser:val.article_data.article[0];
            val["imageConfig"]={
              imageClass: "embed-responsive-16by9",
              imageUrl: val.image_url ? GlobalSettings.getImageUrl(val.image_url, 620) : placeholder,
              urlRouteArray: val["url"],
              extUrl: val['extUrl']
            };

            var articleWriter='';
            val['citationInfo'] = {
              url: val.image_origin_url ? val.image_origin_url : "/",
              info: (val.image_title ? val.image_title : "") + (val.image_title && val.image_owner ? "/" : "") + (val.image_owner ? val.image_owner : "")
            };
            val['author']=val.author ? val.author.replace(/by/gi, "") + ", ": null;
            val['title']= val.title? val.title.replace(/\'/g, "'"): "";
        })
        return data;
    }
}
