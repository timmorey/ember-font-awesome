/* jshint node: true */
'use strict';

module.exports = {

  name: 'ember-cli-font-awesome',

  included: function(app, parentAddon) {
    var target = (parentAddon || app);
    var options = target.options.emberCliFontAwesome || { includeFontAwesomeAssets: true };
    if (options.includeFontAwesomeAssets) {
      target.import(target.bowerDirectory + "/font-awesome/css/font-awesome.css");
      target.import(target.bowerDirectory + "/font-awesome/fonts/fontawesome-webfont.eot", { destDir: "fonts" });
      target.import(target.bowerDirectory + "/font-awesome/fonts/fontawesome-webfont.svg", { destDir: "fonts" });
      target.import(target.bowerDirectory + "/font-awesome/fonts/fontawesome-webfont.ttf", { destDir: "fonts" });
      target.import(target.bowerDirectory + "/font-awesome/fonts/fontawesome-webfont.woff", { destDir: "fonts" });
      target.import(target.bowerDirectory + "/font-awesome/fonts/fontawesome-webfont.woff2", { destDir: "fonts" });
      target.import(target.bowerDirectory + "/font-awesome/fonts/FontAwesome.otf", { destDir: "fonts" });
    }
  }
  
};
