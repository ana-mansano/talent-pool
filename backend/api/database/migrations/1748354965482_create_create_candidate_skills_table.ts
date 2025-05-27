import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'create_candidate_skills'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table
        .integer('candidate_id')
        .unsigned()
        .references('id')
        .inTable('candidates')
        .onDelete('CASCADE')
      table.integer('skill_id').unsigned().references('id').inTable('skills').onDelete('CASCADE')
      table.primary(['candidate_id', 'skill_id'])

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
