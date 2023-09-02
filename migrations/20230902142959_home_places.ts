
exports.up = function(knex, Promise) {
  return knex.schema.createTable('home_places',t=>{
    t.increments('id').primary().notNullable();
    t.string('name').notNullable();
})
}


exports.down = function(knex, Promise) {
  return knex.schema.dropTable('home_places')
}

