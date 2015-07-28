// ==UserScript==
// @name         Udacity Full Page Course Viewer
// @namespace    https://github.com/eosrei/userscript-udacity-course-viewer
// @version      0.6
// @description  Makes full page text content in the Udacity Course Viewer instead of the original 435px tall scrolling div. Moves Downloadables to main sidebar, applies HighlightJS to example code.
// @oujs:author  eosrei
// @author       eosrei
// @copyright    2015+, eosrei (http://eosrei.net)
// @license      MIT
// @match        https://www.udacity.com/course/viewer*
// @homepage     https://github.com/eosrei/userscript-udacity-course-viewer
// @grant        GM_addStyle
// ==/UserScript==

// Remove the text content viewport scrollbars to make the text content fill the page.
GM_addStyle(".scale-media>div.reading-area { position: relative; margin-bottom: -56.25%;}");

// Disable word wrap for example code blocks and reduce fontsize to increase code visibility.
GM_addStyle("pre { word-wrap: normal; font-size: 11px; }");

// Make column generally used for Instructor Notes fill the available width because Downloadables is moving.
GM_addStyle(".col-xs-8 { width: 100%;}");
// Make Downloadables title match Get Help formatting.
GM_addStyle("div.guided-tour-exhibit-downloadables-introduction h2 {color: #303030; font-size: 18px;}");

// Code that needs to run in the Content Scope
function contentScope() {
  // Due to script execution order, we need to be sure everything is ready.
  angular.element(document).ready(function () {
    // Add HighlightJS CSS/JS for code syntax highlighting.
    // Change to whatever highlight style CSS you want: https://github.com/isagalaev/highlight.js/tree/master/src/styles
    $("<link/>", {
      rel: "stylesheet",
      type: "text/css",
      href: "//cdnjs.cloudflare.com/ajax/libs/highlight.js/8.6/styles/github-gist.min.css"
    }).appendTo("head");
    $.getScript('//cdnjs.cloudflare.com/ajax/libs/highlight.js/8.6/highlight.min.js');

    // AngularJS to hijack the viewer's loadingComplete so we can run some code whenever the content is changed.
    var viewerControllerElement = document.querySelector('div.viewer-player');
    var viewerControllerScope = angular.element(viewerControllerElement).scope();
    // Make a copy of the original loadingComplete.
    viewerControllerScope.oldLoadingComplete = viewerControllerScope.loadingComplete;
    // Create a new loadingComplete
    viewerControllerScope.loadingComplete = function(c) {
      // Run the original code.
      viewerControllerScope.oldLoadingComplete(c);
      //console.log("LoadingComplete");

      // @todo: loadingComplete() is called often while playing videos. Which means this
      // setTimeout() function is called many times for every morsel on video pages.
      // We need it called only once per morsel. Research and locate an Angular Directive
      // or Controller to extend and correctly provide this functionality.
      setTimeout(function(){
        // Move Downloadables to the main sidebar under the Get Help section.
        var downloadables = $('div[data-supplemental-materials-list]');
        if (!downloadables.data("once")) {
          downloadables.data("once", true);
          downloadables.insertAfter('div[data-viewer-feedback]');
          //console.log("Moved Downloads");
        };

        // Apply HighlightJS to all example code once.
        $('div.viewer-player pre').each(function(i, block) {
          if (!$(block).data("once")) {
            $(block).data("once", true);
            hljs.highlightBlock(block);
            //console.log("Code block found");
          };
        });
      }, 100);
    };
  });
};

// Content Script Injection (required for FF)
// @src: http://wiki.greasespot.net/Content_Script_Injection
function contentEval(source) {
  // Check for function input.
  if ('function' == typeof source) {
    // Execute this function with no arguments, by adding parentheses.
    // One set around the function, required for valid syntax, and a
    // second empty set calls the surrounded function.
    source = '(' + source + ')();'
  }

  // Create a script node holding this  source code.
  var script = document.createElement('script');
  script.setAttribute("type", "application/javascript");
  script.textContent = source;

  // Insert the script node into the page, so it will run, and immediately
  // remove it to clean up.
  document.body.appendChild(script);
  document.body.removeChild(script);
};

// Inject contentScope()
contentEval(contentScope);
