import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AppController {
  async index(ctx: HttpContextContract) {
    return ctx.view.render('index')
  }

  async termsAndConditions(ctx: HttpContextContract) {
    return ctx.view.render('welcome')
  }

  async privacyPolicy(ctx: HttpContextContract) {
    return ctx.view.render('welcome')
  }
}
