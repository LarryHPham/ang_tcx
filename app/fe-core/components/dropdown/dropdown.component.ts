import {Component, OnInit, Inject, OnDestroy, Input, Output, EventEmitter, Renderer, OnChanges, AfterViewInit, ViewChild, ElementRef} from '@angular/core';

import {Scroller, ScrollerFunctions} from '../../../global/scroller-functions';

/**
 * Adds listeners that determine whether the
 * dropdown should be hidden or visible.
 *
 * Dropdown containers should appear when the header
 * element is clicked and disappear when the mouse is clicked
 * elsewhere within the document, UNLESS the mousedown
 * event starts on the scroller element.
 */
class Dropdown {
  mouseDownOnScrollBar: boolean = false;
  isDropdownVisible: boolean = false;
  nativeElement: any;
  dropdownHeader: any;
  dropdownContainer: any;
  dropdownIcon: any;

  constructor(elementRef: ElementRef) {
    this.nativeElement = elementRef.nativeElement;
    this.dropdownHeader = this.nativeElement.getElementsByClassName('dropdown')[0];
    this.dropdownContainer = this.nativeElement.getElementsByClassName('dropdown-wrapper')[0];
    this.dropdownIcon = this.nativeElement.getElementsByClassName('dropdown-hdr-button')[0];
    if ( this.dropdownIcon ) {
      this.dropdownIcon = this.dropdownIcon.getElementsByTagName("i")[0];
    }
  }

  toggleDropdown(showIt:boolean, dropdownHiddenIcon: string, dropdownVisibleIcon: string) {
      this.isDropdownVisible = showIt;

      var display = "none";
      var icon = dropdownHiddenIcon;
      var className = "dropdown";
      if ( this.isDropdownVisible ) {
        display = "";
        icon = dropdownVisibleIcon;
        className += " dropdown-active";
      }
      this.dropdownContainer.style.display = display;
      this.dropdownHeader.className = className;
      if ( this.dropdownIcon ) {
        this.dropdownIcon.className = "fa " + icon;
      }
  }
}

@Component({
  selector: 'dropdown',
  templateUrl: './app/fe-core/components/dropdown/dropdown.component.html'
})

export class DropdownComponent implements OnDestroy, OnChanges, AfterViewInit {
  @Input() list: Array<{key: string, value: string, preventSelection: string}>;

  @Input() selectedKey: string;

  @Input() icon: string;
  @Input() ddtitle:string;
  @Input() dropdownhdr:string;
  @Input() isModule:boolean;
  prefixString:string = "Date";

  dropdownVisibleIcon: string;

  dropdownHiddenIcon: string;

  selectedIndex: number;

  selectedItem: {key: string, value: string};

  @Output("selectionChanged") dropdownChangedListener = new EventEmitter();

  private hideDropdownListener: Function;
  private keepOpenUntilMouseUp: Function;

  private _elementRef: ElementRef;
  private _scrollerSetup: boolean = false;

  private scroller: Scroller;

  private dropdown: Dropdown;

  constructor(@Inject(ElementRef) elementRef: ElementRef, private _renderer: Renderer) {
    this._elementRef = elementRef;
  }

  ngAfterViewInit() {
    this.dropdown = new Dropdown(this._elementRef);
    this.dropdownSetup();
    this.hoverSetup();
  }

  ngOnChanges() {
    if ( !this.icon ) {

      this.dropdownVisibleIcon = "fa-sort";
      this.dropdownHiddenIcon = "fa-sort";
    }
    else if (this.icon == "fa-caret-down") {

      this.dropdownVisibleIcon = "fa-caret-up";
      this.dropdownHiddenIcon = "fa-caret-down";
    }
    else if (this.icon == "caret-down") {
        this.icon="fa-caret-down";
        this.dropdownVisibleIcon = "fa-caret-down";
        this.dropdownHiddenIcon = "fa-caret-down";
    }
    else {
      this.dropdownVisibleIcon = this.icon;
      this.dropdownHiddenIcon = this.icon;
    }
    if ( this.list ) {

      this.list.forEach((value, index) => {
        if ( value.key == this.selectedKey ) {
          this.selectedItem = value;
          this.selectedIndex = index;

        }
      });

      if ( !this.selectedItem && this.list.length > 0 ) {
        this.setSelected(this.list[0]);
      }
    }
    if ( !this.selectedItem ) {
      this.selectedItem = {key: "", value: " "};
      this.selectedIndex = -1;
    }



  }

  //TODO-CJP: setup multiple sort types
  setSelected($item) {
      function findPrefix(a) {
          return{
              'None': '',
              'Most Recent': 'Date',
              'Oldest':'Date',
              'Past 24 Hours': 'Time',
              'Past 7 Days':'Time',
              'Past 30 Days': 'Time',
          }[a];
      }

    this.selectedItem = $item;
    this.selectedKey = $item.key;
    if ( this.list ) {
      var tempIndex = -1;
      this.list.forEach((item, index) => {
        if ( item.key == $item.key ) {
          tempIndex = index;
        }
      });
      this.selectedIndex = tempIndex;
    }
    this.dropdownChangedListener.next($item.key); //item.key must always be emitted, item.value is for DISPLAY ONLY!
      this.prefixString= findPrefix(this.selectedItem.value);
      //console.log(this._elementRef.nativeElement.querySelector('div').lastElementChild.lastElementChild.querySelector('p').find('active'), "border");
      //this._renderer.setElementStyle(this._elementRef.nativeElement.querySelector('div'))
  }

  ngOnDestroy() {
    if ( this.hideDropdownListener ) {
       this.hideDropdownListener();
       this.hideDropdownListener = undefined;
    }
    if ( this.keepOpenUntilMouseUp ) {
      this.keepOpenUntilMouseUp();
      this.keepOpenUntilMouseUp = undefined;
    }
  }

  //Function to detect arrow key presses
  searchKeydown(event){
    // console.log("keydown", event);
      //If list has items, allow for arrow key functionality
      if(this.list && this.list.length > 0 ) {
          if (event.keyCode === 40) {
              //Down Arrow Keystroke
              if (this.selectedIndex >= this.list.length - 1) {
                  //If index is equal or greater than last item, reset index to -1 (input is selected)
                  this.selectedIndex = -1;
              } else {
                  //Else increment index by 1
                  this.selectedIndex++;
                  while ( this.list[this.selectedIndex].preventSelection ) {
                    this.selectedIndex++;
                    if ( this.selectedIndex >= this.list.length ) {
                      this.selectedIndex = -1;
                      break;
                    }
                  }
              }
              this.scrollToSelected();
              //Prevents unwanted cursor jumping when up and down arrows are selected
              event.preventDefault();
          } else if (event.keyCode === 38) {
              //Up Arrow Keystroke
                if (this.selectedIndex === -1) {
                    //If index is -1 (input is selected), set index to last item
                    this.selectedIndex = this.list.length - 1;
                } else if (this.selectedIndex === 0) {
                    //Else if index is 0 (1st dropdown option is selected), set index to input
                    this.selectedIndex = -1;
                } else {
                    //Else decrement index by 1
                    this.selectedIndex--;
                    while ( this.list[this.selectedIndex].preventSelection ) {
                      this.selectedIndex--;
                      if ( this.selectedIndex == -1 ) {
                        break;
                      }
                    }
                }
                this.scrollToSelected();
              //Prevents unwanted cursor jumping when up and down arrows are selected
              event.preventDefault();
          }
          else if ( event.keyCode === 13 ) {
            //Enter key
            if ( this.selectedIndex >= 0 && this.selectedIndex < this.list.length ) {
              var $item = this.list[this.selectedIndex];
              this.selectedItem = $item;
              this.selectedKey = $item.key;
              this.dropdownChangedListener.next($item.key);
            }
            this.dropdown.toggleDropdown(false, this.dropdownHiddenIcon, this.dropdownVisibleIcon);
          }
      }
  }

  scrollToSelected() {
    if ( this.selectedIndex >= 0 && this.selectedIndex < this.list.length ) {
      var $item = this.list[this.selectedIndex];
      try {
        var $div = this._elementRef.nativeElement.querySelector("[data-key='" + $item.key + "']");
        if ( $div ) {
          this.scroller.scrollToItem($div);
          this.setHighlightOnCaret($div, false);
        }
      }
      catch (err) {
        console.log("error occurred during selector", err);
      }
    }
  }

  dropdownSetup() {
    var self = this;
    //This function closes the dropdown if the mouse is clicked anywhere but on the scrollbar.
    function closeDropdownOnClick() {
        //Remove any existing listener:
        if ( self.hideDropdownListener ) {
          self.hideDropdownListener();
          self.hideDropdownListener = undefined;
        }

        //Add new listener that checks for any click on the document
        self.hideDropdownListener = self._renderer.listenGlobal('document', 'click', (event) => {
          if ( self.dropdown.mouseDownOnScrollBar ) {
            //Ignore click if 'keepDropdownOpen' is true, as that means the
            // user was dragging the scrollbar. But since the mouse is up again,
            // reset the mouseDownOnScrollBar to false.
            self.dropdown.mouseDownOnScrollBar = false;
            return;
          }

          self.dropdown.toggleDropdown(false, self.dropdownHiddenIcon, self.dropdownVisibleIcon);

          if ( self.hideDropdownListener ) {
            //if the listener still exists, remove it as it's not needed once
            //the dropdown is hidden again
            self.hideDropdownListener();
          }
          self.hideDropdownListener = undefined;
        });
    }

    //If we have valid dropdown elements, add the mousedown and click listeners
    if ( this.dropdown.dropdownContainer && this.dropdown.dropdownHeader ) {

      //needed to disable selection in IE11
      this.dropdown.dropdownContainer.onselectstart = function() { return false; }

      // We don't want to close dropdown when the scroller is selected,
      // So this checks to see if the mouse went down on the scroller.
      this.dropdown.dropdownHeader.addEventListener('mousedown', function(event) {
          //Gets the element underneath the mouse
          var element = document.elementFromPoint(event.clientX, event.clientY);

          // Checks to see if that element is the scrollbar
          self.dropdown.mouseDownOnScrollBar = element.className.indexOf("scrollable-item-scroller") >= 0;

          //If it is the scrollbar, remove the 'keepOpenUntilMouseUp' listener, and create a new one
          if ( self.dropdown.mouseDownOnScrollBar ) {

            //Remove the listener if it exists
            if ( self.keepOpenUntilMouseUp ) {
              self.keepOpenUntilMouseUp(); // this does the actual removal
            }

            //Only create this listener after a timeout so that the current mousedown doesn't automatically trigger it.
            // We only want to trigger the 'keepOpenUntilMouseUp' function when a new mousedown event occurs
            setTimeout(() => {
              self.keepOpenUntilMouseUp = self._renderer.listenGlobal('document', 'mousedown', (event) => {
                self.dropdown.mouseDownOnScrollBar = false;
              });
            },1);
          }
      });

      // This opens (and closes) the dropdown when the dropdown header is clicked.
      this.dropdown.dropdownHeader.addEventListener('click', function(event) {
        if ( self.dropdown.mouseDownOnScrollBar ) {
          //ignore click if 'keepDropdownOpen' is true
          // - this prevents the dropdown from closing if the mouse was in the process of dragging the scrollbar.
          return;
        }

        //Toggle the dropdown visibility and show/hide the actual container
        self.dropdown.toggleDropdown(!self.dropdown.isDropdownVisible, self.dropdownHiddenIcon, self.dropdownVisibleIcon);

        //The scroller can't calculate a content's height and scroll ratio when it's hidden.
        //So this checks to see if the dropdown is visible and then sets up the scroller.
        if ( self.dropdown.isDropdownVisible ) {
          self.scroller = ScrollerFunctions.initializeScroller(self.dropdown.nativeElement, document);
          self.scrollToSelected(); //Make sure the current selected item is visible.
        }

        if ( !self.hideDropdownListener && self.dropdown.isDropdownVisible ) {
          //timeout is needed so that click doesn't happen for click.
          setTimeout(closeDropdownOnClick, 1);
        }
      });
    }
  }

  setHighlightOnCaret(optionElement: any, isHover: boolean) {
      //Check to see if the bounds of the element overlaps the top edge of the scroll container
      var scrollContainer = this._elementRef.nativeElement.getElementsByClassName('scrollable-item')[0];
      var caretTop = this._elementRef.nativeElement.getElementsByClassName('dropdown-caret-top')[0];
      var highlightCaret = false;
      if ( optionElement && optionElement.className.indexOf("dropdown-grp-lbl") < 0 ) {
        var elementBounds = optionElement.getBoundingClientRect();
        var scrollContainerBounds = scrollContainer.getBoundingClientRect();
        if ( scrollContainerBounds.top >= elementBounds.top ) {
          highlightCaret = true;
        }
      }

      //If so, add the dropdown-caret-top-hover class to highlight the caret
      var classes = caretTop.className.split(" ");
      var styleClass = isHover ? "dropdown-caret-top-hover" : "dropdown-caret-top-active";
      var index = classes.indexOf(styleClass);
      if ( highlightCaret ) {
        if ( index < 0 ) {
          classes.push(styleClass); //add styleClass
        }
        // caretTop.className = "dropdown-caret-top " + (isHover ? "dropdown-caret-top-hover" : "dropdown-caret-top-active");
      }
      else {
        if ( index >= 0 ) {
          classes.splice(index, 1); //remove styleClass
        }
        // caretTop.className = "dropdown-caret-top";
      }
      caretTop.className = classes.join(" ");
  }

  hoverSetup() {
    var self = this;

    var scrollContainer = this._elementRef.nativeElement.getElementsByClassName('scrollable-item')[0];
    var caretTop = this._elementRef.nativeElement.getElementsByClassName('dropdown-caret-top')[0];
    if ( !scrollContainer || !caretTop ) {
      return;
    }

    //Adds a mouseover listener checks to see if the mouse
    // is over the top item visible in the scroll container
    scrollContainer.addEventListener('mouseover', function(evt) {

      //Get the element under the mouse point
      var element = document.elementFromPoint(evt.clientX, evt.clientY);

      //Cycle through parents until the dropdown-list-option element is found
      // (loopCount limit of 10 to prevent infinite loops)
      var optionElement = null, loopCount = 0;
      while ( !optionElement && loopCount < 10 ) {
        loopCount++;
        if ( element.className.indexOf("dropdown-list-option") >= 0 ) {
          optionElement = element;
        }
        element = element.parentElement;
      }

      self.setHighlightOnCaret(optionElement, true);
    });

    //Removes the dropdown-caret-top-hover class when the mouse
    //moves off the scroll container
    scrollContainer.addEventListener('mouseout', function(evt) {
      if ( caretTop ) {
        var classes = caretTop.className.split(" ");
        var index = classes.indexOf("dropdown-caret-top-hover");
        if ( index >= 0 ) {
          classes.slice(index, 1);
        }
        caretTop.className = classes.join(" ");
        // caretTop.className = "dropdown-caret-top";
      }
    });
  }
}
