'use strict';

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route');

Route.get('/', 'UserController.home').as('home');
Route.get('login', 'UserController.showLoginForm');
Route.post('login', 'UserController.login').as('login');
Route.get('logout', 'UserController.logout');

Route.group(() => {
  Route.get('/', 'WebhookController.index').as('webhooks');
  Route.get('/logs', 'WebhookController.allLogs').as('webhooks.logs');
  Route.get('/log/:id/delete', 'WebhookController.deleteLog').as('webhooks.log.delete');
  Route.get('/logs/delete_all', 'WebhookController.deleteAllLogs').as('logs.deleteAll');
  Route.get('/logs/delete/:id', 'WebhookController.deleteAllLogsOfOne').as('logs.deleteAllOfOne');
  Route.get('/:id', 'WebhookController.getOne').as('webhook.get');
  Route.post('/:id', 'WebhookController.createUpdateOne').as('webhook.createUpdate');
  Route.get('/:id/delete', 'WebhookController.delete').as('webhook.delete');
  Route.get('/:id/update_status_code/:code', 'WebhookController.updateWebhookReplyCode').as(
    'webhook.updateWebhookReplyCode',
  );
  Route.get('/:id/logs', 'WebhookController.logs').as('webhook.logs');
  Route.get('/new', 'WebhookController.new');
})
  .prefix('admin/webhooks')
  .middleware(['authDirectToHome', 'auth']);

Route.any('webhooks/:slug', 'WebhookReceiverController.receiver');
