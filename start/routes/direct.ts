import Route from '@ioc:Adonis/Core/Route'

Route.get('/', 'AppController.index')
Route.get('/landing', ({ view }) => view.render('landing'))
Route.get('terms_and_conditions', 'AppController.termsAndConditions')
Route.get('privacy_policy', 'AppController.privacyPolicy')

Route.get('signup', 'AuthController.signup')
Route.post('signup', 'AuthController.doSignup')
Route.get('login', 'AuthController.login')
Route.post('login', 'AuthController.doLogin')
Route.get('forgot_password', 'AuthController.forgotPassword')
Route.post('forgot_password', 'AuthController.doForgotPassword')
Route.get('reset_password', 'AuthController.resetPassword')
Route.post('reset_password', 'AuthController.doResetPassword')
