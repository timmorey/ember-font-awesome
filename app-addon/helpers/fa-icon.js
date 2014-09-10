import Ember from 'ember';

/**
 * Handlebars helper for generating HTML that renders a FontAwesome icon.
 *
 * @param  {String} name    The icon name. Note that the `fa-` prefix is optional.
 *                          For example, you can pass in either `fa-camera` or just `camera`.
 * @param  {Object} options Options passed to helper.
 * @return {Ember.Handlebars.SafeString} The HTML markup.
 */
var faIcon = function(name, options) {
  var params = options.hash,
    classNames = [];

  classNames.push("fa");
  if (name.match(/^fa\-.*/)) {
    classNames.push(name);
  } else {
    classNames.push("fa-" + name);
  }
  if (params.spin) {
    classNames.push("fa-spin");
  }
  if (params.flip) {
    classNames.push("fa-flip-" + params.flip);
  }
  if (params.rotate) {
    classNames.push("fa-rotate-" + params.rotate);
  }
  if (params.lg) {
    classNames.push("fa-lg");
  }
  if (params.x) {
    classNames.push("fa-" + params.x + "x");
  }
  if (params.fixedWidth) {
    classNames.push("fa-fw");
  }
  if (params.listItem) {
    classNames.push("fa-li");
  }
  var html = "<i class='" + classNames.join(" ") + "'></i>";
  return new Ember.Handlebars.SafeString(html);
};

export {
  faIcon
};

export default Ember.Handlebars.makeBoundHelper(faIcon);
