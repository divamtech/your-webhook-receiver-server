'use strict';

const CryptoJS = require('crypto-js');

const Webhook = use('App/Models/Webhook');
const WebhookReceive = use('App/Models/WebhookReceive');
const httpCodes = require('./http_codes');

class WebhookReceiverController {
  async receiver({ params, request, response }) {
    try {
      let reply = httpCodes['200'];

      let webhookID = null;
      const slug = params.slug;
      const webhook = await Webhook.findBy('slug', slug);
      try {
        webhookID = webhook.id;
        if (!webhook.is_active) {
          reply = httpCodes['423'];
        } else if (!this._checkAuth(request, webhook)) {
          reply = httpCodes['401'];
        } else {
          reply = httpCodes['' + webhook.default_reply_code];
        }
      } catch (err) {
        reply = httpCodes['404'];
      }

      const headers = request.headers();
      headers.ywr_requested_webhook_slug = slug;
      headers.ywr_requested_webhook_url = request.originalUrl();
      headers.ywr_requested_http_method = request.method();
      reply.method = headers.ywr_requested_http_method;

      let reply_body = webhook.reply_body
        .replaceAll('$statusCode', reply.code)
        .replaceAll('$statusMessage', reply.message)
        .replaceAll('$requestMethod', reply.method);
      reply_body = JSON.parse(reply_body);

      const data = {
        webhook_id: webhookID,
        request_headers: headers,
        request_body: request.body,
        reply_code: reply.code,
        reply_body,
      };
      await WebhookReceive.create(data);

      return response.status(reply.code).json(reply_body);
    } catch (err) {
      return response.status(500).json({ code: 500, message: 'something went wrong' });
    }
  }

  _checkAuth(request, webhook) {
    try {
      const headers = request.headers();
      const authHeader = headers['authorization'] || '';
      switch (webhook.auth) {
        case 'basic':
          const base64Credentials = authHeader.substr(6);
          const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
          const [username, password] = credentials.split(':');
          return username == webhook.auth_key1 && password == webhook.auth_key2;
        case 'bearer':
          return authHeader.substr(7) == webhook.auth_key1;
        case 'HMAC-SHA1':
        case 'HMAC-SHA256': {
          const authToken = authHeader.substr(5);
          if (authToken.length == 0) {
            return false;
          }
          const client = webhook.auth_key1;
          const secret = webhook.auth_key2;
          if (client != headers['x-pch-key']) {
            return false;
          }
          let rawBody = '';
          const originalRawBody = request.raw();
          if (typeof originalRawBody == 'string') {
            rawBody = originalRawBody;
          }
          const payload = request.originalUrl() + rawBody;
          let signatureRaw = null;
          if (webhook.auth == 'HMAC-SHA1') {
            signatureRaw = CryptoJS.HmacSHA1(payload, secret);
          } else {
            signatureRaw = CryptoJS.HmacSHA256(payload, secret);
          }
          const signature = CryptoJS.enc.Hex.stringify(signatureRaw);
          return signature == authToken;
        }
        default:
          return true;
      }
    } catch (e) {}
    return false;
  }
}

module.exports = WebhookReceiverController;
