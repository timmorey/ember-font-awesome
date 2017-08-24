/* eslint-env node */
'use strict';

var chalk = require('chalk');
var fs = require('fs');
var path = require('path');
var Funnel = require('broccoli-funnel');
var faPath = path.dirname(require.resolve('font-awesome/package.json'));
var astTransform = require('./lib/ast-transform');
var glimmerSyntax = require('@glimmer/syntax');
let readdirRecursive = require('fs-readdir-recursive');
var Plugin = require('broccoli-plugin');
var path = require('path');

// Create a subclass MyPlugin derived from Plugin
FindUsedIcons.prototype = Object.create(Plugin.prototype);
FindUsedIcons.prototype.constructor = FindUsedIcons;
function FindUsedIcons(inputNodes, options) {
  options = options || {};
  Plugin.call(this, inputNodes, {
    annotation: options.annotation || 'FindUsedIcons'
  });
  this.options = options;
}

FindUsedIcons.prototype.build = function() {
  let options = this.options;
  this.inputPaths.forEach(function(inputPath) {
    let filePaths = readdirRecursive(inputPath);
    filePaths.forEach(function(filePath) {
      let usedIcons = options.usedFaIcons[filePath] = new Set();
      let content = fs.readFileSync(path.join(inputPath, filePath), 'utf8');
      let ast = glimmerSyntax.preprocess(content);
      glimmerSyntax.traverse(ast, {
        MustacheStatement(node) {
          if (node.path.original === 'fa-icon') {
            let iconValue = node.params[0];
            if (!iconValue) {
              let pair = node.hash.pairs.find(pair => pair.key === 'icon');
              if (pair) {
                iconValue = pair.value;
              }
            }
            if (iconValue.type === 'StringLiteral') {
              usedIcons.add(iconValue.value);
            }
          }
        }
      });
    });
  });
};



module.exports = {
  name: 'ember-font-awesome',

  setupPreprocessorRegistry(type, registry) {
    registry.add('htmlbars-ast-plugin', {
      name: 'font-awesome-static-transform',
      plugin: astTransform,
      baseDir() {
        return __dirname;
      }
    });
  },

  preprocessTree(type, tree) {
    if (type === 'template') {
      return new FindUsedIcons([tree], { usedFaIcons: this.usedFaIcons });
    }
    return tree;
  },

  treeForVendor: function() {
    // Get configured fontFormats
    let fontFormats = this.hostBuildOptions.fontFormats || ['eot', 'svg', 'ttf', 'woff', 'woff2', 'otf'];
    let fontFormatsString = fontFormats.join(',');
    // Define fontFormatPattern
    let fontFormatPattern;
    if (fontFormats.length > 1) {
      fontFormatPattern = `*.{${fontFormatsString}}`;
    } else {
      fontFormatPattern = `*.${fontFormatsString}`;
    }
    // Funnel required font types
    return new Funnel(faPath, {
      destDir: 'font-awesome',
      include: ['css/*', `fonts/${fontFormatPattern}`]
    });
  },

  postBuild() {
    let usedIcons = Array.from(Object.values(this.usedFaIcons).reduce((acum, set)=> new Set([...acum, ...set])));
    console.log(`The app uses ${usedIcons.length} icons`);
  },

  included: function(app, parentAddon) {
    this.usedFaIcons = {};
    // Quick fix for add-on nesting
    // https://github.com/aexmachina/ember-cli-sass/blob/v5.3.0/index.js#L73-L75
    // see: https://github.com/ember-cli/ember-cli/issues/3718
    while (typeof app.import !== 'function' && (app.app || app.parent)) {
      app = app.app || app.parent;
    }

    // if app.import and parentAddon are blank, we're probably being consumed by an in-repo-addon
    // or engine, for which the "bust through" technique above does not work.
    if (typeof app.import !== 'function' && !parentAddon) {
      if (app.registry && app.registry.app) {
        app = app.registry.app;
      }
    }

    if (!parentAddon && typeof app.import !== 'function') {
      throw new Error('ember-font-awesome is being used within another addon or engine and is' +
        ' having trouble registering itself to the parent application.');
    }

    // https://github.com/ember-cli/ember-cli/issues/3718#issuecomment-88122543
    this._super.included.call(this, app);

    // Per the ember-cli documentation
    // http://ember-cli.com/extending/#broccoli-build-options-for-in-repo-addons
    var target = (parentAddon || app);
    target.options = target.options || {}; // Ensures options exists for Scss/Less below
    var options = target.options['ember-font-awesome'] || {};

    this.hostBuildOptions = options;

    var scssPath = path.join(faPath, 'scss');
    var lessPath = path.join(faPath, 'less');
    var cssPath = 'vendor/font-awesome/css';
    var fontsPath = 'vendor/font-awesome/fonts';
    var absoluteFontsPath = path.join(faPath, 'fonts');

    // Ensure the font-awesome path is added to the ember-cli-sass addon options
    // (Taking a cue from the Babel options above)
    if (options.useScss) {
      target.options.sassOptions = target.options.sassOptions || {};
      target.options.sassOptions.includePaths = target.options.sassOptions.includePaths || [];
      if (target.options.sassOptions.includePaths.indexOf(scssPath) === -1) {
        target.options.sassOptions.includePaths.push(scssPath);
      }
    }

    // Ensure the font-awesome path is added to the ember-cli-less addon options
    // (Taking a cue from the Babel options above)
    if (options.useLess) {
      target.options.lessOptions = target.options.lessOptions || {};
      target.options.lessOptions.paths = target.options.lessOptions.paths || [];
      if (target.options.lessOptions.paths.indexOf(lessPath) === -1) {
        target.options.lessOptions.paths.push(lessPath);
      }
    }

    // Early out if no assets should be imported
    if ('includeFontAwesomeAssets' in options && !options.includeFontAwesomeAssets) {
      return;
    }

    // Import the css when Sass and Less are NOT used
    if (!options.useScss && !options.useLess) {
      target.import({
        development: path.join(cssPath, 'font-awesome.css'),
        production: path.join(cssPath, 'font-awesome.min.css')
      });
    }

    // Import all files in the fonts folder when option not defined or enabled
    if (!('includeFontFiles' in options) || options.includeFontFiles) {
      // Get all of the font files
      var fontsToImport = fs.readdirSync(absoluteFontsPath);
      var filesInFonts  = []; // Bucket for filenames already in the fonts folder
      var fontsSkipped  = []; // Bucket for fonts not imported because they already have been

      // Find files already imported into the fonts folder
      var fontsFolderPath = options.fontsOutput ? options.fontsOutput : '/fonts';
      target.otherAssetPaths.forEach(function(asset){
        if (asset.dest && asset.dest.indexOf(fontsFolderPath) !== -1) {
          filesInFonts.push(asset.file);
        }
      });

      // Attempt to import each font, if not already imported
      fontsToImport.forEach(function(fontFilename){
        if (filesInFonts.indexOf(fontFilename) > -1) {
          fontsSkipped.push(fontFilename);
        } else {
          target.import(
            path.join(fontsPath, fontFilename),
            { destDir: fontsFolderPath }
          );
        }
      });

      // Fonts that had already been imported, so we skipped..
      if (fontsSkipped.length) {
        this.ui.writeLine(chalk.red(
          this.name + ': Fonts already imported into the "/fonts" folder [' + fontsSkipped.join(', ') +
          '] by another addon or in your ember-cli-build.js, disable the import ' +
          'from other locations or disable the Font Awesome import by setting ' +
          '`includeFontFiles:false` for the "' + this.name + '" options in your ember-cli-build.js'
        ));
      }
    }
  }
};
