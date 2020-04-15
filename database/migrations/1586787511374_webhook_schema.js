'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class WebhookSchema extends Schema {
	up() {
		this.create('webhooks', table => {
			table.increments();
			table
				.string('name', 80)
				.notNullable()
				.unique();
			table
				.string('slug', 80)
				.notNullable()
				.unique();
			table.integer('total_hit_counts', 80).defaultTo(0);
			table.integer('running_hit_counts', 80).defaultTo(0);
			table.string('auth');
			table.string('auth_key1');
			table.string('auth_key2');
			table.bool('is_active');
			table.timestamps();
		});
	}

	down() {
		this.drop('webhooks');
	}
}

module.exports = WebhookSchema;
