import Ember from 'ember';
import tryMatch from 'ember-cli-font-awesome/utils/try-match';

const { computed } = Ember;

export default Ember.Component.extend({
  tagName: 'span',

  classNames: 'fa-stack',

  classNameBindings: ['sizeCssClass'],

  sizeCssClass: computed('size', function() {
    let size = this.get('size');
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
});
