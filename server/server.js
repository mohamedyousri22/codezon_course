const { MongoClient } = require("mongodb");
const url =
  "mongodb+srv://mohamed:od8AQaiReQQu7G1C@natours.xjval0i.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(url);
const dbName = "myProject";

async function main() {
  // Use connect method to connect to the server
  await client.connect();
  console.log("Connected successfully to server");
  const db = client.db(dbName);
  const collection = db.collection("documents");
}
main()
  .then(console.log)
  .catch(console.error)
  .finally(() => client.close());

export default connectDB;
