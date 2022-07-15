const express = require("express");
var morgan = require("morgan");
const path = require("path");

var expressLayouts = require("express-ejs-layouts");
const { getContact } = require("./function/contactHandler");
const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.set("layout extractScripts", true);
app.set("layout extractStyles", true);

app.use(expressLayouts);

// app.use(express.static("public"));
app.use("/public", express.static("public"));
app.use(express.urlencoded());

// app.use(morgan("dev"));

app.use((req, res, next) => {
  console.log("Time:", Date.now());
  next();
});

app.get("/", (req, res) => {
  const contacts = getContact() || [];

  res.render("index", {
    name: "Feri Teja Kusuma",
    title: "WEBSERVER - EJS",
    contacts,
  });
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/contact", (req, res) => {
  const contacts = getContact() || [];

  res.render("contact", {
    name: "Feri Teja Kusuma",
    title: "WEBSERVER - EJS",
    contacts,
  });
});

app.post("/contact", (req, res) => {
  console.log(req.body);
  // res.render("contact");
  res.end();
});

app.get("/contact/add", (req, res) => {
  res.render("contactAdd");
});

app.get("/contact/:userID", (req, res) => {
  const contacts = getContact() || [];
  const userID = req.params.userID;

  const user = contacts.find((contact) => contact.name === userID);
  console.log(user);

  if (!user) {
    res.status(404).render("errorPage", { message: "user not found" });
  }

  res.render("detail", {
    name: "Feri Teja Kusuma",
    title: "WEBSERVER - EJS",
    user,
  });
});

// app.get("/product/:id", (req, res) => {
//   console.log(req.query.category);
//   res.send(
//     `product id: ${req.params.id} <br /> category id: ${req.query.category} `
//   );
// });

// app.get("/product/:id", (req, res) => {
//   res.send(`product id: ${req.params.id}`);
// });

// app.get("/product/:id/category/:idcat", (req, res) => {
//   res.send(
//     `product id: ${req.params.id} <br /> category id: ${req.params.idcat} `
//   );
// });

app.use("/", (req, res) => {
  res.status(404).render("errorPage", { message: "page is not found" });
});

app.listen(port, () => {
  console.log(`your server listening on port ${port}`);
});
