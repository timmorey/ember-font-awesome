import Ember from 'ember';

const { computed } = Ember;

export default Ember.Component.extend({
  tagName: 'span',

  classNames: 'fa-stack',

  classNameBindings: ['sizeCssClass'],

  sizeCssClass: computed('size', function() {
    let size = this.get('size');
    if (size) {
      if (size.match(/^fa-/)) {
        return size;
      } else {
        return size.match(/(?:lg|x)$/) ? `fa-${size}` : `fa-${size}x`;
      }
    }
  }),
});
