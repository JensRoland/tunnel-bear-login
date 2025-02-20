/////////////////////////////////////////////////////////////////////////
// State machine for bear sprite animations
/////////////////////////////////////////////////////////////////////////

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
const ANIMATION_CLASSES = Object.values(ANIM);

/**
 * Get the animation class for the bear sprite transition between states
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
};

export { ANIMATION_CLASSES, getAnimationClass };
