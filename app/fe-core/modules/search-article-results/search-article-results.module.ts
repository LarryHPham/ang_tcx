import {Component, Input, ElementRef, Renderer, Output, EventEmitter, AfterViewChecked, OnInit,OnChanges} from "@angular/core";

@Component({
    selector:'search-results',
    templateUrl:'./app/fe-core/modules/search-article-results/search-article-results.module.html'
})
export class SearchArticleResults implements OnInit, OnChanges{
    @Input() searchArticlesData:Array<any>;
    @Input() userInput:string;
    @Input() totalPages:any;
    @Input() articleTotalCount:number;
    @Output() emitPageNum: EventEmitter<any>=new EventEmitter();
    @Input() currentPage:number;

    leftisactive;
    rightisactive;
    startCount:number=1;
    EndCount:number=this.startCount*10;
    pageNum:number =1;
    error:any;
    checkInit = null;
    topRight = null;
    bottomRight = null;
    topLeft = null;
    bottomLeft = null;

    constructor(private elementRef:ElementRef, private render:Renderer){
    }
    ngOnInit(){
        this.error={
            message:"Sorry we can't find articles matching your search term(s) " +  this.userInput + ", please try your search again.",
            icon:"fa-search-icon",
        };
        this.changeStyles();

    }
    ngOnChanges(){
        this.pageNum=this.currentPage+1;
        this.changeStyles();
    }
    changeStyles(){
        if(this.totalPages==1){
            this.leftisactive = false;
            this.rightisactive = false;
        } else if(this.totalPages>1 && this.pageNum != this.totalPages){
            this.rightisactive = true;
            if(this.pageNum>1){
                this.leftisactive = true;
            } else{
                this.leftisactive = false;
            }

        } else if(this.totalPages>1 && this.pageNum == this.totalPages){
            this.leftisactive = true;
            this.rightisactive = false;
        }
    }
    previousPage(e){
        if(this.pageNum>1){
            this.pageNum--;
        }

        this.emitPageNum.emit(this.pageNum-1);
        this.startCount=(this.pageNum-1)*10+1;
        this.EndCount=this.startCount+9;

    }
    nextPage(e){

        if(this.pageNum<this.totalPages){
            this.pageNum++;
        }

        this.emitPageNum.emit(this.pageNum-1);
        this.startCount=(this.pageNum-1)*10+1;
        this.EndCount=this.startCount+9;
    }

}
