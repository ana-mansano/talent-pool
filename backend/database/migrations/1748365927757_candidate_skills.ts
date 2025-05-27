import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class CandidateSkills extends BaseSchema {
  protected tableName = 'candidate_skills'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('candidate_id').unsigned().references('id').inTable('candidates').onDelete('CASCADE')
      table.integer('skill_id').unsigned().references('id').inTable('skills').onDelete('CASCADE')
      table.unique(['candidate_id', 'skill_id'])

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
