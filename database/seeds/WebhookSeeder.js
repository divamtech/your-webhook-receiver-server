'use strict';

/*
|--------------------------------------------------------------------------
| WebhookSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

const Webhook = use('App/Models/Webhook');

class WebhookSeeder {
	async run() {
		await Webhook.createMany([
			{
				name: 'Webhook A',
				slug: 'a-c4f9622f-8456-4dfb-ae3a-4d2ae01a7fc6',
				auth: 'none',
				is_active: true,
			},
			{
				name: 'Webhook B',
				slug: 'b-c4f9622f-8456-4dfb-ae3a-4d2ae01a7fc6',
				auth: 'basic',
				auth_key1: 'userX',
				auth_key2: 'passwordY',
				is_active: true,
			},
			{
				name: 'Webhook C',
				slug: 'c-c4f9622f-8456-4dfb-ae3a-4d2ae01a7fc6',
				auth: 'bearer',
				auth_key1: '050b3f5a76caf1778ac389eefb766b872d51b57ed157f49615db251473eddb6c',
				is_active: true,
			},
			{
				name: 'Webhook D',
				slug: 'd-c4f9622f-8456-4dfb-ae3a-4d2ae01a7fc6',
				auth: 'HMAC-SHA1',
				auth_key1: '3da541559918a808c2402bba5012f6c60b27661c',
				auth_key2: '92429d82a41e930486c6de5ebda9602d55c39986',
				is_active: true,
			},
			{
				name: 'Webhook E',
				slug: 'e-c4f9622f-8456-4dfb-ae3a-4d2ae01a7fc6',
				auth: 'HMAC-SHA256',
				auth_key1: 'affff7ff15ea7649eaf95ddc119db9a4752abbb40c7af701e06275a1fe3c690d',
				auth_key2: '050b3f5a76caf1778ac389eefb766b872d51b57ed157f49615db251473eddb6c',
				is_active: true,
			},
			{
				name: 'Events',
				slug: 'events',
				auth: 'basic',
				auth_key1: 'userX',
				auth_key2: 'passwordY',
				is_active: true,
			},
		]);
	}
}

module.exports = WebhookSeeder;
