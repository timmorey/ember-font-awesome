import { faIcon } from '../../../helpers/fa-icon';
import { module, test } from 'qunit';

module('Unit | Helper | {{fa-icon}}');

test('it works as a function', function(assert) {
  var result = faIcon('credit-card');
  assert.equal(result, '<i class="fa fa-credit-card" aria-hidden="true"></i>');
});
