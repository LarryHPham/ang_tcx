import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule, ActivatedRoute, Router } from '@angular/router';
import { AppComponent }  from './app-component/app.component';

import {DeepDiveNgModule} from "./ngModules/deep-dive.ngmodule";
import {DeepDivePage} from "./webpages/deep-dive-page/deep-dive-page";
import {AboutUsPage} from "./webpages/aboutus/aboutus";
import {PrivacyPolicy} from "./webpages/privacy-policy/privacy-policy";
import {TermsOfService} from "./webpages/terms-of-service/terms-of-service";
import {SyndicatedArticlePage} from "./webpages/syndicated-article-page/syndicated-article-page";
import {SearchPage} from "./webpages/search-page/search-page";

const relativeChildRoutes = [
   /* {
        path:'search/:userInput',
        component: SearchPage
    },*/
    {
        path: 'about-us',
        component: AboutUsPage
    },
    {
        path: 'privacy-policy',
        component: PrivacyPolicy
    },
    {
        path: 'terms-of-service',
        component: TermsOfService
    },
    {
        path:'search/articles/:userInput',
        component: SearchPage
    },
    {
        path: ':category/:subCategory/article/:articleType/:articleID',
        //redirectTo: 'news/:articleType/:articleID',
        component: SyndicatedArticlePage,
    },
    {
        path: ':category/article/:articleType/:articleID',
        //redirectTo: 'news/:articleType/:articleID',
        component: SyndicatedArticlePage,
    },
    {
        //added article category with subarticles
        path: ':category/:subCategory',
        component: DeepDivePage,
    },
    {
        //category is top level deep dive page that are groupings of other deep dive pages (ex: sports)
        path: ':category',
        component: DeepDivePage,
    },
    {
        path: '',
        component: DeepDivePage,
    },

  ];

const appRoutes: Routes = [
    {
        path: 'news-feed',
        component: AppComponent,
        children: relativeChildRoutes
    },
    {
        path: ':partner_id/news',
        component: AppComponent,
        children: relativeChildRoutes
    },
    {
        path: ':partner_id',
        redirectTo:':partner_id/news',
        pathMatch:'full'
    },
    {
        path: '',
        redirectTo:'news-feed',
        pathMatch:'full'
    },
    {
        path: 'about-us',
        component: AboutUsPage
    }
    ];

// [routerLink]=["jimmy", {relativeTo: this.route}]



// [routerLink]=["/news-feed/:category/:subCategory", 'sports', 'nfl']

export const routing = RouterModule.forRoot(appRoutes);
