import {Component, OnInit, OnDestroy, Input, Output, EventEmitter, Renderer} from '@angular/core';

@Component({
  selector: 'sort-dropdown',
  templateUrl: './app/fe-core/components/custom-table/sort-dropdown.component.html'
})

export class SortDropdown implements OnDestroy {
  public isSortDropdownVisible: boolean = false;

  @Input() iconSortType: string;

  @Output() sortAscendingListener = new EventEmitter();
  @Output() sortDescendingListener = new EventEmitter();

  private hideDropdownListener: Function;

  constructor(private _renderer: Renderer) {}

  displaySortDropdown() {
    this.isSortDropdownVisible = !this.isSortDropdownVisible;

    if ( this.hideDropdownListener === undefined ) {
      //timeout is needed so that click doesn't happen for click.
      setTimeout(() => {
        this.hideDropdownListener = this._renderer.listenGlobal('document', 'click', (event) => {
          this.isSortDropdownVisible = false;


          this.hideDropdownListener();
          this.hideDropdownListener = undefined;
        });
      }, 0);
    }
  }

  //TODO-CJP: setup multiple sort types
  sortAscending($event) {
    this.sortAscendingListener.next([]);
  }

  sortDescending($event) {
    this.sortDescendingListener.next([]);
  }

  ngOnDestroy() {
    if ( this.hideDropdownListener !== undefined ) {
       this.hideDropdownListener();
       this.hideDropdownListener = undefined;
    }
  }
}
