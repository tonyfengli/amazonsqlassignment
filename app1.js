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
  database: "amazonDB"
});

/* connection.connect(function(err) {
  if (err) throw err;
    var query = "SELECT id, product_name, price FROM products WHERE ?";
    connection.query(query, { department_name: "kitchen" }, function(err, res) {
      console.log(res);
    });
});

 */

function runSearch() {
    inquirer
      .prompt([
        {
            name: "product",
            message: "What product do you want to buy?"
        },
        {
            name: "quantity",
            message: "How many would you like?"
        }
    
    ])
      .then(function(answer) {
        connection.connect(function(err) {
            if (err) throw err;
              var query = "SELECT id, stock_quantity, price FROM products WHERE ?";
              connection.query(query, { product_name: answer.product }, function(err, res) {
                productQuantity = res[0].stock_quantity;
                answerQuantity = parseInt(answer.quantity);
                if(productQuantity < answerQuantity) {
                    console.log("Insufficient quantity!")
                } else {
                    console.log("Sure. Let me process it for you.");
                    processOrder(answer.product, productQuantity, answerQuantity);
                    updateProductSales(answer.product, answerQuantity)
                }

              });
          });
      });
  }

  function processOrder(product, oldQuantity, orderedQuantity) {
    var updatedQuantity = oldQuantity - orderedQuantity;
    var query = connection.query(
        "UPDATE products SET ? WHERE ?",
        [
          {
            stock_quantity: updatedQuantity
          },
          {
            product_name: product
          }
        ],
        function(err, res) {
            readQuantity(product, orderedQuantity)
        }
      );
  }

  function readQuantity(product, orderedQuantity) {
    var query = "SELECT id, stock_quantity, price FROM products WHERE ?";
    connection.query(query, { product_name: product }, function(err, res) {
      console.log("The total cost of this order will be $" + res[0].price * orderedQuantity);
    });
  }


  function updateProductSales(product, answerQuantity) {
        var query1 = connection.query(
            "SELECT id, product_name, stock_quantity, price, product_sales FROM products",
            function(err, res) {
              oldProductSales = 0;
                price = 0
                res.forEach(row => {
                    if (row.product_name === product) {
                        oldProductSales = row.product_sales;
                        price = row.price;
                    }
                });
                ProductSalesAdded = answerQuantity * price;
                updatedProductSales = ProductSalesAdded + oldProductSales;
                


                var query2 = connection.query(
                    "UPDATE products SET ? WHERE ?",
                    [
                      {
                        product_sales: updatedProductSales
                      },
                      {
                        product_name: product
                      }
                    ],
                );
                console.log("The item " + product + " now has product sales of $" + updatedProductSales);
            }
        );
  }

  runSearch();


  