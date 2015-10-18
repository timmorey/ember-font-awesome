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
        'ember': '1.13.10'
      }
    },
    {
      name: 'ember-2.0.X',
      dependencies: {
        'ember': '2.0.2'
      }
    },
    {
      name: 'ember-release',
      dependencies: {
        'ember': 'components/ember#release'
      },
      resolutions: {
        'ember': 'release'
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
