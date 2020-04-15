'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Webhook extends Model {
	static new() {
		return { id: 0, name: '', slug: '', auth: 'none', auth_key1: '', auth_key2: '' };
	}
}

module.exports = Webhook;
