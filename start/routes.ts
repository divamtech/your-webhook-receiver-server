import Route from '@ioc:Adonis/Core/Route'

Route.get('/', 'UsersController.index').as('home');
Route.get('/login', 'UsersController.showLoginForm');
Route.post('login', 'UsersController.login').as('login');
Route.get('/logout', 'UsersController.logout');

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
  .prefix('/admin/webhooks')
  .middleware('auth');
  
Route.get('/webhooks/:slug', 'WebhookReceiverController.receiver');
  
//   .middleware(['authDirectToHome', 'auth']);