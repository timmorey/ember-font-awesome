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
const { builders: b } = require('@glimmer/syntax');
const { BuildTimeComponent } = require('ember-ast-helpers');
const { isDynamic, buildConcatIfPresent, interpolateSize } = require('./utils');

function interpolateAttribute(component, propName, parts) {
  let value = component.attrs[propName];
  if (value) {
    if (isDynamic(value)) {
      if (value.type === 'PathExpression') {
        return b.concat(parts.map((p) => p === '$' ? b.mustache(value) : b.text(p)));
      } else if (value.type === 'SubExpression') {
        return b.concat(parts.map((p) => p === '$' ? b.mustache(value.path, value.params) : b.text(p)));
      }
    } else {
      return parts.map((p) => p === '$' ? value.value : p).join('');
    }
  } else if (component.options[propName]) {
    return parts.map((p) => p === '$' ? component.options[propName] : p).join('');
  }
}

function splitInterpolation(interpolation, divisor) {
  let parts = [];
  let lastMatch = 0;
  let inCaptureGroup = false;
  for(let i = 0; i < interpolation.length; i++) {
    if (interpolation[i] === divisor) {
      parts.push(interpolation.slice(lastMatch, i + (inCaptureGroup ? 1 : 0)));
      inCaptureGroup = !inCaptureGroup
      lastMatch = i + (inCaptureGroup ? 0 : 1);
    }
  }
  if (lastMatch < interpolation.length - 1) {
    parts.push(interpolation.slice(lastMatch, interpolation.length));
  }
  if (parts[0] === '') {
    return parts.slice(1);
  }
  return parts;
}

function interpolateIfPresent(interpolation, divisor = ':') {
  let parts = splitInterpolation(interpolation, divisor);
  return function() {
    let concatParts = [];
    let hasDynamicInterpolation = false;
    for (let part of parts) {
      if (part[0] === divisor && part[part.length - 1] === divisor) {
        let propName = part.slice(1, part.length - 1);
        let attrValue = this.attrs[propName];
        if (isDynamic(attrValue)) {
          hasDynamicInterpolation = true;
          if (attrValue.type === 'PathExpression') {
            return b.mustache(attrValue);
          } else if (attrValue.type === 'SubExpression') {
            return b.mustache(attrValue.path, attrValue.params, attrValue);
          }
          concatParts.push(b.mustache(attrValue.value));
        } else if (attrValue.value !== undefined && attrValue.value !== null) {
          concatParts.push(attrValue.value);
        }
      } else {
        concatParts.push(part);
      }
    }
    if (hasDynamicInterpolation) {
      return b.concat(concatParts);
    } else {
      return concatParts.join('');
    }
  }
}

module.exports = class FaIconComponent extends BuildTimeComponent {
  constructor(node, opts = {}) {
    opts = Object.assign({}, { tagName: 'i', ariaHidden: true, attributeBindings: [], classNameBindings: [] }, opts);
    super(node, opts);
    this.classNames = ['fa'];
    this.attributeBindings = ['title', 'ariaLabel:aria-label', 'ariaHidden:aria-hidden:true', 'style', 'click:onclick'];
    this.classNameBindings = [
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
    this.pullContent = interpolateIfPresent('fa-pull-:pull:')
  }

  iconContent() {
    let iconValue = this.attrs.icon || this.node.params[0];
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

  // pullContent() {
  //   return interpolateAttribute(this, 'pull', ['fa-pull-', '$']);
  // }



  rotateContent() {
    return interpolateAttribute(this, 'rotate', ['fa-rotate-', '$']);
  }

  flipContent() {
    return interpolateAttribute(this, 'flip', ['fa-flip-', '$']);
  }

  styleContent() {
    if (this.attrs.color) {
      if (isDynamic(this.attrs.color)) {
        return buildConcatIfPresent(this.attrs.color, ['color:', this.attrs.color]);
      } else {
        return `color:${this.attrs.color.value}`;
      }
    }
  }

  stackContent() {
    if (this.attrs.stack) {
      if (isDynamic(this.attrs.stack)) {
        return buildConcatIfPresent(this.attrs.stack, ['fa-stack-', this.attrs.stack, 'x']);
      } else if (this.attrs.stack.type === 'NumericLiteral') {
        return `fa-stack-${this.attrs.stack.value}x`;
      } else if (isNaN(parseInt(this.attrs.stack.value), 10)) {
        return `fa-stack-${this.attrs.stack.value}`;
      } else {
        return `fa-stack-${this.attrs.stack.value}x`;
      }
    } else if (this.options.stack) {
      return `fa-stack-${this.options.stack}x`;
    }
  }
}
