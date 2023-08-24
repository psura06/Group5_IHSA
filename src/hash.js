require('dotenv').config();
const bcrypt = require('bcrypt');
const saltRounds = 10;

const password1 = process.env.ADMIN1_PASSWORD;
const password2 = process.env.ADMIN2_PASSWORD;
const password3 = process.env.ADMIN3_PASSWORD;
const password4 = process.env.SHOWADMIN1_PASSWORD;
const password5 = process.env.SHOWADMIN2_PASSWORD;
const password6 = process.env.SHOWADMIN3_PASSWORD;

bcrypt.hash(password1, saltRounds, function(err, hash) {
  console.log('Hashed ADMIN1_PASSWORD: ', hash);
});

bcrypt.hash(password2, saltRounds, function(err, hash) {
  console.log('Hashed ADMIN2_PASSWORD: ', hash);
});

bcrypt.hash(password3, saltRounds, function(err, hash) {
  console.log('Hashed ADMIN3_PASSWORD: ', hash);
});

bcrypt.hash(password4, saltRounds, function(err, hash) {
  console.log('Hashed SHOWADMIN1_PASSWORD: ', hash);
});

bcrypt.hash(password5, saltRounds, function(err, hash) {
  console.log('Hashed SHOWADMIN2_PASSWORD: ', hash);
});

bcrypt.hash(password6, saltRounds, function(err, hash) {
  console.log('Hashed SHOWADMIN3_PASSWORD: ', hash);
});
