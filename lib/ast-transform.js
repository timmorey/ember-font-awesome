/* eslint-env node */
"use strict";

/*
  ```hbs
  1. {{fa-icon icon="credit-card"}}
  2. {{fa-icon icon="credit-card" fixedWidth=true}}
  3. {{fa-icon "credit-card"}}
  4. {{fa-icon "credit-card" ariaLabel="Select card"}}
  5. {{fa-icon "credit-card" ariaHidden=false}}
  6. {{fa-icon "credit-card" class="custom-class"}}
  7. {{fa-icon "credit-card" tagName="span"}}
  8. {{fa-icon "credit-card" size="lg"}}
  9. {{fa-icon "credit-card" size=2}}
  ```

  becomes

  ```hbs
  1. <i aria-hidden="true" class="fa fa-credit-card"></i>
  2. <i aria-hidden="true" class="fa fa-credit-card fa-fw"></i>
  3. <i aria-hidden="true" class="fa fa-credit-card"></i>
  4. <i aria-hidden="true" aria-label="Select card" class="fa fa-credit-card"></i>
  5. <i class="fa fa-credit-card"></i>
  6. <i aria-hidden="true" class="fa fa-credit-card custom-class"></i>
  7. <span aria-hidden="true" class="fa fa-credit-card"></span>
  8. <i aria-hidden="true" class="fa fa-credit-card fa-lg"></i>
  9. <i aria-hidden="true" class="fa fa-credit-card fa-2x"></i>
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
        let purelyStatic = node.hash.pairs.every(pair => pair.value.type !== "PathExpression");
        if (!purelyStatic) {
          AstTransform.dynamicInvocationsFound = true;
          return;
        }
        let tagName = 'i';
        let attrs = [];
        let classNames = ['fa'];
        let iconPair = node.hash.pairs.find(pair => pair.key === 'icon');
        let iconLiteral = iconPair && iconPair.value
        if (!iconLiteral) {
          iconLiteral = node.params[0];
        }
        let tagPair = node.hash.pairs.find(pair => pair.key === 'tagName' && pair.value.value);
        if (tagPair) {
          tagName = tagPair.value.value
        }
        let ariaHidden = node.hash.pairs.find(pair => pair.key === 'ariaHidden' && pair.value);
        if (!ariaHidden || ariaHidden.value.value) {
          attrs.push(b.attr('aria-hidden', b.text('true')));
        }
        if (iconLiteral) {
          AstTransform.usedIcons.add(iconLiteral.value)
          classNames.push(`fa-${iconLiteral.value}`);
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
        let ariaLabel = node.hash.pairs.find(pair => pair.key === 'ariaLabel' && pair.value.value);
        if (ariaLabel) {
          attrs.push(b.attr('aria-label', b.text(ariaLabel.value.value)));
        }

        attrs.push(b.attr('class', b.text(classNames.join(' '))));
        return b.element(tagName, attrs)
      }
    });

    return ast;
  }
}
