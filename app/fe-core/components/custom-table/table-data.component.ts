import {CircleImageData} from '../../components/images/image-data';

export class CellData {

  /**
   * The formatted value to display in the cell
   */
  display: string;

  /**
   * The value used to sort the cell within the column
   */
  sort: any;

  /**
   * (Optional) The route that the cell should be linked to (with <a>)
   */
  routerLink: Array<any>;

  /**
   * (Optional) The image configuration to use.
   *
   */
  image: CircleImageData;

  /**
   * When set to true, [innerHtml] is not used to display the text, but rather {{}}
   */
  displayAsRawText: boolean = false;

  bottomStat: any;
  bottomStat2:any;

  constructor(display: string, sort: any, routerLink?: Array<any>, imageUrl?: string, bottomStat?:any, bottomStat2?:any,  displayAsRawText?: boolean) {
    this.display = display;
    this.sort = sort;
    this.routerLink = routerLink;
    this.displayAsRawText = displayAsRawText;
    this.bottomStat=bottomStat;
    this.bottomStat2=bottomStat2;
    if ( imageUrl ) {
      this.image = {
        imageClass: "image-48",
        mainImage: {
          imageUrl: imageUrl,
          imageClass: "border-1",
          urlRouteArray: routerLink,
          hoverText: "<i class='fa fa-mail-forward'></i>",
        },
        subImages: []
      };
    }
  }
}

export interface TableModel<T> {
  columns: Array<TableColumn>;

  rows: Array<T>;

  footer?: { [key: string]: string };

  setRowSelected(rowIndex:number);

  isRowSelected(item:T, rowIndex:number): boolean;

  getSelectedKey(): string;

  setSelectedKey(key: string);

  getCellData(item:T, column:TableColumn): CellData;
}

/**
 * TableColumn includes settings for styling and sorting each column,
 * as well as the display value to use for the header row.
 */
export interface TableColumn {

  /**
   * The value to display in the header cell for the column.
   * HTML is not supported.
   */
  headerValue: string;

  /**
   * The class used to format the column's data values. They are prepended
   * with either .custom-table-body- or .custom-table-compact- depending on the
   * value of TableData.isCompactStyle.
   *
   *    Pre-styled classes include:
   *      * "bold-column": applies a bold style with @masterBrandColor and centers the text
   *      * "image-column": applies a bold style and left-aligns the text
   *      * "data-column": centers the text
   *    If TableData.isCompactStyle is set to true, then the font size for these
   *    classes will be 12px. Otherwise the font size will be 16px for those classes.
   */
  columnClass: string;

  /**
   * If isNumericType is true, then the column's data will be sorted numerically.
   * Otherwise (if it's undefined or false), the column's data will be
   * sorted alphabetically
  */
  isNumericType?: boolean;

  /**
   * The direction to sort the data. Defaults to 0 (no-sort) if it is not specified.
   * Possible values:
   *   -1: descending
   *    0: no sort
   *    1: ascending
   */
  sortDirection?: number;

  /**
   * The key used to look up the appropriate value for the column's cells.
   * Each row must contain a TableCell corresponding to this key.
   */
  key: string;

  /**
   * Set to true if the column should not be sortable.
   * Otherwise (if not included) columns will sort as normal
   */
  ignoreSort?: boolean;
}
