import {Component, Input, OnInit} from '@angular/core';
import {Http, Headers} from '@angular/http';
import { GlobalSettings } from "../../global/global-settings";

declare var jQuery:any;

@Component({
    selector: 'billboard-module',
    templateUrl: './app/ui-modules/billboard/billboard.module.html',
})

export class BillboardModule implements OnInit {
    srcLink:string;
    @Input() category:string;
    @Input() subCategory:string;
    //adding temporary variables in order to avoid making changes to the category and subcategory directly
    billcategory:string;
    billsubCategory:string;

    getData() {
        var topScope = GlobalSettings.getTCXscope(this.category).topScope ? GlobalSettings.getTCXscope(this.category).topScope : null;
        this.billcategory = this.category == "real estate" ? this.category.replace(/ /g, "-") : this.category;
        this.billsubCategory = this.subCategory == "real estate" ? this.subCategory.replace(/ /g, "-") : this.subCategory;

        if (this.billcategory != "all" && topScope) {
            this.billcategory = topScope && topScope != "real estate" ? topScope : 'keyword-' + this.billcategory;
            this.billsubCategory = this.billsubCategory && this.billsubCategory != this.billcategory && this.billcategory != "real-estate" ? this.billsubCategory : "";
        } else {
            this.billcategory = "trending";
            this.billsubCategory = "";
        }
        this.srcLink = "/app/ads/billboard.html?category=" + this.billcategory + "&sub_category=" + this.billsubCategory;
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
        if (e.data.hasOwnProperty('billboard')) {
            document.getElementById("billboard-section").style.height = e.data['billboard'];
        }
    }
}
