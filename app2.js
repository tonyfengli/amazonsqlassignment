var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "password",
  database: "amazonDB",
  multipleStatements: true
});


function runSearch() {
    inquirer
      .prompt({
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: [
          "View Products for Sale",
          "View Low Inventory",
          "Add to Inventory",
          "Add New Product"
        ]
      })
      .then(function(answer) {
        switch (answer.action) {
        case "View Products for Sale":
            productsSearch();
            break;
  
        case "View Low Inventory":
            inventorySearch();
            break;
  
        case "Add to Inventory":
            addInventory();
            break;
  
        case "Add New Product":
            createProduct();
            break;
        }
      });
  }

    runSearch();

    function productsSearch (product) {
        var query = "SELECT id, product_name, stock_quantity, price FROM products";
        productsArray = [];
        connection.query(query, function(err, res) {
            console.log(res.map(row => {
                    return "ID: " + row.id + "," + " Name: " + row.product_name + " ,"
                    + " Price: " + row.price + " ," + " Quantity: " + row.stock_quantity;
                }
            ));
        });
    }

    function inventorySearch () {
        var query = "SELECT stock_quantity, product_name FROM products";
        connection.query(query, function(err, res) {
            var productArray = [];
            res.forEach(row => {
                    if(row.stock_quantity < 6) {
                        productArray.push("Name: " + row.product_name, "Quantity: " + row.stock_quantity);
                    }
                }
            );
            console.log(productArray);
        });
    }
 

  
    function addInventory() {
        inquirer
          .prompt([
            {
                name: "product",
                message: "What product do you want to look at?"
            },
            {
                name: "quantity",
                message: "How many would you like to add?"
            }
        
        ])
          .then(function(answer) {
            var query1 = connection.query(
                "SELECT id, product_name, stock_quantity, price FROM products",
                function(err, res) {
                    oldQuantity = 0;
                    res.forEach(row => {
                        if (row.product_name === answer.product) {
                            oldQuantity = row.stock_quantity;
                        }
                    });
                    orderedQuantity = parseInt(answer.quantity);
                    newQuantity = orderedQuantity + oldQuantity;

                    var query2 = connection.query(
                        "UPDATE products SET ? WHERE ?",
                        [
                          {
                            stock_quantity: newQuantity
                          },
                          {
                            product_name: answer.product
                          }
                        ],
                    );
                    console.log("The item " + answer.product + " now has a stock quantity of " + newQuantity);
                }
            );
          });
      }


    function createProduct() {
        inquirer
        .prompt([
            {
                name: "product",
                message: "What is the name of the new product?"
            },
            {
                name: "department",
                message: "What is the department of the new product?"
            },
            {
                name: "price",
                message: "What is the price of the new product?"
            },
            {
                name: "quantity",
                message: "What is the stock quantity of the new product?"
            }
      
        ])
        .then(function(answer) {
            var query = connection.query(
                "INSERT INTO products SET ?",
                {
                product_name: answer.product,
                department_name: answer.department,
                price: answer.price,
                stock_quantity: answer.quantity
                },
                function(err, res) {
                console.log(res.affectedRows);
                }
            );

        });
    }