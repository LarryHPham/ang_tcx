import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

//interfaces
import { PagingData } from './directory.data';

@Component({
    selector: 'directory-pagination',
    templateUrl: './app/fe-core/modules/directory/directory-pagination.component.html'
})

export class DirectoryPagination {
  @Input() data: PagingData;
}
