// input validation. display error if invalid input

var mysql = require("mysql");
let inquirer = require('inquirer');
require("console.table");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;

  // displays id connected and welcome message
  console.log("connected as id " + connection.threadId);
  console.log("-------------------");
  console.log("Welcome to Bamazon!");
  console.log("-------------------");

  // display product list
  displayProducts();

});

// displays list of products
function displayProducts() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;

    // logs out table - really pretty
    console.table(res);

    // 
    askQuestions();
  });

};

// inquirer function that takes in user input about item and quantity
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

        connection.query("SELECT * FROM products WHERE ?",
            [{ id: item, }],
            function (error, data) {
                if (error) throw error;

                console.log(`You chose: ${data[0].stock_quantity} ${data[0].product_name}(s)`);
                console.table(data[0])
                checkStock(data, response.itemQuantity);

             });
      });
};


function checkStock(data, quantity) {

  // inventory calculation
  var quantityLeft =  data[0].stock_quantity - quantity;

  // if the input amount is less than the available stock --
  if (data[0].stock_quantity < quantity) {
      // -- log this error
      console.log("Insufficient Quantity!");

    //otherwise
  } else {

    // log this success message --
    console.log("OK! Give me a moment while I process this transaction...");

      // -- and update the database
      connection.query(
        "UPDATE products SET ? WHERE ?",
        [
          { 
            stock_quantity: quantityLeft
          }
        ], 
        function (err, results) {
          console.log("RESULTS: " + results);
        });
  };
      console.log(`Quantity Left: ${quantityLeft}`); 
      // displayProducts(); 
};



// updateStock();


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
      console.log("RESULTS" + res);
    }
  );
};


function placeOrder() {

}


