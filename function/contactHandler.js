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

const getContact = () => {
  checkContactFile();
  const file = fs.readFileSync("./data/contact.json", "utf8");
  const contacts = JSON.parse(file);

  return contacts;
};

const contactValidator = (req, res, next) => {
  const { name, email, mobile } = req.body;

  const contacts = getContact();
  const isNameDuplicate = contacts.some((cons) => cons.name === name);
  const isEmailValid = validator.isEmail(email);
  const isNumber = validator.isMobilePhone(mobile, "id-ID");
  if (isNameDuplicate) {
    req.errorMessage = "Name is Duplicated, Please enter something else";
  }
  if (!isEmailValid) {
    req.errorMessage = "Email is not valid";
  }
  if (!isNumber && mobile) {
    req.errorMessage = "Number is not valid";
  }
  next();
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

  const newContacts = contacts.filter((cont) => cont.name !== userID);

  fs.writeFileSync("data/contact.json", JSON.stringify(newContacts));
};

const updateContact = (userID, contactInput) => {
  const contacts = getContact();
  const userDetail = getContactDetail(userID);

  const filteredContacts = contacts.filter(
    (contact) => contact.name !== userID
  );

  const contact = {
    name: contactInput.name || userDetail.name,
    email: contactInput.email || userDetail.email,
    mobile: contactInput.mobile || userDetail.mobile,
  };

  filteredContacts.push(contact);

  fs.writeFileSync("data/contact.json", JSON.stringify(filteredContacts));
};

module.exports = {
  getContact,
  addContact,
  contactValidator,
  deleteContact,
  getContactDetail,
  updateContact,
};
