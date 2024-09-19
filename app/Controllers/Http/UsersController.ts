import Users from "App/Models/Users";
import Hash from '@ioc:Adonis/Core/Hash';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class UsersController {
  async index(ctx: HttpContextContract) {
    if (await ctx.auth.use('web').authenticate()) {
      return ctx.response.redirect('/admin/webhooks');
    }
    return ctx.response.redirect('/login')
  }

  public showLoginForm(ctx: HttpContextContract) {
    return ctx.view.render('login')
  }

  async login({ request, auth, session, response }: HttpContextContract) {
    try {
      // get form data
      const { email, password, remember } = request.all();

      // retrieve user based on the form data
      const user = await Users.query().where('email', email).first();

      if (user) {
        // verify password
        const passwordVerified = await Hash.verify(password, user.password);

        if (passwordVerified) {
          // login user
          await auth.attempt(email, password, remember);
        } else {
          // display error message
          session.flash({
            notification: {
              type: 'danger',
              message: `We couldn't verify your credentials. Make sure you've confirmed your email address.`,
            },
          });
        }
        return response.redirect('/');
      }
    } catch (error) {
      console.error('Login error:', error);
      session.flash({
        notification: {
          type: 'danger',
          message: 'An unexpected error occurred. Please try again.',
        },
      });
    }
    return response.redirect('/');
  }

  async logout(ctx: HttpContextContract) {
    try {
      await ctx.auth.logout();
      return ctx.response.redirect('/');
    } catch (error) {
      console.error('Logout error:', error);
      ctx.session.flash({
        notification: {
          type: 'danger',
          message: 'An unexpected error occurred. Please try again.',
        },
      });
      return ctx.response.redirect('/');
    }
  }



}

