class Color {
  red: number;
  green: number;
  blue: number;

  static parseColor(hexValue) {
    if ( hexValue != null ) {
      var match = /#?([0-9A-Fa-f]{6})/.exec(hexValue);
      if ( match && match[1] ) {
        let hexOnly = match[1];
        var red   = parseInt(hexOnly.substring(0, 2), 16);
        var green = parseInt(hexOnly.substring(2, 4), 16);
        var blue  = parseInt(hexOnly.substring(4, 6), 16);
        return new Color(red, green, blue);
      }
    }
    return null;
  }

  static decimalToHex(d:number, padding:number) {
    var hex = Number(d).toString(16);
    if ( padding != null ) padding = 2;
    while(hex.length < padding ) {
      hex = "0" + hex;
    }
    return hex;
  }

  constructor(red: number, green: number, blue: number) {
    this.red = parseInt(red.toString());
    this.green = parseInt(green.toString());
    this.blue = parseInt(blue.toString());
  }

  toRgbFormat(alpha?: number) {
    if ( alpha != null ) {
      return "rgba(" + this.red + "," + this.green + "," + this.blue + "," + alpha + ")";
    }
    else {
      return "rgb(" + this.red + "," + this.green + "," + this.blue + ")";
    }
  }

  toHexFormat() {
    return "#" + Color.decimalToHex(this.red, 2) + Color.decimalToHex(this.green, 2) + Color.decimalToHex(this.blue, 2);
  }

  static ColorLuminance(hex, lum){
  	// validate hex string
  	hex = String(hex).replace(/[^0-9a-f]/gi, '');
  	if (hex.length < 6) {
  		hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
  	}
  	lum = lum || 0;

  	// convert to decimal and change luminosity
  	var rgb = "#", c, i;
  	for (i = 0; i < 3; i++) {
  		c = parseInt(hex.substr(i*2,2), 16);
  		c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
  		rgb += ("00"+c).substr(c.length);
  	}
  	return rgb;
  }

  // function to check if given color is light or dark
  // if light/dark then give a value to darken/lighten the color by 0.5
  static lightOrDark(colorStr:string):number {
    var epsilon = 255;
    var color = Color.parseColor(colorStr);
    var hsp = Math.abs(Math.sqrt(299 * color.red * color.red + 0.587 * color.green * color.green + 0.114 * color.blue * color.green));
    var pointValue = 0;
    if(hsp > 127.5){
      pointValue = -0.5;
    } else {
      pointValue = 0.5;
    }
    return pointValue;
  }// lightOrDark ends

}//COLOR ends

export class Gradient {
  static getGradientStyles(colorStrings: Array<string>, alpha?: number): any {
    var colors: Array<Color> = [];
    for ( var i = 0; i < colorStrings.length; i++ ) {
      var color = Color.parseColor(colorStrings[i]);
      if ( color != null ) {
        colors.push(color);
      }
    }
    var numOfColors = colors.length;
    if ( numOfColors <= 1 ) {
      return null;
    }
    else {
      var currPercent = 0;
      var steps = 100/(numOfColors-1);
      var gradientSteps = [];
      for ( var i = 0; i < numOfColors; i++ ) {
        gradientSteps.push(colors[i].toRgbFormat(alpha) + " " + currPercent.toFixed(0) + "%");
        currPercent += steps;
      }
      var gradientStr = gradientSteps.join(",");
      return {
          '-ms-filter': "progid:DXImageTransform.Microsoft.gradient (0deg," + gradientStr + ")",
          'background': "linear-gradient(90deg," + gradientStr + ")"
      }
    }
  }

  /**
   * This function calculates a weighted Euclidean distance for the 3-dimensional
   * space of red, green, and blue. This is not the best approximation for
   * color similarity as percieved by humans, but it is simple to calculate
   * and hopefully is good enough for our purposes (avoiding blue+blue, red+red/orange matches).
   *
   * For the algorithms see http://www.compuphase.com/cmetric.htm
   *
   */
  static areColorsClose(colorStr1:string, colorStr2:string):boolean {
    var epsilon = 255;

    var squaredDiff = function(num1:number, num2:number):number {
      var temp = num1 - num2;
      return temp * temp;
    }

    var color1 = Color.parseColor(colorStr1);
    var color2 = Color.parseColor(colorStr2);

    //Weighted RGB Euclidian distance
    var sum = 3 * squaredDiff(color1.red, color2.red) + 4 * squaredDiff(color1.green, color2.green) + 2 * squaredDiff(color1.blue, color2.blue);
    var distance = Math.abs(Math.sqrt(sum));

    // console.log("difference between " + colorStr1 + " and " + colorStr2 + " is " + distance);

    return distance < epsilon;
  }

  /**
   * Finds a pair of colors that are distinct, given the two sets of color arrays.
   * Throws an exception if there is not at least one color in each array.
   *
   * @returns a string array of the resulting pair of colors. [0] is a color from the first set and [1] is a color from the second set.
   */
  static getColorPair(colorSetOne: Array<string>, colorSetTwo: Array<string>) {
    if ( !colorSetOne || colorSetOne.length == 0 ) {
      throw new Error("Invalid colorSetOne - it must contain a least one string");
    }
    if ( !colorSetTwo || colorSetTwo.length == 0 ) {
      throw new Error("Invalid colorSetTwo - it must contain a least one string");
    }
    var colorOne = colorSetOne[0];
    var colorTwo = colorSetTwo[0];
    // CURRENTLY JUST USING THE PRIMARY COLORS AND NOT GOING TO SECONDARY COLORS
    // WHEN THEY ARE CLOSE
    // //If the first set of colors are closed
    // if ( Gradient.areColorsClose(colorOne, colorTwo) ) {
    //   // colorTwo = Color.ColorLuminance(colorTwo, Color.lightOrDark(colorTwo));
    //   if( colorSetTwo.length >= 2 && colorSetTwo[1] != ""){
    //     colorTwo = colorSetTwo[1]; //get second color of set 2 if first colors are closed to each other
    //     //check if the second color is closed with the first color of set 1
    //     if ( Gradient.areColorsClose(colorOne, colorTwo) ) {
    //       //get third color if available or get the darken/lighten color of the second color of the second set
    //       colorTwo = colorSetTwo.length > 2 ? colorSetTwo[2] : Color.ColorLuminance(colorSetTwo[1], Color.lightOrDark(colorTwo));
    //     }
    //   } else {//if there's no more than 2 colors for set 2, then check for set 1 if there's more than 1 color
    //     if( colorSetOne.length >= 2 && colorSetTwo[1] != ""){
    //       colorOne = colorSetOne[1];//get the second color of the first set
    //       if ( Gradient.areColorsClose(colorOne, colorTwo) ) {//check if the second color of the first set is close to the color of the second set, then darken the color of the second set
    //         colorOne = Color.ColorLuminance(colorSetTwo[1], Color.lightOrDark(colorOne));
    //       }
    //     } else {//else there's only one color of the first set, then darken/lighten the color of second set
    //       colorTwo = Color.ColorLuminance(colorTwo, Color.lightOrDark(colorTwo));
    //     }
    //   }
    // }
    return [colorOne, colorTwo];
  }

}
