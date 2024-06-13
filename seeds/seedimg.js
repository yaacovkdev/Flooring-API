/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

const crypto = require('crypto');

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
  "../seed-data/public_project_descriptions.json"
));

const user = require(path.join(__dirname, "../seed-data/admin_users.json"));

for(let i = 0; i < user.length; i++) {
  user[i].email = crypto.createHash('sha256').update(user[i].email).digest('base64');
  user[i].password = crypto.createHash('sha256').update(user[i].password).digest('base64');
}

exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("hero_titles").del();
  await knex("public_images_controller").del();
  await knex("contract_descriptions").del();
  await knex("admin_users").del();
  await knex("public_images_controller").insert(pubimgscontroller);
  await knex("hero_titles").insert(herotitles);
  await knex("contract_descriptions").insert(pubdescription);
  await knex("admin_users").insert(user);
};
