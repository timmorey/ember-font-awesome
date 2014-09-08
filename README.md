# ember-cli-font-awesome

An ember-cli addon for using Font Awesome icons in Ember applications.

Basically this addon does the following:

* Register a Handlebars helper for rendering Font Awesome icon markup.
* Import FontAwesome CSS and fonts into your app. (This can be disabled if necessary, see below.)

## Install

```
npm install --save-dev ember-cli-font-awesome
```

This addon has been developed and tested against ember-cli 0.0.44 and uses Font Awesome 4.2.

## Basic usage

In your Handlebars templates:

```
{{fa-icon "camera"}}
```

If you prefer, you can use the `fa-` prefix in the icon name.

```
{{!-- Equivalent --}}
{{fa-icon "fa-camera"}}
{{fa-icon "camera"}}
```

[Complete list of Font Awesome icons](http://fortawesome.github.io/Font-Awesome/icons/)

You can also bind the icon name to a controller or model property:

```
{{fa-icon iconName}}
{{fa-icon menu.copyIcon}}
```

## Options

The [Font Awesome examples](http://fortawesome.github.io/Font-Awesome/examples/) illustrate the various options and their effects. It should be obvious how these options map to `fa-icon` options.

Different icon sizes:

```
{{fa-icon "star"}}
{{fa-icon "star" lg=true}}
{{fa-icon "star" x=2}}
{{fa-icon "star" x=3}}
{{fa-icon "star" x=4}}
{{fa-icon "star" x=5}}
```

Rotate:

```
{{fa-icon "camera" rotate=90}}
{{fa-icon "camera" rotate=180}}
{{fa-icon "camera" rotate=270}}
```

Flip:

```
{{fa-icon "bicycle" flip="horizontal"}}
{{fa-icon "car" flip="vertical"}}
```

Spin:

```
{{!-- using a boolean literal --}}
{{fa-icon "refresh" spin=true}}
{{!-- or a property --}}
{{fa-icon "refresh" spin=isLoading}}
```

Coming soon, support for:

* List icons
* Fixed width icons
* Bordered and pulled icons.

## How do I prevent the addon from including Font Awesome CSS and fonts?

Pass the relevant option to the `EmberApp` constructor in your application's `Brocfile.js`:

```
var app = new EmberApp({
  emberCliFontAwesome: { includeFontAwesomeAssets: false }
});
```

You can then manage the Font Awesome dependency yourself.

Managing Font Awesome separately might be the more practical way of doing things. This addon includes Font Awesome by default simply to give developers a better out-of-the-box experience.

## License

Public Domain
