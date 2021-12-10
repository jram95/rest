const express = require("express");
const dotenv = require("dotenv");
const {Client} = require("pg");

const app = express();
const client = new Client({ database: 'restaurant' });
dotenv.config();

// const config = {
//   connectionString: process.env.DATABASE_URL,
// };


// enable server to read body as JSON data
app.use(express.json());

app.get("/", (req,res) => {
  try{
    res.send("connected")
  }
})

// GET menu data
app.get("/food", async (req, res) => {
  try{
  await client.connect();
  const result = await client.query(
    'select food_item from food_items'
    ); // query to read all food items
  await client.end();

  res.json(result.rows)
  }

  catch (err){
      console.error(err.message)
      }
});

app.get("/food/:id", async (req, res) => {
  try{
  const id = parseInt(req.params.id); // params are always string type

  await client.connect();
  const result = await client.query(
    'select food_item from food_items where food_id = ($1)', [id]
  );
  await client.end();

  res.json(result.rows[0])
  }

  catch (err){
      console.error(err.message)
      }
});

app.get('/ingredients', async (req, res) => {
  try{
  await client.connect();
  const result = await client.query(
    'select ingredient from ingredients'
  );
  await client.end();

  res.json(result.rows)
  }
  catch (err){
      console.error(err.message)
      }
});

app.get('/allergens', async (req, res) => {
  try{
  await client.connect();
  const result = await client.query(
    'select allergen from allergens'
  );
  await client.end();

  res.json(result.rows)
  }
  catch (err){
      console.error(err.message)
      }
});

const PORT = process.env.PORT_NUMBER ?? 4000;

app.listen(PORT, () => {
  console.log(`You are now listening on PORT ${PORT}`)
})