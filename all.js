const express = require("express");
const { Pool, Client } = require("pg");

const app = express();

let clientCount = 0;
let clientSum = 0;
let poolCount = 0;
let poolSum = 0;

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

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.get("/pool", async (req, res) => {
  const formDate = new Date();
  poolCount++;
  // Ulanishni qo'lda boshqarish
  // const client = await pool.connect();
  // const results = await client.query("select * from users");
  // client.release(); // Ulanishni pool ga qaytarish

  // Barchasi avtomatik bajariladi
  const results = await pool.query("select * from users");

  console.table(results.rows);

  const toDate = new Date();
  const elapsed = toDate.getTime() - formDate.getTime();
  poolSum += elapsed;

  res.send({
    rows: results.rows,
    elapsed,
    avg: Math.round(poolSum / poolCount),
  });
});

app.get("/client", async (req, res) => {
  const formDate = new Date();

  clientCount++;

  const client = new Client({
    user: "postgres",
    host: "localhost",
    database: "pg",
    password: "sql36883235",
    port: 5432,
  });

  await client.connect();
  const results = await client.query("select * from users");
  await client.end();

  console.table(results.rows);

  const toDate = new Date();
  const elapsed = toDate.getTime() - formDate.getTime();

  clientSum += elapsed;
  res.send({
    rows: results.rows,
    elapsed,
    avg: Math.round(clientSum / clientCount),
  });
});

// Server to'xtaganida hovuzni yopish
process.on("SIGINT", async () => {
  console.log("Gracefully shutting down...");
  await pool.end();
  process.exit(0);
});

app.listen(7777, () => {
  console.log("http://localhost:7777");
});
