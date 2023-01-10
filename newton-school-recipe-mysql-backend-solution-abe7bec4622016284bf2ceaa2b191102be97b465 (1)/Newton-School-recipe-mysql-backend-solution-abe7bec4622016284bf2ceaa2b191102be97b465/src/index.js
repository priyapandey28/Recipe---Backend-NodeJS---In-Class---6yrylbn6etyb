const express = require("express");
const bodyParser = require("body-parser");
const mysql = require('mysql');

const con  = require("./connector");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false,}));


app.post('/api/recipe', async(req,res) => {
  const { title, description, category, ingredients } = req.body;
  
  await con.query("INSERT INTO Recipes (title, description, category, ingredients) VALUES (?,?,?,?);", [title, description, category, ingredients], (err, result, fields) => {
    if (err) { res.status(400).json(err.message); }
    else {
        res.status(200).json({ message: "Successfully created a recipe", id: result.insertId });
    }
  });
});

app.patch('/api/recipe/:id', async(req,res) => {

  const { id: unformatted_id } = req.params;
  const { title, description, category, ingredients } = req.body;
  const id = Number(unformatted_id); //Validation
    if (Number.isNaN(id) || id < 1)
      return res.status(400).json({
        message: "Recipe id is invalid",
      });
      
      await con.query(
        `UPDATE Recipes SET title = ?, description = ?, category = ?, ingredients = ? WHERE id= ?`, [title, description, category, ingredients, id],
        (err, result, fields) => {
            if (err) {
                res.status(400).json(err.message);
            } else {
                res.status(200).json({ message: "Successfully updated a recipe" });
            }
        });
});

app.get('/api/recipes', async(req,res)=> {
    await con.query('SELECT * FROM Recipes ORDER BY id ASC;', (err, result) => {
      if (err) { res.status(400).json(err.message); }
      res.status(200).json({
        data: result,
        message: "Successfully fetched all Recipes",
      });
    })
});

app.get('/api/recipe/:id', async(req,res)=> {
    const { id: unformatted_id } = req.params;
    const id = Number(unformatted_id);
    if (Number.isNaN(id) || id < 1)
      return res.status(400).json({
        message: "Recipe id is invalid",
      });

    await con.query(`SELECT title,description,category,ingredients FROM Recipes WHERE id = ${id};`, (err, result) => {
      if (err) { res.status(400).json(err.message); }
      res.json({
        data: result,
        message: "Successfully fetched a Recipe",
      });
    })
});

app.delete('/api/recipe/:id', async(req,res) => {
  const { id: unformatted_id } = req.params;
  const id = Number(unformatted_id);

    await con.query(`DELETE FROM Recipes WHERE id = ${id};`, (err, result) => {
      if (err) { res.status(400).json(err.message); }
      const { affectedRows } = result;
      if (affectedRows === 0)
      return res.status(400).json({
        message: "Recipe id is invalid or does not exist",
      });

      res.status(200).json({
        message: "Successfully deleted a Recipe",
      });
    })
})

app.listen(PORT, () => {
  console.log(`Server Listening on ${PORT}`);
});

module.exports = app;
