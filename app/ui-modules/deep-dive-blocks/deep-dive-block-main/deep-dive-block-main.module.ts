import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { DeepDiveService } from '../../../services/deep-dive.service';
import { ArticleStackData, VideoStackData, SectionNameData } from "../../../fe-core/interfaces/deep-dive.data";
import { GlobalSettings } from "../../../global/global-settings";
import { GlobalFunctions } from "../../../global/global-functions";
import { VerticalGlobalFunctions } from "../../../global/vertical-global-functions";

declare var moment;

@Component({
    selector: 'deep-dive-block-main',
    templateUrl: './app/ui-modules/deep-dive-blocks/deep-dive-block-main/deep-dive-block-main.module.html',
})

export class DeepDiveBlockMain implements OnInit {
    @Input() geoLocation: string;
    @Input() sideScrollData:any;
    @Input() scopeList:any;
    @Input() scrollLength;
    @Input() changeScope;
    @Input() topScope;
    @Input() pageScope;
    @Output() emitcount = new EventEmitter();
    @Output() emitscope = new EventEmitter();
    @Output() emitLocation = new EventEmitter();
    private callApi: boolean = true;
    private commonarticleStack:Array<ArticleStackData>;
    private trendingStack: Array<ArticleStackData>;
    private recDataSports: Array<ArticleStackData>;
    private businessStack: Array<ArticleStackData>;
    private politicsStack: Array<ArticleStackData>;
    private recDataEntertain: Array<ArticleStackData>;
    private foodStack: Array<ArticleStackData>;
    // private recDataHealth: Array<ArticleStackData>;
    private lifestyleStack: Array<ArticleStackData>;
    private estateStack: Array<ArticleStackData>;
    private recDataTravel: Array<ArticleStackData>;
    // private weatherStack: Array<ArticleStackData>;
    private recDataAuto: Array<ArticleStackData>;

    private videoDataBatch1: Array<VideoStackData>;
    private videoDataBatch2: Array<VideoStackData>;
    private videoDataBatch3: Array<VideoStackData>;
    private blockIndex: number = 0;
    private secName: Array<SectionNameData>;
    private batchNum: number = 1;
    private homePageBlocks = ["trending", "video", "sports", "business", "politics", "entertainment", "food", "video", "lifestyle", "real estate", "travel", "video", "automotive"];//"health", "weather"

    constructor(private _deepDiveData: DeepDiveService) { }

    getSectionNameData() {
        var sectionNameArray = [];
        this.homePageBlocks.forEach(function(val, index) {
            var d = {
                icon: val != 'video' ? GlobalSettings.getTCXscope(val).icon : 'fa-play-circle',
                title: val != 'video' ? GlobalFunctions.toTitleCase(GlobalSettings.getTCXscope(val).displayName): 'Videos',
                route: val != 'video' && val != 'automotive' ? VerticalGlobalFunctions.formatSectionFrontRoute(GlobalSettings.getTCXscope(val).topScope) : null
            }
            sectionNameArray.push(d);
        });
        return sectionNameArray;
    }

    private onScroll(event) {
        var bodyHeight = event.target.documentElement.scrollHeight?event.target.documentElement.scrollHeight:event.target.body.scrollHeight;
        var scrollTop = window.pageYOffset? window.pageYOffset: window.scrollY;
        var footer = document.getElementById('footer');
        var footerHeight=footer?footer.offsetHeight:0;

        if(window.innerHeight + scrollTop >= bodyHeight ){
            if(Number(this.blockIndex)<6) {
                //fire when scrolled into footer
                this.blockIndex = this.blockIndex + 1;
                this.callModules(this.blockIndex);
            }
        };
    }
    getArticleStackData(ctype,count,imgMobile:boolean){
        var _selfscope=this;
        function getobjectStackArray(ctype,carray){
            var objectStackArray = {
                'trending':function () {
                    _selfscope.trendingStack =carray;
                },
                'sports':function () {
                    _selfscope.recDataSports =carray;
                },
                 'business':function(){
                     _selfscope.businessStack=carray;
                 },

                'food': function(){
                        _selfscope.foodStack=carray;
                    },
                'politics': function(){
                        _selfscope.politicsStack=carray;
                    },
                'entertainment': function(){
                    _selfscope.recDataEntertain=carray;
                },
                // 'health': function(){
                //     _selfscope.recDataHealth=carray;
                // },
                'lifestyle':function(){
                    _selfscope.lifestyleStack=carray;
                },
                'real estate':function(){
                    _selfscope.estateStack=carray;
                },
                'travel':function(){
                    _selfscope.recDataTravel=carray;
                },
                // 'weather':function(){
                //     _selfscope.weatherStack=carray;
                // },
                'automotive':function(){
                    _selfscope.recDataAuto=carray;
                }
            }
            return objectStackArray[ctype]();
        }

        var batchNum=this.batchNum;
        var geoLoc= this.geoLocation;
        this._deepDiveData.getDeepDiveBatchService(ctype,count,batchNum,geoLoc).subscribe(data=>{
            try{
                if(data){
                    if(imgMobile==true){
                        data = data.length > 2 ? data.length >=3 && data.length < 6 ? data.splice(0,3) : data.splice(0,6): null;
                        this.commonarticleStack = this._deepDiveData.transformToArticleStack(data, ctype, GlobalSettings._imgMobile);
                        getobjectStackArray(ctype, this.commonarticleStack)
                    }else {
                        this.commonarticleStack = this._deepDiveData.transformToArticleStack(data, ctype);
                        getobjectStackArray(ctype, this.commonarticleStack)
                    }
                }else throw new Error("Error getting" + ctype + "News data");
            }catch(e){
                console.log(e.message);
            }
        },
        err=>{
            console.log("Error getting" + ctype + "News data");
        })
    }

    getDeepDiveVideo() {
        this._deepDiveData.getDeepDiveVideoBatchService("sports", 15, 1, this.geoLocation)
            .subscribe(data => {
                try{
                    if(data){
                        if (data.length > 0) {
                            let videoBatch1 = data.splice(0, 5);
                            this.videoDataBatch1 = videoBatch1 ? this._deepDiveData.transformSportVideoBatchData(videoBatch1, "sports") : null;
                            if (data.length > 1) {
                                let videoBatch2 = data.splice(0, 5);
                                let videoBatch3 = data.splice(0, 5);
                                this.videoDataBatch2 = videoBatch2 ? this._deepDiveData.transformSportVideoBatchData(videoBatch2, "sports") : null;
                                this.videoDataBatch3 = videoBatch3 ? this._deepDiveData.transformSportVideoBatchData(videoBatch3, "sports") : null;
                            }
                        }
                    }else throw new Error(" Video Articles are missing for sports in the home page");
                }catch(e){
                    console.log(e.message);
                }
            },
            err => {
                console.log("Error getting video batch data");
            });
    }
    callModules(index) {
      var self=this;
      var callMethodByIndex={
          0:function(){
              self.getArticleStackData("trending",7,false);

              self.getArticleStackData("sports",6,true);
          },
          1:function(){
              self.getArticleStackData("business",7,false);
              self.getArticleStackData("politics",5,false);
          },
          2:function(){
              self.getArticleStackData("entertainment",6,true);
              self.getArticleStackData("food",7,false);
          },
          3:function(){
              self.getArticleStackData("lifestyle",7,false);
              self.getArticleStackData("real estate",5,false);
          },
          4:function(){
              self.getArticleStackData("travel",6,true);
              self.getArticleStackData("automotive",6,true);
          }
      };
      if(index<5){callMethodByIndex[index]()};
      if(!this.videoDataBatch1 && this.blockIndex > 1){
        this.getDeepDiveVideo();
      }
    }

    clickcount(event){
        this.emitcount.emit(event);
    }

    scopeType(event){
        this.emitscope.emit(event);
    }

    locType(event){
        this.emitLocation.emit(event);
    }

    ngOnInit() {
        this.secName = this.getSectionNameData();
        this.callModules(this.blockIndex);
    }
}
