import {Component, Input, OnInit} from '@angular/core';
import {Http, Headers} from '@angular/http';
import { GlobalSettings } from "../../global/global-settings";

declare var jQuery:any;

@Component({
    selector: 'chatterbox-module',
    templateUrl: './app/ui-modules/chatterbox/chatterbox.module.html',
})

export class ChatterboxModule implements OnInit {
    srcLink:string;
    @Input() category:string;
    @Input() subCategory:string;
    //adding temporary variables in order to avoid making changes to the category and subcategory directly
    cbcategory:string;
    cbsubCategory:string;

    getData() {
        var topScope = GlobalSettings.getTCXscope(this.category).topScope ? GlobalSettings.getTCXscope(this.category).topScope : null;

        this.cbcategory = this.category == "real estate" ? this.category.replace(/ /g, "-") : this.category;
        this.cbsubCategory = this.subCategory == "real estate" ? this.subCategory.replace(/ /g, "-") : this.subCategory;

        if (topScope && this.cbcategory != "all") {
            this.cbcategory = topScope ? topScope : 'keyword-' + this.cbcategory;
            this.cbsubCategory = this.cbsubCategory && this.cbsubCategory != this.cbcategory && this.cbcategory != "real-estate" ? this.cbsubCategory : "";
        } else {
            this.cbcategory = "trending";
            this.cbsubCategory = "";
        }
        this.srcLink = "/app/ads/chatterbox.html?category=" + this.cbcategory + "&sub_category=" + this.cbsubCategory;
    }

    ngOnInit() {
        this.getData();
        window.addEventListener("message", this.receiveSize, false);
    }

    ngOnChanges() {
        this.getData();
        window.addEventListener("message", this.receiveSize, false);
    }

    receiveSize(e) {
        if (e.data.hasOwnProperty('chatterbox')) {
            document.getElementById("chatterbox-section").style.height = e.data['chatterbox'];
        }
    }
}
