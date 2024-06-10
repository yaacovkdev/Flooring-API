/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable("public_images_controller", (table) => {
      table.increments("id").primary();
      table.string("name").notNullable();
      table.boolean("display").notNullable().defaultTo(false);
      table.string("type").notNullable();
      table.string("dir").notNullable();
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table
        .timestamp("updated_at")
        .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
    })
    .createTable("hero_titles", (table) => {
      table.increments("id").primary();
      table.string("file_name").notNullable();
      table
        .integer("image_id")
        .unsigned()
        .references("public_images_controller.id")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table.string("body").notNullable().defaultTo("");
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table
        .timestamp("updated_at")
        .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
    })
    .createTable("contract_descriptions", (table) => {
      table.increments("id").primary();
      table.string("project_name").notNullable();
      table.boolean("display").notNullable().defaultTo(false);
      table.specificType('description', 'LONGTEXT').notNullable();
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table
        .timestamp("updated_at")
        .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .dropTable("hero_titles")
    .dropTable("public_images_controller")
    .dropTable("contract_descriptions");
};
