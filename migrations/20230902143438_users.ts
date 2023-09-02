
exports.up = function(knex) {
  return knex.schema.createTable('users',t=>{
    t.increments('id').primary().notNullable();
    t.string('name').notNullable();
})
}


exports.down = function(knex) {
  return knex.schema.dropTable('users')
}

