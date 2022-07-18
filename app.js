const express = require("express");
var morgan = require("morgan");
const contact = require("./router/web/contact/contact");

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

app.use("/contact", contact);

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
