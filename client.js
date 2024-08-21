const express = require("express");
const { Client } = require("pg");

const app = express();

const config = {
  user: "postgres",
  host: "localhost",
  database: "pg",
  password: "sql36883235",
  port: 5432,
};

app.get("/", async (req, res) => {
  const formDate = new Date();

  const client = new Client(config);

  //   connect
  await client.connect();

  //   return all rows
  const results = await client.query("select * from users");
  console.table(results.rows);

  //   end
  await client.end();
  const toDate = new Date();
  const elapsed = toDate.getTime() - formDate.getTime();

  //   send it to the wire
  res.send({ rows: results.rows, elapsed });
});

app.listen(3001, () => {
  console.log("http://localhost:3001");
});
