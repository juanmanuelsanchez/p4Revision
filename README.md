
###IMPORTANT: THIS IS A PRODUCTION VERSION. FOR THIS REASON ALL THE OPTIMIZATIONS ARE EXPLAINED HERE, DOWN BELOW.FOR AN INLINE EXPLANATION OF THE OPTIMIZATION PROCESS ADDRESS TO MASTER BRANCH.###

  *Website Performance Optimization portfolio project*

1) DEFINITION OF THE PROJECT:

Your challenge, if you wish to accept it (and we sure hope you will), is to optimize this online portfolio for speed! In particular, optimize the critical rendering path and make this page render as quickly as possible by applying the techniques you've picked up in the [Critical Rendering Path course](https://www.udacity.com/course/ud884).

/***************************************************************************************************/

2) REWIEW AND OPTIMIZATION PROCESS:

These are the list of Web sites, books, forums, blog posts, github repositories etc, that I referred to or used in this submission:

- “Web performance optimization” course, Udacity, and course materials.
- Piazza forum and discussions.
- Den Odell’s _Pro JavaScript Development_ book, page 103, as docummented here below, and chapters 3
  4 and 15.
-  Billy Lamberta and Keith Peters: _Foundation HTML5 Animation with JavaScript_, page 20. 
- [Grunt](https://www.gruntjs.com/) for Grunt task runner.
- [npm](https://www.npmjs.com/) for Grunt workflow.
- [html5rocks](https://www.html5rocks.com/en/tutorial/speed/scrolling/) for Debouncing scroll events
- [html5rocks](https://www.html5rocks.com/en/tutorial/speed/scrolling/high-performance-animations/)
  for CSS transform and translate.

 I've applied the three recommended patterns:

 /#/
   A) Mimimize bytes (minimize, compress, cache):

 I've minified and compressed HTML, CSS and JS files using Grunt and Nodejs as a part of automated development workflow with these devDependencies: closure-compiler, htmlmin, and cssmin. I've used
 also Adobe Fireworks for a medium-size compression.
 I don't have access to the .htaccess file on the server so I haven't been able to implement "Expires" and "Cache-Control: max-age" headers as recommended on Pagespeed Insights.


 /##/
   B) Reduce critical resources (minimize use of render blocking resources):

 b.1) I've deleted <link href="//fonts.googleapis.com/css?family=Open+Sans:400,700" rel="stylesheet">
  which caused unnecessary render blocking as recommended by Pagespeed Insigths site and suggested
  by Cameron Pittman in his comments to the "index.html", "project-2048.html", "project-mobile.html", "project-webperf.html".

 b.2) I've used media queries on <link> to unblock rendering in print.min.css:'media="print"'.

 b.3) Inlined css: 
   b.3.1) I've inlined "style.css" in "index.html", "project-2048.html", "project-mobile.html", "project-webperf.html" and "pizza.html".
   b.3.2) The same optimization is done with "boostrap-grid.css" in "pizza.html".

 b.4) I've done some small changes in views/js/main.min.js to optimize the logical side of how the page is rendered at "updatePosition" and "resizePizzas" functions, following the recommendations of Den Odell: Pro JavaScript Development, page 103, for handling "Rapid-Fire Events With Framing", and Paul Lewis at www.html5rocks.com/en/tutorial/speed/scrolling/. The pursued target was to adjust the code in order to make the scroll event handler to store the scroll position in a variable and then you perform your visual updates in a requestAnimationFrame, making use ofthe last known value. This means that the browser can schedule the visual updates at the correct time, and we are not doing more work that it's absolutely necessary inside of each frame. I've also moved all the variable declarations outside the for loop and minimize the access to Page Elements
 by simply storing their references in a variable and refering to that variable throughout the code. This is how I've implemented these concepts in the code:

 /** Lines 502 to 522 of the original code:
   */

 /** This function has a new index 1 and, as shown below, is going to be executed in
   * requestAnimationFrame. To minimize the access to Page Elements
   * their references are stored in a variable which is used throughout the code.
   */

  function updatePositions1() {
  frame++;
  var phase;
  var i=0;
  
  window.performance.mark("mark_start_frame");
  var items = document.querySelectorAll('.mover');
  var length= items.length;
  for (; i < length; i++) {
  phase = Math.sin((scrollTopPosition / 1250) + (i % 5));
  items[i].style.transform = 'translateX(' + (100 * phase) + 'px)'; 
  }

  window.performance.mark("mark_end_frame");
  window.performance.measure("measure_frame_duration", "mark_start_frame", "mark_end_frame");
  if (frame % 10 === 0) {
    var timesToUpdatePosition = window.performance.getEntriesByName("measure_frame_duration");
    logAverageFrame(timesToUpdatePosition);
   }
 }

/** Connects the event with the handler function updatePosition2
  */
    window.addEventListener('scroll', updatePositions2);

/** Creates an event handler function that does nothing but to store the current scroll position and
  * perform an average measure between the last 10 frames
  */

    function updatePositions2() {

 scrollTopPosition= body.scrollTop;
 scrollLeftPosition= body.scrollLeft;
   
  frame++;

  window.performance.mark("mark_start_frame");
  window.performance.mark("mark_end_frame");
  window.performance.measure("measure_frame_duration", "mark_start_frame", "mark_end_frame");
  if (frame % 10 === 0) {
   var timesToUpdatePosition = window.performance.getEntriesByName("measure_frame_duration");
    logAverageFrame(timesToUpdatePosition);


   }
 }

/** Execute the updatePositions1 function, which caused the performance problems, inside of 
  * requestAnimationFrame rather than every time the scroll event fires, improving application 
  * performance
  */

 //Debouncing scroll events with requestAnimationFrame:
(function drawFrame () { 
window.requestAnimationFrame(drawFrame);

updatePositions1();
resizePizzas();



 }());

 
 b.5) Instead of animate the position of moving pizzas by setting "left" property, I'm using a "translate" on the element because it doesn't trigger layout. I've added in this way:

 function updatePositions1() {
  frame++;
  var phase;
  var i=0;
  
  window.performance.mark("mark_start_frame");
  var items = document.querySelectorAll('.mover');
  var length= items.length;
  for (; i < length; i++) {
  phase = Math.sin((scrollTopPosition / 1250) + (i % 5));
  /*items[i].style.left = items[i].basicLeft + 100 * phase + 'px';*/
  items[i].style.transform = 'translateX(' + (100 * phase) + 'px)'; 
  }

 And I've added this line to the anonimous function of the bottom of main.min.js:

    /*elem.basicLeft = (i % cols) * s;*/
    elem.style.left= (i % cols) * s + 'px';

/###/
  C) Shorten CRP length:

  I've used async atrribute on the following JS files, which have dependencies with "index.html", "project-2048.html", "project-mobile.html", "project-webperf.html":

 <script async src="//www.google-analytics.com/analytics.js"></script>
 <script async src="js/perfmatters.js"></script>

/***************************************************************************************************/

 3) REWIEW AND OPTIMIZATION PROCESS RESULTS:

 All the files have passed the Pagespeed Insights site recommendations with a "speed" score of 90/100 or higher, and 100/100 score on "user experience" both on mobile and on desktop. And the pizza.html has a 60 FPS when scrolling the page.







