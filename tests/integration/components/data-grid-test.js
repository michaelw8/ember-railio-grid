import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';
import wait from 'ember-test-helpers/wait';
import { moduleForComponent, test } from 'ember-qunit';

const { run } = Ember;

let Ben    = { id: 1, name: 'Ben',   type: 'dog' };
let Alex   = { id: 2, name: 'Alex',   type: 'dog' };
let Chris  = { id: 3, name: 'Chris',   type: 'cat' };
let Edward = { id: 4, name: 'Edward', type: 'dog' };
let Dwight = { id: 5, name: 'Dwight', type: 'cat' };

let properties = [
  { key: 'id', label: 'nr' },
  { key: 'name', label: 'name' },
  { key: 'type', label: 'species' }
];

function buildSmallList() {
  return [Ben, Alex, Chris];
}

moduleForComponent('data-grid', 'Integration | Component | {{data-grid}}', {
  integration: true,
  beforeEach() {
    this.set('properties', properties);
  }
});

test('renders the table with given content', function(assert) {
  this.set('list', buildSmallList());

  this.render(hbs`{{data-grid content=list properties=properties}}`);

  let $table = this.$('.data-grid table');
  let $rows  = $table.find('tbody tr');

  assert.equal($table.length, 1, 'renders table');
  assert.equal($rows.length, 3, 'renders rows for each item');
});

test('renders with display options', function(assert) {
  this.set('list', buildSmallList());
  this.set('showHeader', true);

  this.render(hbs`{{data-grid content=list
                              properties=properties
                              showHeader=showHeader
                              width=800}}`);

  let $table = this.$('.data-grid table');
  let $header  = $table.find('thead');

  assert.equal($header.length, 1, 'shows header by default');
  assert.equal($table.outerWidth(), 800, 'renders with given width');

  this.set('showHeader', false);

  $header = $table.find('thead');
  assert.equal($header.length, 0, 'hides header on showHeader=false');
});

test('shows label and value for properties array with objects', function(assert) {
  this.set('list', buildSmallList());
  this.render(hbs`{{data-grid content=list
                              properties=properties}}`);

  let $table       = this.$('.data-grid table');
  let $headerCols  = $table.find('thead tr').eq(0).find('th');
  let $contentCols = $table.find('tbody tr').eq(0).find('td');

  assert.equal($headerCols[0].innerText.toUpperCase().trim(), 'NR');
  assert.equal($headerCols[1].innerText.toUpperCase().trim(), 'NAME');
  assert.equal($headerCols[2].innerText.toUpperCase().trim(), 'SPECIES');

  assert.equal($contentCols[0].innerText, '1');
  assert.equal($contentCols[1].innerText, 'Ben');
  assert.equal($contentCols[2].innerText, 'dog');
});

test('shows given topPaginator', function(assert) {
  let paginator = 'page-picker-paginator';
  this.set('list', buildSmallList());
  this.set('topPaginator', null);

  this.render(hbs`{{data-grid content=list
                              properties=properties
                              topPaginator=topPaginator}}`);

  let $topPaginator = this.$('.paginator--top');
  assert.equal($topPaginator.length, 0, 'no top paginator by default');

  this.set('topPaginator', paginator);

  $topPaginator = this.$('.paginator--top');
  assert.ok($topPaginator.hasClass(paginator),
            'shows given top paginator');
});

test('shows given bottomPaginator', function(assert) {
  let paginator = 'page-picker-paginator';
  this.set('list', buildSmallList());
  this.set('bottomPaginator', null);

  this.render(hbs`{{data-grid content=list
                              properties=properties
                              bottomPaginator=bottomPaginator}}`);

  let $bottomPaginator = this.$('.paginator--bottom');
  assert.equal($bottomPaginator.length, 0, 'no bottom paginator by default');

  this.set('bottomPaginator', paginator);

  $bottomPaginator = this.$('.paginator--bottom');
  assert.ok($bottomPaginator.hasClass(paginator),
            'shows given bottom paginator');
});

test('sort on clicking header', function(assert) {
  this.set('list', [Ben, Alex, Chris, Edward, Dwight]);
  this.render(hbs`{{data-grid content=list
                              properties=properties}}`);

  let $table = this.$('.data-grid table');

  run(() => {
    $table.find('thead tr th').eq(1).find('span').eq(0).trigger('click');
  });

  let $rows = $table.find('tbody tr');
  assert.equal($rows.eq(0).find('td')[1].innerText, 'Alex');
  assert.equal($rows.eq(1).find('td')[1].innerText, 'Ben');
  assert.equal($rows.eq(2).find('td')[1].innerText, 'Chris');
  assert.equal($rows.eq(3).find('td')[1].innerText, 'Dwight');
  assert.equal($rows.eq(4).find('td')[1].innerText, 'Edward');

  run(() => {
    $table.find('thead tr th').eq(1).find('span').eq(0).trigger('click');
  });

  $rows = $table.find('tbody tr');
  assert.equal($rows.eq(0).find('td')[1].innerText, 'Edward');
  assert.equal($rows.eq(1).find('td')[1].innerText, 'Dwight');
  assert.equal($rows.eq(2).find('td')[1].innerText, 'Chris');
  assert.equal($rows.eq(3).find('td')[1].innerText, 'Ben');
  assert.equal($rows.eq(4).find('td')[1].innerText, 'Alex');
});

test('shows filter bar', function(assert) {
  this.set('filterEnabled', false);

  this.render(hbs`{{data-grid properties=properties
                              filterEnabled=filterEnabled}}`);

  let $filterBar = this.$('.filter-bar');
  assert.equal($filterBar.length, 0, 'no filterBar by default');

  this.set('filterEnabled', true);

  $filterBar = this.$('.filter-bar');
  assert.equal($filterBar.length, 1, 'show filterBar');
});

test('shows checkboxes only when actionList passed', function(assert) {
  let list = [
    { id: 1, name: 'Ben',   type: 'dog' },
    { id: 2, name: 'Alex',  type: 'dog' },
    { id: 3, name: 'Chris', type: 'cat' }
  ];

  this.set('list', list);

  this.render(hbs`{{data-grid content=list
                              actionList=listActions
                              properties=properties}}`);

  let $table = this.$('.data-grid table');

  let $checkAll = $table.find('thead tr th').eq(0).find('input[type="checkbox"]');
  let $checkRow = $table.find('tbody tr td').eq(0).find('input[type="checkbox"]');

  assert.equal($checkAll.length, 0, 'No checkAll when no actions passed');
  assert.equal($checkRow.length, 0, 'No checkboxes when no actions passed');

  this.set('listActions', [
    {
      label: 'edit',
      action(objects) { assert.deepEqual(objects, list); }
    }
  ]);

  $checkAll = $table.find('thead tr th').eq(0).find('input[type="checkbox"]');
  $checkRow = $table.find('tbody tr td').eq(0).find('input[type="checkbox"]');

  assert.equal($checkAll.length, 1, 'CheckAll when actions passed');
  assert.equal($checkRow.length, 1, 'Checkboxes when actions passed');
});

test('select items', function(assert) {
  this.set('list', [ Ben, Alex, Chris ]);

  this.set('selection', Ember.A());

  this.set('listActions', [ { label: 'edit',   action() { } } ]);

  this.render(hbs`{{data-grid content=list
                              _selection=selection
                              actionList=listActions
                              properties=properties}}`);

  let $checkboxes = this.$('.data-grid table tbody input[type="checkbox"]');

  let $checkRow1 = $checkboxes.eq(0);
  let $checkRow2 = $checkboxes.eq(1);

  return wait()
    .then(() => {
      $checkRow1.trigger('click');
      return wait();
    })
    .then(() => {
      assert.equal($checkRow1[0].checked, true, 'item selected');
      assert.equal(this.get('selection.length'), 1, 'item added to selection');
      return wait();
    })
    .then(() => {
      $checkRow2.trigger('click');
      return wait();
    })
    .then(() => {
      assert.equal($checkRow2[0].checked, true, 'item selected');
      assert.equal(this.get('selection.length'), 2, 'item added to selection');
      return wait();
    });
});

test('select and deselect all items', function(assert) {
  this.set('list', [ Ben, Alex, Chris ]);

  this.set('listActions', [ { label: 'edit',   action() { } } ]);

  this.render(hbs`{{data-grid content=list
                              actionList=listActions
                              properties=properties}}`);

  let $checkbox = this.$('.data-grid table thead input[type="checkbox"]').eq(0);

  return wait()
    .then(() => {
      $checkbox.trigger('click');
      return wait();
    })
    .then(() => {
      assert.equal(this.$(".data-grid__selection:contains('3 selected')").length, 1,
                   'all items selected');
      return wait();
    })
    .then(() => {
      $checkbox.trigger('click');
      return wait();
    })
    .then(() => {
      assert.equal(this.$('.data-grid__selection').length, 0, 'none items selected');
      return wait();
    });
});

test('shows actions for selected items', function(assert) {
  assert.expect(3);

  this.set('list', [ Alex, Ben, Chris ]);

  this.set('listActions', [
    {
      label: 'edit',
      action(objects) { assert.deepEqual(objects, [Ben, Chris]); }
    }
  ]);

  this.render(hbs`{{data-grid content=list
                              actionList=listActions
                              properties=properties}}`);

  let $actions = this.$('.data-grid__actions');
  assert.equal($actions.length, 0, 'do not show actions on default');

  let $checkboxes = this.$('.data-grid table tbody input[type="checkbox"]');

  run(() => {
    $checkboxes.eq(1).trigger('click');
    $checkboxes.eq(2).trigger('click');
  });

  $actions = this.$('.data-grid__actions');
  assert.equal($actions.length, 1, 'show actions when items selected');

  $actions.find('.data-grid__actions__action').eq(0).trigger('click');
});

test('selection updates on updating or deleting items', function(assert) {
  this.set('list', Ember.A([ Ben, Alex, Chris ]));

  this.set('listActions', [ { label: 'edit',   action() { } } ]);

  this.render(hbs`{{data-grid content=list
                              actionList=listActions
                              properties=properties}}`);

  let $checkbox = this.$('.data-grid table thead input[type="checkbox"]').eq(0);

  return wait()
    .then(() => {
      $checkbox.trigger('click');
      return wait();
    })
    .then(() => {
      assert.equal(this.$(".data-grid__selection:contains('3 selected')").length, 1,
                   'all items selected');
      return wait();
    })
    .then(() => {
      this.get('list').removeAt(1);
      return wait();
    })
    .then(() => {
      assert.equal(this.$(".data-grid__selection:contains('2 selected')").length, 1,
                   'selection updated on remove object');
      return wait();
    });
});

test('double clicking item calls doubleClickAction with item', function(assert) {
  assert.expect(1);

  let Alex = { id: 1, name: 'Alex' };
  let Bart = { id: 2, name: 'Bart' };

  this.set('list', [Alex, Bart]);

  this.set('doubleClickAction', function(object) {
    assert.deepEqual(object, Bart, 'calls with clicked item');
  });

  this.render(hbs`{{data-grid content=list
                              properties=properties
                              doubleClickAction=doubleClickAction}}`);

  this.$('.data-grid__row').eq(1).trigger('dblclick');
});

test('show sorting order', function(assert) {
  this.set('list', [Ben, Alex, Chris, Edward, Dwight]);
  this.render(hbs`{{data-grid content=list
                              properties=properties}}`);

  let $table = this.$('.data-grid table');

  run(() => {
    $table.find('thead tr th').eq(1).find('span').eq(0).trigger('click');
    $table.find('thead tr th').eq(0).find('span').eq(0).trigger('click');
  });

  let $order1 = $table.find('thead tr th').eq(1)
                       .find('.data-grid__header__sorting-order')[0];
  let $order2 = $table.find('thead tr th').eq(0)
                       .find('.data-grid__header__sorting-order')[0];

  assert.equal($order1.innerText, '1', 'sorting order 1');
  assert.equal($order2.innerText, '2', 'sorting order 2');
});
