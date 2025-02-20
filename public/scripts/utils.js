import { AVATAR_SELECTOR } from './constants.js';

/////////////////////////////////////////////////////////////////////////
// Utility functions
/////////////////////////////////////////////////////////////////////////

/**
 * Load the bear sprite into browser cache
 */
const loadSprite = function() {
  const fragment = document.createDocumentFragment(),
        div = document.createElement('div');
  div.style.backgroundImage = 'url(img/bear_sprite.webp)';
  div.style.width = '1px';
  div.style.height = '1px';
  div.style.position = 'absolute';
  div.style.top = '-1px';
  div.style.left = '-1px';
  fragment.appendChild(div);

  // Append the fragment to the body to trigger the browser to load the image
  document.body.appendChild(fragment);
  
  document.querySelectorAll(AVATAR_SELECTOR).forEach((element) => {
    element.classList.add('sprite');
  });
  window.bearSpriteLoaded = true;
  document.body.removeChild(div);
};

/**
 * Measure the width of a text string using Canvas measureText()
 * 
 * @param {string} text The text to measure
 * 
 * @returns {number} The width of the text in pixels
 */
let measuringContext = null; // Cache this for an extra iota of performance
const measureTextWidth = function(text, font = "16px system-ui") {
  if (! measuringContext) {
    const canvas = document.createElement('canvas');
    measuringContext = canvas.getContext('2d');
  }
  measuringContext.font = font;
  return measuringContext.measureText(text).width;
};

export { loadSprite, measureTextWidth };
