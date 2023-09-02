exports.up = function (knex) {
  return knex.schema.createTable('users_home_places', t => {
    t.increments('id').primary().notNullable();
    t.integer('user_id').references('id').inTable('users').notNull().onDelete('cascade');
    t.integer('home_place_id').references('id').inTable('home_places').notNull().onDelete('cascade');
    t.string('uuid').notNullable()
    t.timestamps()
  })
}

exports.down = function(knex) {
  knex.schema.dropTable('users_home_places')
};