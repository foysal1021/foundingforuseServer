const express = require("express");
const app = express();
const port = 5000;
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${"foundingForus"}:${"samVdGxloI7vlpX0"}@cluster0.uvaek7y.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const DataBase = client.db("FoundigForUS");
    const RecentApplication = DataBase.collection("RecentApplication");
    const AllApplication = DataBase.collection("AllApplication");
    const userInfo = DataBase.collection("user_info");
    const LoanRequeste = DataBase.collection("LoanRequeste");

    // post user info start
    app.post("/user_info", async (req, res) => {
      const Info = req.body;
      const post = await userInfo.insertOne(Info);
      console.log(post);
    }); // post user info end

    // verifi user email start
    app.post("/user_verifi", async (req, res) => {
      const email = req.body.email;
      const query = { email: email };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          isEmailVerifi: true,
        },
      };
      const result = await userInfo.updateOne(query, updateDoc, options);
      res.send(result);
    });
    // verifi user email end

    //recent Loan Applications start
    app.post("/Loan_Application", async (req, res) => {
      const LoanApplication = req.body;
      const post = await RecentApplication.insertOne(LoanApplication);
      res.send(post);
    });
    //recent Loan Applications end

    //get recent loan application start
    app.get("/recent_appliction", async (req, res) => {
      const query = {};
      const result = await RecentApplication.find(query).toArray();
      res.send(result);
    });
    //get recent loan application end
    // find recent application post for all application start
    app.get("/recent_appliction/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const findData = await RecentApplication.findOne(query);
      res.send(findData);
    });

    // recent all post in allapplication start
    app.post("/All_Application", async (req, res) => {
      const data = req.body;
      const postINallApplication = await AllApplication.insertOne(data);
      res.send(postINallApplication);
    });

    // recent application delete start
    app.get("/recent_application_checked/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const find = await RecentApplication.deleteOne(query);
      console.log(find);
    });
    // recent application delete end

    // get all application start
    app.get("/All_Application", async (req, res) => {
      const query = {};
      const result = await AllApplication.find(query).toArray();
      res.send(result);
    }); // get all application end

    app.get("/user_info", async (req, res) => {
      const query = {};
      const result = await userInfo.find(query).toArray();
      res.send(result);
    });

    // mack admin start
    app.get("/mack_admin/:id", async (req, res) => {
      const data = req.params.id;
      const idSplit = data.split("&");
      const mackAdminID = idSplit[0];
      const userEmail = idSplit[1];

      const userEmailQuery = { email: userEmail };
      const isUserAdmin = await userInfo.findOne(userEmailQuery);

      if (isUserAdmin.role === undefined) {
        return;
      }

      const query = { _id: new ObjectId(mackAdminID) };
      const findUser = await userInfo.findOne(query);
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          role: "admin",
        },
      };
      const result = await userInfo.updateOne(query, updateDoc, options);
      console.log(result);
    });
    // mack admin end

    // check admin start
    app.get("/check_admin/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const find = await userInfo.findOne(query);
      res.send(find);
    });
    // check admin end

    // Loan requested start
    app.post("/Loan_Request", async (req, res) => {
      const data = req.body;
      const postLoanData = await LoanRequeste.insertOne(data);
      res.send(postLoanData);
    });
    // Loan requested end

    // loan requested start
    app.get("/Loan_Request", async (req, res) => {
      const query = {};
      const result = await LoanRequeste.find(query).toArray();
      res.send(result);
    });
    // loan requested end

    // contact start
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
