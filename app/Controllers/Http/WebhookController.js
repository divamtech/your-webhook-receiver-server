'use strict';

const Webhook = use('App/Models/Webhook');
const WebhookReceive = use('App/Models/WebhookReceive');

const webhookHost = `${process.env.SELF_HOST || 'http://localhost:3535'}/webhooks/`;

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
			return view.render('webhook_cru', { webhook, isUpdate });
		} catch (err) {
			return response.route('webhooks');
		}
	}

	async createUpdateOne({ params, request, response }) {
		let webhook = null;
		const { isUpdate, id } = this._checkID(params);
		const data = request.only(['name', 'slug', 'auth', 'auth_key1', 'auth_key2', 'is_active']);
		data.is_active = !!data.is_active;
		if (isUpdate) {
			webhook = await Webhook.find(id);
			webhook.merge(data);
			await webhook.save();
		} else {
			webhook = await Webhook.create(data);
		}
		return response.route('webhooks');
	}

	async logs({ params, response, view }) {
		const { valid, id } = this._checkID(params);
		if (valid) {
			const webhook = await Webhook.find(id);
			const logs = await WebhookReceive.query()
				.where('webhook_id', id)
				.orderBy('id', 'desc')
				.fetch();
			return view.render('logs', { logs: logs.toJSON(), webhook });
		}
		return response.route('webhooks');
	}

	async allLogs({ view }) {
		const logs = await WebhookReceive.query()
			.orderBy('id', 'desc')
			.limit(30)
			.fetch();
		return view.render('logs', { logs: logs.toJSON(), webhook: { id: 0, name: 'All webhooks' } });
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

	async receiver({ params, request, response }) {
		let replyCode = 200;
		let replyBody = { message: 'Yupiee! I got the data' };
		let webhookID = null;
		try {
			const slug = params.slug;
			const webhook = await Webhook.findBy('slug', slug);
			webhookID = webhook.id;
			if (!webhook.is_active) {
				replyCode = 423;
				replyBody = { message: 'webhooks has been disabled.' };
			}
		} catch (err) {
			replyCode = 404;
			replyBody = { message: 'webhooks not available' };
		}

		const data = {
			webhook_id: webhookID,
			request_headers: request.headers(),
			request_body: request.body,
			reply_code: replyCode,
			reply_body: replyBody
		};
		await WebhookReceive.create(data);

		return response.status(replyCode).json(replyBody);
	}

	_checkID(params) {
		if (params.id != 'new' && !isNaN(parseInt(params.id))) {
			return { valid: true, isUpdate: true, id: parseInt(params.id) };
		} else {
			return { valid: true, isUpdate: false, id: 0 };
		}
	}
}

module.exports = WebhookController;
