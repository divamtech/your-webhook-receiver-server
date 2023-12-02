import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UserController {
  async profile(ctx: HttpContextContract) {
    return ctx.view.render('welcome')
  }

  async updateProfile(ctx: HttpContextContract) {
    return ctx.view.render('welcome')
  }

  async changePassword(ctx: HttpContextContract) {
    return ctx.view.render('welcome')
  }

  async logout(ctx: HttpContextContract) {
    return ctx.view.render('welcome')
  }
}
