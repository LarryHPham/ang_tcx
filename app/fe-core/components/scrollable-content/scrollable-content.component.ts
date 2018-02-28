import {Component, Input, Inject, OnChanges, AfterViewInit, AfterViewChecked, ElementRef} from '@angular/core';
import {ScrollerFunctions} from '../../../global/scroller-functions';

@Component({
    selector: 'scrollable-content',
    templateUrl: './app/fe-core/components/scrollable-content/scrollable-content.component.html'
})
export class ScrollableContent implements AfterViewInit, OnChanges {
  private _elementRef: ElementRef;
  private _afterViewInit: boolean = false;

  //change this input to fire a refresh of the scroller's size
  @Input() refreshVar: string = "";

  constructor(@Inject(ElementRef) elementRef: ElementRef) {
    this._elementRef = elementRef;
  }

  ngAfterViewInit() {
    this.setupScroller();
    this._afterViewInit = true;
  }

  ngOnChanges() {
    if ( this._afterViewInit ) {
      this.setupScroller();
    }
  }

  setupScroller() {
    var nativeElement = this._elementRef.nativeElement;
    ScrollerFunctions.initializeScroller(nativeElement, document);
  }
}
