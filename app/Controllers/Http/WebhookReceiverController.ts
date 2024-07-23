import Webhooks from "App/Models/Webhooks";
import { https_codes } from './http_codes';
import WebhookReceive from "App/Models/WebhookReceive";
import CryptoJS from 'crypto-js'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'


export default class WebhookReceiverController {

    async receiver({ params, request, response }) {
        try {
            let reply: { code: number, message: string } = https_codes['200'];
            let webhookID: number | null = null;
            const slug = params.slug;
            const webhook: Webhooks | null = await Webhooks.findBy('slug', slug);
            if (webhook) {
                try {
                    webhookID = webhook.id;
                    if (!webhook.is_active) {
                        reply = https_codes['423'];
                    } else if (!this._checkAuth(request, webhook)) {
                        reply = https_codes['401'];
                    } else {
                        reply = https_codes['' + webhook.default_reply_code];
                    }
                } catch (err) {
                    reply = https_codes['404'];
                }
                const headers = request.headers();
                headers.ywr_requested_webhook_slug = slug;
                // FIXME : use url function instead of originalUrl 
                headers.ywr_requested_webhook_url = request.url();
                headers.ywr_requested_http_method = request.method();

                let method = headers.ywr_requested_http_method;

                let reply_body = webhook.reply_body
                    .replace('$statusCode', reply.code.toString())
                    .replace('$statusMessage', reply.message)
                    .replace('$requestMethod', method);
                reply_body = JSON.parse(reply_body);

                if (webhookID) {
                    try {
                        await WebhookReceive.create({
                            webhook_id: webhookID,
                            request_headers: headers,
                            request_body: request.body,
                            reply_code: reply.code,
                            reply_body,
                        });
                        return response.status(reply.code).json(reply_body);
                    } catch (error) {
                        console.log(error)
                    }
                }
            }
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
        } catch (e) { }
        return false;
    }
}