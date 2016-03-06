import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('fa-list', 'Integration | Component | {{fa-list}}', {
  integration: true
});

test('It is an ul tag with fa-ul class', function(assert) {
  this.render(hbs`{{fa-list}}`);

  let $list = this.$('ul');
  assert.equal($list.length, 1);
  assert.ok($list.hasClass('fa-ul'));
});

test('It yields a fa-icon with listItem=true to a block', function(assert) {
  this.render(hbs`
    {{#fa-list as |l|}}
      <li>{{l.fa-icon icon="star"}}Item 1</li>
      <li>{{l.fa-icon icon="star"}}Item 2</li>
    {{/fa-list}}
  `);

  let $icons = this.$('i');
  assert.equal($icons.length, 2);
});
