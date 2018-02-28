"use strict";
var router_1 = require('@angular/router');
var deep_dive_page_1 = require("./webpages/deep-dive-page/deep-dive-page");
var syndicated_article_page_1 = require("./webpages/syndicated-article-page/syndicated-article-page");
var appRoutes = [
    {
        path: '',
        redirectTo: 'deep-dive',
        pathMatch: 'full'
    },
    {
        path: 'deep-dive',
        component: deep_dive_page_1.DeepDivePage
    },
    {
        path: 'syndicated-article',
        component: syndicated_article_page_1.SyndicatedArticlePage
    }
];
exports.routing = router_1.RouterModule.forRoot(appRoutes);
//# sourceMappingURL=app.routing.js.map