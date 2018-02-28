import {Component, OnInit, OnDestroy, Input, Output, EventEmitter, Renderer, ViewChild} from '@angular/core';
import {TableColumn} from '../../components/custom-table/table-data.component';

@Component({
  selector: 'custom-table-header',
  templateUrl: './app/fe-core/components/custom-table/table-header.component.html'
})

export class TableHeader implements OnInit {
  private SORT_NONE: number = 0;
  private SORT_ASC: number = 1;
  private SORT_DESC: number = -1;

  public iconSortDirection: string;
  public iconSortType: string;
  public isSortable: boolean;

  @Input() headerData: TableColumn;
  @Input() headerIndex: number;
  @Output() sortSwitched = new EventEmitter();

  constructor(private _renderer: Renderer) {}

  ngOnInit() {
    this.isSortable = !this.headerData.ignoreSort;
    this.iconSortType = this.headerData.isNumericType ? "numeric" : "alpha";
    this.setSortIcon();
    
  }

  setSortIcon() {
    switch ( this.headerData.sortDirection ) {
      case this.SORT_ASC:
        this.iconSortDirection = "fa-sort-up";
        break;

      case this.SORT_DESC:
        this.iconSortDirection = "fa-sort-down";
        break;

      default:
      case this.SORT_NONE:
        this.iconSortDirection = "fa-sort";
        break;
    }
  }

  sortRows($event) {
    if ( this.isSortable ) {
      switch ( this.headerData.sortDirection ) {
        case this.SORT_ASC:
          this.headerData.sortDirection = this.SORT_DESC;
          break;

        case this.SORT_DESC:
          this.headerData.sortDirection = this.SORT_ASC;
          break;

        default:
        case this.SORT_NONE:
          this.headerData.sortDirection = this.SORT_DESC;
          break;
      }
      this.setSortIcon();
      this.sortSwitched.next([this.headerData, this.headerIndex]);
    }
  }
}
