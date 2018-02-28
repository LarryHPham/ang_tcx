import {
    Component, AfterViewInit, Input, OnChanges, OnDestroy, HostListener, ElementRef, Renderer,
    ViewChild
} from '@angular/core';
import {SyndicateArticleService} from "../../services/syndicate-article.service";
import {GlobalSettings} from "../../global/global-settings";
import {ActivatedRoute, Route, Router, NavigationStart, Event as NavigationEvent} from "@angular/router";
import {GlobalFunctions} from "../../global/global-functions";
import {VerticalGlobalFunctions} from "../../global/vertical-global-functions";
import {SeoService} from "../../global/seo.service";
import {runInNewContext} from "vm";
import {element} from "@angular/upgrade/src/angular_js";
import {error} from "util";
import {Location} from "@angular/common";

declare var jQuery:any;
declare var moment;

@Component({
    selector: 'syndicated-article-page',
    templateUrl: './app/webpages/syndicated-article-page/syndicated-article-page.html',

})

export class SyndicatedArticlePage implements OnDestroy, AfterViewInit{
    windowUrl= window.location.href;
    public partnerID: string = GlobalSettings.storedPartnerId();
    checkPartner: boolean;
    public geoLocation:string;
    public articleData: any;
    public recomendationData: any;
    public articleID: string;
    public trendingData:Array<any>=[];
    public eventType: string;
    public imageData=[];
    public imageTitle=[];
    public copyright=[];
    public trendingLength: number = 10;
    @Input() scope: string;
    public category:string;
    public subcategory: string;
    public loadingshow:boolean;
    public articleCount:number;
    public scrollTopPrev:number=0;
    public trendingKeyword:string;
    public callTrendingAPI:boolean=true;
    public currentPage:number=1;
    public subcategorywidgets:string;
    iframeUrl: any;
    paramsub;
    errorPage:boolean=false;
    private isCrawler: boolean = false;

    constructor(
        private _synservice:SyndicateArticleService,
        private activateRoute:ActivatedRoute,
        private router:Router,
        private _eref:ElementRef,
        private _render:Renderer,
        private _seo:SeoService,
        private _location:Location
    ){
        this.checkPartner = GlobalSettings.getHomeInfo().isPartner;
        this.isCrawler = this._seo.elasticSearchUserAgent();
        this.initializePage(this.partnerID);
    }

    initializePage(partner){
        this.paramsub= this.activateRoute.params.subscribe(
            (param :any)=> {
                window.scrollTo(0, 0);
                this.articleID = param['articleID'];
                this.eventType= param['articleType'];
                this.category=param['category'];
                this.category = this.category.replace(/--/g," ");
                this.subcategory=param['subCategory']?param['subCategory']:param['category'];
                this.subcategory = this.subcategory.replace(/--/g," ");
                this.subcategorywidgets = GlobalSettings.getTCXscope(this.subcategory).parentScope!=null?this.subcategory:null;
                if (this.eventType == "story" && this.articleID) {
                    this.getSyndicateArticle(this.articleID, partner);
                } else {
                    this.getSyndicateVideoArticle(this.subcategory, this.articleID, partner);
                }
            }
        );
    }

    ngAfterViewInit(){
        // to run the resize event on load
        try {
            window.dispatchEvent(new Event('load'));
        }catch(e){
            //to run resize event on IE
            var resizeEvent = document.createEvent('UIEvents');
            resizeEvent.initUIEvent('load', true, false, window, 0);
            window.dispatchEvent(resizeEvent);
        }
    }

    private getSyndicateArticle(articleID, partner) {
        this._synservice.getSyndicateArticleService(articleID).subscribe(
            data => {
                try{
                    if(data.data && data.data[0].article_data.article && data.data[0].title) {
                        this.errorPage=false;
                        this.articleData = this._synservice.transformMainArticle(data.data, this.category, this.subcategory, articleID, this.eventType);
                        this.imageData = this.articleData.imageData;
                        this.imageTitle = this.articleData.imageTitle;
                        this.copyright = this.articleData.copyright;
                        this.trendingKeyword=this.articleData.trendingKeyword;
                        this.getRecomendationData(this.category,this.subcategory, 4, false);
                        this.getTrendingArticles(this.category,this.subcategory, this.trendingLength, this.eventType, this.articleID, true, this.currentPage);
                        this.metaTags(data.data[0], this.eventType);
                    }else throw new Error('No article data available');
                }
                catch (e){
                    this.errorPage=true;
                    var self=this;
                    setTimeout(function () {
                        //removes error page from browser history
                        self._location.replaceState('/');
                        if(partner){
                          self.router.navigateByUrl('/' + partner, 'news');
                        } else {
                          self.router.navigateByUrl('/news-feed');
                        }
                    }, 5000);

                }
            },
            err=>{
                this.errorPage=true;
                var self=this;
                setTimeout(function () {
                    //removes error page from browser history
                    self._location.replaceState('/');
                    if(this.checkPartner || this.partnerID){
                      self.router.navigateByUrl('/' + this.partnerID, 'news');
                    } else {
                      self.router.navigateByUrl('/news-feed');
                    }
                  }, 5000);
            }
        )

    }
    private getSyndicateVideoArticle(subCat, articleID, partner){
        this._synservice.getSyndicateVideoService(subCat,articleID).subscribe(
            data => {
                try{
                    if(data.data){
                        this.errorPage=false;
                        this.articleData = data.data;
                        this.articleData.url= VerticalGlobalFunctions.formatArticleRoute(this.category,this.subcategory,this.articleID,this.eventType);
                        this.iframeUrl = this.articleData.video_url + "&autoplay=on";
                        this.metaTags(this.articleData, this.eventType);
                        this.getRecomendationData(this.category,this.subcategory, 4, false);
                        this.getTrendingArticles(this.category,this.subcategory, this.trendingLength, this.eventType, this.articleID, true, this.currentPage);
                    }else throw new Error('oops! No video article data');
                }
                catch (e){
                    this.errorPage=true;
                    var self=this;
                    setTimeout(function () {
                        //removes error page from browser history
                        self._location.replaceState('/');
                        if(partner){
                          self.router.navigateByUrl('/' + partner, 'news');
                        } else {
                          self.router.navigateByUrl('/news-feed');
                        }
                    }, 5000);

                }

            },
            err=>{
                this.errorPage=true;
                var self=this;
                setTimeout(function () {
                    //removes error page from browser history
                    self._location.replaceState('/');
                    if(partner){
                      self.router.navigateByUrl('/' + this.partnerID, 'news');
                    } else {
                      self.router.navigateByUrl('/news-feed');
                    }
                }, 5000);
            }

        )
    }
    ngOnDestroy(){
        this.paramsub.unsubscribe();
    }

    getRecomendationData(c,subc,count,istrending:boolean){
        this._synservice.getArticleBatch(c,subc,count)
            .subscribe(data => {
                try{
                    if(data){
                        this.recomendationData=[];
                        this.recomendationData = this._synservice.transformToRecArticles(data,c, subc,this.eventType, this.articleID);
                    }else throw new Error("Error getting recommended Articles")
                } catch(e){
                    console.log(e.message);
                }

            });
    }
    private getTrendingArticles(c,subc,tl,type,aid,istrending:boolean,cp) {
        this.loadingshow=true;

        this._synservice.getArticleBatch(c,subc,tl,istrending,cp).subscribe(
            data => {
                try{
                    if(data){
                        if(data.length==10) {
                            this.currentPage++;
                            this.loadingshow=true;
                            var newArray = this._synservice.transformTrending(data, c, subc, type, aid);
                            for(var i=0;i<newArray.length;i++) {
                                this.trendingData.push(newArray[i]);
                            }
                        }else if(data.length>0 && data.length<10){
                            this.loadingshow=false;
                            var newArray = this._synservice.transformTrending(data, c, subc, type, aid);
                            for(var i=0;i<newArray.length;i++) {
                                this.trendingData.push(newArray[i]);
                            }
                            this.currentPage++;
                        }
                        else{
                            this.loadingshow=false;
                        }
                    } else throw new Error("Oops! No more Trending Articles")
                }catch(e){
                    this.loadingshow=false;
                    this.callTrendingAPI=false;
                    console.log(e.message);
                }
            }

        )
    }
    private metaTags(data, artType) {
        //This call will remove all meta tags from the head.
        this._seo.removeMetaTags();
        var metaData = data;
        var searchString;
        var searchArray = [];
        let metaDesc = GlobalSettings.getPageTitle('Dive into the most recent news about your favorite sports, movies and read the latest articles on politics, business, travel etc.', 'Articles');
        let link = window.location.href;

        //this._seo.setCanonicalLink(link);
        this._seo.setOgDesc(metaDesc);
        this._seo.setOgType('Website');
        this._seo.setOgUrl(link);
        this._seo.setOgImage(GlobalSettings.getImageUrl('/app/public/mainLogo.png'));
        this._seo.setTitle('TCX Syndicate article');
        this._seo.setMetaDescription(metaDesc);
        this._seo.setMetaRobots('INDEX, NOFOLLOW');
        this._seo.setOgTitle(this.subcategory);
        this._seo.setCategory(this.category);
        //searchArray.push(metaData.title);
        if(data.keywords){
            data.keywords.forEach(function (keyword) {
                searchArray.push(keyword);
            });
        }
        searchString = searchArray.join(',');

        if(artType=="story") {
            let image;
            if(data.image_url != undefined && data.image_url != null){
                image =GlobalSettings.getImageUrl(data.image_url);
            } else{
                image=GlobalSettings.getImageUrl("/app/public/placeholder_XL.png");
            }
            let articleAuthor = '';

            if (data.author) {

                let authorArray = data.author.split(' ');

                if (authorArray[0] == 'By') {
                    for (var i = 1; i < authorArray.length; i++) {
                        articleAuthor += authorArray[i] + ' ';
                    }
                } else {
                    for (var i = 0; i < authorArray.length; i++) {
                        articleAuthor += authorArray[i] + ' ';
                    }
                }

            }
            this._seo.setCanonicalLink(this.activateRoute.params, this.router);
            this._seo.setOgTitle(metaData.title);
            this._seo.setTitle(metaData.title);
            this._seo.setMetaDescription(metaDesc);
            this._seo.setMetaRobots('INDEX, NOFOLLOW');
            this._seo.setIsArticle('true');
            this._seo.setPageType('article');
            this._seo.setSource(metaData.source);
            this._seo.setArticleId(metaData.article_id);
            this._seo.setPageTitle(metaData.title);
            this._seo.setAuthor(articleAuthor);
            this._seo.setPublishedDate(metaData.last_updated);
            this._seo.setPublisher(metaData.publisher);
            this._seo.setImageUrl(image);
            this._seo.setPageDescription(metaData.teaser.replace(/<ng2-route>|<\/ng2-route>/g, ''));
            this._seo.setKeyword(searchString);//should be user input for search
            this._seo.setPageUrl(link);
            this._seo.setArticleType(metaData.article_type);

            //data.teaser?this._seo.setTeaser(data.teaser):this._seo.setTeaser(data.article_data.article[0]);

        }else{//video pages, etc. not article pages
            this._seo.setPageTitle(metaData.title.replace(/\\'/g, "'"));
            this._seo.setPageUrl(link);
            this._seo.setTitle(metaData.title);
            this._seo.setImageUrl(metaData.video_thumbnail);
            this._seo.setPublishedDate(metaData.time_stamp);
            this._seo.setArticleId(metaData.id);
            this._seo.setCategory(metaData.keyword);
            this._seo.setPageDescription(data.teaser);
            this._seo.setIsArticle('false');
            this._seo.setPageType('video article');
            this._seo.setPublisher("sendtonews.com");
            this._seo.setSource(metaData.video_url);
            this._seo.setKeyword(metaData.keyword);
        }
    }

    @HostListener('window:scroll',['$event']) onScroll(e){
        var trendingElement= e.target.body.getElementsByClassName('trending-small')[0];
        var topHeight= window.pageYOffset? window.pageYOffset: window.scrollY;
        var scrollerHeight = e.target.documentElement.scrollHeight?e.target.documentElement.scrollHeight:e.target.body.scrollHeight;
        if(window.innerHeight + topHeight >= scrollerHeight && this.currentPage>1 && this.callTrendingAPI){
            //callTrendingApi is a boolean variable that decide if we have to call the below methods
            this.getTrendingArticles(this.category,this.subcategory, this.trendingLength,this.eventType, this.articleID, true, this.currentPage);

        };
    }
}
