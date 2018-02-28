import {Component, Input} from '@angular/core';
import {TableColumn, CellData} from '../../components/custom-table/table-data.component';

@Component({
  selector: 'table-cell',
  templateUrl: './app/fe-core/components/custom-table/table-cell.component.html'
})

export class TableCell {
  @Input() data: any;

  @Input() index: string;
  cellLocal: CellData;
  ngOnChanges(event) {
    this.cellLocal = this.data.model.getCellData(this.data.item, this.data.hdr);
  }
}
