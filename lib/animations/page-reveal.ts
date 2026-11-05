/**
 * A tiny signal for "the page is now visible": fired when the preloader lifts
 * on first load, and when the transition curtain lifts after a navigation.
 * Intro animations (hero titles, first-screen reveals) wait for it so they
 * never play hidden behind an overlay.
 */
type Listener = () => void;

let visible = false;
const listeners = new Set<Listener>();

export const pageReveal = {
  hide() {
    visible = false;
  },
  show() {
    visible = true;
    const pending = [...listeners];
    listeners.clear();
    pending.forEach((fn) => fn());
  },
  /** Run `fn` once the page is visible (immediately if it already is). Returns a cancel function. */
  when(fn: Listener): () => void {
    if (visible) {
      fn();
      return () => {};
    }
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
};
