import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('fa-list-icon', 'Integration | Component | {{fa-list-icon}}', {
  integration: true
});

test('it is an icon with the fa-li class on it', function(assert) {
  this.render(hbs`{{fa-list-icon}}`);

  let $icon = this.$('i');
  assert.equal($icon.length, 1);
  assert.ok($icon.hasClass('fa-li'));
});
