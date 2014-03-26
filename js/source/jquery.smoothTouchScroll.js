/*
 * jQuery SmoothTouchScroll
 *
 * Copyright (c) 2013 Thomas Kahn
 * Licensed under the GPL license.
 *
 * http://www.smoothtouchscroll.com/
 *
 * Depends:
 * jquery-1.10.2.min.js
   Please use https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js
   ...or later

 * jquery.kinetic.min.js
   Used for scrolling on touch devices.
   Download the latest version at https://github.com/davetayls/jquery.kinetic
 *
 */

;(function ( $, window, document, undefined ) {

    $.widget( "thomaskahn.smoothTouchScroll" , {

        // Default options
        options: {
			scrollableAreaClass: "scrollableArea", // String
			scrollWrapperClass: "scrollWrapper", // String
			continuousScrolling: false, // Boolean
			startAtElementId: "", // String
        },

        // Setup widget
        _create: function () {
			var self = this, o = this.options, el = this.element;
			
			// Create variables for any existing or not existing 
			// scroller elements on the page.
			el.data("scrollWrapper", el.find("." + o.scrollWrapperClass));
			el.data("scrollableArea", el.find("." + o.scrollableAreaClass));
			
			// Check what the DOM looks like
	
			// Both the scrollable area and the wrapper are missing
			if (el.data("scrollableArea").length === 0 && el.data("scrollWrapper").length === 0) {
				el.wrapInner("<div class='" + o.scrollableAreaClass + "'>").wrapInner("<div class='" + o.scrollWrapperClass + "'>");

				el.data("scrollWrapper", el.find("." + o.scrollWrapperClass));
				el.data("scrollableArea", el.find("." + o.scrollableAreaClass));
			}
			
			// Only the wrapper is missing
			else if (el.data("scrollWrapper").length === 0) {
				el.wrapInner("<div class='" + o.scrollWrapperClass + "'>");
				el.data("scrollWrapper", el.find("." + o.scrollWrapperClass));
			}
			
			// Only the scrollable area is missing
			else if (el.data("scrollableArea").length === 0) {
				el.data("scrollWrapper").wrapInner("<div class='" + o.scrollableAreaClass + "'>");
				el.data("scrollableArea", el.find("." + o.scrollableAreaClass));
			}
			
			// Create variables in the element data storage.
			el.data("scrollXPos", 0);
			el.data("scrollableAreaWidth", 0);
			el.data("startingPosition", 0);
			el.data("rightScrollingInterval", null);
			el.data("leftScrollingInterval", null);
			el.data("previousScrollLeft", 0);
			el.data("getNextElementWidth", true);
			el.data("swapAt", null);
			el.data("startAtElementHasNotPassed", true);
			el.data("swappedElement", null);
			el.data("originalElements", el.data("scrollableArea").children());
			el.data("visible", true);
			el.data("enabled", true);
			el.data("scrollableAreaHeight", el.data("scrollableArea").height());
			
			/*****************************************
			SET UP EVENTS FOR TOUCH SCROLLING
			*****************************************/
			if (el.data("enabled")) {
				// Use jquery.kinetic.js for touch scrolling
				// All the parameters for jquery.kinetic can be
				// altered here. 
				// TO-DO: expose the relevant parameters as parameters
				// of Smooth Touch Scroll.
				el.data("scrollWrapper").kinetic({
					cursor: 'move',
					decelerate: true,
					triggerHardware: false,
					y: false,
					x: true,
					axisTolerance: 7,
					slowdown: 0.9,
					maxvelocity: 120,
					throttleFPS: 60,
					moved: function (settings) {
						if (o.continuousScrolling) {
							if (el.data("scrollWrapper").scrollLeft() <= 0) {
								self._checkContinuousSwapLeft();
							} else {
								self._checkContinuousSwapRight();
							}
						}
						
						// Callback
						self._trigger("touchMoved");
					},
					stopped: function (settings) {
						// Callback
						self._trigger("touchStopped");
					}
				});
			}
			
			/*****************************************
			SET UP EVENT FOR RESIZING THE BROWSER WINDOW
			*****************************************/
			$(window).bind("resize", function () {
				self._trigger("windowResized");
			});
			
        },
		/**********************************************************
		_init 
		**********************************************************/
		// This code is run every time the widget is called without arguments.
		// Use it when you add elements to the scroller without reloading the page.
		 _init: function () {
			var self = this, el = this.element;
		 
			// Recalculate the total width of the elements inside the scrollable area
			self.recalculateScrollableArea();
		
			// Trigger callback
			self._trigger("initializationComplete");
		},
		/**********************************************************
		Recalculate the scrollable area
		**********************************************************/
		recalculateScrollableArea: function () {

			var tempScrollableAreaWidth = 0, foundStartAtElement = false, o = this.options, el = this.element, children = el.data("scrollableArea").children();

			// Add up the total width of all the items inside the scrollable area
			if (children.length) {
				el.data("scrollableArea").children().each(function () {
					// Check to see if the current element in the loop is the one where the scrolling should start
					if ((o.startAtElementId.length > 0) && (($(this).attr("id")) === o.startAtElementId)) {
						el.data("startingPosition", tempScrollableAreaWidth);
						foundStartAtElement = true;
					}
					tempScrollableAreaWidth = tempScrollableAreaWidth + $(this).outerWidth(true);
				});
			} else {
				// Doesn't have children, so calculate width of scollableAread
				tempScrollableAreaWidth += el.data("scrollableArea").outerWidth(true);
			}

			// If the element with the ID specified by startAtElementId
			// is not found, reset it
			if (!(foundStartAtElement)) {
				el.data("startAtElementId", "");
			}

			// Set the width of the scrollable area
			el.data("scrollableAreaWidth", tempScrollableAreaWidth);
			el.data("scrollableArea").width(el.data("scrollableAreaWidth"));

			// Move to the starting position
			el.data("scrollWrapper").scrollLeft(el.data("startingPosition"));
			el.data("scrollXPos", el.data("startingPosition"));
		},
		/**********************************************************
		Check Continuos Swap Right
		**********************************************************/
		_checkContinuousSwapRight: function () {
			var el = this.element, o = this.options;

			// Get the width of the first element. When it has scrolled out of view,
			// the element swapping should be executed. A true/false variable is used
			// as a flag variable so the swapAt value doesn't have to be recalculated
			// in each loop.  
			if (el.data("getNextElementWidth")) {

				if ((o.startAtElementId.length > 0) && (el.data("startAtElementHasNotPassed"))) {
					// If the user has set a certain element to start at, set swapAt 
					// to that element width. This happens once.
					el.data("swapAt", $("#" + o.startAtElementId).outerWidth(true));
					el.data("startAtElementHasNotPassed", false);
				}
				else {
					// Set swapAt to the first element in the scroller
					el.data("swapAt", el.data("scrollableArea").children(":first").outerWidth(true));
				}
				el.data("getNextElementWidth", false);
			}


			// Check to see if the swap should be done
			if (el.data("swapAt") <= el.data("scrollWrapper").scrollLeft()) {
				el.data("swappedElement", el.data("scrollableArea").children(":first").detach());
				el.data("scrollableArea").append(el.data("swappedElement"));
				var wrapperLeft = el.data("scrollWrapper").scrollLeft();
				el.data("scrollWrapper").scrollLeft(wrapperLeft - el.data("swappedElement").outerWidth(true));
				el.data("getNextElementWidth", true);
			}
		},
		/**********************************************************
		Check Continuos Swap Left
		**********************************************************/
		_checkContinuousSwapLeft: function () {
			var el = this.element, o = this.options;

			// Get the width of the first element. When it has scrolled out of view,
			// the element swapping should be executed. A true/false variable is used
			// as a flag variable so the swapAt value doesn't have to be recalculated
			// in each loop.

			if (el.data("getNextElementWidth")) {
				if ((o.startAtElementId.length > 0) && (el.data("startAtElementHasNotPassed"))) {
					el.data("swapAt", $("#" + o.startAtElementId).outerWidth(true));
					el.data("startAtElementHasNotPassed", false);
				}
				else {
					el.data("swapAt", el.data("scrollableArea").children(":first").outerWidth(true));
				}

				el.data("getNextElementWidth", false);
			}

			// Check to see if the swap should be done
			if (el.data("scrollWrapper").scrollLeft() === 0) {
       
				el.data("swappedElement", el.data("scrollableArea").children(":last").detach());
				el.data("scrollableArea").prepend(el.data("swappedElement"));
				el.data("scrollWrapper").scrollLeft(el.data("scrollWrapper").scrollLeft() + el.data("swappedElement").outerWidth(true));
				el.data("getNextElementWidth", true);
        
			}

		},
		/**********************************************************
		Restore the original elements in the scroller
		**********************************************************/
		restoreOriginalElements: function () {
			var self = this, el = this.element;

			// Restore the original content of the scrollable area
			el.data("scrollableArea").html(el.data("originalElements"));
			self.recalculateScrollableArea();
			self.jumpToElement("first");
		},
		/**********************************************************
		Show the scroller
		**********************************************************/
		show: function () {
			var el = this.element;
			el.data("visible", true);
			el.show();
		},
		/**********************************************************
		Hide the scroller
		**********************************************************/
		hide: function () {
			var el = this.element;
			el.data("visible", false);
			el.hide();
		},
		/**********************************************************
		Enable the scroller
		**********************************************************/
		enable: function () {
			var el = this.element;

			el.data("scrollWrapper").kinetic('attach');
			
			// Set enabled to true
			el.data("enabled", true);
		},
		/**********************************************************
		Disable the scroller
		**********************************************************/
		disable: function () {
			var self = this, el = this.element;

			el.data("scrollWrapper").kinetic('detach');

			// Set enabled to false
			el.data("enabled", false);
		},
		
        // Destroy an instantiated plugin and clean up
        // modifications the widget has made to the DOM
        destroy: function () {
			var self = this, el = this.element;
			
			// Remove elements created by the scroller
			el.data("scrollableArea").remove();
			el.data("scrollWrapper").remove();

			// Restore the original content of the scrollable area
			el.html(el.data("originalElements"));

            // For UI 1.8, destroy must be invoked from the
            // base widget
            $.Widget.prototype.destroy.call(this);
            // For UI 1.9, define _destroy instead and don't
            // worry about
            // calling the base widget
        }
    });

})( jQuery, window, document );
