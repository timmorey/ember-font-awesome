/* eslint-env node */
"use strict";

/*
  ```hbs
  {{fa-icon icon="credit-card"}}
  {{fa-icon icon="credit-card" fixedWidth=true}}
  ```

  becomes

  ```hbs
  <i aria-hidden="true" class="fa fa-credit-card">
  <i aria-hidden="true" class="fa fa-credit-card fa-fw">
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
        let icon = node.hash.pairs.find(pair => pair.key === 'icon');
        if (icon) {
          AstTransform.usedIcons.add(icon.value.value)
          classNames.push(`fa-${icon.value.value}`);
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

// function BindTransform() {
//   this.syntax = null;
// }

// BindTransform.prototype.transform = function(ast) {
//   var b = this.syntax.builders;

//   this.syntax.traverse(ast, {
//     SubExpression(node) {
//       transform(node);
//     },
//     MustacheStatement(node) {
//       transform(node);
//     }
//   });

//   function transform(call) {
//     if (call.path.original === "bind" && call.params.length > 0) {
//       let hasTarget = call.hash.pairs.some(p => p.key === "target");

//       if (!hasTarget) {
//         let target = getDefaultTarget(call.params[0]);

//         call.hash.pairs.push(b.pair("target", target));
//       }
//     }

//     function getDefaultTarget(fn) {
//       if (fn.type === "PathExpression") {
//         if (fn.parts.length === 0) {
//           return b.null();
//         } else if (fn.parts.length === 1) {
//           return b.path("this");
//         } else {
//           let parts = fn.parts.slice(0);
//           parts.pop(); // Remove function part

//           let lastPart = parts[parts.length - 1];

//           if (lastPart !== "actions") {
//             return b.path(parts.join("."));
//           }

//           parts.pop(); // Remove actions part

//           if (parts.length === 0) {
//             return b.path("this");
//           }

//           return b.path(parts.join("."));
//         }
//       } else {
//         return b.null();
//       }
//     }
//   }

//   return ast;
// };

// module.exports = BindTransform;
