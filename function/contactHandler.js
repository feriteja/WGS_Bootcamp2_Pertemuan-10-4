const fs = require("fs");

const validator = require("validator");

const checkContactFile = () => {
  const dirPath = "./data";
  const isFolderExist = fs.existsSync(dirPath);
  if (!isFolderExist) {
    console.log("Creating folder 'data'");
    fs.mkdirSync(dirPath);
  }

  const dataPath = "./data/contact.json";
  if (!fs.existsSync(dataPath)) {
    console.log("Creating file 'Contact'");
    fs.writeFileSync(dataPath, "[]", "utf-8");
  }
};

const contactValidator = (req, res, next) => {
  const { name, email, mobile } = req.body;

  const file = fs.readFileSync("data/Contact.json", "utf8");
  const contacts = JSON.parse(file);
  const isNameDuplicate = contacts.some((cons) => cons.name === name);
  const isEmailValid = validator.isEmail(email);
  const isNumber = validator.isMobilePhone(mobile, "id-ID");
  if (isNameDuplicate) {
    res.render("contactAdd", {
      message: "Name is Duplicated, Please enter something else",
      params: req.body,
    });

    return false;
  }
  if (!isEmailValid) {
    res.render("contactAdd", {
      message: "Email is not valid",
      params: req.body,
    });

    return false;
  }
  if (!isNumber) {
    res.render("contactAdd", {
      message: "Number is not valid",
      params: req.body,
    });

    return false;
  }
  next();
};

const getContact = () => {
  checkContactFile();
  const file = fs.readFileSync("./data/contact.json", "utf8");
  const contacts = JSON.parse(file);

  return contacts;
};

const getContactDetail = (userID) => {
  const contacts = getContact() || [];

  const user = contacts.find((contact) => contact.name === userID);
  return user;
};

const addContact = (contact) => {
  checkContactFile();

  const contacts = getContact();

  contacts.push(contact);
  fs.writeFileSync("data/contact.json", JSON.stringify(contacts));
};

const deleteContact = (userID) => {
  checkContactFile();
  const contacts = getContact();

  const isContactExist = contacts.find((cont) => cont.name === userID);

  if (!isContactExist) {
    return console.log("user doesn't exist");
  }
  console.log("halo");

  const newContacts = contacts.filter((cont) => cont.name !== userID);
  console.log("deleted");

  fs.writeFileSync("data/contact.json", JSON.stringify(newContacts));
  console.log("saved");
};

module.exports = {
  getContact,
  addContact,
  contactValidator,
  deleteContact,
  getContactDetail,
};
