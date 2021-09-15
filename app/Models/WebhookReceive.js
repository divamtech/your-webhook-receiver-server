'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class WebhookReceive extends Model {
  static boot() {
    super.boot();

    this.addHook('beforeSave', async (instance) => {
      instance.request_headers = JSON.stringify(instance.request_headers);
      instance.request_body = JSON.stringify(instance.request_body);
      instance.reply_body = JSON.stringify(instance.reply_body);
    });
    this.addHook('afterFind', async (instance) => {
      instance.request_headers = JSON.parse(instance.request_headers);
      instance.request_body = JSON.parse(instance.request_body);
      instance.reply_body = JSON.parse(instance.reply_body);
    });

    this.addHook('afterFetch', async (instances) => {
      instances.forEach((instance) => {
        instance.request_headers = JSON.parse(instance.request_headers);
        instance.request_body = JSON.parse(instance.request_body);
        instance.reply_body = JSON.parse(instance.reply_body);
      });
    });
  }
}

module.exports = WebhookReceive;
