(function(t, yawp, fx) {

	t.moduledef('parent rest action', {
		testStart : function() {
			fx.reset();
		}
	});

	t.asyncTest("create", function(assert) {
		expect(1);

		var parent = {
			name : 'xpto'
		};

		yawp('/parents').create(parent).done(function(retrievedParent) {
			assert.equal(retrievedParent.name, 'xpto');
			t.start();
		});
	});

	t.asyncTest("create array", function(assert) {
		expect(3);

		var parents = [ {
			name : 'xpto1'
		}, {
			name : 'xpto2'
		} ];

		yawp('/parents').create(parents).done(function(retrievedParents) {
			assert.equal(retrievedParents.length, 2)
			assert.equal(retrievedParents[0].name, 'xpto1');
			assert.equal(retrievedParents[1].name, 'xpto2');
			t.start();
		});
	});

	t.asyncTest("update", function(assert) {
		expect(1);

		var parent = fx.parent('parent', {
			name : 'xpto'
		});

		parent.name = 'changed xpto';

		yawp.update(parent).done(function(retrievedParent) {
			assert.equal(retrievedParent.name, 'changed xpto');
			t.start();
		});
	});

	t.asyncTest("show", function(assert) {
		expect(1);

		var parent = fx.parent('parent', {
			name : 'xpto'
		});

		yawp(parent).fetch(function(retrievedParent) {
			assert.equal(retrievedParent.name, 'xpto');
			t.start();
		});

	});

	t.asyncTest("index", function(assert) {
		expect(3);

		fx.parent('parent1', {
			name : 'xpto1'
		});

		fx.parent('parent2', {
			name : 'xpto2'
		});

		var order = [ {
			p : 'name'
		} ];

		function eventually(parents) {
			return parents.length == 2 && parents[0].name == 'xpto1' && parents[1].name == 'xpto2';
		}

		function retry() {
			yawp('/parents').order(order).list(function(parents) {
				if (!eventually(parents)) {
					retry();
					return;
				}

				assert.equal(parents.length, 2);
				assert.equal(parents[0].name, 'xpto1');
				assert.equal(parents[1].name, 'xpto2');
				t.start();
			});
		}

		retry();
	});

	t.asyncTest("destroy", function(assert) {
		expect(2);

		var parent = fx.parent('parent', {
			name : 'xpto'
		});

		yawp.destroy(parent).done(function(retrievedId) {
			t.equal(parent.id, retrievedId);

		}).then(function() {
			yawp(parent).fetch().fail(function(error) {
				assert.equal(error.status, 404);
				t.start();
			});
		});
	});

})(QUnit, yawp, yawp.fixtures);