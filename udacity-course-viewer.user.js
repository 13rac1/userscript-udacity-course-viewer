// ==UserScript==
// @name         Udacity Full Page Course Viewer
// @version      0.1
// @description  Udacity course content viewer displays text content in a 435px tall viewport div. This removes the viewport and displays the content at full height.
// @oujs:author  eosrei
// @match        https://www.udacity.com/course/viewer
// @grant        GM_addStyle
// ==/UserScript==

GM_addStyle(".scale-media>div { position: relative;}");

