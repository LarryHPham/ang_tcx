export interface PaginationParameters {
    /**
     * Required - Determines what index is selected
     */
    index: number;

    /**
     * Required - Determines the max index that can be selected
     */
    max: number;

    /**
    * Required - Determines what kind of pagination footer this is (options are module or page. modules make the pagination navigation buttons. page makes the pagination navigation anchor tags.)
    */
    paginationType: string;

    /**
     * Optional - This is the page used for routerLink in the view all button. (Both this and viewAllParams must be defined for the view all button to show)
     */
    viewAllPage?: string;

    /**
     *  Optional - This is the parameters used for routerLink in the view all button. (Both this and viewAllPage must be defined for the view all button to show)
     */
    viewAllParams?: Object;

    /**
     * Required for pagination Type page - This is the page used for routerLink for the navigation anchor tags
     */
    navigationPage?: string;

    /**
     * Required for pagination Type page - This is the parameters used for routerLink for the navigation anchor tags.
     */
    navigationParams?: Object;

    /**
     * Required for pagination Type page - This is the key name within navigation parameters in which index will apply to.
     *
     * @Example - If a routes index field is named pageNumber, input "pageNumber" through this field and it will be added to navigationParams to allow for routerLink routing.
     */
    indexKey?: string;
}
