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

const appendToContent = require('ember-ast-helpers').appendToContent;
const buildAttr = require('ember-ast-helpers').buildAttr;
const BuildTimeComponent = require('ember-ast-helpers').BuildTimeComponent;
const b = require('@glimmer/syntax').builders;

class FaIconComponent extends BuildTimeComponent {
  constructor(node, opts = { tagName: 'i', attributeBindings: [], classNameBindings: [] }) {
    opts.attributeBindings = ['title', 'ariaLabel:aria-label', 'ariaHidden:aria-hidden:true'];
    opts.classNameBindings = [
      'fixedWidth:fa-fw',
      'pulse:fa-pulse',
      'inverse:fa-inverse',
      'border:fa-border',
      'spin:fa-spin',
      'size',
      'icon',
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
        return buildConcatIfPresent(iconValue, ['fa-', iconValue]);
        // this.addon.fontAwesomeUsage.usedIconsUnknown = true;
      } else {
        // if (!this.addon.fontAwesomeUsage.usedIconsUnknown) {
        //   this.addon.fontAwesomeUsage.usedIcons.add(iconValue.value);
        // }
        return `fa-${iconValue.value}`;
      }
    }
  }

  sizeContent() {
    let pair = this.node.hash.pairs.find((p) => p.key === 'size');
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
    let traverse = this.syntax.traverse;

    traverse(ast, {
      BlockStatement: (node) => {
        if (node.path.original === 'fa-list') {
          return this.transformFaListBlock(traverse, node);
        } else if (node.path.original === 'fa-stack') {
          return this.transformFaStackBlock(traverse, node);
        }
      },

      MustacheStatement: (node) => {
        if (node.path.original === 'fa-icon') {
          let faIcon = new FaIconComponent(node);
          return faIcon.toNode();
        } else if (node.path.original === 'fa-list') {
          return this.buildFaList(node);
        } else if (node.path.original === 'fa-stack') {
          return this.buildFaStack(node);
        }
      }
    });

    return ast;
  }

  // Private functions
  buildFaList(node) {
    let classContent = b.text('fa-ul');
    node.hash.pairs.forEach(function(pair) {
      switch(pair.key) {
        case 'class':
        classContent = appendToContent(pair.value, classContent);
        break;
      }
    });
    let children = node.type === 'BlockStatement' ? node.program.body : [];
    return b.element('ul', [b.attr('class', classContent)], [], children);
  }

  buildFaStack(node) {
    let classContent = b.text('fa-stack');
    node.hash.pairs.forEach(function(pair) {
      switch(pair.key) {
        case 'class':
          classContent = appendToContent(pair.value, classContent);
          break;
        case 'size':
          if (isDynamic(pair.value)) {
            classContent = appendToContent(buildConcatIfPresent(pair.value, ['fa-', pair.value, 'x']), classContent);
          } else if (pair.value.type === 'NumericLiteral') {
            classContent = appendToContent(`fa-${pair.value.value}x`, classContent);
          } else if (isNaN(parseInt(pair.value.value), 10)) {
            classContent = appendToContent(`fa-${pair.value.value}`, classContent);
          } else {
            classContent = appendToContent(`fa-${pair.value.value}x`, classContent);
          }
          break;
      }
    });
    let children = node.type === 'BlockStatement' ? node.program.body : [];
    return b.element('span', [b.attr('class', classContent)], [], children);
  }

  transformFaListBlock(traverse, node) {
    let listAlias = node.program.blockParams[0];

    traverse(node.program, {
      MustacheStatement: (node) => {
        if (node.path.original === `${listAlias}.fa-icon`) {
          return this.transformFaIcon(node, { listItem: true });
        }
      }
    });

    return this.buildFaList(node);
  }

  transformFaStackBlock(traverse, node) {
    let listAlias = node.program.blockParams[0];

    traverse(node.program, {
      MustacheStatement: (node) => {
        if (node.path.original === `${listAlias}.stack-1x`) {
          return this.transformFaIcon(node, { stack: b.string('1') });
        } else if (node.path.original === `${listAlias}.stack-2x`) {
          return this.transformFaIcon(node, { stack: b.string('2') });
        }
      }
    });

    return this.buildFaStack(node);
  }

  transformFaIcon(node, opts) {
    opts = opts || {};
    let tagName = opts.tagName || 'i';
    let listItem = opts.listItem;
    let stack = opts.stack;
    if (listItem === undefined) {
      listItem = false
    }
    let attrs = [];
    let iconValue = node.params[0];
    let classContent = b.text('fa');
    let ariaHidden = true;
    let ariaLabel, title;
    node.hash.pairs.forEach(function(pair) {
      switch(pair.key) {
        case 'tagName':
          tagName = pair.value.value;
          break;
        case 'ariaHidden':
          ariaHidden = pair.value;
          break;
        case 'class':
          classContent = appendToContent(pair.value, classContent);
          break;
        case 'ariaLabel':
          ariaLabel = pair.value;
          break;
        case 'title':
          title = pair.value;
          break;
        case 'icon':
          iconValue = pair.value;
          break;
        case 'fixedWidth':
          if (isDynamic(pair.value)) {
            classContent = appendToContent(buildConditional([pair.value, 'fa-fw']), classContent);
          } else if (pair.value.value) {
            classContent = appendToContent('fa-fw', classContent);
          }
          break;
        case 'listItem':
          listItem = pair.value;
          break;
        case 'pulse':
          if (isDynamic(pair.value)) {
            classContent = appendToContent(buildConditional([pair.value, 'fa-pulse']), classContent);
          } else if (pair.value.value) {
            classContent = appendToContent('fa-pulse', classContent);
          }
          break;
        case 'inverse':
          if (isDynamic(pair.value)) {
            classContent = appendToContent(buildConditional([pair.value, 'fa-inverse']), classContent);
          } else if (pair.value.value) {
            classContent = appendToContent('fa-inverse', classContent);
          }
          break;
        case 'border':
          if (isDynamic(pair.value)) {
            classContent = appendToContent(buildConditional([pair.value, 'fa-border']), classContent);
          } else if (pair.value.value) {
            classContent = appendToContent('fa-border', classContent);
          }
          break;
        case 'spin':
          if (isDynamic(pair.value)) {
            classContent = appendToContent(buildConditional([pair.value, 'fa-spin']), classContent);
          } else if (pair.value.value) {
            classContent = appendToContent('fa-spin', classContent);
          }
          break;
        case 'size':
          if (isDynamic(pair.value)) {
            classContent = appendToContent(buildConcatIfPresent(pair.value, ['fa-', pair.value, 'x']), classContent);
          } else if (pair.value.type === 'NumericLiteral') {
            classContent = appendToContent(`fa-${pair.value.value}x`, classContent);
          } else if (isNaN(parseInt(pair.value.value), 10)) {
            classContent = appendToContent(`fa-${pair.value.value}`, classContent);
          } else {
            classContent = appendToContent(`fa-${pair.value.value}x`, classContent);
          }
          break;
        case 'pull':
          if (isDynamic(pair.value)) {
            classContent = appendToContent('fa-pull-', classContent);
            classContent = appendToContent(pair.value, classContent, { prependSpace: false });
          } else {
            classContent = appendToContent(`fa-pull-${pair.value.value}`, classContent);
          }
          break;
        case 'flip':
          if (isDynamic(pair.value)) {
            classContent = appendToContent('fa-flip-', classContent);
            classContent = appendToContent(pair.value, classContent, { prependSpace: false });
          } else {
            classContent = appendToContent(`fa-flip-${pair.value.value}`, classContent);
          }
          break;
        case 'rotate':
          if (isDynamic(pair.value)) {
            classContent = appendToContent('fa-rotate-', classContent);
            classContent = appendToContent(pair.value, classContent, { prependSpace: false });
          } else {
            classContent = appendToContent(`fa-rotate-${pair.value.value}`, classContent);
          }
          break;
        case 'color':
          if (isDynamic(pair.value)) {
            let content = buildConcatIfPresent(pair.value, ['color:', pair.value]);
            attrs.push(buildAttr('style', content));
          } else {
            attrs.push(buildAttr('style', b.text(`color:${pair.value.value}`)));
          }
          break;
        case 'stack':
          stack = pair.value;
          break;
        case 'click':
          attrs.push(buildAttr('onclick', pair.value));
          break;
        default:
          console.warn(`{{fa-icon}}: Ignored unknown option named "${pair.key}"`);
      }
    });
    if (ariaHidden === true || ariaHidden.value === true) {
      attrs.push(buildAttr('aria-hidden', b.text('true')));
    }
    if (ariaLabel) {
      attrs.push(buildAttr('aria-label', ariaLabel));
    }
    if (title) {
      attrs.push(buildAttr('title', title));
    }
    if (iconValue) {
      if (isDynamic(iconValue)) {
        classContent = appendToContent(buildConcatIfPresent(iconValue, ['fa-', iconValue]), classContent);
        this.addon.fontAwesomeUsage.usedIconsUnknown = true;
      } else {
        if (!this.addon.fontAwesomeUsage.usedIconsUnknown) {
          this.addon.fontAwesomeUsage.usedIcons.add(iconValue.value);
        }
        classContent = appendToContent(`fa-${iconValue.value}`, classContent);
      }
    }
    if (listItem) {
      if (isDynamic(listItem)) {
        classContent = appendToContent(buildConditional([listItem, 'fa-li']), classContent);
      } else {
        classContent = appendToContent('fa-li', classContent);
      }
    }
    if (stack) {
      if (isDynamic(iconValue)) {
        classContent = appendToContent('fa-stack-', classContent);
        classContent = appendToContent(stack, classContent, { prependSpace: false });
        classContent = appendToContent('x', classContent, { prependSpace: false });
      } else if (stack.value[stack.value.length - 1] !== 'x') {
        classContent = appendToContent(`fa-stack-${stack.value}x`, classContent);
      } else {
        classContent = appendToContent(`fa-stack-${stack.value}`, classContent);
      }
    }
    attrs.push(buildAttr('class', classContent));
    return b.element(tagName, attrs)
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
