/* eslint-env node */
"use strict";
const { BuildTimeComponent } = require('ember-ast-helpers');
const FaIconComponent = require('./fa-icon');

module.exports = class FaListComponent extends BuildTimeComponent {
  constructor(node, opts = {}) {
    super(node, Object.assign({ tagName: 'ul', classNames: ['fa-ul'] }, opts));
    this.contentVisitor = {
      MustacheStatement: (node) => {
        let componentAlias = this.node.program.blockParams[0];
        if (componentAlias !== undefined && node.path.original === `${componentAlias}.fa-icon`) {
          return (new FaIconComponent(node, { listItem: true, addon: this.options.addon })).toNode();
        }
      }
    }
  }
}
