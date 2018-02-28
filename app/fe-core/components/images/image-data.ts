export interface ImageData {
  /**
   *  An array of URL route values to pass to the
   *  RouterLink method.
   *
   *  The image will include an <a> that will link
   *  to the given route.
   *
   *  If this is not included, no hover overlay will be displayed
   */
  urlRouteArray?: Array<any>;

  /**
   *  The URL location to the image to display.
   *  NOTE: It cannot be null or undefined for the mainImage object in CircleImageData, otherwise errors occur.
   *
   *  If this is not included, the [text] field will be displayed
   *  instead.
   */
  imageUrl?: any;

  url?: any;
  /**
   * The list of classes to use to style the image. If it's a main image, then
   * the style typically just specifies the border style. If it's a sub element,
   * then the style specifies the size, border style, and location.
   */
  imageClass: string;
  /**
   * The URL location of the image to display if the
   * imageUrl could not be found.
   *
   * If this is not included, then placeholder image will default
   * to '/app/public/placeholder-location.png'
   */

  placeholderImageUrl?: string;

  /**
   * The text to display as part of the hover overlay. HTML elements
   * can be included.
   *
   * If <p> tags are included, the last tag will be sized as 32px (see LESS file).
   *
   * Icons can be included through an <i class="fa..." /> tag
   */
  hoverText?: string;

  /**
   * The text to display if there is no image URL specified. This is mainly
   * used for specifying the rank.
   */
  text?: string;

  imageDesc?: string;

}

export interface CircleImageData {
 /**
  * The main image in the center of the component.
  * Required.
  */
 mainImage: ImageData;

 /**
  * The sub images to display in one of the corners.
  * The user is expected to specify a location, and only one
  * element per location. Listing no location or multiple
  * elements for one location is undefined behavior.
  *
  * Possible locations:
 *    .image-round-upper-left
 *    .image-round-upper-right
 *    .image-round-lower-left
 *    .image-round-lower-right
  */
 subImages?: Array<ImageData>;

 /**
  * The style to use for the entire component. It should
  * specify the width/height of the component.
  */
 imageClass: string;
}

export interface RectangleImageData{
  imageUrl: any;
  imageClass?: string;
  urlRouteArray?: any;
  extUrl?: boolean;
  imageDesc?: string;
  /*hoverText?: string;*/
}
