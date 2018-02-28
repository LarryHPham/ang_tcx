//learn about robots.txt here
//http://www.robotstxt.org/robotstxt.html

/**
 *Optimal Length for Search Engines
 *Roughly 155 Characters
 ***/
import {Injectable, Inject} from '@angular/core';
import {Title, DOCUMENT} from '@angular/platform-browser';
/*import { getDOM } from '@angular/platform-browser/src/dom/dom_adapter';*/
import { __platform_browser_private__ } from '@angular/platform-browser'
import {GlobalSettings} from "./global-settings";
import {getDOM} from "@angular/platform-browser/src/dom/dom_adapter";

@Injectable()

export class SeoService {
    private titleService: Title;
    private headElement: HTMLElement;
    private metaDescription: HTMLElement;
    private canonicalLink: HTMLElement;
    private document:any;
    private themeColor:HTMLElement;

    private ogTitle: HTMLElement;
    private ogType: HTMLElement;
    private ogUrl: HTMLElement;
    private ogImage: HTMLElement;
    private ogDesc: HTMLElement;
    private startDate:HTMLElement;
    private endDate:HTMLElement;
    private isArticle:HTMLElement;


    private es_page_type: HTMLElement;
    private es_data_source: HTMLElement;
    private es_article_id: HTMLElement;
    private es_page_title: HTMLElement;
    private es_category: HTMLElement;
    private es_published_date: HTMLElement;
    private es_article_author: HTMLElement;
    private es_article_publisher: HTMLElement;
    private es_image_url: HTMLElement;
    private es_description: HTMLElement;
    private es_page_url: HTMLElement;
    private es_article_type: HTMLElement;
    private es_keywords:HTMLElement;

    private robots: HTMLElement;
    private DOM: any;

    constructor(@Inject(DOCUMENT) document:any){
        this.DOM = getDOM();
        this.document = document;
        this.headElement = this.document.head;

    }

    /**
     * Inject the Angular 2 Title Service
     * @param titleService
     */
    /*  constructor(titleService: Title){
     this.titleService = titleService;
     this.DOM = __platform_browser_private__.getDOM();

     /!**
     * get the <head> Element
     * @type {any}
     *!/
     this.headElement = this.DOM.query('head');
     this.metaDescription = this.getOrCreateMetaElement('description');
     this.robots = this.getOrCreateMetaElement('robots');
     this.ogTitle = this.getOgMetaElement("og:title");
     this.ogType = this.getOgMetaElement("og:type");
     this.ogUrl = this.getOgMetaElement("og:url");
     this.ogImage = this.getOgMetaElement("og:image");
     this.ogDesc = this.getOgMetaElement("og:description");
     this.es_page_type= this.getOrCreateMetaElement('es_page_type');
     this.es_data_source= this.getOrCreateMetaElement('es_data_source');
     this.es_article_id= this.getOrCreateMetaElement('es_article_id');
     this.es_page_title= this.getOrCreateMetaElement('es_page_title');
     this.es_category= this.getOrCreateMetaElement('es_category');
     this.es_published_date= this.getOrCreateMetaElement('es_published_date');
     this.es_article_author= this.getOrCreateMetaElement('es_article_author');
     this.es_article_publisher= this.getOrCreateMetaElement('es_article_publisher');
     this.es_image_url= this.getOrCreateMetaElement('es_image_url');
     this.es_article_teaser= this.getOrCreateMetaElement('es_article_teaser');
     this.es_page_url= this.getOrCreateMetaElement('es_page_url');
     this.es_article_type= this.getOrCreateMetaElement('es_article_type');
     this.es_is_article= this.getOrCreateMetaElement('es_is_article');
     this.es_end_date= this.getOrCreateMetaElement('es_end_date');
     this.es_start_date= this.getOrCreateMetaElement('es_start_date');
     this.es_keywords= this.getOrCreateMetaElement('es_keywords');



     }*/


    //sets title to atleast less than 55 characters and will choose the  first 3 words and append site name at end
    public setTitle(newTitle:string) {
        let splitTitle = newTitle.split(' ');
        let shortTitle;

        if (newTitle.length > 55) {
            splitTitle = splitTitle.splice(0, 3);
            shortTitle = splitTitle.join(' ');
        } else {
            shortTitle = splitTitle.join(' ');
        }

        if (GlobalSettings.getHomeInfo().isPartner) {
            shortTitle = shortTitle + ' | ' + GlobalSettings.getBasePartnerTitle();
        } else {
            shortTitle = shortTitle + ' | ' + GlobalSettings.getBaseTitle();
        }

        this.document.title = shortTitle;
    }

    public getMetaDescription(): string {
        return this.metaDescription.getAttribute('content');
    }

    private setElementAttribute(el:HTMLElement, name:string, attr:string) {
        return this.DOM.setAttribute(el, name, attr);
    }

    static checkData(data) {
        var check;
        check = !!(data != null && data != "");
        return check
    }


    public setMetaDescription(description: string) {
        if (SeoService.checkData(description)) {
            let html = description;
            let div = document.createElement("div");
            div.innerHTML = html;
            let truncatedDescription = div.textContent || div.innerText || "";
            if (truncatedDescription.length > 167) {
                truncatedDescription = truncatedDescription.substring(0, 167);
                truncatedDescription += '...';
            }
            if (!this.document.querySelector('meta[name="description"]')) {
                this.metaDescription = this.getOrCreateElement('name', 'description', 'meta');
            }
            this.setElementAttribute(this.metaDescription, 'content', truncatedDescription);
        }

    }

    public getMetaRobots(): string {
        return this.robots.getAttribute('content');
    }

    //Valid values for the "CONTENT" attribute are: "INDEX", "NOINDEX", "FOLLOW", "NOFOLLOW"
    //http://www.robotstxt.org/meta.html
    public setMetaRobots(robots:string) {
        if (SeoService.checkData(robots)) {
            if (!this.document.querySelector('meta[name="robots"]')) {
                this.robots = this.getOrCreateElement('name', 'robots', 'meta');
            }
            this.setElementAttribute(this.robots, 'content', robots);
        }
    }

    public setThemeColor(color:string) {
        if (SeoService.checkData(color)) {
            if (!this.document.querySelector('meta[name="themeColor"]')) {
                this.themeColor = this.getOrCreateElement('name', 'themeColor', 'meta');
            }
            this.setElementAttribute(this.themeColor, 'content', color);
        }
    }

    public setOgTitle(newTitle:string) {
        if (SeoService.checkData(newTitle)) {
            if (!this.document.querySelector('meta[property="og:title"]')) {
                this.ogTitle = this.getOrCreateElement('property', 'og:title', 'meta');
            }
            this.setElementAttribute(this.ogTitle, 'content', newTitle);
        }
    }

    public setOgDesc(description:string) {
        if (SeoService.checkData(description)) {
            if (!this.document.querySelector('meta[property="og:description"]')) {
                this.ogDesc = this.getOrCreateElement('property', 'og:description', 'meta');
            }
            this.setElementAttribute(this.ogDesc, 'content', description);
        }
    }

    public setOgType(newType:string) {
        if (SeoService.checkData(newType)) {
            if (!this.document.querySelector('meta[property="og:type"]')) {
                this.ogType = this.getOrCreateElement('property', 'og:type', 'meta');
            }
            this.setElementAttribute(this.ogType, 'content', newType);
        }
    }

    public setOgUrl(url:string) {
        if (SeoService.checkData(url)) {
            if (!this.document.querySelector('meta[property="og:url"]')) {
                this.ogUrl = this.getOrCreateElement('property', 'og:url', 'meta');
            }
            this.setElementAttribute(this.ogUrl, 'content', url)
        }
    }
    public setOgImage(imageUrl:string) {
        if (SeoService.checkData(imageUrl)) {
            if (!this.document.querySelector('meta[property="og:image"]')) {
                this.ogImage = this.getOrCreateElement('property', 'og:image', 'meta');
            }
            this.setElementAttribute(this.ogImage, 'content', imageUrl);
        }
    }

    public setCategory(category:string) {
        if (SeoService.checkData(category)) {
            if (!this.document.querySelector('meta[name="es_category"]')) {
                this.es_category = this.getOrCreateElement('name', 'es_category', 'meta');
            }
            this.setElementAttribute(this.es_category, 'content', category);
        }
    }

    public setStartDate(startDate:string) {
        if (SeoService.checkData(startDate)) {
            if (!this.document.querySelector('meta[name="start_date"]')) {
                this.startDate = this.getOrCreateElement('name', 'start_date', 'meta');
            }
            this.setElementAttribute(this.startDate, 'content', startDate);
        }
    }

    public setEndDate(endDate:string) {
        if (SeoService.checkData(endDate)) {
            if (!this.document.querySelector('meta[name="end_date"]')) {
                this.endDate = this.getOrCreateElement('name', 'end_date', 'meta');
            }
            this.setElementAttribute(this.endDate, 'content', endDate);
        }
    }

    public setIsArticle(isArticle:string) {
        if (SeoService.checkData(isArticle)) {
            if (!this.document.querySelector('meta[name="is_article"]')) {
                this.isArticle = this.getOrCreateElement('name', 'is_article', 'meta');
            }
            this.setElementAttribute(this.isArticle, 'content', isArticle);
        }
    }

    public setPageType(searchType:string) {
        if (SeoService.checkData(searchType)) {
            if (!this.document.querySelector('meta[name="es_page_type"]')) {
                this.es_page_type = this.getOrCreateElement('name', 'es_page_type', 'meta');
            }
            this.setElementAttribute(this.es_page_type, 'content', searchType);
        }
    }

    public setArticleId(articleId:string) {
        if (SeoService.checkData(articleId)) {
            if (!this.document.querySelector('meta[name="es_article_id"]')) {
                this.es_article_id = this.getOrCreateElement('name', 'es_article_id', 'meta');
            }
            this.setElementAttribute(this.es_article_id, 'content', articleId);
        }
    }

    public setPageTitle(articleTitle:string) {
        if (SeoService.checkData(articleTitle)) {
            if (!this.document.querySelector('meta[name="es_page_title"]')) {
                this.es_page_title = this.getOrCreateElement('name', 'es_page_title', 'meta');
            }
            this.setElementAttribute(this.es_page_title, 'content', articleTitle);
        }
    }

    public setAuthor(author:string) {
        if (SeoService.checkData(author)) {
            if (!this.document.querySelector('meta[name="es_article_author"]')) {
                this.es_article_author = this.getOrCreateElement('name', 'es_article_author', 'meta');
            }
            this.setElementAttribute(this.es_article_author, 'content', author);
        }
    }

    public setPublisher(publisher:string) {
        if (SeoService.checkData(publisher)) {
            if (!this.document.querySelector('meta[name="es_article_publisher"]')) {
                this.es_article_publisher = this.getOrCreateElement('name', 'es_article_publisher', 'meta');
            }
            this.setElementAttribute(this.es_article_publisher, 'content', publisher);
        }
    }

    public setPageUrl(url:string) {
        if (SeoService.checkData(url)) {
            if (!this.document.querySelector('meta[name="es_page_url"]')) {
                this.es_page_url = this.getOrCreateElement('name', 'es_page_url', 'meta');
            }
            this.setElementAttribute(this.es_page_url, 'content', url);
        }
    }

    public setKeyword(keywords:string) {
        if (SeoService.checkData(keywords)) {
            if (!this.document.querySelector('meta[name="es_keywords"]')) {
                this.es_keywords = this.getOrCreateElement('name', 'es_keywords', 'meta');
            }
            this.setElementAttribute(this.es_keywords, 'content', keywords);
        }
    }

    public setSource(source:string) {
        if (SeoService.checkData(source)) {
            if (!this.document.querySelector('meta[name="es_data_source"]')) {
                this.es_data_source = this.getOrCreateElement('name', 'es_data_source', 'meta');
            }
            this.setElementAttribute(this.es_data_source, 'content', source);
        }
    }

    public setPublishedDate(publishedDate:string) {
        if (SeoService.checkData(publishedDate)) {
            if (!this.document.querySelector('meta[name="es_published_date"]')) {
                this.es_published_date = this.getOrCreateElement('name', 'es_published_date', 'meta');
            }
            this.setElementAttribute(this.es_published_date, 'content', publishedDate);
        }
    }

    public setImageUrl(imageUrl:string) {
        if (SeoService.checkData(imageUrl)) {
            if (!this.document.querySelector('meta[name="es_image_url"]')) {
                this.es_image_url = this.getOrCreateElement('name', 'es_image_url', 'meta');
            }
            this.setElementAttribute(this.es_image_url, 'content', imageUrl);
        }
    }

    public setPageDescription(articleTeaser:string) {
        if (SeoService.checkData(articleTeaser)) {
            if (!this.document.querySelector('meta[name="es_description"]')) {
                this.es_description = this.getOrCreateElement('name', 'es_description', 'meta');
            }
            this.setElementAttribute(this.es_description, 'content', articleTeaser);
        }
    }

    public setArticleType(articleType:string) {
        var metaTag = this.document.querySelector('meta[name="es_article_type"]');
        if (SeoService.checkData(articleType)) {
            if (!metaTag) {
                this.es_article_type = this.getOrCreateElement('name', 'es_article_type', 'meta');
            }
            this.setElementAttribute(this.es_article_type, 'content', articleType);
        }
    }

    /**
     * get the HTML Element when it is in the markup, or create it.
     * @param name
     * @returns {HTMLElement}
     */
    private getOrCreateElement(name:string, attr:string, type:string):HTMLElement {
        let el:HTMLElement;
        el = this.DOM.createElement(type);
        this.setElementAttribute(el, name, attr);
        if (attr != "canonical") {
            this.setElementAttribute(el, "rel", "tcx");
        }
        this.DOM.insertBefore(this.document.head.lastChild, el);
        return el;
    }


    public setCanonicalLink(RouteParams, router):HTMLElement {
        let el:HTMLElement;
        el = this.DOM.query("link[rel='canonical']");
        let canonicalLink = window.location.href;
        if (el === null) {
            el = this.DOM.createElement('link');
            el.setAttribute('rel', 'canonical');
            el.setAttribute('href', canonicalLink);
            this.headElement.appendChild(el);
        } else {
            el.setAttribute('href', canonicalLink);
        }
        return el;
    }

    public removeMetaTags() {
        var element = this.document.getElementsByTagName('meta'), index;
        for (index = element.length - 1; index >= 0; index--) {
            if (element[index].getAttribute('rel') == 'tcx') {
                element[index].parentNode.removeChild(element[index]);
            }
        }
    }

    public elasticSearchUserAgent(){
      // preRender && PhantomJS or sntCrawler && nutch are specific keywords found when prerender or SNT crawler is being used to crawler the site for Elastic search
      let preRender = navigator.userAgent.indexOf("Prerender") > 0;
      let phantomJS = navigator.userAgent.indexOf("PhantomJS") > 0;
      let sntCrawler = navigator.userAgent.indexOf("SNTCrawler") > 0;
      let nutch = navigator.userAgent.indexOf("Nutch") > 0;

      if( (preRender && phantomJS) || (sntCrawler && nutch) ){
        return true;
      }else{
        return false;
      }
    }

}
