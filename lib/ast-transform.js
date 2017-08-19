/* eslint-env node */
"use strict";

/*
  ```hbs
  {{fa-icon icon="credit-card"}}
  {{fa-icon icon="credit-card" fixedWidth=true}}
  {{fa-icon "credit-card"}}
  ```

  becomes

  ```hbs
  <i aria-hidden="true" class="fa fa-credit-card">
  <i aria-hidden="true" class="fa fa-credit-card fa-fw">
  <i aria-hidden="true" class="fa fa-credit-card">
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
        let classNames = ['fa'];
        let iconPair = node.hash.pairs.find(pair => pair.key === 'icon');
        let iconLiteral = iconPair && iconPair.value
        if (!iconLiteral) {
          iconLiteral = node.params[0];
        }
        if (iconLiteral) {
          AstTransform.usedIcons.add(iconLiteral.value)
          classNames.push(`fa-${iconLiteral.value}`);
        }
        let fixWidth = node.hash.pairs.find(pair => pair.key === 'fixedWidth' && pair.value.value);
        if (fixWidth) {
          classNames.push('fa-fw');
        }

        let attrs = [
          b.attr('aria-hidden', b.text('true')),
          b.attr('class', b.text(classNames.join(' ')))
        ];
        return b.element('i', attrs)
      }
    });

    return ast;
  }
}
