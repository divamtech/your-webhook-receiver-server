import Route from '@ioc:Adonis/Core/Route'

Route.get('/', ({ view }) => view.render('home'))
Route.get('/landing', ({ view }) => view.render('landing'))
Route.get('/user-profile', ({ view }) => view.render('userProfile'))
Route.get('/company-profile', ({ view }) => view.render('companyProfile'))
Route.get('/events', ({ view }) => view.render('events'))
Route.get('/create-event', ({ view }) => view.render('createEvent'))

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
