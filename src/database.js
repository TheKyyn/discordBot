const mongoose = require("mongoose");

const dbConnection = process.env.MONGO_URI;

mongoose
  .connect(dbConnection, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connecté à MongoDB Atlas."))
  .catch((err) => console.error("Erreur de connexion à MongoDB Atlas", err));
