import { FORM_SELECTOR, BEAR_STATES } from '../constants.js';
import { loadSprite, measureTextWidth } from '../utils.js';
import { animateBear } from './animations.js';

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
        progress = Math.min(1, measureTextWidth(input.value) / 366);

  animateBear(formElement, BEAR_STATES.WATCH, progress);
};

/**
 * Register event listeners
 * 
 * Event delegation lets us add components dynamically without having to
 * re-register event listeners.
 */
const registerEventListeners = function() {
  const addEvent = document.documentElement.addEventListener.bind(document.documentElement);

  // On first mouseover/hover on the bear-form element, preload the sprite
  addEvent('mouseover', (event) => {
    if (! window.bearSpriteLoaded && event.target.closest(FORM_SELECTOR)) {
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

export { registerEventListeners };
