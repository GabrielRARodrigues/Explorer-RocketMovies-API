export const up = knex =>
  knex.schema.createTable('movie_tags', table => {
    table.uuid('id').primary().defaultTo(knex.fn.uuid())
    table
      .integer('note_id')
      .references('id')
      .inTable('movie_notes')
      .onDelete('CASCADE')
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE')
    table.text('name').notNullable()
  })

export const down = knex => knex.schema.dropTable('movie_tags')
