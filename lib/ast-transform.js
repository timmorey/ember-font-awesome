/* eslint-env node */
"use strict";

/*
  ```hbs
  {{! purely static }}
  1. {{fa-icon icon="credit-card"}}
  2. {{fa-icon icon="credit-card" fixedWidth=true}}
  3. {{fa-icon "credit-card"}}
  4. {{fa-icon "credit-card" ariaLabel="Select card"}}
  5. {{fa-icon "credit-card" ariaHidden=false}}
  6. {{fa-icon "credit-card" class="custom-class"}}
  7. {{fa-icon "credit-card" tagName="span"}}
  8. {{fa-icon "credit-card" size="lg"}}
  9. {{fa-icon "credit-card" size=2}}
  10. {{fa-icon "credit-card" pulse=true}}
  11. {{fa-icon "credit-card" rotate=90}}
  12. {{fa-icon "credit-card" rotate="90"}}
  13. {{fa-icon "credit-card" flip="horizontal"}}
  14. {{fa-icon "credit-card" stack=2}}
  15. {{fa-icon "credit-card" stack="2"}}
  16. {{fa-icon "credit-card" stack="2x"}}
  17. {{fa-icon "credit-card" inverse=true}}
  18. {{fa-icon "credit-card" title="pay now"}}
  19. {{fa-icon "credit-card" color="#ff0000"}}
  20. {{fa-icon "credit-card" border=true}}
  21. {{fa-icon "credit-card" pull="left"}}
  22. {{fa-icon "credit-card" pull="right"}}

  {{! dynamic }}
  30. {{fa-icon icon=boundValue}}
  31. {{fa-icon icon=boundValue fixedWidth=true}}}
  32. {{fa-icon icon=boundValue pull=direction}}}
  ```

  becomes

  ```hbs
  {{! purely static }}
  1. <i aria-hidden="true" class="fa fa-credit-card"></i>
  2. <i aria-hidden="true" class="fa fa-credit-card fa-fw"></i>
  3. <i aria-hidden="true" class="fa fa-credit-card"></i>
  4. <i aria-hidden="true" aria-label="Select card" class="fa fa-credit-card"></i>
  5. <i class="fa fa-credit-card"></i>
  6. <i aria-hidden="true" class="fa fa-credit-card custom-class"></i>
  7. <span aria-hidden="true" class="fa fa-credit-card"></span>
  8. <i aria-hidden="true" class="fa fa-credit-card fa-lg"></i>
  9. <i aria-hidden="true" class="fa fa-credit-card fa-2x"></i>
  10. <i aria-hidden="true" class="fa fa-credit-card fa-pulse"></i>
  11. <i aria-hidden="true" class="fa fa-credit-card fa-rotate-90"></i>
  12. <i aria-hidden="true" class="fa fa-credit-card fa-rotate-90"></i>
  13. <i aria-hidden="true" class="fa fa-credit-card fa-flip-horizontal"></i>
  14. <i aria-hidden="true" class="fa fa-credit-card fa-stack-2x"></i>
  15. <i aria-hidden="true" class="fa fa-credit-card fa-stack-2x"></i>
  16. <i aria-hidden="true" class="fa fa-credit-card fa-stack-2x"></i>
  17. <i aria-hidden="true" class="fa fa-credit-card fa-inverse"></i>
  18. <i aria-hidden="true" class="fa fa-credit-card" title="pay now"></i>
  19. <i aria-hidden="true" class="fa fa-credit-card" style="color:#ff0000"></i>
  20. <i aria-hidden="true" class="fa fa-credit-card fa-border"></i>
  21. <i aria-hidden="true" class="fa fa-credit-card fa-pull-left"></i>
  22. <i aria-hidden="true" class="fa fa-credit-card fa-pull-right"></i>

  {{! dynamic }}
  30. <i aria-hidden="true" class="fa {{if boundValue (concat 'fa-' boundValue)}}"></i>
  31. <i aria-hidden="true" class="fa {{if boundValue (concat 'fa-' boundValue)}} fa-fw"></i>
  31. <i aria-hidden="true" class="fa {{if boundValue (concat 'fa-' boundValue)}} fa-pull-{{direction}}"></i>
  ```
*/

const BuildTimeComponent = require('ember-ast-helpers').BuildTimeComponent;
const { builders: b, traverse } = require('@glimmer/syntax');

function interpolateAttribute(component, propName, parts) {
  let pair = component.node.hash.pairs.find((p) => p.key === propName);
  if (pair) {
    if (isDynamic(pair.value)) {
      if (pair.value.type === 'PathExpression') {
        return b.concat(parts.map((p) => p === '$' ? b.mustache(pair.value) : b.text(p)));
      } else if (pair.value.type === 'SubExpression') {
        return b.concat(parts.map((p) => p === '$' ? b.mustache(pair.value.path, pair.value.params) : b.text(p)));
      }
    } else {
      return parts.map((p) => p === '$' ? pair.value.value : p).join('');
    }
  } else if (component.options[propName]) {
    return parts.map((p) => p === '$' ? component.options[propName] : p).join('');
  }
}

function interpolateSize(component) {
  let pair = component.node.hash.pairs.find((p) => p.key === 'size');
  if (pair) {
    if (isDynamic(pair.value)) {
      return buildConcatIfPresent(pair.value, ['fa-', pair.value, 'x']);
    } else if (pair.value.type === 'NumericLiteral') {
      return `fa-${pair.value.value}x`;
    } else if (isNaN(parseInt(pair.value.value), 10)) {
      return `fa-${pair.value.value}`;
    } else {
      return `fa-${pair.value.value}x`;
    }
  }
}

class FaIconComponent extends BuildTimeComponent {
  constructor(node, opts = {}) {
    opts = Object.assign({}, { tagName: 'i', ariaHidden: true, attributeBindings: [], classNameBindings: [] }, opts);
    opts.classNames = ['fa'];
    opts.attributeBindings = ['title', 'ariaLabel:aria-label', 'ariaHidden:aria-hidden:true', 'style', 'click:onclick'];
    opts.classNameBindings = [
      'size',
      'icon',
      'pull',
      'rotate',
      'flip',
      'stack',
      'fixedWidth:fa-fw',
      'pulse:fa-pulse',
      'inverse:fa-inverse',
      'border:fa-border',
      'spin:fa-spin',
      'listItem:fa-li'
    ]
    super(node, opts);
  }

  iconContent() {
    let iconValue;
    let pair = this.node.hash.pairs.find((p) => p.key === 'icon');
    if (pair) {
      iconValue = pair.value;
    } else {
      iconValue = this.node.params[0];
    }
    if (iconValue) {
      if (isDynamic(iconValue)) {
        this.options.addon.fontAwesomeUsage.usedIconsUnknown = true;
        return buildConcatIfPresent(iconValue, ['fa-', iconValue]);
      } else {
        if (!this.options.addon.fontAwesomeUsage.usedIconsUnknown) {
          this.options.addon.fontAwesomeUsage.usedIcons.add(iconValue.value);
        }
        return `fa-${iconValue.value}`;
      }
    }
  }

  sizeContent() {
    return interpolateSize(this);
  }

  pullContent() {
    return interpolateAttribute(this, 'pull', ['fa-pull-', '$']);
  }

  rotateContent() {
    return interpolateAttribute(this, 'rotate', ['fa-rotate-', '$']);
  }

  flipContent() {
    return interpolateAttribute(this, 'flip', ['fa-flip-', '$']);
  }

  styleContent() {
    let pair = this.node.hash.pairs.find((p) => p.key === 'color');
    if (pair) {
      if (isDynamic(pair.value)) {
        return buildConcatIfPresent(pair.value, ['color:', pair.value]);
      } else {
        return `color:${pair.value.value}`;
      }
    }
  }

  stackContent() {
    let pair = this.node.hash.pairs.find((p) => p.key === 'stack');
    if (pair) {
      if (isDynamic(pair.value)) {
        return buildConcatIfPresent(pair.value, ['fa-stack-', pair.value, 'x']);
      } else if (pair.value.type === 'NumericLiteral') {
        return `fa-stack-${pair.value.value}x`;
      } else if (isNaN(parseInt(pair.value.value), 10)) {
        return `fa-stack-${pair.value.value}`;
      } else {
        return `fa-stack-${pair.value.value}x`;
      }
    } else if (this.options.stack) {
      return `fa-stack-${this.options.stack}x`;
    }
  }
}

class FaListComponent extends BuildTimeComponent {
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

class FaStackComponent extends BuildTimeComponent {
  constructor(node, opts = {}) {
    super(node, Object.assign({ tagName: 'span', classNames: ['fa-stack'], classNameBindings: ['size'] }, opts));
    this.contentVisitor = {
      MustacheStatement: (node) => {
        let componentAlias = this.node.program.blockParams[0];
        if (node.path.original === `${componentAlias}.stack-1x`) {
          return (new FaIconComponent(node, { stack: '1', addon: this.options.addon })).toNode();
        } else if (node.path.original === `${componentAlias}.stack-2x`) {
          return (new FaIconComponent(node, { stack: '2', addon: this.options.addon })).toNode();
        }
      }
    }
  }

  sizeContent() {
    return interpolateSize(this);
  }
}

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

class AstTransform {
  constructor() {
    this.syntax = null;
  }

  transform(ast) {
    traverse(ast, {
      BlockStatement: (node) => {
        if (node.path.original === 'fa-list') {
          return (new FaListComponent(node, { addon: this.addon })).toNode();
        } else if (node.path.original === 'fa-stack') {
          return (new FaStackComponent(node, { addon: this.addon })).toNode();
        }
      },

      MustacheStatement: (node) => {
        if (node.path.original === 'fa-icon') {
          let faIcon = new FaIconComponent(node, { addon: this.addon });
          return faIcon.toNode();
        } else if (node.path.original === 'fa-list') {
          return (new FaListComponent(node, { addon: this.addon })).toNode();
        } else if (node.path.original === 'fa-stack') {
          return (new FaStackComponent(node, { addon: this.addon })).toNode();
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
