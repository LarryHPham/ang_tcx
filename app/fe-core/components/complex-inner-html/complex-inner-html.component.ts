
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Link } from '../../../global/global-interface';
import { SanitizeHtml } from "../../pipes/safe.pipe";

@Component({
    selector: 'complex-inner-html',
    styles: [`
       .special-text {
           margin-left: -3px;
       }
       .main-tex {
           z-index: 1;
       }
    `],
    templateUrl: './app/fe-core/components/complex-inner-html/complex-inner-html.component.html'
})

export class ComplexInnerHtml {
  @Input() textItems: Array<Link | string>;
}
