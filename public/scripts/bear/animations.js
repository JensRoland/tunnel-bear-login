import { AVATAR_SELECTOR, BEAR_STATES } from '../constants.js';
import { ANIMATION_CLASSES, getAnimationClass } from './state-machine.js';

/////////////////////////////////////////////////////////////////////////
// Bear animation logic
/////////////////////////////////////////////////////////////////////////

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

// Helper: Maps background position strings to objects
const positionsToMap = (pos) => { return { backgroundPosition: pos }; };

/**
 * Clear/cancel existing bear animations
 * 
 * @param {HTMLElement} avatar The bear sprite element
 * @param {string} animationClassToKeep An optional animation class to keep
 */
const clearExistingAnimations = function(avatar, animationClassToKeep = '') {
    // Remove/cancel existing animations
    ANIMATION_CLASSES.forEach((anim) => {
      if (anim !== animationClassToKeep) {
        avatar.classList.remove(anim);
      }
    });
    avatar.getAnimations().map((animation) => animation.cancel());
};

/**
 * Animate the bear sprite from one state to another
 * using a CSS class. Clear any existing animations first.
 * 
 * @param {HTMLElement} avatar The bear sprite element
 * @param {string} animationClass The animation class to apply
 */
const animateStateTransitionWithCSS = function(avatar, animationClass) {
  // Workaround: Trigger reflow to restart the animation.
  // See https://css-tricks.com/restart-css-animation/
  void avatar.offsetWidth;

  avatar.classList.add(animationClass);
}

/**
 * Animate the bear sprite
 * 
 * @param {HTMLElement} formElement The form element containing the bear sprite
 * @param {string} targetState The target state of the bear sprite (idle, watch, peek, hide)
 * @param {number} progress The typing progress (0.0-1.0) when the target state is 'watch'
 */
const animateBear = function(formElement, targetState, progress = 0) {
  if (! window.bearSpriteLoaded) return;

  const avatar = formElement.querySelector(AVATAR_SELECTOR),
        currentState = avatar.dataset.state || BEAR_STATES.IDLE,
        currentGaze = parseInt(avatar.dataset.gaze) || 0,
        targetGaze = Math.floor(progress * (GAZE_KEYFRAMES.length-1));

  // If the target state is the same as the current state, 
  // or if it's a 'watch->watch' to the same gaze direction, do nothing
  if (currentState == targetState) {
    if (targetState != BEAR_STATES.WATCH || currentGaze === targetGaze) {
      return;
    }
  }

  avatar.dataset.state = targetState;

  // Clear all running/old animations and add the animation class
  // corresponding to this particular state transition
  const animationClassForTransition = getAnimationClass(currentState, targetState, currentGaze, targetGaze);
  clearExistingAnimations(avatar, animationClassForTransition);
  animateStateTransitionWithCSS(avatar, animationClassForTransition);


  // If the target state is 'watch', we also animate the bear's head/gaze to the correct position
  if (targetState === BEAR_STATES.WATCH) {
    // Wait for current animation(s) to finish
    Promise.all(
      avatar.getAnimations().map((animation) => animation.finished),
    ).then(() => turnGaze(avatar, targetGaze));
  }
};

/**
 * Get the keyframes for the bear's gaze animation over a
 * particular range of head movement
 * 
 * @param {number} fromGaze The current gaze direction (0-17)
 * @param {number} toGaze The target gaze direction (0-17)
 * 
 * @returns {Object[]} An array of keyframes for the animation
 */
const getKeyframes = function(fromGaze, toGaze) {
  if (toGaze - fromGaze > 0) {
    // Moving right
    return GAZE_KEYFRAMES.slice(fromGaze, toGaze + 1).map(positionsToMap);
  } 
  // Moving left
  return GAZE_KEYFRAMES.slice(toGaze, fromGaze + 1).map(positionsToMap).reverse();
};

/**
 * Direct the bear's gaze towards the email input text
 * 
 * @param {HTMLElement} avatar The bear sprite element
 * @param {number} targetGaze The target gaze direction (0-17)
 */
const turnGaze = function(avatar, targetGaze) {
  const currentGaze = parseInt(avatar.dataset.gaze) || 0,
        animationFrames = Math.abs(targetGaze - currentGaze),
        animationDuration = Math.max(1, Math.floor(animationFrames * (400/GAZE_KEYFRAMES.length)));

  // Set the new gaze direction
  avatar.dataset.gaze = targetGaze;

  // Create the animation
  const keyframes = getKeyframes(currentGaze, targetGaze);
  avatar.animate(keyframes, {
    duration: animationDuration,
    easing: 'steps(' + Math.max(1,animationFrames) + ', jump-end)',
    fill: 'forwards'
  });
};

export { animateBear };
