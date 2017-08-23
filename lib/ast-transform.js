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
const appendToContent = require('ember-ast-helpers/lib/helpers/append-to-content');

function buildConcatIfPresent(b, path, concatArgs) {
  let args = concatArgs.map((p) => typeof p === 'string' ? b.string('fa-') : p);
  return b.mustache(b.path('if'), [path, b.sexpr(b.path('concat'), args)]);
}

function buildAttr(b, name, content) {
  if (content.type === 'PathExpression') {
    return b.attr(name, b.mustache(content));
  } else if (content.type === 'StringLiteral') {
    return b.attr(name, b.text(content.value));
  } else {
    return b.attr(name, content);
  }
}

module.exports = class AstTransform {
  constructor() {
    this.syntax = null;
  }

  transform(ast) {
    let b = this.syntax.builders;

    this.syntax.traverse(ast, {
      MustacheStatement: (node) => {
        if (node.path.original !== 'fa-icon') return;
        let attrs = [];
        let tagName = 'i';
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
              if (pair.value.value) {
                classContent = appendToContent(b, 'fa-fw', classContent);
              }
              break;
            case 'pulse':
              if (pair.value.value) {
                classContent = appendToContent(b, 'fa-pulse', classContent);
              }
              break;
            case 'inverse':
              if (pair.value.value) {
                classContent = appendToContent(b, 'fa-inverse', classContent);
              }
              break;
            case 'border':
              if (pair.value.value) {
                classContent = appendToContent(b, 'fa-border', classContent);
              }
              break;
            case 'spin':
              if (pair.value.value) {
                classContent = appendToContent(b, 'fa-spain', classContent);
              }
              break;
            case 'size':
              if (pair.value.type === 'PathExpression') {
                classContent = appendToContent(b, buildConcatIfPresent(b, pair.value, ['fa-', pair.value, 'x']), classContent);
              } else {
                classContent = appendToContent(b, `fa-${pair.value.value}x`, classContent);
              }
              break;
            case 'pull':
              if (pair.value.type === 'PathExpression') {
                classContent = appendToContent(b, 'fa-pull-', classContent, { prependSpace: false });  // This is going to be wrong
              } else {
                classContent = appendToContent(b, `fa-pull-${pair.value.value}`, classContent);
              }
              break;
            case 'flip':
              if (pair.value.type === 'PathExpression') {
                classContent = appendToContent(b, 'fa-flip-', classContent, { prependSpace: false });  // This is going to be wrong
              } else {
                classContent = appendToContent(b, `fa-flip-${pair.value.value}`, classContent);
              }
              break;
            case 'rotate':
              if (pair.value.type === 'PathExpression') {
                classContent = appendToContent(b, 'fa-rotate-', classContent, { prependSpace: false });  // This is going to be wrong
              } else {
                classContent = appendToContent(b, `fa-rotate-${pair.value.value}`, classContent);
              }
              break;
            case 'color':
              attrs.push(b.attr('style', b.text(`color:${pair.value.value}`)));
              break;
            case 'stack':
              if (pair.value.type === 'PathExpression') {
                classContent = appendToContent(b, 'fa-stack-', classContent);
                classContent = appendToContent(b, pair.value, classContent, { prependSpace: false });
                classContent = appendToContent(b, 'x', classContent, { prependSpace: false });
              } else if (pair.value.value[pair.value.value.length - 1] !== 'x') {
                classContent = appendToContent(b, `fa-stack-${pair.value.value}x`, classContent);
              } else {
                classContent = appendToContent(b, `fa-stack-${pair.value.value}`, classContent);
              }
              break;
            default:
              console.warn(`Found unknown hash option named "${pair.key}"`);
              // throw new Error(`Found unknown hash option named "${pair.key}"`);
          }
        });
        if (ariaHidden === true || ariaHidden.value === true) {
          attrs.push(buildAttr(b, 'aria-hidden', b.text('true')));
        }
        if (ariaLabel) {
          attrs.push(buildAttr(b, 'aria-label', ariaLabel));
        }
        if (title) {
          attrs.push(buildAttr(b, 'title', title));
        }
        if (iconValue) {
          if (iconValue.type === 'PathExpression') {
            classContent = appendToContent(b, buildConcatIfPresent(b, iconValue, ['fa-', iconValue]), classContent);
          } else {
            classContent = appendToContent(b, `fa-${iconValue.value}`, classContent);
          }
        }
        attrs.push(buildAttr(b, 'class', classContent));
        return b.element(tagName, attrs)
      }
    });

    return ast;
  }
}
