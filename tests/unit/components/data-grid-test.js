import Paginator from 'ember-railio-grid/utils/paginator';
import Sorter from 'ember-railio-grid/utils/sorter';
import { moduleForComponent, test } from 'ember-qunit';

moduleForComponent('data-grid', 'Unit | Component | data-grid', {
  unit: true
});

test('creates a default paginator with content', function(assert) {
  const dataGrid = this.subject({
    content: [1, 2, 3, 4],
    page: 1
  });

  assert.notEqual(dataGrid.get('paginator'), null);
  assert.ok(dataGrid.get('paginator') instanceof Paginator);
});

test('assigns attributes to paginator', function(assert) {
  const dataGrid = this.subject({
    content:   [1, 2, 3, 4],
    paginator: Paginator.create(),
    page:      2,
    pageSize:  2
  });

  assert.equal(dataGrid.get('paginator.page'), 2);
  assert.equal(dataGrid.get('paginator.pageSize'), 2);
  assert.deepEqual(dataGrid.get('paginator.content'), [1, 2, 3, 4]);
});

test('creates a default sorter with content', function(assert) {
  const dataGrid = this.subject({
    content: [1, 2, 3, 4]
  });

  assert.notEqual(dataGrid.get('sorter'), null);
  assert.ok(dataGrid.get('sorter') instanceof Sorter);
  assert.deepEqual(dataGrid.get('sorter.content'), [1, 2, 3, 4]);
});
