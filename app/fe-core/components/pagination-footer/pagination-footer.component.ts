import { Component, Input, Output, OnInit, OnChanges, EventEmitter, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

declare var jQuery: any;

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

@Component({
    selector: 'pagination-footer',
    templateUrl: './app/fe-core/components/pagination-footer/pagination-footer.component.html'
})

/*
    Summary
        There are two types of footer pagination.
        The first type is "module". The purpose of a module pagination footer is to control the index value of pagination without changing the page.
        To accomplish this, the index value is initially set based on the inputs and is controlled by the event emitter output.
        The second type is "page". The purpose of a page pagination footer is to navigate to a new page when a new index is clicked.
        To accomplish this, navigation parameters are initially inputted to create anchor tags, which allow for page navigation.
    Input - paginationParameters
        {
            index: number,
            max: number,
            paginationType: string,
            viewAllPage: string,
            viewAllParams: Object,
            navigationPage: string,
            navigationParams: Object,
            indexKey: string
        }
    Output
        newIndex() //Used for pagination Type module. This event emitter returns the new index value that was clicked.
 */

export class PaginationFooter implements OnChanges{
    @Input() paginationParameters: PaginationParameters;
    //Booleans to determine if max/min skip buttons should be shown
    public showMinSkip: boolean = false;
    public showMaxSkip: boolean = false;
    public disabledMin: string;
    public disabledMax: string;
    //Button (anchor tag) parameters for min, max, previous angle, and next angle buttons
    public minButtonParameters: Object;
    public maxButtonParameters: Object;
    public previousButtonParameters: Object;
    public nextButtonParameters: Object;
    public firstButtonParameters: Object;
    public lastButtonParameters: Object;
    //Number to determine +- range of buttons. (ex. buttonRange of 2 with an index of 6 yields buttons, 4 5 6 7 8)
    public buttonRange: number = 9;
    public buttonRangeMobile: number = 4;

    //Array of what indexes are displayed. paginationButtonsModule is used for paginationType module. paginationButtonsPage is used for paginationType page
    public paginationButtonsModule: Array<Number>;
    public paginationButtonsModuleMobile: Array<Number>;
    public paginationButtonsPage: Array<{
        index: number,
        params: Object;
    }>;
    public paginationButtonsPageForMobile: Array<{
      index: number,
      params: Object;
    }>;
    //Output event emitter
    @Output() newIndex = new EventEmitter();

    constructor(public myElement:ElementRef){}
    //Verifies component input. If any issues are detected console warning is thrown
    verifyInput(){
        var input = this.paginationParameters;
        try{
            //Check if input is defined at all
            if(typeof input == 'undefined'){
                throw 'No input parameters defined. Make sure input values are passed in correctly';
            }
            //Check if index parameter is defined
            if(typeof input.index == 'undefined'){
                throw 'input parameter index must be defined. Check component comments for more details';
            }
            //Check if max parameter is defined
            if(typeof input.max == 'undefined'){
                throw 'input parameter max must be defined. Check component comments for more details';
            }
            //Check if paginationType is defined
            if(typeof input.paginationType == 'undefined'){
                throw 'input parameter paginationType must be defined. Check component comments for more details';
            }
            //Do checks on required inputs if paginationType is page
            if(input.paginationType == 'page'){
                //Check if navigationPage is defined
                if(typeof input.navigationPage == 'undefined'){
                    throw 'input parameter navigationPage must be defined for paginationType page. Check component comments for more details';
                }
                //Check if navigationParams are defined
                if(typeof input.navigationParams == 'undefined'){
                    throw 'input parameter navigationParams must be defined for paginationType page. Check component comments for more details';
                }
                //Check if indexKey is defined
                if(typeof input.indexKey == 'undefined'){
                    throw 'input parameter indexKey must be defined for paginationType page. Check component comments for more details';
                }
            }

        }catch(e){
            console.error('Error - Pagination Footer: ', e);
        }
    }

    //Build button structure for pagination Type module
    buildModuleButtons(){
        var index = Number(this.paginationParameters.index);
        var max = Number(this.paginationParameters.max);
        var range = this.buttonRange;
        var minRange, maxRange;
        this.paginationButtonsModule = [];
        //Determine values before index that can be added to button array
        for(var p = range; p >= 0; p--){
          let currentMin = index - p;
            if(index - p > (index - 6) && index - p > 0){//only show if number is 4 below current index and above 0
              minRange = index - p;
                this.paginationButtonsModule.push(index - p);
            }
        }

        //set the minimum number gonig to be shown that is in the array
        minRange = Math.min.apply(null, this.paginationButtonsModule);
        if(minRange + range < max){//only show the next 4 buttons if its less than the maximum otherwise let the maximum become the biggest
          maxRange = minRange + range;
        }else{
          maxRange = max
        }

        //Determine values after index that can be added to button array
        for(var n = 1; n <= range; n++){
            if((index + n) <= maxRange){
                this.paginationButtonsModule.push(index + n);
            }
        }

        //Determine if absolute first button should be shown (show ellipsis if first item in array is not 5)
        if(this.paginationButtonsModule.length != 0 && this.paginationButtonsModule[0] != (1 + 4)){
            this.showMinSkip = true;
        }else{
            this.showMinSkip = false;
        }

        //Determine if absolute last button should be shown (show ellipsis if the last item in the array is not max - 4)
        if(this.paginationButtonsModule.length != 0 && this.paginationButtonsModule[this.paginationButtonsModule.length - 1] != (max - 4)){
            this.showMaxSkip = true;
        }else{
            this.showMaxSkip = false;
        }
    }

    //Build button structure for pagination Type module Mobile version
    buildModuleButtonsMobile(){
        var index = Number(this.paginationParameters.index);
        var max = Number(this.paginationParameters.max);
        var range = this.buttonRangeMobile;
        var minRange, maxRange;
        this.paginationButtonsModuleMobile = [];
        //Determine values before index that can be added to button array
        for(var p = range; p >= 0; p--){
          let currentMin = index - p;
            if(index - p > (index - 4) && index - p > 0){//only show if number is 2 below current index and above 0
              minRange = index - p;
                this.paginationButtonsModuleMobile.push(index - p);
            }
        }

        //set the minimum number gonig to be shown that is in the array
        minRange = Math.min.apply(null, this.paginationButtonsModuleMobile);
        if(minRange + range < max){//only show the next 4 buttons if its less than the maximum otherwise let the maximum become the biggest
          maxRange = minRange + range;
        }else{
          maxRange = max
        }

        //Determine values after index that can be added to button array
        for(var n = 1; n <= range; n++){
            if((index + n) <= maxRange){
                this.paginationButtonsModuleMobile.push(index + n);
            }
        }

        //Determine if absolute first button should be shown (show ellipsis if first item in array is not 3)
        if(this.paginationButtonsModuleMobile.length != 0 && this.paginationButtonsModuleMobile[0] != (1 + 2)){
            this.showMinSkip = true;
        }else{
            this.showMinSkip = false;
        }

        //Determine if absolute last button should be shown (show ellipsis if the last item in the array is not max - 2)
        if(this.paginationButtonsModule.length != 0 && this.paginationButtonsModuleMobile[this.paginationButtonsModuleMobile.length - 1] != (max - 2)){
            this.showMaxSkip = true;
        }else{
            this.showMaxSkip = false;
        }
    }

    //Build button(anchor tag) structure for pagination Type page
    buildPageButtons(){
        var index = Number(this.paginationParameters.index);
        var max = Number(this.paginationParameters.max);
        var range = this.buttonRange;
        this.paginationButtonsPage = [];

        var navigationPage = this.paginationParameters.navigationPage;
        var indexKey = this.paginationParameters.indexKey;
        //Determine values before index that can be added to button array
        var r = 0;
        if(index < max-4 && index > 1){
          r = 4;
        } else {
          r = max-index;
        }
        for(var p = range - r; p > 0; p--){
            if(index - p > 1){
              //Build routerLink params for index values
              var params = this.copyDynamicParams();
              params[indexKey] = index - p;
              //Push button parameters to array
              this.paginationButtonsPage.push({
                  index: (index - p),
                  params: this.getArrayLink(navigationPage, params)
              });
            }
        }
        if(index != 1 && index != max) {
            //Build routerLink params for inputted index value
            var params = this.copyDynamicParams();
            params[indexKey] = (index);
            //Push button parameters to array
            this.paginationButtonsPage.push({
                index: index,
                params: this.getArrayLink(navigationPage, params)
            });
        }

        //Determine values after index that can be added to button array
        var i = 0;
        if(index > 5){
          i = 5;
        } else {
          i = range - (range - index) - 1;
        }
        for(var n = 1; n <= range - i; n++){
            if(index + n < max){
                //Build routerLink params for index values
                var params = this.copyDynamicParams();
                params[indexKey] = (index + n);
                //Push button parameters to array
                this.paginationButtonsPage.push({
                    index: (index + n),
                    params: this.getArrayLink(navigationPage, params)
                });
            }
        }

        //Build min button parameters
        var params = this.copyDynamicParams();
        params[indexKey] = 1;

        this.minButtonParameters = this.getArrayLink(navigationPage, params);

        //Build max button parameters
        var params = this.copyDynamicParams();
        params[indexKey] = max;

        this.maxButtonParameters = this.getArrayLink(navigationPage, params);

        //Determine if next/previous and last/first buttons should be inactive
        if(max <= 1){
          this.disabledMin = "pagDisabled";
          this.disabledMax = "pagDisabled";
        } else if(index == max){
          this.disabledMax = "pagDisabled";
        } else if(index == 1){
          this.disabledMin = "pagDisabled";
        }
        //Determine if absolute first button should be shown (show ellipsis if first item in array is not 5)
        if(index > 6 && range + 1 < max){
            this.showMinSkip = false;
        }else{
            this.showMinSkip = true;
        }

        //Determine if absolute last button should be shown (show ellipsis if the last item in the array is not max - 1)
        if((index < max - 4 && range + 1 < max) || max < 2){
            this.showMaxSkip = false;
        }else{
            this.showMaxSkip = true;
        }
        var firstParams = this.copyDynamicParams();
        firstParams[indexKey] = 1;
        this.firstButtonParameters = this.getArrayLink(navigationPage, firstParams);

        //Build parameters of previous angle button
        var prevParams = this.copyDynamicParams();
        if (index - 1 >= 1) {
            prevParams[indexKey] = index - 1;
        } else {
            prevParams[indexKey] = 1;
        }
        this.previousButtonParameters = this.getArrayLink(navigationPage, prevParams);

        //Build parameters of next angle button
        var nextParams = this.copyDynamicParams();
        if (index + 1 <= max) {
            nextParams[indexKey] = index + 1;
        } else {
            nextParams[indexKey] = max;
        }
        this.nextButtonParameters = this.getArrayLink(navigationPage, nextParams);

        var lastParams = params;
        lastParams[indexKey] = max;
        this.lastButtonParameters = this.getArrayLink(navigationPage, lastParams);
    }


    //Build pagination page for mobile
    buildPageButtonsMobile() {
      var index = Number(this.paginationParameters.index);
      var max = Number(this.paginationParameters.max);
      var range = this.buttonRangeMobile;
      this.paginationButtonsPageForMobile = [];

      var navigationPage = this.paginationParameters.navigationPage;
      let pageNav;
      var indexKey = this.paginationParameters.indexKey;
      //Determine values before index that can be added to button array
      var r = 0;
      if(index < max-2 && index > 1){
        r = 2;
      } else {
        r = max-index;
      }

      for(var p = range - r; p > 0; p--){
          if(index - p > 1){
            //Build routerLink params for index values
            var params = this.copyDynamicParams();
            params[indexKey] = index - p;
            //Push button parameters to array
            this.paginationButtonsPageForMobile.push({
                index: (index - p),
                params: this.getArrayLink(navigationPage, params)
            });
          }
      }
      if(index != 1 && index != max) {
          //Build routerLink params for inputted index value
          var params = this.copyDynamicParams();
          params[indexKey] = (index);
          //Push button parameters to array
          this.paginationButtonsPageForMobile.push({
              index: index,
              params: this.getArrayLink(navigationPage, params)
          });
      }

      //Determine values after index that can be added to button array
      var i = 0;
      if(index > 2){
        i = 2;
      } else {
        i = range - (range - index) - 1;
      }

      for(var n = 1; n <= range - i; n++){
          if(index + n < max){
              //Build routerLink params for index values
              var params = this.copyDynamicParams();
              params[indexKey] = (index + n);
              //Push button parameters to array
              this.paginationButtonsPageForMobile.push({
                  index: (index + n),
                  params: this.getArrayLink(navigationPage, params)
              });
          }
      }

      //Build min button parameters
      var params = this.copyDynamicParams();
      params[indexKey] = 1;
      this.minButtonParameters = this.getArrayLink(navigationPage, params);

      //Build max button parameters
      var params = this.copyDynamicParams();
      params[indexKey] = max;
      this.maxButtonParameters = this.getArrayLink(navigationPage, params);

      //Determine if next/previous and last/first buttons should be inactive
      if(max <= 1){
        this.disabledMin = "pagDisabled";
        this.disabledMax = "pagDisabled";
      } else if(index == max){
        this.disabledMax = "pagDisabled";
      } else if(index == 1){
        this.disabledMin = "pagDisabled";
      }
      //Determine if absolute first button should be shown (show ellipsis if first item in array is not 5)
      if(index > 3 && range + 1 < max){
          this.showMinSkip = false;
      }else{
          this.showMinSkip = true;
      }

      //Determine if absolute last button should be shown (show ellipsis if the last item in the array is not max - 1)
      if((index < max - 2 && range + 1 < max) || max < 2){
          this.showMaxSkip = false;
      }else{
          this.showMaxSkip = true;
      }
      var firstParams = this.copyDynamicParams();
      firstParams[indexKey] = 1;
      this.firstButtonParameters = this.getArrayLink(navigationPage, firstParams);

      //Build parameters of previous angle button
      var prevParams = this.copyDynamicParams();
      if (index - 1 >= 1) {
          prevParams[indexKey] = index - 1;
      } else {
          prevParams[indexKey] = 1;
      }
      this.previousButtonParameters = this.getArrayLink(navigationPage, prevParams);

      //Build parameters of next angle button
      var nextParams = this.copyDynamicParams();
      if (index + 1 <= max) {
          nextParams[indexKey] = index + 1;
      } else {
          nextParams[indexKey] = max;
      }
      this.nextButtonParameters = this.getArrayLink(navigationPage, nextParams);

      var lastParams = params;
      lastParams[indexKey] = max;
      this.lastButtonParameters = this.getArrayLink(navigationPage, lastParams);
    } //buildPageButtonsMobile()

    //Copy object of input navigationParameters
    copyDynamicParams(){
        var params = {};
        var navigationParameters = this.paginationParameters.navigationParams;
        for(var key in navigationParameters){
            params[key] = navigationParameters[key];
        }
        return params;
    }

    //Function to navigate number buttons for paginationType module
    indexClick(event){
      var newIndex = Number(event.target.innerHTML);
      this.paginationParameters.index = newIndex;
      this.newIndex.next(newIndex);
      this.buildModuleButtons();
      this.buildModuleButtonsMobile();
    }

    //Function to navigate angle left button for paginationType module
    indexLeft(event){
        //If index equals 1 exit function, else set new index
        if(this.paginationParameters.index == 1){
            return false;
        }else{
          if(event == 'single'){
            var newIndex = this.paginationParameters.index - 1;
          }else if (event == 'last'){
            var newIndex = 1;
          }
        }
        //Send new index to output event emitter
        this.newIndex.next(newIndex);

        this.paginationParameters.index = newIndex;
        this.buildModuleButtons();
        this.buildModuleButtonsMobile();
    }

    //Function to navigate angle right button for paginationType module
    indexRight(event){
        //If index equals max exit function, else set new index
        if(this.paginationParameters.index == this.paginationParameters.max){
            return false;
        }else{
            if(event == 'single'){
              var newIndex = this.paginationParameters.index + 1;
            }else if (event == 'last'){
              var newIndex = this.paginationParameters.max;
            }
        }
        //Send new index to output event emitter
        this.newIndex.next(newIndex);

        this.paginationParameters.index = newIndex;
        this.buildModuleButtons();
        this.buildModuleButtonsMobile();
    }

    getArrayLink(navigationPage, params){
      let pageNav = [navigationPage];
      for(var param in params){
        pageNav.push(params[param]);
      }
      return pageNav;
    }

    ngOnChanges(event){
      this.verifyInput();
      // window.scrollTo(0, 0);
      //Call button build function based on pagination Type
      if(this.paginationParameters.paginationType == 'module') {
          this.buildModuleButtons();
          this.buildModuleButtonsMobile();
      }else if(this.paginationParameters.paginationType == 'page'){
          this.buildPageButtons();
          this.buildPageButtonsMobile();
      }
    }
}
