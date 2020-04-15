'use strict';

/*
|--------------------------------------------------------------------------
| UserSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/
const Env = use('Env');
const User = use('App/Models/User');

class UserSeeder {
	async run() {
		await User.create({
			name: Env.get('SUPER_ADMIN_NAME', 'Super Admin'),
			email: Env.get('SUPER_ADMIN_EMAIL', 'super@admin.com'),
			password: Env.get('SUPER_ADMIN_PASSWORD', 'superuser')
		});
	}
}

module.exports = UserSeeder;
