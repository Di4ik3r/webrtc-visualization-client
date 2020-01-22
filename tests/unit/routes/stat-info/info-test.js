import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | stat-info/info', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:stat-info/info');
    assert.ok(route);
  });
});
