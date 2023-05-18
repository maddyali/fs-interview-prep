const express = require("express");
const app = express();
const mongodb = require("mongodb");
const MongoClient = require("mongodb").MongoClient;
require("dotenv").config();

let dbConnectionStr = process.env.DB_STRING;

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
  .then((client) => {
    const db = client.db("fullstack-bank");
    const questionsCollection = db.collection("questions");
    console.log(`Connected to ${db.databaseName}`);

    /*
    ========== Express Handlers ========== 
    */

    app.set("view engine", "ejs");
    // Replaces body-parser:
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use("/public", express.static(__dirname + "/public"));

    // READ
    app.get("/", (req, res) => {
      db.collection("questions")
        .find()
        .toArray()
        .then((result) => res.render("index.ejs", { questions: result }))
        .catch((err) => console.log(err));
    });

    // CREATE
    app.post("/createQuestion", (req, res) => {
      questionsCollection
        .insertOne(req.body)
        .then((result) => res.redirect("/"))
        .catch((err) => console.log(err));
    });

    // UPDATE
    app.put("/updateQuestion", (req, res) => {
      try {
        questionsCollection
          .updateOne(
            { _id: new mongodb.ObjectId(req.body.id) },
            {
              $set: {
                question: req.body.question,
                type: req.body.type,
              },
            }
          )
          .then((result) => {
            console.log(result);
            res.json("Updated Question");
          });
      } catch (err) {
        console.log(err);
      }
    });

    // DELETE
    app.delete("/deleteQuestion", (req, res) => {
      try {
        questionsCollection
          .deleteOne({ _id: new mongodb.ObjectId(req.body.id) })
          .then((result) => {
            console.log("Question Deleted");
            res.json("Question Deleted");
          });
      } catch (err) {
        console.log(err);
      }
    });

    app.listen(process.env.PORT, () =>
      console.log(`Server is running on port ${PORT}`)
    );
  })
  .catch((err) => console.log(err));
