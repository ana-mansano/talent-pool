import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'candidates'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')

      table.integer('code').notNullable().unique()
      table.string('name').notNullable()
      table.date('birth_date').notNullable()
      table.string('email').notNullable().unique()
      table.string('phone').notNullable().unique()
      table.string('cep', 9).notNullable()
      table.string('street').nullable()
      table.string('district').nullable()
      table.string('city').nullable()
      table.string('state', 2).nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
