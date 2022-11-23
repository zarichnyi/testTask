const response = require("./../response");
const knex = require("../db/db");

const defaultPersons = [
  {
    nick_name: "Counter",
    name: "Anton",
    second_name: "Verba",
    role: "user",
    password: new Buffer.from("12345", "ascii").toString("base64"),
    department: "buhalteriya",
    work_position: "buhalter",
    date: new Date().toUTCString(),
  },
  {
    nick_name: "Programmer",
    name: "Yura",
    second_name: "Dub",
    role: "admin",
    password: new Buffer.from("54321", "ascii").toString("base64"),
    department: "IT",
    work_position: "administrator",
    date: new Date().toUTCString(),
  },
];

const defaultTopic = [
  {
    title: "Topic",
    body: "LONGtextTopic",
    date: new Date().toUTCString(),
    summary: "shortSummary",
    user_id: 1,
  },
];

exports.index = (req, res) => {
  knex.schema
    .hasTable("users")
    .then((exists) => {
      if (!exists) {
        knex.schema
          .createTable("users", (table) => {
            table.increments("id");
            table.string("nick_name");
            table.string("name");
            table.string("second_name");
            table.string("date");
            table.string("role");
            table.string("password");
            table.string("department");
            table.string("work_position");
          })
          .then(() => {
            knex("users")
              .insert(defaultPersons)
              .then(() => console.log("default USERS created succesfull"));
          })
          .catch((err) =>
            console.log(`default Users data not added with: ${err}`)
          );
      } else {
        response.status(200, "default data ALREDY added", res);
      }
    })
    .then(() => {
      knex.schema.hasTable("topics").then((exists) => {
        if (!exists) {
          knex.schema
            .createTable("topics", (table) => {
              table.string("title");
              table.string("body");
              table.string("date");
              table.string("summary");
              table.string("user_id");
              table.increments("id");
            })
            .then(() => {
              knex("topics")
                .insert(defaultTopic)
                .then(() => response.status(200, "default data added", res));
            })
            .catch((err) => console.log(`default data not added with ${err}`));
        }
      });
    });
};
