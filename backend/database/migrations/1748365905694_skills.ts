import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Skills extends BaseSchema {
  protected tableName = 'skills'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable().unique()

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })

    // Inserir as habilidades pré-definidas
    this.defer(async (db) => {
      await db.table(this.tableName).multiInsert([
        { name: 'Java' },
        { name: 'Node.js' },
        { name: 'C++' },
        { name: 'PHP' },
        { name: 'Python' },
        { name: 'Go' },
        { name: 'ADVPL' },
        { name: 'Angular' },
        { name: 'Electron' },
        { name: 'React' },
        { name: 'React Native' },
        { name: 'MongoDB' },
        { name: 'MySQL' },
        { name: 'SQLServer' },
        { name: 'Postgres' },
        { name: 'Backend' },
        { name: 'Front-End' }
      ])
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
