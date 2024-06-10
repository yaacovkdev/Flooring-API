/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const path = require("path");

const pubimgscontroller = require(path.join(
  __dirname,
  "../seed-data/public_image_controller.json"
));
const herotitles = require(path.join(
  __dirname,
  "../seed-data/hero_titles.json"
));
const pubdescription = require(path.join(
  __dirname,
  "../seed-data/public_project_description.json"
));

exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("hero_titles").del();
  await knex("public_images_controller").del();
  await knex("contract_descriptions").del();
  await knex("public_images_controller").insert(pubimgscontroller);
  await knex("hero_titles").insert(herotitles);
  await knex("contract_descriptions").insert(pubdescription);
};
