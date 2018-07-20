var mysql = require("mysql");
var inquirer = require("inquirer");
var chosenItem;
var user_ID;
var finalTotalArray = [];
var INFO = [];
// Dependencies
// =============================================================
var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");

// Sets up the Express App
// =============================================================
var app = express();
var PORT = 3000;

// Sets up the Express app to handle data parsing
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// var chosenItem.quantity;
var choiceArray = [];
var connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "root",
    database: "bamazon"

});
connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadID);
    // addProduct();
    CreateUser();
});

function CreateUser(username, first_name, last_name, street_address, city, state, zipcode, email, password) {
    this.username = username;
    this.first_name = first_name;
    this.last_name = last_name;
    this.street_address = street_address;
    this.city = city;
    this.state = state;
    this.zipcode = zipcode;
    this.email = email;
    this.password = password;

}

CreateUser.prototype.printInfo = function () {
    console.log("Username: " + this.username);
};

inquirer.prompt([
    {
        type: "input",
        name: "username",
        message: "Please Create a username."
    }, {
        type: "input",
        name: "first_name",
        message: "What is your first name?"
    }, {
        type: "input",
        name: "last_name",
        message: "What is your last name?"
    }, {
        type: "input",
        name: "street_address",
        message: "Please enter a street address"
    }, {
        type: "input",
        name: "city",
        message: "Please enter a city"
    }, {
        type: "input",
        name: "state",
        message: "Please enter a state"
    }, {
        type: "input",
        name: "zipcode",
        message: "Please enter a zipcode"
    }, {
        type: "email",
        name: "email",
        message: "Please enter a valid email address"
    }, {
        type: "password",
        name: "password",
        message: "Please create a password (5 digits min: 1 varter, 1 special character, 1 number)"
    }
]).then(function (answers) {
    var newUser = new CreateUser(answers.username, answers.first_name, answers.last_name, answers.street_address, answers.city, answers.state, answers.zipcode, answers.email, answers.password);


    newUser.printInfo(answers.username);


    AddUsertoDB();

    // Prompts for a new users to create their account
    function AddUsertoDB() {
        console.log("Inserting a new user to DB...\n");

        var query = connection.query(
            "INSERT INTO user SET ?",
            {
                username: answers.username,

                first_name: answers.first_name,

                last_name: answers.last_name,

                street_address: answers.street_address,

                city: answers.city,

                state: answers.state,

                zipcode: answers.zipcode,

                email: answers.email,

                password: answers.password,
            },
            // callback function:
            function (err, result) {
                console.log(err);
                console.log(result.affectedRows + " user inserted!\n");

            });
        console.log(query.sql + "Sent info to DB");
        findUserID();
    };

    function findUserID() {

        connection.query("SELECT user_id FROM user WHERE ?",
            {
                username: answers.username,
            },
            function (err, result) {

                console.log("user_ID: " + result[0].user_id);
                user_ID = result[0].user_id
            });




    }
    addProduct();
});

function addProduct() {
    // query the database for all items being auctioned
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        // once you have selected to Buy, prompt the user for how many they want.
        inquirer
            .prompt([
                {
                    name: "choice",
                    type: "rawlist",
                    choices: function () {

                        for (var i = 0; i < results.length; i++) {
                            choiceArray.push(
                                {
                                    name: "There are " + results[i].quantity + " " + results[i].name + " items in stock",
                                    value: i
                                }
                            );
                        }
                        
                        return choiceArray;
                    
                    },

                    message: "Select an Item #:"
                },
                {
                    name: "numtobuy",
                    type: "input",
                    message: "How many would you like to purchase?"
                }
            ])
            .then(function (answer) {
                // get the information of the chosen item
                // console.log("answer", answer);
                // console.log("results", results[answer.choice]);
                chosenItem = results[answer.choice];

                // determine if there are enough in stock

                if (chosenItem.quantity >= parseInt(answer.numtobuy)) {
                    // console.log("LOOK HERE!");
                    var updateProductSet = 'UPDATE products SET quantity = ' + (chosenItem.quantity - answer.numtobuy) + ' WHERE id = ' + chosenItem.id;
                    
                    connection.query(updateProductSet,

                        function (error) {
                            if (error) throw err;
                            console.log("Item(s) added to cart successfully!");
                            addtoCart();
                        }
                    );
                }

                else {
                    
                    console.log("There aren't that many " + chosenItem.name + " items in stock, please start over with your purchase");
                    addProduct();
                }

                console.log("YAY", chosenItem);



                function quantTimesPrice(x, y) {
                    return (x * y);
                }

                var totalprice = quantTimesPrice(chosenItem.price, answer.numtobuy);
               

                function addtoCart() {
                    console.log("Adding product to you cart...\n");


                    var query = connection.query(
                        "INSERT INTO cart SET ?",
                        {
                            name: chosenItem.name,
                            quantity: answer.numtobuy,
                            price: chosenItem.price,
                            total_price: totalprice,
                            cart_id: user_ID
                        },

                       
                        function (err, result) {
                            console.log(err);
                            console.log(result.affectedRows + " New Product added!\n");


                        }
                    );

                    console.log(query.sql);
                    reset();
                }
            });
    });
}
function reset() {

    choiceArray = [];


    doneshopping();
}

function doneshopping() {
    inquirer
        .prompt([
            {
                name: "fin",
                type: "confirm",
                message: "Are you ready to checkout?"
            }
        ])
        .then(function (done) {
            if (done.fin == true) {
                sumFinalTotal();
            }

            else {
                addProduct();
            }
        })

};


// function checkout() {
//     var query = connection.query("SELECT * FROM cart WHERE ?",
//         [{
//             cart_id: user_ID

//         }],

//         function (err, result) {
//             if (err) throw err;
//             console.log(err);
//             // console.log(" THANK YOU FOR SHOPPING, YOU OWE " + result);
//             // for (var i = 0; i < result.length; i++) {


//             //     // var totalprice = connection.query(
//             //     // "SELECT count(cart.total_price) FROM cart WHERE ?", 
//             //     // {
//             //     //     cart_id: user_ID
//             //     // },

//             //     console.log( "checking final total: " + finalTotal + "......" + result[i].total_price);
//             // }
//             sumFinalTotal();
//         }
//     );

//     console.log(query.sql);

// };


function sumFinalTotal() {
    var query = connection.query("SELECT SUM(total_price) FROM cart WHERE ?",
        [{
            cart_id: user_ID

        }],

        function (err, INFO) {
            if (err) throw err;
            console.log(err);
            console.log(INFO);
            console.log()
            return INFO;
             },
                
            
        );
console.log(query.sql);

for (var i = 0; i < INFO.length; i++) {

     finalTotalArray = new sumFinalTotal(INFO.total_price);


        finalTotalArray.printInfo(INFO.total_price);
               
                console.log(finalTotalArray);
                return finalTotalArray;
                
};
// query.connect(function(err) {
//     if (err) throw err;
//     //Select all cart items for current user and return the result object:
//     con.query("SELECT * FROM cart WHERE ",
//         [{
//             cart_id: user_ID

//         }], function (err, result, fields) {
//       if (err) throw err;
//       console.log(result);
//     });
//   });
  
// query.connect(function(err) {
//     if (err) throw err;
//     //Select all products and return the result of current object:
//     con.query("SELECT * FROM products", function (err, result, fields) {
//       if (err) throw err;
//       console.log(result);
//     });
//   });   
// };

};

app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});

