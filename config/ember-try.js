module.exports = {
  scenarios: [
    {
      name: 'ember-1.11.X',
      dependencies: {
        'ember': '1.11.3'
      }
    },
    {
      name: 'ember-1.12.X',
      dependencies: {
        'ember': '1.12.1'
      }
    },
    {
      name: 'ember-1.13.X',
      dependencies: {
        'ember': '1.13.11'
      }
    },
    {
      name: 'ember-2.0.X',
      dependencies: {
        'ember': '2.0.2'
      }
    },
    {
      name: 'ember-2.1.X',
      dependencies: {
        'ember': '2.1.1'
      }
    },
    {
      name: 'ember-2.2.X',
      dependencies: {
        'ember': '2.2.0'
      }
    },
    {
      name: 'ember-beta',
      dependencies: {
        'ember': 'components/ember#beta'
      },
      resolutions: {
        'ember': 'beta'
      }
    },
    {
      name: 'ember-canary',
      dependencies: {
        'ember': 'components/ember#canary'
      },
      resolutions: {
        'ember': 'canary'
      }
    }
  ]
};
