'use strict';

var path = require('path');
var fs = require('fs');
var ADDON_NAME = "ember-cli-font-awesome";

function EmberCliFontAwesome(project) {
  this.project = project;
  this.name = ADDON_NAME;
}

function unwatchedTree(dir) {
  return {
    read: function() {
      return dir;
    },
    cleanup: function() {
    }
  };
}

EmberCliFontAwesome.prototype.treeFor = function treeFor(name) {
  var treePath = path.join("node_modules", ADDON_NAME);
  if (name === "vendor") {
    // Map 'node_modules' to 'vendor', so that we can import Font Awesome assets later.
    treePath =  path.join(treePath, "node_modules");
  } else {
    // otherwise just append '-add-on';
    treePath = path.join(treePath, name + "-addon");
  }
  if (fs.existsSync(treePath)) {
    return unwatchedTree(treePath);
  }

};

EmberCliFontAwesome.prototype.included = function included(app) {
  this.app = app;
  var options = this.app.options.emberCliFontAwesome || { includeFontAwesomeAssets: true };
  if (options.includeFontAwesomeAssets) {
    app.import("vendor/font-awesome/css/font-awesome.css");
    app.import("vendor/font-awesome/fonts/fontawesome-webfont.eot", { destDir: "fonts" });
    app.import("vendor/font-awesome/fonts/fontawesome-webfont.svg", { destDir: "fonts" });
    app.import("vendor/font-awesome/fonts/fontawesome-webfont.ttf", { destDir: "fonts" });
    app.import("vendor/font-awesome/fonts/fontawesome-webfont.woff", { destDir: "fonts" });
    app.import("vendor/font-awesome/fonts/FontAwesome.otf", { destDir: "fonts" });
  }
};

module.exports = EmberCliFontAwesome;
