# jQuery Smooth Touch Scroll
by Thomas Kahn 

### A lightweight touch version of Smooth Div Scroll

You may have used Smooth Div Scroll to present smooth scrolling content on your webpage. If Smooth Div Scroll is the Swiss Army Knife of smooth scrolling, Smooth Touch Scroll is the lightweight cousin, slimmed down and geared towards touch scrolling. Smooth Touch Scroll will still work on desktop computers that don't have touch (using drag scrolling) but it's primarily intended for touch devices.

## Demo
I'm currently working on building a demo and documentation page for Smooth Touch Scroll. I apologise it it's not that elaborate yet, but I hope it's enough to get you started together with the documentation here on GitHub.

[Visit the demo page (smoothtouchscroll.com)](http://smoothtouchscroll.com)

## Usage

1. Include jQuery:

	```html
	<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
	```
2. Include jQuery UI containing only the widget functionality:

	```html
	<script src="js/jquery-ui-1.10.3.custom.min.js"></script>
	```
If you need more from jQuery UI than just the widget functionality you can use [the dowload builder at jqueryui.com](http://jqueryui.com/download/). Otherwise the only part from jQuery UI that is required by Smooth Touch Scroll is the Widget functionality. It's included in the download.

2. Include the minified version of jQuery Kinetic:

	```html
	<script src="js/jquery.kinetic.min.js"></script>
	```
Kinetic is included in the download. If you want to know more, you'll find [all the information here](http://davetayls.me/jquery.kinetic/).

3. Include the minified version Smooth Touch Scroll:

	```html
	<script src="js/jquery.smoothTouchScroll.min.js"></script>
	```

3. Call the plugin:

	```javascript
	$("#element").smoothTouchScroll();
	```

## Options
This is an early version of the plugin with just the bare-bones functionality. Therefore the number of options are limited to begin with.

```javascript
// Default options
options: {
	scrollableAreaClass: "scrollableArea", // String
	scrollWrapperClass: "scrollWrapper", // String
	continuousScrolling: false, // Boolean
	startAtElementId: "", // String
},

```

### scrollableAreaClass (string)
If you have added a __scrollable area__ element of your own with a custom class, you can tell the plugin the name of this class here. Normally Smooth Touch Scroll takes care of this automatically, so in most cases you won't be using this option. But if you should need it, it's there.

### scrollWrapperClass (string)
If you have added a __scroll wrapper__ element of your own with a custom class, you can tell the plugin the name of this class here. Normally Smooth Touch Scroll takes care of this automatically, so in most cases you won't be using this option. But if you should need it, it's there.

### continuousScrolling (boolean)
Set this option to true if you want endless scrolling in both directions. Smooth Touch Scroll will swap around the elements inside the scroller to give the illusion of endless/continuous scrolling.

### startAtElementId (string)
If you want the scroller to start at a certain element, you provide the CSS id of this element as a string. The scroller will then start with this element at the leftmost edge of the scroller, provided there are enough elements in the scroller to scroll that far.

## Public methods
There are not that many methods yet, but these are the ones you can use for now.

### recalculateScrollableArea
This method goes through all the elements in the scroller and calculates their combined width. Then it sets the width of the scrollable area to this number. Use it if you add or remove elements in the scroller after it has been initialized. 

You can also use the init-method of the plugin by calling the plugin without arguments. Right now the only thing that happens inside the init-method is that recalculateScrollableArea is invoked.

```javascript
$("#element").smoothTouchScroll("recalculateScrollableArea");
```
or use the init-method:
```javascript
$("#element").smoothTouchScroll();
```

### restoreOriginalElements
When Smooth Touch Scroll is first created it stores a copy of the original elements inside the scroller. When you call this method these elements are restored and replace all the current elements in the scroller.

```javascript
$("#element").smoothTouchScroll("restoreOriginalElements");
```
### show
Shows the scroller.

```javascript
$("#element").smoothTouchScroll("show");
```

### hide
Hides the scroller.

```javascript
$("#element").smoothTouchScroll("hide");
```

### enable
Enables the scroller. The scroller is enabled per default, so calling this method is only useful if you have previously disabled it.

```javascript
$("#element").smoothTouchScroll("enable");
```

### disable
Disables the scroller. The result is basically a frozen scroller that you can't interact with.

```javascript
$("#element").smoothTouchScroll("disable");
```
### destroy
Destroys the instantiated plugin and restores the element to its original state.
```javascript
$("#element").smoothTouchScroll("destroy");
```

## Current development status
__This is version 1.0 of the plugin.__ Eventhough it's based on [Smooth Div Scroll](http://smoothdivscroll.com/), which has been around for many years and is continuously updated, Smooth Touch Scroll is a new plugin. Therefore I ask that you test it before you use it in any production environment. Please report any issues here on GitHub.

## License
[GNU General Public License](http://www.gnu.org/licenses/gpl-3.0.html) as published by the Free Software Foundation, either version 3 of the License, or any later version.

This plugin is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
