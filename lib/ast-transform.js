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

  {{! dynamic }}
  20. {{fa-icon icon=boundValue}}
  21. {{fa-icon icon=boundValue fixedWidth=true}}}
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

  {{! dynamic }}
  20. <i aria-hidden="true" class="fa {{if boundValue (concat 'fa-' boundValue)}}"></i>
  21. <i aria-hidden="true" class="fa {{if boundValue (concat 'fa-' boundValue)}} fa-fw"></i>
  ```
*/

module.exports = class AstTransform {
  constructor() {
    this.syntax = null;
  }

  transform(ast) {
    let b = this.syntax.builders;

    this.syntax.traverse(ast, {
      MustacheStatement: (node) => {
        if (node.path.original !== 'fa-icon') return;
        let dynamicClass = false;
        let tagName = 'i';
        let attrs = [];
        let classNames = ['fa'];
        let iconPair = node.hash.pairs.find(pair => pair.key === 'icon');
        let iconValue = iconPair && iconPair.value
        if (!iconValue) {
          iconValue = node.params[0];
        }
        let tagPair = node.hash.pairs.find(pair => pair.key === 'tagName' && pair.value.value);
        if (tagPair) {
          tagName = tagPair.value.value
        }
        let ariaHidden = node.hash.pairs.find(pair => pair.key === 'ariaHidden' && pair.value);
        if (!ariaHidden || ariaHidden.value.value) {
          attrs.push(b.attr('aria-hidden', b.text('true')));
        }
        if (iconValue) {
          if (iconValue.type === 'PathExpression') {
            let mustache = b.mustache(
              b.path('if'),
              [
                iconValue,
                b.sexpr(b.path('concat'), [b.string('fa-'), iconValue])
              ]
            );
            classNames.push(mustache);
            dynamicClass = true;
            AstTransform.dynamicInvocationsFound = true;
          } else {
            AstTransform.usedIcons.add(iconValue.value)
            classNames.push(`fa-${iconValue.value}`);
          }
        }
        let fixWidth = node.hash.pairs.find(pair => pair.key === 'fixedWidth' && pair.value.value);
        if (fixWidth) {
          classNames.push('fa-fw');
        }
        let sizePair = node.hash.pairs.find(pair => pair.key === 'size' && pair.value.value);
        if (sizePair) {
          if (sizePair.value.type === 'NumberLiteral') {
            classNames.push(`fa-${sizePair.value.value}x`);
          } else if (sizePair.value.type === 'StringLiteral') {
            classNames.push(`fa-${sizePair.value.value}`);
          }
        }
        let pulse = node.hash.pairs.find(pair => pair.key === 'pulse' && pair.value.value);
        if (pulse) {
          classNames.push('fa-pulse');
        }
        let rotate = node.hash.pairs.find(pair => pair.key === 'rotate' && pair.value.value);
        if (rotate) {
          classNames.push(`fa-rotate-${rotate.value.value}`);
        }
        let flip = node.hash.pairs.find(pair => pair.key === 'flip' && pair.value.value);
        if (flip) {
          classNames.push(`fa-flip-${flip.value.value}`);
        }
        let inverse = node.hash.pairs.find(pair => pair.key === 'inverse' && pair.value.value);
        if (inverse) {
          classNames.push(`fa-inverse`);
        }
        let stack = node.hash.pairs.find(pair => pair.key === 'stack' && pair.value.value);
        if (stack) {
          let val = stack.value.value;
          if (val[val.length - 1] !== 'x') {
            val += 'x';
          }
          classNames.push(`fa-stack-${val}`);
        }
        let ariaLabel = node.hash.pairs.find(pair => pair.key === 'ariaLabel' && pair.value.value);
        if (ariaLabel) {
          attrs.push(b.attr('aria-label', b.text(ariaLabel.value.value)));
        }
        let title = node.hash.pairs.find(pair => pair.key === 'title' && pair.value.value);
        if (title) {
          attrs.push(b.attr('title', b.text(title.value.value)));
        }
        let color = node.hash.pairs.find(pair => pair.key === 'color' && pair.value.value);
        if (color) {
          attrs.push(b.attr('style', b.text(`color:${color.value.value}`)));
        }
        let classContent;
        if (dynamicClass) {
          for (let i = 0; i < classNames.length; i++) {
            if (typeof classNames[i] === 'string') {
              if (classNames[i - 1] && typeof classNames[i - 1] !== 'string') {
                classNames[i] = ' ' + classNames[i];
              }
              if (classNames[i + 1] && typeof classNames[i + 1] !== 'string') {
                classNames[i] = classNames[i] + ' ';
              }
            }
          }
          classContent = b.concat(classNames.map(e => typeof e === 'string' ? b.text(e) : e));
        } else {
          classContent = b.text(classNames.join(' '));
        }
        attrs.push(b.attr('class', classContent));
        return b.element(tagName, attrs)
      }
    });

    return ast;
  }
}
