/* eslint-env node */
"use strict";

const { builders: b } = require('@glimmer/syntax');

function buildConditional(conditionArgs) {
  let args = conditionArgs.map((p) => typeof p === 'string' ? b.string(p) : p);
  return b.mustache(b.path('if'), args);
}

function buildConcatIfPresent(path, concatArgs) {
  let args = concatArgs.map((p) => typeof p === 'string' ? b.string(p) : p);
  return buildConditional([path, b.sexpr(b.path('concat'), args)]);
}

function isDynamic(node) {
  return node.type !== undefined && node.type === 'PathExpression' || node.type === 'SubExpression';
}

function interpolateSize(component) {
  if (component.attrs.size) {
    if (isDynamic(component.attrs.size)) {
      return buildConcatIfPresent(component.attrs.size, ['fa-', component.attrs.size, 'x']);
    } else if (component.attrs.size.type === 'NumericLiteral') {
      return `fa-${component.attrs.size.value}x`;
    } else if (isNaN(parseInt(component.attrs.size.value), 10)) {
      return `fa-${component.attrs.size.value}`;
    } else {
      return `fa-${component.attrs.size.value}x`;
    }
  }
}

module.exports = {
  interpolateSize,
  buildConcatIfPresent,
  isDynamic
}
