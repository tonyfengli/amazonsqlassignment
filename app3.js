var mysql = require("mysql");
var inquirer = require("inquirer");
var consoleTable = require("console.table");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "password",
  database: "amazonDB",
});


function runSearch() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View Product Sales by Department",
        "Create New Department",
      ]
    })
    .then(function(answer) {
      switch (answer.action) {
      case "View Product Sales by Department":
          departmentSalesSearch();
          break;

      case "Create New Department":
          createDepartment();
          break;
      }
    });
}

function departmentSalesSearch () {
  var query = "SELECT departments.department_id, departments.department_name, departments.over_head_costs, SUM(products.product_sales) FROM departments INNER JOIN products ON products.department_name=departments.department_name GROUP BY departments.department_id, departments.department_name, departments.over_head_costs;";
  connection.query(query, function(err, res) {
      console.table(res);
  });
}

runSearch();
