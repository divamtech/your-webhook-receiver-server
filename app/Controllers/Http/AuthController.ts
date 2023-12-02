import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AuthController {
  async signup(ctx: HttpContextContract) {
    return ctx.view.render('welcome')
  }
  async doSignup(ctx: HttpContextContract) {
    return ctx.view.render('welcome')
  }
  async login(ctx: HttpContextContract) {
    return ctx.view.render('welcome')
  }
  async doLogin(ctx: HttpContextContract) {
    return ctx.view.render('welcome')
  }
  async forgotPassword(ctx: HttpContextContract) {
    return ctx.view.render('welcome')
  }
  async doForgotPassword(ctx: HttpContextContract) {
    return ctx.view.render('welcome')
  }
  async resetPassword(ctx: HttpContextContract) {
    return ctx.view.render('welcome')
  }
  async doResetPassword(ctx: HttpContextContract) {
    return ctx.view.render('welcome')
  }
}
