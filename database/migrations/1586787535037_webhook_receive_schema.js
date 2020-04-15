'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class WebhookReceiveSchema extends Schema {
	up() {
		this.create('webhook_receives', table => {
			table.increments();
			table
				.integer('webhook_id')
				.unsigned()
				.references('id')
				.inTable('webhooks');
			table.text('request_headers', 'longtext');
			table.text('request_body', 'longtext');
			table.integer('reply_code', 80);
			table.text('reply_body', 'longtext');
			table.timestamps();
		});
	}

	down() {
		this.drop('webhook_receives');
	}
}

module.exports = WebhookReceiveSchema;
