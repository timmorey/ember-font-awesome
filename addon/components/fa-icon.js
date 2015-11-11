import Ember from 'ember';
import tryMatch from 'ember-cli-font-awesome/utils/try-match';

const { computed } = Ember;

const FaIconComponent = Ember.Component.extend({
  tagName: 'i',

  classNames: ['fa'],

  classNameBindings: [
    'iconCssClass',
    'flipCssClass',
    'rotateCssClass',
    'sizeCssClass',
    'pullCssClass',
    'stackCssClass',
    'spin:fa-spin',
    'fixedWidth:fa-fw',
    'listItem:fa-li',
    'border:fa-border',
    'pulse:fa-pulse',
    'inverse:fa-inverse'
  ],

  attributeBindings: [
    'ariaHiddenAttribute:aria-hidden',
    'title'
  ],

  iconCssClass: computed('icon', 'params.[]', function() {
    const params = this.get('params');
    const icon = this.get('icon') || (params && params.length && params[0]);
    if (icon) {
      return tryMatch(icon, /^fa-/) ? icon : `fa-${icon}`;
    }
  }),

  flipCssClass: computed('flip', function() {
    const flip = this.get('flip');
    if (flip) {
      return tryMatch(flip, /^fa-flip/) ? flip : `fa-flip-${flip}`;
    }
  }),

  rotateCssClass: computed('rotate', function() {
    const rotate = this.get('rotate');
    if (rotate) {
      if (tryMatch(rotate, /^fa-rotate/)) {
        return rotate;
      } else {
        return `fa-rotate-${rotate}`;
      }
    }
  }),

  sizeCssClass: computed('size', function() {
    const size = this.get('size');
    if (size) {
      if (tryMatch(size, /^fa-/)) {
        return size;
      } else if (tryMatch(size, /(?:lg|x)$/)) {
        return `fa-${size}`;
      } else {
        return `fa-${size}x`;
      }
    }
  }),

  pullCssClass: computed('pull', function() {
    const pull = this.get('pull');
    if (pull) {
      return `fa-pull-${pull}`;
    }
  }),

  stackCssClass: computed('stack', function() {
    const stack = this.get('stack');
    if (stack) {
      if (tryMatch(stack, /^fa-/)) {
        return stack;
      } else if (tryMatch(stack, /x$/)) {
        return `fa-stack-${stack}`;
      } else {
        return `fa-stack-${stack}x`;
      }
    }
  }),

  ariaHiddenAttribute: computed('ariaHidden', function() {
    const ariaHidden = this.get('ariaHidden');
    return ariaHidden !== false ? true : undefined;
  })
});

FaIconComponent.reopenClass({
  positionalParams: 'params'
});

export default FaIconComponent;
