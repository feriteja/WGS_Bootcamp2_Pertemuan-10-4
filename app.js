const express = require("express");
var morgan = require("morgan");
const path = require("path");

var expressLayouts = require("express-ejs-layouts");
const {
  getContact,
  contactValidator,
  addContact,
  getContactDetail,
  deleteContact,
} = require("./function/contactHandler");
const { sendDelete } = require("./function/requestHandler");
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
  const contacts = getContact();

  res.render("index", {
    name: "Feri Teja Kusuma",
    title: "WEBSERVER - EJS",
    contacts,
  });
});

app.get("/about", (req, res) => {
  res.render("about");
});

//! GET ALL USER
app.get("/contact", (req, res) => {
  const contacts = getContact();

  res.render("contact", {
    name: "Feri Teja Kusuma",
    title: "WEBSERVER - EJS",

    contacts,
  });
});

//! ADD USER
app.post("/contact", contactValidator, (req, res) => {
  addContact(req.body);
  const contacts = getContact();
  res.render("contact", {
    name: "Feri Teja Kusuma",
    title: "WEBSERVER - EJS",
    contacts,
  });
});

//! TO ADD USER PAGE
app.get("/contact/add", (req, res) => {
  res.render("contactAdd");
});

//! GET USER DETAIL
app.get("/contact/:userID", (req, res) => {
  const userID = req.params.userID;
  const user = getContactDetail(userID);

  if (!user) {
    res.status(404).render("errorPage", { message: "user not found" });
  }

  res.render("detail", {
    name: "Feri Teja Kusuma",
    title: "WEBSERVER - EJS",
    user,
  });
});

//! DELETE  USER
app.post("/contact/:userID", (req, res) => {
  const contact = req.params.userID;
  deleteContact(contact);
  console.log("delete methode");

  const contacts = getContact();

  res.render("contact", {
    name: "Feri Teja Kusuma",
    title: "WEBSERVER - EJS",
    contacts,
  });

  res.redirect("contact", {
    name: "Feri Teja Kusuma",
    title: "WEBSERVER - EJS",

    contacts,
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
