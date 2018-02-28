import {Component, Input, ViewChildren, OnChanges, EventEmitter, Output,ChangeDetectionStrategy} from '@angular/core';
import {TableHeader} from '../../components/custom-table/table-header.component';
import {TableModel, TableColumn, CellData} from '../../components/custom-table/table-data.component';

@Component({
  selector: 'custom-table',
  templateUrl: './app/fe-core/components/custom-table/custom-table.component.html',
  changeDetection:ChangeDetectionStrategy.OnPush//Need to look more into CheckOnce and OnPush
})

export class CustomTable implements OnChanges {
  @ViewChildren(TableHeader) _tableHeaders: Array<TableHeader>;
  @Input() error: any;
  @Input() lastStanding: boolean = true;
  @Output() sortChanged = new EventEmitter(true); //async=true
  public isSortDropdownVisible: boolean = false;
  public bodyClass: string;
  /**
   * The column data and settings for the table. To sort by
   * a particular column, set sortDirection for that column to either
   * -1 or 1.
   */
  columns: Array<TableColumn>;

  /**
   * (Optional) The values to display in the footer. The footer keys
   * correspond to the keys defined in the TableColumn array and
   * the values can contain HTML elements. The footer (if included)
   * is always displayed at the bottom of the table regardless of
   * the column being sorted. If no values are set for the footer,
   * it will not be displayed.
   *
   * The footer style (.custom-table-footer) defaults to 12px bold and centered.
   */
  footer: { [key: string]: string };
  @Input() model: TableModel<any>;

  /**
   * If true, then the table body and footer are given the style ".custom-table-compact",
   * which uses a smaller font-size and smaller table rows.
   * Otherwise, the table body and footer are given the style ".custom-table-body".
   */
  @Input() isCompactStyle: boolean = false;

  ngOnChanges() {
    this.updateData();
  }

  updateData() {
    this.bodyClass = this.isCompactStyle ? "custom-table-compact" : "custom-table-body";

    if ( this.model === undefined || this.model === null ) {
      return;
    }
    this.columns = this.model.columns;

    var sortedColumn = null;
    var columnIndex = 0;

    this.columns.forEach((col) => {
      if ( col.sortDirection && !sortedColumn ) {
        sortedColumn = col;
      }
    });

    // this.updateRows();

    if ( sortedColumn !== null ) {
      this.sortRows(sortedColumn);
    }
  }

  setSortColumn($event, $event1) {
    //Remove sort on other columns;
    var sortedColumn = $event[0];
    var sortedIndex = +$event[1]; //make a number

    this.model.columns.forEach((col, i) => {
      if ( i !== sortedIndex ) {
        col.sortDirection = 0;
      }
    });

    this._tableHeaders.forEach(function(item, index) {
        item.setSortIcon();
    });

    this.sortRows(sortedColumn);
  }

  sortRows(tableHdr:TableColumn) {
    this.model.rows.sort((row1, row2) => {
      var value1 = this.model.getCellData(row1, tableHdr).sort;
      var value2 = this.model.getCellData(row2, tableHdr).sort;

      if ( value1 == null || value2 == null ) {
        return value1 == null ? (value2 == null ? 0 : 1) : -1;
      }

      //Comparison method works for both numbers and strings
      if ( value1 > value2 ) {
        return tableHdr.sortDirection * 1;
      }
      if ( value1 < value2 ) {
        return tableHdr.sortDirection * -1;
      }
      return 0;
    });
    this.sortChanged.next(this.model.rows);
  }
}
