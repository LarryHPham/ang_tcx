import {Component, Input, Output, OnInit, OnDestroy, EventEmitter, ElementRef} from '@angular/core';
import { Router } from '@angular/router';
import {SearchService} from '../../services/search.service';
import {Observable} from 'rxjs/Rx';
import {FormControl} from '@angular/forms';
/*
 * Search Component
 * Lutz Lai - 05/13/2016
 *
 * Description - This component is a bit tricky. Since this component actively uses an api as a user types,
 * the search service must be configured in a particular way. The search component expects search-service.ts to contain 2 functions:
 *
 * getSearchDropdownData(term: string){} - This is the function the search service subscribes to (function returns an observable) for dropdown data.
 *  The input is the search term. The data returned from this function should be in the Interface SearchComponentData format
 *
 * getSearchRoute(query: string){} - This is the function the component calls to get the search route to the search results page.
 *  The input is the search term. This allows the component to navigate to the search page on form submit
 *
 * I made it this way so you don't have to configure a module/page to watch for debounced output events from this component.
 * Instead you can just add this component to modules/pages with minimal input. There is probably a better way to do this down the line.
 *
 */

//Interface for single search result item
export interface SearchComponentResult {

    //Html string that is displayed in the dropdown
    title: string;
    //Value to compare against for autocomplete text
    value: string;
    //Url of image to be displayed next to the dropdown item
    imageUrl: any;
    //Array for routerLink parameters
    routerLink: Array<any>
}

//Interface for object returned from search-service.ts
export interface SearchComponentData {
    //Input text that search results are based on
    term: string;
    //Dropdown items returned from search service
    searchResults: Array<SearchComponentResult>;
}

//Interface for input of search component
export interface SearchInput {
    //Text that goes in as the placeholder for the input
    placeholderText: string;
    //Boolean to determine if the search dropdown should be displayed
    hasSuggestions: boolean;
    //Text that goes in the input on load
    initialText?: string;
}

@Component({
    selector: 'search',
    host: {
      '(document:click)': 'handleClick($event)'
    },
    templateUrl: './app/ui-modules/search/search.component.html',

})

export class Search{
    @Input() searchInput: SearchInput;
    @Input() partnerID: string;
    //NgControl of input
    public term:any = new FormControl();
    //Array of suggestions dropdown
    public dropdownList: Array<SearchComponentResult> = [];
    public elementRef;
    //Boolean to determine if dropdown is focused on by the user
    public dropdownIsFocused: boolean = false;
    //Subscription object for observables
    public subscription: any;
    //Autocomplete string
    public autoCompleteText: string = '';
    //Index of a dropdown item that is been selected by arrow keys. (-1 is no selection or input selected)
    public selectedIndex: number = -1;
    //Boolean to prevent search subscription from firing
    public isSuppressed: boolean = false;
    //Store search value
    public storedSearchTerm: string;
    //Boolean used to determine if input has text and results have been searched for
    public hasInputText: boolean;

    constructor(_elementRef: ElementRef, private _searchService: SearchService, private _router: Router){
        this.elementRef = _elementRef;
    }

    //Function to detect if user clicks inside the component
    handleClick(event){
        let target = event.target;
        let clickedInside = false;
        do{
            if(target === this.elementRef.nativeElement){
                clickedInside = true;
                //Exit do while loop
                target = false;
            }
            target = target.parentNode;
        }while(target);
        //If the user clicks in the component, show results else hide results
        if(clickedInside){
            //Clicked inside
            this.dropdownIsFocused = true;
        }else{
            //Clicked outside
            this.dropdownIsFocused = false;
        }
    }

    //Function to detect arrow key presses
    searchKeydown(event){
        //If search input has suggestions, allow for arrow key functionality
        if(this.searchInput.hasSuggestions === true) {

            if (event.keyCode === 40) {
                //Down Arrow Keystroke
                if (this.dropdownList.length > 0) {
                    //If dropdown list exists change index
                    if (this.selectedIndex >= this.dropdownList.length - 1) {
                        //If index is equal or greater than last item, reset index to -1 (input is selected)
                        this.selectedIndex = -1;
                        this.unsuppressSearch();
                    } else {
                        //Else increment index by 1
                        this.selectedIndex++;
                        let value = this.getSelectedValue(this.selectedIndex);
                        this.suppressSearch(value);
                    }
                }
                //Prevents unwanted cursor jumping when up and down arrows are selected
                event.preventDefault();
            } else if (event.keyCode === 38) {
                //Up Arrow Keystroke
                if (this.dropdownList.length > 0) {
                    //If dropdown list exists change index
                    if (this.selectedIndex < 0) {
                        //If index is -1 (input is selected), set index to last item
                        this.selectedIndex = this.dropdownList.length - 1;
                        let value = this.getSelectedValue(this.selectedIndex);
                        this.suppressSearch(value);
                    } else if (this.selectedIndex === 0) {
                        //Else if index is 0 (1st dropdown option is selected), set index to input and unsuppress search
                        this.selectedIndex = -1;
                        this.unsuppressSearch();
                    } else {
                        //Else decrement index by 1
                        this.selectedIndex--;
                        let value = this.getSelectedValue(this.selectedIndex);
                        this.suppressSearch(value);
                    }
                }
                //Prevents unwanted cursor jumping when up and down arrows are selected
                event.preventDefault();
            } else if(event.keyCode == 13){
              //do nothing and let the form submit route to necessary area
            } else {
                //If other key is pressed unsuppress search
                this.isSuppressed = false;
                this.resetSelected();
            }
        }
    }

    //Get value that is
    getSelectedValue(index: number){
        return this.dropdownList[index].value;
    }

    //Prevent search subscription from firing. This is needed to prevent the search from firing when a user selects a dropdown option with the arrow keys
    suppressSearch(value: string){
        this.isSuppressed = true;
        this.term.updateValue(value);
    }

    //Allow search subscription to fire again
    unsuppressSearch(){
        this.term.updateValue(this.storedSearchTerm);
        this.isSuppressed = false;
    }

    //Function to reset the dropdown item selected by arrow keys to default (-1: input selected)
    resetSelected(){
        this.selectedIndex = -1;
    }

    //Function to make dropdown item active when hovered
    itemHovered(index: number){
        this.selectedIndex = index;
    }

    //Function to check if autocomplete text should be displayed or hidden
    compareAutoComplete(text: string){
      this.dropdownIsFocused = true;
        if(this.dropdownList.length > 0){
            //If dropdown suggestions exists, determine if autocomplete text should be shown
            let suggestionText = this.dropdownList[0].value;
            //Sanitize values to compare. This is to match different case values
            let tempCompare = suggestionText.toLowerCase();
            let tempText = text.toLowerCase();
            //Check to see if input text is a substring of suggestion Text
            let indexOf = tempCompare.indexOf(tempText);
            //If input is a substring of the suggestion text, display suggestion text
            if(indexOf === 0 && text !== ''){
                //Rebuild auto complete text to display
                let autoCompleteText = text + suggestionText.substring(text.length);
                this.autoCompleteText = autoCompleteText;
            }else{
                //Else remove autocomplete text
                this.autoCompleteText = '';
            }
        }else{
            //Else remove autocomplete text
            this.autoCompleteText = '';
        }
    }

    //On submit function for input
    onSubmit(){
        //Encode input to safely push to URL
        let term = this.term.value ? encodeURIComponent(this.term.value) : '';
        //If input is empty exit submit
        if(term == ''){
            return false;
        }
        let searchRoute: Array<any>;
        if( this.selectedIndex < 0 && (this.dropdownList.length > 1 || this.dropdownList.length == 0) ){//no dropdown selected and if there are multiple results or 0 go to search page with query
          // searchRoute = this._searchService.getSearchRoute(term);
        }else if(this.dropdownList.length == 1 ){// if there is a selected dropdown and only one item available to to that route
          searchRoute = this.dropdownList[0].routerLink;
        }else{
          /*let dropdownLink = this.dropdownList[this.selectedIndex].routerLink;
          searchRoute = dropdownLink;*/

        }
        if(this.partnerID){
          this._router.navigate(['/'+this.partnerID, 'news', 'search', 'articles', term]);
        } else {
          this._router.navigate(['/news-feed','search','articles',term]);
        }
        // this._router.navigate(searchRoute);

        //Clear out autocomplete text and close dropdown when search occurs
        this.dropdownIsFocused = false;
        this.autoCompleteText = '';

    }

    unFocus(){
      this.dropdownIsFocused = false;
    }

    ngOnInit(){
        let self = this;
        let input = this.searchInput;

        //If initial text exists
        if(typeof input.initialText !== 'undefined'){
            this.term.updateValue(input.initialText);
        }
        //Subscription for function call to service
        this.subscription = this.term.valueChanges
            .map(data => {
                //Check every keystroke to determine if autocomplete text should be displayed
                self.compareAutoComplete(data);
                return data;
            })
            //Only continue stream if 400 milliseconds have passed since the last iteration
            .debounceTime(400)
            //If search is not suppressed, continue rxjs stream
            .filter(data => !self.isSuppressed)
            //Only continue stream if the input value has changed from the last iteration
            .distinctUntilChanged()
            // Cancel any previous iterations if they have not completed their cycle. Also used to empty dropdown list if input is blank
            .switchMap((term: string) => term.length > 0 ? self._searchService.getSortOptions() : Observable.of({term: term, searchResults: []}))
            // .switchMap((term: string) => term.length > 0 ? self._searchService.getSortOptions(this._router, term) : Observable.of({term: term, searchResults: []}))
            .subscribe(data => {
                let term = data.term;
                let searchResults = data.searchResults;
                self.hasInputText = term.length > 0 ? true : false;
                //Reset dropdown item that is selected
                self.resetSelected();
                //Assign data to dropdown
                self.dropdownList = searchResults;
                //Store input value for arrow keys dropdown
                self.storedSearchTerm = term;
                self.compareAutoComplete(term);
            });

    }


    ngOnDestroy(){
        //Unsubscribe to observable to avoid memory leak
        this.subscription.unsubscribe();
    }
}
