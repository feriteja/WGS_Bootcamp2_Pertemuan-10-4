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
  updateContact,
} = require("./function/contactHandler");

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.set("layout extractScripts", true);
app.set("layout extractStyles", true);

app.use(expressLayouts);

// app.use(express.static("public"));
app.use("/public", express.static("public"));
app.use(express.urlencoded({ extended: true }));

// app.use(morgan("dev"));

// app.use((req, res, next) => {
//   console.log("Time:", Date.now());
//   next();
// });

//! Home page
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
  let message = "";
  if (req.query.added) message = "user has been added";
  if (req.query.updated) message = "user has been updated";
  if (req.query.deleted) message = "user has been deleted";

  res.render("contact", {
    name: "Feri Teja Kusuma",
    title: "WEBSERVER - EJS",
    message,
    contacts,
  });
});

//! ADD USER FUNC
app.post("/contact", contactValidator, (req, res) => {
  const message = req.errorMessage;

  if (message.length > 0) {
    return res.render("contactAdd", {
      message: message,
      params: req.body,
    });
  }
  addContact(req.body);

  const contacts = getContact();

  res.redirect("/contact?added=success");
});

//! TO ADD USER PAGE
app.get("/contact/add", (req, res) => {
  res.render("contactAdd");
});

//! UPDATE USER PAGE
app.get("/contact/update/:userID", (req, res) => {
  const userID = req.params.userID;
  const contacts = getContact();

  const contact = contacts.find((contact) => contact.name === userID);
  res.render("contactUpdate", { userID: userID, contact: contact });
});

//! UPDATE USER FUNC
app.post("/contact/update/:userID", contactValidator, (req, res) => {
  const userID = req.params.userID;
  const newContact = req.body;
  const existContact = getContactDetail(userID);
  const message = req.errorMessage;

  if (message.length > 0 && userID !== newContact.name) {
    return res.render("contactUpdate", {
      message: message,
      userID: userID,
      contact: req.body,
    });
  }

  if (JSON.stringify(existContact) === JSON.stringify(newContact)) {
    res.redirect("/contact");
  }

  updateContact(userID, newContact);
  res.redirect("/contact?updated=success");
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

  const isDeleted = deleteContact(contact);

  if (!isDeleted) res.status(404).render("errorPage");

  res.redirect("/contact?deleted=success");
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
