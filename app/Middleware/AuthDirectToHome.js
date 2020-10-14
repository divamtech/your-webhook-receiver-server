'use strict';
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class AuthDirectToHome {
	/**
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Function} next
	 */
	async handle({ response }, next) {
		try {
			await next();
		} catch (err) {
			try {
				if (err.status == 401) {
					return response.route('home');
				}
			} catch (e) {}
			throw err;
		}
	}
}

module.exports = AuthDirectToHome;
