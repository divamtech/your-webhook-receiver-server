import Webhooks from 'App/Models/Webhooks';
import { https_codes } from './http_codes';
import WebhookReceive from "App/Models/WebhookReceive";
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

const FETCH_LIMIT = 30;
const webhookHost = `${process.env.SELF_HOST || 'http://localhost:3535'}/webhooks/`;

export default class WebhookController {


  async index({ view }: HttpContextContract) {
    const webhooks = await Webhooks.query().orderBy('name', 'asc');
    return view.render('home', { webhooks, webhookHost });
  }

  async getOne({ params, view, response }) {
    try {
      let webhook: Webhooks | null = null;
      const { isUpdate, id } = this._checkID(params);
      if (isUpdate) {
        webhook = await Webhooks.find(id);
      }
      const default_reply_body = `{\n\t"code": $statusCode,\n\t"message": "$statusMessage",\n\t"method": "$requestMethod"\n}`;
      return view.render('webhook_crud', { webhook, isUpdate, https_codes, default_reply_body });
    } catch (err) {
      console.log(err);
      return response.route('webhooks');
    }
  }

  async createUpdateOne({ params, request, response, session }) {
    let webhook: Webhooks | null = null;
    const { isUpdate, id } = this._checkID(params);
    const data = request.only([
      'name',
      'slug',
      'auth',
      'auth_key1',
      'auth_key2',
      'is_active',
      'default_reply_code',
      'reply_body',
    ]);
    data.slug = data.slug.replaceAll('/', '_').replaceAll(' ', '_');

    try {
      let testReplyBody = data.reply_body
        .replaceAll('$statusCode', 200)
        .replaceAll('$statusMessage', 'something')
        .replaceAll('$requestMethod', 'GET');
      testReplyBody = JSON.parse(testReplyBody);

      data.is_active = !!data.is_active;
      if (!data.is_active) {
        data.default_reply_code = 423;
      } else if (!this._codeExist(data.default_reply_code)) {
        data.default_reply_code = 200;
      }
      if (isUpdate) {
        webhook = await Webhooks.find(id);
        if (webhook) {
          webhook.merge(data);
          await webhook.save();
        }
      } else {
        webhook = await Webhooks.create(data);
      }

      return response.redirect().toRoute('webhooks');
    } catch (err) {
      console.log(err);
      session.flash({ notification_reply_body: 'Invalid JSON' });
      return response.redirect(request.url());
    }
  }

  async updateWebhookReplyCode({ params, response }) {
    try {
      const { id, code } = params;
      if (this._codeExist(code)) {
        const webhook: Webhooks | null = await Webhooks.find(id);
        if (webhook) {
          if (!webhook.is_active) {
            return response.status(400).send('webhook is not active. Edit webhook and then activate it first');
          }
          webhook.default_reply_code = code;
          await webhook.save();
          return response.send('done');
        }
      }
    } catch (err) {
      console.log("Check error", err)
    }
    return response.status(400).send('something went wrong.');
  }

  async delete({ params, response }) {
    try {
      const webhook: Webhooks | null = await Webhooks.find(params.id);
      if (webhook) {
        await WebhookReceive.query().where('webhook_id', webhook.id).delete();
        await webhook.delete();
      }
    } catch (err) {
      console.log(err);
    }
    return response.redirect().toRoute('webhooks');
  }

  async logs({ params, request, response, view }) {
    const { valid, id } = this._checkID(params);
    if (valid) {
      const webhook = await Webhooks.find(id);
      const query = request.get();
      let logs: WebhookReceive[] | null = [];
      if (query.list == 'all') {
        logs = await WebhookReceive.query().where('webhook_id', id).orderBy('id', 'desc');
      } else {
        logs = await WebhookReceive.query().where('webhook_id', id).orderBy('id', 'desc').limit(FETCH_LIMIT);
      }
      return view.render('logs', { logs: logs, webhook, https_codes });
    }
    return response.redirect().toRoute('webhooks');
  }

  async allLogs({ view, request }) {
    const query = request.get();
    let logs: WebhookReceive[] | null = [];
    if (query.list == 'all') {
      logs = await WebhookReceive.query().orderBy('id', 'desc');
    } else {
      logs = await WebhookReceive.query().orderBy('id', 'desc').limit(FETCH_LIMIT);
    }
    return view.render('logs', { logs: logs });
  }

  async deleteLog({ params, request, response }) {
    const { valid, id } = this._checkID(params);
    if (valid) {
      try {
        const webhookRec: WebhookReceive | null = await WebhookReceive.find(id);
        if (webhookRec)
          await webhookRec.delete();
      } catch (err) {
        console.log(err);
      }
    }
    const query = request.get();
    return response.route(query.path || 'webhooks');
  }

  async deleteAllLogs({ response }) {
    await WebhookReceive.query().delete();
    return response.redirect().toRoute('webhooks');
  }

  async deleteAllLogsOfOne({ params, response }) {
    const { valid, id } = this._checkID(params);
    if (valid) {
      await WebhookReceive.query().where('webhook_id', id).delete();
    }

    return response.redirect().toRoute('webhooks');
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
    return Object.keys(https_codes).includes(code);
  }
}
