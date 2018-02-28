import { Component, Input, OnInit, OnChanges, ViewChild, AfterViewChecked } from '@angular/core';

//interfaces
import { ImageData, CircleImageData } from '../images/image-data';
import { CircleImage} from '../images/circle-image/circle-image';

export interface ComparisonBarInput {
    title: string;
    data: Array<{
        width?: number;
        value: number;
        color: string;
        fontWeight?: number;
    }>;
    minValue: number;
    maxValue: number;
    info?: string;
    infoBoxDetails?: Array<{
      teamName: string;
      playerName: string;
      infoBoxImage: CircleImageData;
      routerLinkPlayer: any;
      routerLinkTeam: any;
    }>;
    qualifierLabel: string;
}

@Component({
    selector: 'comparison-bar',
    templateUrl: './app/fe-core/components/comparison-bar/comparison-bar.component.html'
})

export class ComparisonBar {
    //Pull in DOM Elements
    @ViewChild('labelOne') labelOne;
    @ViewChild('labelTwo') labelTwo;
    @ViewChild('masterBar') masterBar;

    @Input() comparisonBarInput: ComparisonBarInput;
    @Input() index: number;
    displayData: ComparisonBarInput;
    statsHighCheck: string = "";
    isSelected(displayData){
      if(displayData.active === true){
        return false;
      }
      this.displayData.infoBoxDetails.forEach(comparisonBarInput => displayData.active = false);
      displayData.active = true;
    }

    mouseOff(element){
      element.active = false;
    }

    ngOnChanges(event){
        this.displayData = this.configureBar();
      }//ngOnChanges ends

    //Function to reposition labels if needed
    calculateLabelPositions(){
        if ( this.displayData.data.length < 1 ) {
            return;
        }

        if ( this.displayData.data.length == 1 ) {
            this.labelOne.nativeElement.style.left = "auto";
            this.labelOne.nativeElement.style.right = "auto"

            if ( labelOneWidth > barOneWidth ) {
                this.labelOne.nativeElement.style.left = 0;
            }
            else {
                this.labelOne.nativeElement.style.right = 0;
            }
        }
        else {
            //Reset labels
            this.labelOne.nativeElement.style.left = "auto";
            this.labelOne.nativeElement.style.right = "auto";
            this.labelTwo.nativeElement.style.left = "auto";
            this.labelTwo.nativeElement.style.right = 0;

            //Get widths of DOM elements
            var barWidth = this.masterBar.nativeElement.offsetWidth;
            var labelOneWidth = this.labelOne.nativeElement.offsetWidth;
            var labelTwoWidth = this.labelTwo.nativeElement.offsetWidth;

            //Calculate final bar widths
            var barOneWidth = barWidth * this.displayData.data[0].width / 100;
            var barTwoWidth = barWidth * this.displayData.data[1].width / 100;

            //Set pixel buffer between labels that are close
            var pixelBuffer = 5;
            var adjustLabelOne = true;

            if ( (labelOneWidth+pixelBuffer) > barOneWidth ) {
                // if the label is wider than the bar, do calculation from label width
                // and adjust label two, as label one can't move left any more
                barOneWidth = labelOneWidth;
                adjustLabelOne = false;
            }

            if((barTwoWidth - barOneWidth) <= (labelTwoWidth + pixelBuffer)) {
                //If the difference between the bars is less than the width of the second label, shift label one over
                if ( adjustLabelOne ) {
                    var adjustLabel = Math.ceil(labelTwoWidth - (barTwoWidth - barOneWidth) + pixelBuffer);
                    this.labelOne.nativeElement.style.right = adjustLabel;
                    this.labelTwo.nativeElement.style.right = 0;
                }
                else {
                    var adjustLabel = Math.ceil((barTwoWidth - barOneWidth) - (labelTwoWidth + pixelBuffer));
                    this.labelOne.nativeElement.style.left = 0;
                    this.labelTwo.nativeElement.style.right = adjustLabel;
                }
            }
            else {
                if ( adjustLabelOne ) {
                    this.labelOne.nativeElement.style.right = 0;
                }
                else {
                    this.labelOne.nativeElement.style.left = 0;
                }
                this.labelTwo.nativeElement.style.right = 0;
            }
        }
    }

    ngAfterViewInit(){
        this.calculateLabelPositions();
    }

    //Function to configure any variables the comparison bar needs
    configureBar(){
        var barData = this.comparisonBarInput;
        var worstValue = Number(barData.minValue);
        var bestValue = Number(barData.maxValue);
        // var dataOne = typeof barData.data[0]['value'] != 'undefined' ? barData.data[0]['value'] : null;
        // var dataTwo = typeof barData.data[1]['value'] != 'undefined' ? barData.data[1]['value'] : null;
        var adjustedMax = bestValue;
        var switchValues = false;
        if(bestValue < worstValue){
            adjustedMax = worstValue - bestValue;
            switchValues = true;
        }

        //Determines what percentage the scale starts at (ex. 0 starts at 2% of bars width)
        var scaleStart = 2;
        //Determine widths of bars and add to display list
        // if((dataOne === null && dataTwo === null) || worstValue == bestValue || barData.maxValue == null){
        if(worstValue == bestValue || barData.maxValue == null){
          this.statsHighCheck = "hideMe";
        }
        for (var i = 0; i < barData.data.length; i++ ) {
            var dataItem = barData.data[i];
            var value = dataItem.value != null ? dataItem.value : 0;

            if ( switchValues ) {
                if ( value < bestValue ) {
                    dataItem.value = null;
                    value = 0;
                }
                else {
                    value = worstValue - value;
                }
            }
            dataItem.width = (Math.round(value / adjustedMax * (100 - scaleStart) * 10) / 10) + scaleStart;
            if ( dataItem.width < scaleStart || !dataItem.value ) {
                dataItem.width = scaleStart;
            }
        }

        barData.data.sort((a,b) => {
            var diff = a.width - b.width;
            if ( Math.abs(diff) <= 0.5 ) {
                if ( b.value == null ) {
                    a.width += 1;
                }
                else if ( a.value == null ) {
                    b.width += 1;
                }
                else if ( diff >= 0 ) {
                    b.width += 1;
                }
                else {
                    a.width += 1;
                }
                diff = a.width - b.width;
            }
            return diff;
        });

        return barData;
    }
}
