import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Users from 'App/Models/Users'
import Env from '@ioc:Adonis/Core/Env';

export default class extends BaseSeeder {
  public async run () {
    // Write your database queries inside the run method
    await Users.createMany([
      {
        name: Env.get('SUPER_ADMIN_NAME', 'Super Admin'),
        email: Env.get('SUPER_ADMIN_EMAIL', 'super@admin.com'),
        password: Env.get('SUPER_ADMIN_PASSWORD', 'superuser'),
      }
    ])    
  }
}
