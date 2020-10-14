'use strict';

const Webhook = use('App/Models/Webhook');
const WebhookReceive = use('App/Models/WebhookReceive');
const httpCodes = require('./http_codes');

const webhookHost = `${process.env.SELF_HOST || 'http://localhost:3535'}/webhooks/`;
const FETCH_LIMIT = 30;

class WebhookController {
	async index({ view }) {
		const webhooks = await Webhook.all();
		return view.render('home', { webhooks: webhooks.toJSON(), webhookHost });
	}

	async getOne({ params, view, response }) {
		try {
			let webhook = Webhook.new();
			const { isUpdate, id } = this._checkID(params);
			if (isUpdate) {
				webhook = await Webhook.find(id);
			}
			return view.render('webhook_cru', { webhook, isUpdate, httpCodes });
		} catch (err) {
			return response.route('webhooks');
		}
	}

	async createUpdateOne({ params, request, response }) {
		let webhook = null;
		const { isUpdate, id } = this._checkID(params);
		const data = request.only([
			'name',
			'slug',
			'auth',
			'auth_key1',
			'auth_key2',
			'is_active',
			'default_reply_code'
		]);
		data.is_active = !!data.is_active;
		if (!data.is_active) {
			data.default_reply_code = 423;
		} else if (!this._codeExist(data.default_reply_code)) {
			data.default_reply_code = 200;
		}
		if (isUpdate) {
			webhook = await Webhook.find(id);
			webhook.merge(data);
			await webhook.save();
		} else {
			webhook = await Webhook.create(data);
		}
		return response.route('webhooks');
	}

	async updateWebhookReplyCode({ params, response }) {
		try {
			const { id, code } = params;
			if (this._codeExist(code)) {
				const webhook = await Webhook.find(id);
				if (!webhook.is_active) {
					return response.status(400).send('webhook is not active. Edit webhook and then activate it first');
				}
				webhook.default_reply_code = code;
				await webhook.save();
				return response.send('done');
			}
		} catch (err) {}
		return response.status(400).send('something went wrong.');
	}

	async logs({ params, request, response, view }) {
		const { valid, id } = this._checkID(params);
		if (valid) {
			const webhook = await Webhook.find(id);
			const query = request.get();
			let logs = [];
			if (query.list == 'all') {
				logs = await WebhookReceive.query()
					.where('webhook_id', id)
					.orderBy('id', 'desc')
					.fetch();
			} else {
				logs = await WebhookReceive.query()
					.where('webhook_id', id)
					.orderBy('id', 'desc')
					.limit(FETCH_LIMIT)
					.fetch();
			}
			return view.render('logs', { logs: logs.toJSON(), webhook, httpCodes });
		}
		return response.route('webhooks');
	}

	async allLogs({ view, request }) {
		const query = request.get();
		let logs = [];
		if (query.list == 'all') {
			logs = await WebhookReceive.query()
				.orderBy('id', 'desc')
				.fetch();
		} else {
			logs = await WebhookReceive.query()
				.orderBy('id', 'desc')
				.limit(FETCH_LIMIT)
				.fetch();
		}
		return view.render('logs', { logs: logs.toJSON() });
	}

	async deleteLog({ params, request, response }) {
		const { valid, id } = this._checkID(params);
		if (valid) {
			try {
				const webhookRec = await WebhookReceive.find(id);
				await webhookRec.delete();
			} catch (err) {}
		}
		const query = request.get();
		return response.route(query.path || 'webhooks');
	}

	async deleteAllLogs({ response }) {
		await WebhookReceive.query().delete();
		return response.route('webhooks');
	}

	async deleteAllLogsOfOne({ params, response }) {
		const { valid, id } = this._checkID(params);
		if (valid) {
			await WebhookReceive.query()
				.where('webhook_id', id)
				.delete();
		}
		return response.route('webhooks');
	}

	_checkID(params) {
		if (params.id != 'new' && !isNaN(parseInt(params.id))) {
			return { valid: true, isUpdate: true, id: parseInt(params.id) };
		} else {
			return { valid: true, isUpdate: false, id: 0 };
		}
	}

	_codeExist(code) {
		if (isNaN(parseInt(code))) {
			return false;
		}
		return Object.keys(httpCodes).includes(code);
	}
}

module.exports = WebhookController;
