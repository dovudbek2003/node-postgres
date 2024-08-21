const express = require("express");
const { Pool } = require("pg");

const app = express();

const config = {
  user: "postgres",
  host: "localhost",
  database: "pg",
  password: "sql36883235",
  port: 5432,
  max: 20,
  connectionTimeoutMillis: 0,
  idleTimeoutMillis: 0,
};

const pool = new Pool(config);

app.get("/", async (req, res) => {
  const formDate = new Date();

  // Ulanishni qo'lda boshqarish
  const client = await pool.connect();
  const results = await client.query("select * from users");
  client.release(); // Ulanishni pool ga qaytarish

  // Barchasi avtomatik bajariladi
  // const results = await pool.query("select * from users");

  console.table(results.rows);

  const toDate = new Date();
  const elapsed = toDate.getTime() - formDate.getTime();

  res.send({ rows: results.rows, elapsed });
});

// Server to'xtaganida hovuzni yopish
process.on("SIGINT", async () => {
  console.log("Gracefully shutting down...");
  await pool.end();
  process.exit(0);
});

app.listen(3000, () => {
  console.log("http://localhost:3000");
});
