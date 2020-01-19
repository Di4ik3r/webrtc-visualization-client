import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Adapter | users', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function(assert) {
    let adapter = this.owner.lookup('adapter:users');
    assert.ok(adapter);
  });
});
