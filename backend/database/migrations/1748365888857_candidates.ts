import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Candidates extends BaseSchema {
  protected tableName = 'candidates'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.integer('code').notNullable()
      table.date('birth_date').nullable()
      table.string('phone').nullable()
      table.string('street').nullable()
      table.string('number').nullable()
      table.string('complement').nullable()
      table.string('neighborhood').nullable()
      table.string('city').nullable()
      table.string('state').nullable()
      table.string('zip_code').nullable()
      table.boolean('selected_for_interview').defaultTo(false)
      table.timestamp('interview_date').nullable()
      table.boolean('notified').defaultTo(false)

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
