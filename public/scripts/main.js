"use strict";

// IIFE to avoid polluting the global scope
// Could just make it an ES module, but this way works locally without a server
(function() {

  let bearSpriteLoaded = false;

  /////////////////////////////////////////////////////////////////////////
  // Constants
  /////////////////////////////////////////////////////////////////////////

  const FORM_SELECTOR = '.bear-form';
  const AVATAR_SELECTOR = '.bear-avatar';

  const BEAR_STATES = {
    'IDLE': 'idle',
    'WATCH': 'watch',
    'PEEK': 'peek',
    'HIDE': 'hide'
  };

  const ANIM = {
    'NOOP': 'animate-none',
    'WATCH_FROM_IDLE': 'ani-watch',
    'UN_WATCH_FROM_IDLE': 'ani-unwatch',
    'HIDE_FROM_IDLE': 'ani-hide',
    'UN_HIDE_FROM_IDLE': 'ani-unhide',
    'PEEK_FROM_IDLE': 'ani-ipeek',
    'UN_PEEK_FROM_IDLE': 'ani-unipeek',
    'PEEK_FROM_HIDDEN': 'ani-hpeek',
    'UN_PEEK_FROM_HIDDEN': 'ani-unhpeek',
    'UN_HIDE_FROM_IDLE_WATCH': 'ani-unhide-watch',
    'UN_PEEK_FROM_IDLE_WATCH': 'ani-unipeek-watch',
  };

  const GAZE_KEYFRAMES = [
    '-160px -460px',
    '-310px -460px',
    '-460px -460px',
    '-610px -10px',
    '-610px -160px',
    '-610px -310px',
    '-610px -460px',
    '-10px -610px',
    '-160px -610px',
    '-310px -610px',
    '-460px -610px',
    '-610px -610px',
    '-760px -10px',
    '-760px -160px',
    '-760px -310px',
    '-760px -460px',
    '-760px -610px',
    '-10px -760px'
  ];



  /////////////////////////////////////////////////////////////////////////
  // Animation functions
  /////////////////////////////////////////////////////////////////////////

  /**
   * Animate the bear sprite
   * 
   * @param {HTMLElement} formElement The form element containing the bear sprite
   * @param {string} targetState The target state of the bear sprite (idle, watch, peek, hide)
   * @param {number} targetGaze The target gaze direction (0-17) when the target state is 'watch'
   */
  const animateBear = function(formElement, targetState, targetGaze = 0) {
    if (! bearSpriteLoaded) {
      return;
    }

    const avatar = formElement.querySelector(AVATAR_SELECTOR),
          currentState = avatar.dataset.state || BEAR_STATES.IDLE,
          currentGaze = parseInt(avatar.dataset.gaze) || 0;

    // If the target state is the same as the current state, 
    // or if it's a 'watch->watch' to the same index, do nothing
    if (currentState == targetState) {
      if (targetState != BEAR_STATES.WATCH || currentGaze === targetGaze) {
        return;
      }
    }

    avatar.dataset.state = targetState;

    // State machine: Which CSS class holds the animation for this transition?
    const animationClass = getAnimationClass(currentState, targetState, currentGaze, targetGaze);

    // Remove/cancel existing animations
    Object.values(ANIM).forEach((anim) => {
      if (anim !== animationClass) {
        avatar.classList.remove(anim);
      }
    });
    avatar.getAnimations().map((animation) => animation.cancel());

    // Trigger reflow to restart the animation. Workaround, see https://css-tricks.com/restart-css-animation/
    void avatar.offsetWidth;

    avatar.classList.add(animationClass);


    // Finally, move the bear's head to the correct position if the target state is 'watch'
    if (targetState === BEAR_STATES.WATCH) {
      // Wait for current animation(s) to finish
      Promise.all(
        avatar.getAnimations().map((animation) => animation.finished),
      ).then(() => turnGaze(avatar, targetGaze));
    }
  };

  /**
   * Direct the bear's gaze towards the email input text
   * 
   * @param {HTMLElement} avatar The bear sprite element
   * @param {number} targetGaze The target gaze direction (0-17)
   */
  const turnGaze = function(avatar, targetGaze) {
    const currentGaze = parseInt(avatar.dataset.gaze) || 0,
          gazeDiff = targetGaze - currentGaze,
          animationFrames = Math.abs(gazeDiff),
          animationDuration = Math.max(1, Math.floor(animationFrames * (400/GAZE_KEYFRAMES.length)));

    // Set the new gaze direction
    avatar.dataset.gaze = targetGaze;

    // Create the animation
    let keyframes = [];
    const positionsToMap = (pos) => {
      return { backgroundPosition: pos };
    };
    if (gazeDiff > 0) {
      keyframes = GAZE_KEYFRAMES.slice(currentGaze, targetGaze + 1).map(positionsToMap);
    } else {
      keyframes = GAZE_KEYFRAMES.slice(targetGaze, currentGaze + 1).reverse().map(positionsToMap);
    }

    avatar.animate(keyframes, {
      duration: animationDuration,
      easing: 'steps(' + Math.max(1,animationFrames) + ', jump-end)',
      fill: 'forwards'
    });
  };



  /////////////////////////////////////////////////////////////////////////
  // Event handlers
  /////////////////////////////////////////////////////////////////////////

  /**
   * Handle the password visibility toggle button
   * 
   * @param {Event} event The click event
   */
  const handleVisibilityToggle = function(event) {
    const container = event.target.closest('fieldset'),
          input = container.querySelector('input'),
          bearForm = container.closest(FORM_SELECTOR);

    if (input.type === 'password') {
      input.type = 'text';
      animateBear(bearForm, BEAR_STATES.PEEK);
    } else {
      input.type = 'password';
      animateBear(bearForm, BEAR_STATES.HIDE);
    }
    return event.preventDefault();
  };

  /**
   * Handle the login form submission
   * 
   * @param {Event} event The 'Log in' button click event
   */
  const handleLogin = function(event) {
    const bearForm = event.target.closest(FORM_SELECTOR),
          emailValid = bearForm.querySelector('input[name="email"]').checkValidity(),
          passwordValid = bearForm.querySelector('input[name="password"]').checkValidity();

    if (emailValid && passwordValid) {
      alert("Voilä!");
      // For the sake of the demo, we don't actually submit the form
      return event.preventDefault();
    }
  };

  /**
   * Handle input events on the email field
   * 
   * @param {Event} event The input event
   */
  const handleEmailInputEvent = function(event) {
    const input = event.target,
          formElement = input.closest(FORM_SELECTOR),
          progress = Math.min(1, measureTextWidth(input.value) / 366),
          gaze = Math.floor(progress * (GAZE_KEYFRAMES.length-1));

    animateBear(formElement, BEAR_STATES.WATCH, gaze);
  };

  /**
   * Register event listeners
   * 
   * Event delegation lets us add components dynamically without having to
   * re-register event listeners.
   */
  const registerEventListeners = function() {
    const docElem = document.documentElement,
          addEvent = docElem.addEventListener.bind(docElem);

    // On first mouseover/hover on the bear-form element, preload the sprite
    addEvent('mouseover', (event) => {
      if (! bearSpriteLoaded && event.target.closest(FORM_SELECTOR)) {
        loadSprite();
      }
    });
    
    addEvent('click', (event) => {
      if (event.target.closest('.password-visibility')) {
        return handleVisibilityToggle(event);
      }
      else if (event.target.closest('button[type="submit"]')) {
        return handleLogin(event);
      }
    });

    // Note: We use `focusin` because `focus` doesn't bubble
    ['input', 'focusin'].forEach((eventType) => {
      addEvent(eventType, (event) => {
        const target = event.target;
        // If the email field is focused, we animate the bear watching the input
        if (target.name === 'email') {
          return handleEmailInputEvent(event);
        }

        // If the password field is focused, we animate the bear peeking
        // or covering its eyes
        if (target.name === 'password') {
          const isHidden = target.type === 'password';
          animateBear(target.closest(FORM_SELECTOR), isHidden ? BEAR_STATES.HIDE : BEAR_STATES.PEEK);
        }
      });
    });

    // Note: We use `focusout` because `blur` doesn't bubble
    addEvent('focusout', (event) => {
      const bearForm = event.target.closest(FORM_SELECTOR),
            clickedInBearFormField = event.relatedTarget && event.relatedTarget.closest(FORM_SELECTOR);
      
      // When the form is unfocused, we reset the bear to idle
      if (bearForm && !clickedInBearFormField ) {
        animateBear(bearForm, BEAR_STATES.IDLE);
      }
    });
  };



  /////////////////////////////////////////////////////////////////////////
  // Helper functions
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
    bearSpriteLoaded = true;
    document.body.removeChild(div);
  };

  /**
   * Measure the width of a text string
   * 
   * @param {string} text The text to measure
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

  /**
   * Get the animation class for the bear sprite
   * 
   * This encapsulates the bear avatar's state machine
   * 
   * @param {string} currentState Current bear state (idle, peek, hide, watch)
   * @param {string} targetState Target bear state (idle, peek, hide, watch)
   * @param {number} currentGaze Current gaze direction (0-17)
   * @param {number} targetGaze Target gaze direction (0-17)
   * 
   * @returns {string} The animation class to apply
   */
  const getAnimationClass = function(currentState, targetState, currentGaze, targetGaze) {
    return {
      'idle->peek': ANIM.PEEK_FROM_IDLE,
      'idle->hide': ANIM.HIDE_FROM_IDLE,
      'peek->hide': ANIM.UN_PEEK_FROM_HIDDEN,
      'hide->peek': ANIM.PEEK_FROM_HIDDEN,
      'idle->watch': (targetGaze==0) ? ANIM.WATCH_FROM_IDLE : ANIM.NOOP,
      'watch->idle': (currentGaze==0) ? ANIM.UN_WATCH_FROM_IDLE : ANIM.NOOP,
      'peek->watch': (targetGaze==0) ? ANIM.UN_PEEK_FROM_IDLE_WATCH : ANIM.UN_PEEK_FROM_IDLE,
      'hide->watch': (targetGaze==0) ? ANIM.UN_HIDE_FROM_IDLE_WATCH: ANIM.UN_HIDE_FROM_IDLE,
      'watch->peek': ANIM.PEEK_FROM_IDLE,
      'watch->hide': ANIM.HIDE_FROM_IDLE,
      'peek->idle': ANIM.UN_PEEK_FROM_IDLE,
      'hide->idle': ANIM.UN_HIDE_FROM_IDLE,
      'watch->watch': ANIM.NOOP
    }[`${currentState}->${targetState}`];
  }



  /////////////////////////////////////////////////////////////////////////
  // Let's go!
  /////////////////////////////////////////////////////////////////////////

  registerEventListeners();

  // Progressive enhancement
  document.documentElement.classList.remove('no-js');

})();
