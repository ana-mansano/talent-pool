import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'educations'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('candidate_id')
        .unsigned()
        .references('id')
        .inTable('candidates')
        .onDelete('CASCADE')

      table.string('course_name').notNullable()
      table.string('institution').notNullable()
      table.date('conclusion_date').notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
