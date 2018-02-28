import {Component, Input} from '@angular/core';

@Component({
    selector: 'profile-data-component',
    templateUrl: './app/fe-core/components/articles/profile-data/profile-data.component.html'
})

export class ProfileDataComponent {
    @Input() articleData:any;
    @Input() articleSubType:any;
    @Input() articleType:any;
    @Input() imageLinks:any;
    @Input() index:any;
}