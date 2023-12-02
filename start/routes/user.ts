import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('profile', 'UsersController.profile')
  Route.post('profile/basic', 'UsersController.updateProfile')
  Route.post('profile/password', 'UsersController.changePassword')
  Route.get('logout', 'UsersController.logout')
}).middleware(['auth'])
