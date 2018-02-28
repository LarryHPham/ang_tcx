/**
 * This Directive is used to hide the element when a user clicks any where on the window
 * Dependencies: All search auto suggestion dropdowns
 * id's necessary: active-dropdown
 */


import {Directive, HostListener, ElementRef, Renderer} from "@angular/core";
@Directive({
    selector:'[windowClick]'
})
export class WindowClickDirective{
    transmuteElement;
    constructor(private _renderer:Renderer){}
    @HostListener('window:click',['$event']) onwindowclick(e){
        this.transmuteElement=document.getElementById('active-dropdown');
        if(this.transmuteElement){
            this._renderer.setElementStyle(this.transmuteElement,'display','none');
        }
    }
}