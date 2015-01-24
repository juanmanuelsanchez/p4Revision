
/** I've applied here the firts recommended pattern to optimize the webpage:
 *  A) Mimimize bytes (minimize, compress, cache):
 *  I've minified and compressed HTML, CSS and JS files using Grunt and Nodejs as a part 
 *  of automated development workflow with these devDependencies: closure-compiler, htmlmin, and cssmin. 
 *  I've used also Adobe Fireworks for a medium-size compression of the images.
 */
// Measuring the Critical Rendering Path with Navigation Timing
// https://developers.google.com/web/fundamentals/performance/critical-rendering-path/measure-crp

function logCRP() {
  var t = window.performance.timing,
    dcl = t.domContentLoadedEventStart - t.domLoading,
    complete = t.domComplete - t.domLoading;
  var stats = document.getElementById("crp-stats");
  stats.textContent = 'DCL: ' + dcl + 'ms, onload: ' + complete + 'ms';
}

window.addEventListener("load", function(event) {
  logCRP();
});
