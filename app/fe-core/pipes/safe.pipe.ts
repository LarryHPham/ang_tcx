
import {Pipe, PipeTransform} from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";


//sanitize html and innerHtml
@Pipe({
    name: 'safeHtml'
})
export class SanitizeHtml implements PipeTransform {
    constructor(private sanitizer:DomSanitizer){}
    transform(html) {
        return this.sanitizer.bypassSecurityTrustHtml(html);
    }
}


//sanitize scripts
@Pipe({
    name: 'safeScript'
})
export class SanitizeScript implements PipeTransform {
    constructor(private sanitizer:DomSanitizer){}
    transform(script) {
        return this.sanitizer.bypassSecurityTrustScript(script);
    }
}


//sanitize styles
@Pipe({
    name: 'safeStyle'
})
export class SanitizeStyle implements PipeTransform {
    constructor(private sanitizer:DomSanitizer){}
    transform(style) {
        return this.sanitizer.bypassSecurityTrustStyle(style);
    }
}


//sanitize url src
@Pipe({
    name: 'safeUrl'
})
export class SanitizeUrl implements PipeTransform {
    constructor(private sanitizer:DomSanitizer){}
    transform(url) {
        return this.sanitizer.bypassSecurityTrustUrl(url);
    }
}


//sanitize url that returns videos
@Pipe({
    name: 'safeRUrl'
})
export class SanitizeRUrl implements PipeTransform {
    constructor(private sanitizer:DomSanitizer){}
    transform(rurl) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(rurl);
    }
}
