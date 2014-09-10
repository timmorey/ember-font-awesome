# ember-cli-font-awesome

An ember-cli addon for using Font Awesome icons in Ember applications.

This addon:

* Registers a Handlebars helper for rendering Font Awesome icon markup.
* Imports FontAwesome CSS and fonts into your app. (This can be disabled if necessary, see below.)

## Install in ember-cli application

For the sake of clarity: this is an [ember-cli](http://www.ember-cli.com) addon, not a standalone module.

```
# In your application's directory:
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

List icons:

```
<ul class="fa-ul">
  <li>
    {{fa-icon "star" listItem=true}} Item
  </li>
</ul>
```

Fixed width icons:

```
<div class="list-group">
  <a class="list-group-item" href="#">
    {{fa-icon "home" fixedWidth=true}} Home
  </a>
  <a class="list-group-item" href="#">
    {{fa-icon "book" fixedWidth=true}} Library
  </a>
</div>
```

## How do I prevent the addon from including Font Awesome CSS and fonts?

Pass this option to the `EmberApp` constructor in your application's `Brocfile.js`:

```
var app = new EmberApp({
  emberCliFontAwesome: { includeFontAwesomeAssets: false }
});
```

You can then manage the Font Awesome dependency yourself.

Managing Font Awesome separately might be more practical. This addon includes Font Awesome by default simply to give developers a better out-of-the-box experience.

## License

Public Domain
