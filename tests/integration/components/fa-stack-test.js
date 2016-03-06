import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('fa-stack', 'Integration | Component | {{fa-stack}}', {
  integration: true
});

test('it is an span tag with a fa-stack class', function(assert) {
  this.render(hbs`{{fa-stack}}`);
  let $stack = this.$('span');
  assert.equal($stack.length, 1);
  assert.ok($stack.hasClass('fa-stack'));
});

test('size 2x', function(assert) {
  this.render(hbs`{{fa-stack size="2x"}}`);
  let $stack = this.$('span');
  assert.ok($stack.hasClass('fa-2x'));
});

test('size 2', function(assert) {
  this.render(hbs`{{fa-stack size="2"}}`);
  let $stack = this.$('span');
  assert.ok($stack.hasClass('fa-2x'));
});

test('size as a number', function(assert) {
  this.set('stack', 2);
  this.render(hbs`{{fa-stack size=stack}}`);
  let $stack = this.$('span');
  assert.ok($stack.hasClass('fa-2x'));
});

test('size fa-3x', function(assert) {
  this.render(hbs`{{fa-stack size="fa-3x"}}`);
  let $stack = this.$('span');
  assert.ok($stack.hasClass('fa-3x'));
});

test('size lg', function(assert) {
  this.render(hbs`{{fa-stack size="lg"}}`);
  let $stack = this.$('span');
  assert.ok($stack.hasClass('fa-lg'));
});

test('it yields to a block', function(assert) {
  this.render(hbs`
    {{#fa-stack}}
      {{fa-icon icon="fa-square-o" stack="2x"}}
      {{fa-icon icon="fa-twitter" stack="1x"}}
    {{/fa-stack}}
  `);

  let $icons = this.$('i');
  assert.equal($icons.length, 2);
});
