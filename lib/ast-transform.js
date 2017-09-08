/* eslint-env node */
"use strict";

const { traverse } = require('@glimmer/syntax');
const FaIconComponent = require('./build-time-components/fa-icon');
const FaListComponent = require('./build-time-components/fa-list');
const FaStackComponent = require('./build-time-components/fa-stack');

class AstTransform {
  constructor() {
    this.syntax = null;
  }

  transform(ast) {
    traverse(ast, {
      BlockStatement: (node) => {
        if (node.path.original === 'fa-list') {
          return (new FaListComponent(node, { addon: this.addon })).toElement();
        } else if (node.path.original === 'fa-stack') {
          return (new FaStackComponent(node, { addon: this.addon })).toElement();
        }
      },

      MustacheStatement: (node) => {
        if (node.path.original === 'fa-icon') {
          let faIcon = new FaIconComponent(node, { addon: this.addon });
          return faIcon.toElement();
        } else if (node.path.original === 'fa-list') {
          return (new FaListComponent(node, { addon: this.addon })).toElement();
        } else if (node.path.original === 'fa-stack') {
          return (new FaStackComponent(node, { addon: this.addon })).toElement();
        }
      }
    });

    return ast;
  }
}

function buildAstTransform(addon) {
  return class EmberFontAwesomeAstTransform extends AstTransform {
    constructor(options) {
      super(options);
      this.addon = addon;
    }
  }
}

module.exports = buildAstTransform;
