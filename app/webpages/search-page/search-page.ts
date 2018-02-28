
import {Component, HostListener, Renderer, OnDestroy, OnInit, OnChanges} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {SearchService} from "../../services/search.service";
import {GlobalSettings} from "../../global/global-settings";
import {SeoService} from "../../global/seo.service";
@Component({
    selector:"search-page",
    templateUrl:"app/webpages/search-page/search-page.html",
})
export class SearchPage implements OnInit, OnChanges, OnDestroy{
    pageSearchTitle=" Stay Current With The Latest News";
    pageSearchSubTitle="Search for a topic or keyword that interests you!";
    paramsub:any;
    userInput;
    searchArticlesData:any;
    currentPage:number=0;
    pageCount:number;
    articleCount:number;
    keywordFilter:any;
    sortFilter:any;
    error:any;
    public scrollTopPrev:number=0;
    filter1:string;
    filter2:string;
    constructor(private activateRoute:ActivatedRoute, private searchService:SearchService, private _render:Renderer, private _router:Router, private _seo:SeoService){
        this.paramsub=activateRoute.params.subscribe(
            (param :any)=> {
                this.currentPage=0; //initialize current page to start page (i.e currently 0 in the API)
                this.articleCount = 0;
                this.userInput= param['userInput'];
                this.keywordFilter=this.searchService.getkeyWords(); //get all the keywords for the dropdown
                this.sortFilter=this.searchService.getSortOptions(); //get all the sort options for the dropdown
                this.filter1 = 'all';
                this.filter2 = 'recent';
                this.getSearchResult(this.userInput,this.currentPage,this.filter1,this.filter2);

            }
        );
    }
    ngOnInit(){
        this.addMetaTags()
    }
    ngOnChanges(){}

    /* method to get the articles*/
    private getSearchResult(i,currentPage,filter1?,filter2?){
        this.searchService.searchArticleService(i,currentPage,filter1,filter2).subscribe(
            data=>{
                try{
                    if(data.data.article_data) {
                        this.searchArticlesData = this.searchService.transformSearchResults(data.data);
                        this.pageCount=data.data.total_pages;
                        this.articleCount=this.pageCount*10;
                    }else throw new Error(" Error getting search results for" + " " + i)
                }catch(e){
                     this.searchArticlesData=null;
                    this.pageCount=0;
                    this.articleCount=this.pageCount*10;
                   console.log(e.message);
                }
            }
        )
    }

    ngOnDestroy(){
        this.paramsub.unsubscribe();
    }
    getPageOnClick(e){ //e => page number i
        this.currentPage=e;
        this.getSearchResult(this.userInput,this.currentPage,this.filter1,this.filter2);


    }
    chosenFilter1(e){ //e => selection from the dropdown filter: categories
        this.currentPage=0;
        this.filter1=e;
        this.getSearchResult(this.userInput,this.currentPage,this.filter1,this.filter2)

    }
    chosenFilter2(e){ //e => selection from the dropdown filter: sort options
        this.currentPage=0;
        this.filter2=e;
        this.getSearchResult(this.userInput,this.currentPage,this.filter1,this.filter2)
         }

    private addMetaTags(){
        var title = 'Search Page';
        this._seo.removeMetaTags();
        let metaDesc = GlobalSettings.getPageTitle("Search the most recent news about your favorite sports, movies and read the latest articles on politics, business, travel etc.",'Search Page');
        let link = window.location.href;
        this._seo.setCanonicalLink(this.activateRoute.params,this._router);
        this._seo.setOgTitle(title);
        this._seo.setOgDesc(metaDesc);
        this._seo.setOgType('Website');
        this._seo.setOgUrl(link);
        this._seo.setOgImage('/app/public/mainLogo.png');
        this._seo.setTitle(title);
        this._seo.setMetaDescription(metaDesc);
        this._seo.setMetaRobots('INDEX, NOFOLLOW');
        this._seo.setPageTitle(title);
        this._seo.setPageType('Search Page');
        this._seo.setPageUrl(link);
    }
}
