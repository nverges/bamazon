'use strict'
// input validation. display error if invalid input

// require packages
const mysql = require("mysql");
const inquirer = require('inquirer');
require("console.table");

// creates mysql connection
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "bamazon"
});


// initializes connection to database
connection.connect(function(err) {
  if (err) throw err;

  // displays id connected and welcome message
  console.log("connected as id " + connection.threadId);
  console.log("------------------- WELCOME TO BAMAZON! -----------------------");

  // display product list
  displayProducts();

});

// displays list of products
function displayProducts() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;

    // logs out table using console.table npm package - really pretty
    console.log('    ------------------ Current Stock ----------------------');
    console.table(res);

    // begins inquirer prompt
    askQuestions();
  });

};

// inquirer function that takes in item and quantity info
function askQuestions() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "Which item would you like to buy?",
        name: "itemChoose"
      },
      {
        type: "input",
        message: "How many would you like?", 
        name: "itemQuantity"
      }
    ])
    .then (function(response) {

      // item selected 
      var item = response.itemChoose;

      // amount selected
      var amount = response.itemQuantity;

        // mysql query to pull the selected item object
        connection.query("SELECT * FROM products WHERE ?",
            [{ item_id: item, }],
            function (error, data) {

                // error checking
                if (error) throw error;

                // recap of the item being adjusted 
                console.log(`You chose: ${data[0].stock_quantity} ${data[0].product_name}(s) at $${data[0].price} each for a total of $${data[0].price * response.itemQuantity}.`);

                // inserts user input into function to calculate stock availability
                checkStock(data, response.itemQuantity);

             });
      });
};


// calculates item availability
function checkStock(data, quantity) {

  // inventory adjustment
  var quantityLeft =  data[0].stock_quantity - quantity;

  // if the input amount is less than the available stock --
  if (data[0].stock_quantity < quantity) {
      // -- log this error
      console.log("Insufficient Quantity!");

    // otherwise
  } else {

    // log this success message --
    console.log("OK! Give me a moment while I process this transaction...");

      // -- and update the database
      connection.query(
        "UPDATE products SET ? WHERE ?",
        [
          { 
            stock_quantity: quantityLeft
          },
          {
            item_id: data[0].item_id
          }
        ], 
        function (err, results) {

          // error checking
          if (err) throw err;

          // logs returned data
          // console.log("RESULTS: " + results);
        });
  };

    // if statement to determine if there's any stock remaining 
    if (quantityLeft >= 0) {
        console.log('-----------------------------');
        console.log(`Quantity Left: ${quantityLeft}`); 
      displayProducts();
    } else {
      console.log('Cannot complete this transaction. Sucks to be you.');
      buyItem();
    }

    // updateStock();
    // displayProducts(); 
};


// function that prompts user whether or not to purchase another item
function buyItem() {
    inquirer
    .prompt([
      {
        type: "confirm",
        message: "Would you like to purchase another item?",
        name: "anotherItem"
      }
    ])
    .then (function(response) {
        if (response.anotherItem === "y" || "yes") {
          displayProducts();
        } else if (response.anotherItem === "n" || "no" ) {
          console.log('Awww, ok. Thank you for choosing Bamazon!');
        };
    });
};




// not functioning becuase of scoping issues//////
function updateStock(data, quantity) {
    var quantityLeft =  data[0].stock_quantity - quantity;

  connection.query(
    "UPDATE products SET ? WHERE ?",
    [
      { 
        stock_quantity: quantityLeft
      }
    ], 
    function (err, res) {

      // error checking
      if (err) throw err;

      // logs returned data
      // console.log("RESULTS" + res);
    }
  );
};
