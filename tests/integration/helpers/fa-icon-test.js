import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';
import { moduleForComponent, test } from 'ember-qunit';

const { run } = Ember;

// It's not really a component, but it works! :)
moduleForComponent('fa-icon', {
  integration: true
});

test('fa icon has a class corresponding to the icon name', function(assert) {
  this.render(hbs`{{fa-icon 'credit-card'}}`);
  const $icon = this.$('.fa-credit-card');
  assert.equal($icon.length, 1);
});

test('optionally its possible to use the full css icon name', function(assert) {
  this.render(hbs`{{fa-icon 'fa-credit-card'}}`);
  const $icon = this.$('.fa-credit-card');
  assert.equal($icon.length, 1);
});

test('spin', function(assert) {
  this.render(hbs`{{fa-icon 'credit-card' spin=spin}}`);
  assert.equal(this.$('.fa-spin').length, 0);

  run(() => this.set('spin', true));

  assert.equal(this.$('.fa-spin').length, 1);

});

test('flip', function(assert) {
  this.render(hbs`{{fa-icon 'credit-card' flip=flip}}`);
  assert.equal(
    this.$('.fa-flip-horizontal,.fa-flip-vertical,.fa-flip-undefined').length,
    0
  );

  run(() => this.set('flip', 'horizontal'));

  assert.equal(this.$('.fa-flip-horizontal').length, 1);
  assert.equal(this.$('.fa-flip-vertical').length, 0);

  run(() => this.set('flip', 'vertical'));

  assert.equal(this.$('.fa-flip-horizontal').length, 0);
  assert.equal(this.$('.fa-flip-vertical').length, 1);
});

test('rotate', function(assert) {
  this.render(hbs`{{fa-icon 'credit-card' rotate=rotate}}`);
  assert.equal(
    this.$('.fa-rotate-undefined,.fa-rotate-90,.fa-rotate-180,.fa-rotate-270').length,
    0
  );

  run(() => this.set('rotate', 90));
  assert.equal(this.$('.fa-rotate-90').length, 1);

  run(() => this.set('rotate', 180));
  assert.equal(this.$('.fa-rotate-180').length, 1);

  run(() => this.set('rotate', 270));
  assert.equal(this.$('.fa-rotate-270').length, 1);
});

test('size', function(assert) {
  this.render(hbs`{{fa-icon 'credit-card' size=size}}`);
  assert.equal(
    this.$('.fa-lg,.fa-2x,.fa-3x,.fa-4x,.fa-5x,.fa-undefined').length,
    0
  );

  run(() => this.set('size', 'lg'));
  assert.equal(this.$('.fa-lg').length, 1);

  run(() => this.set('size', '2x'));
  assert.equal(this.$('.fa-2x').length, 1);

  run(() => this.set('size', 2));
  assert.equal(this.$('.fa-2x').length, 1);

  run(() => this.set('size', 3));
  assert.equal(this.$('.fa-3x').length, 1);

  run(() => this.set('size', 4));
  assert.equal(this.$('.fa-4x').length, 1);

  run(() => this.set('size', 5));
  assert.equal(this.$('.fa-5x').length, 1);
});

test('fixed width', function(assert) {
  this.render(hbs`{{fa-icon 'credit-card' fixedWidth=fixedWidth}}`);
  assert.equal(this.$('.fa-fw').length, 0);

  run(() => this.set('fixedWidth', true));
  assert.equal(this.$('.fa-fw').length, 1);
});

test('list item', function(assert) {
  this.render(hbs`{{fa-icon 'credit-card' listItem=listItem}}`);
  assert.equal(this.$('.fa-li').length, 0);

  run(() => this.set('listItem', true));
  assert.equal(this.$('.fa-li').length, 1);
});

test('border', function(assert) {
  this.render(hbs`{{fa-icon 'credit-card' border=border}}`);
  assert.equal(this.$('.fa-border').length, 0);

  run(() => this.set('border', true));
  assert.equal(this.$('.fa-border').length, 1);
});

test('pull', function(assert) {
  this.render(hbs`{{fa-icon 'credit-card' pull=pull}}`);
  assert.equal(this.$('.pull-left,.pull-right,.pull-undefined').length, 0);

  run(() => this.set('pull', 'left'));
  assert.equal(this.$('.pull-left').length, 1);

  run(() => this.set('pull', 'right'));
  assert.equal(this.$('.pull-right').length, 1);
});

test('pulse', function(assert) {
  this.render(hbs`{{fa-icon 'credit-card' pulse=pulse}}`);
  assert.equal(this.$('.fa-pulse').length, 0);

  run(() => this.set('pulse', true));
  assert.equal(this.$('.fa-pulse').length, 1);
});

test('stack', function(assert) {
  this.render(hbs`{{fa-icon 'credit-card' stack=stack}}`);
  assert.equal(this.$('.fa-stack-1x,.fa-stack-2x,.fa-stack-undefined').length, 0);

  run(() => this.set('stack', '1x'));
  assert.equal(this.$('.fa-stack-1x').length, 1);

  run(() => this.set('stack', 1));
  assert.equal(this.$('.fa-stack-1x').length, 1);

  run(() => this.set('stack', '2x'));
  assert.equal(this.$('.fa-stack-2x').length, 1);
});

test('inverse', function(assert) {
  this.render(hbs`{{fa-icon 'credit-card' inverse=inverse}}`);
  assert.equal(this.$('.fa-inverse').length, 0);

  run(() => this.set('inverse', true));
  assert.equal(this.$('.fa-inverse').length, 1);
});

test('aria-hidden', function(assert) {
  this.render(hbs`{{fa-icon 'credit-card' ariaHidden=ariaHidden}}`);
  assert.equal(this.$('.fa[aria-hidden="true"]').length, 1);

  this.set('ariaHidden', true);
  assert.equal(this.$('.fa[aria-hidden="true"]').length, 1);

  this.set('ariaHidden', false);
  assert.equal(this.$('.fa[aria-hidden]').length, 0);
});
