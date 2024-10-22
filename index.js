const mongoose = require("mongoose");
const fs = require("fs");
require("dotenv").config();

async function main() {
  /**--------------- Not allowed to be edited - start - --------------------- */
  const mongoUri = process.env.MONGODB_URI;
  const collection = process.env.MONGODB_COLLECTION;

  const args = process.argv.slice(2);

  const command = args[0];
  /**--------------- Not allowed to be edited - end - --------------------- */

  // Connect to MongoDB
  await mongoose.connect(mongoUri);

  // Define a schema for the collection
  const schema = new mongoose.Schema({}, {
    strict: false
  });
  const Model = mongoose.model(collection, schema);

  switch (command) {
    case "check-db-connection":
      await checkConnection();
      break;
    case 'reset-db':
      await resetDb(Model);
      break;
    case 'bulk-insert':
      await bulkInsert(Model);
      break;
      // TODO: Buat logic fungsionalitas yg belum tersedia di bawah
    default:
      throw Error("command not found");
  }

  await mongoose.disconnect();
  return;
}

// To check MongoDB connection
async function checkConnection() {
  console.log("check db connection started...");
  try {
    await mongoose.connection.db.admin().ping();
    console.log("MongoDB connection is successful!");
  } catch (err) {
    console.error("MongoDB connection failed:", err);
  }
  console.log("check db connection ended...");
}

// To reset database
const resetDb = async (Model) => {
  try {
    await Model.deleteMany({});
    console.log('Database reset successfully');
  } catch (error) {
    console.error('Failed to reset database', error);
  };
}

// To bulk insert data from seed.json
const bulkInsert = async (Model) => {
  console.log("bulk inserting data...");
  try {
    // Baca data dari seed.json
    const data = JSON.parse(fs.readFileSync("seed.json", "utf-8"));
    await Model.insertMany(data);
    console.log("Bulk insert successful!");
  } catch (error) {
    console.error("Bulk insert failed:", error);
  }
};

main();