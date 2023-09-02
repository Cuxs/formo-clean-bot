
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users',t=>{
    t.increments('id').primary().notNullable();
    t.string('name').notNullable();
})
}


exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users')
}

