/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('home_places').del()
  await knex('home_places').insert([
    {id: 1, name: 'Patio y terraza 🌲🌳'},
    {id: 2, name: 'Living 📺 escalera 🪜 y pasillo de arriba 🛋️'},
    {id: 3, name: 'Baños 🚽 🧻'},
    {id: 4, name: 'Cocina 🍽️'}
  ]);
};
