/* eslint-env node */
"use strict";

const BroccoliFilter = require('broccoli-filter');
const postcss = require('postcss');

module.exports = class PruneUnusedIcons extends BroccoliFilter {
  constructor(inputNodes, options) {
    super(inputNodes, options)
    this.options = options;
    this.targetFiles = ['assets/vendor.css'];
    this.postcss = postcss.plugin('postcss-remove-unused-fa-icons', () => {
      return root => {
        root.walkRules(rule => {
          let matchData = rule.selector.match(/\.fa-(.*):before/);
          if (matchData !== null && !this.options.addon.fontAwesomeUsage.usedIcons.has(matchData[1])) {
            rule.remove();
          }
        });
      };
    });
  }

  processString(str /*, relativePath */) {
    if (this.options.addon.fontAwesomeUsage.usedIconsUnknown) {
      return str;
    }
    return this.postcss.process(str).css;
  }

  getDestFilePath(relativePath) {
    if (this.targetFiles.includes(relativePath)) {
      return relativePath;
    }
    return null;
  }
}
