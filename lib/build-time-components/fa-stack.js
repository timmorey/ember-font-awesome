/* eslint-env node */
"use strict";
const { BuildTimeComponent } = require('ember-ast-helpers');
const FaIconComponent = require('./fa-icon');
const { interpolateSize } = require('./utils');

module.exports = class FaStackComponent extends BuildTimeComponent {
  constructor(node, opts = {}) {
    super(node, Object.assign({ tagName: 'span', classNames: ['fa-stack'], classNameBindings: ['size'] }, opts));
    this.contentVisitor = {
      MustacheStatement: (node) => {
        let componentAlias = this.node.program.blockParams[0];
        if (node.path.original === `${componentAlias}.stack-1x`) {
          return (new FaIconComponent(node, { stack: '1', addon: this.options.addon })).toElement();
        } else if (node.path.original === `${componentAlias}.stack-2x`) {
          return (new FaIconComponent(node, { stack: '2', addon: this.options.addon })).toElement();
        }
      }
    }
  }

  sizeContent() {
    return interpolateSize(this);
  }
}
