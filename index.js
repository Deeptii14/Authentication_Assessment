const express = require("express");
const app = express();
const fs = require("fs");
const session = require("express-session");

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//home page
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

//signup page
app.get("/signup", (req, res) => {
  res.sendFile(__dirname + "/public/SignUp.html");
});

//login page
app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/public/login.html");
});
//user login post request

app.post("/login", function (req, res) {
  const { email, password } = req.body;
  getAllusers(function (error, users) {
    if (error) {
      res.render("login", { error: error });
    } else {
      const match = users.find(function (user) {
        return user.email === email;
      });
      if (match === undefined) {
        res.send("User not registered ");
      } else {
        if (match.email === email && match.password === password) {
          // res.send(match);
          res.sendFile(__dirname + "/public/Logsucess.html");
        } else {
          res.sendFile(__dirname + "/public/wrngDetail.html");
        }
      }
    }
  });
});

//log out

app.get("/logout", function (req, res) {
  res.redirect("/");
});
// add data of signup to file
app.post("/signup", (req, res) => {
  const { email, firstname, Lastname, password } = req.body;
  const user = {
    email: email,
    firstname: firstname,
    Lastname: Lastname,
    password: password,
  };

  //save entry in file
  saveUser(user, function (error, flag) {
    if (error) {
      res.render("signup", { error: error });
    } else if (flag === true) {
      res.sendFile(__dirname + "/public/UAlready.html");
    } else {
      res.redirect("/login");
    }
  });
});

//server listen at 8000
app.listen(8000, () => {
  console.log("server is running at 8000");
});

//to get all the users from file
function getAllusers(callback) {
  fs.readFile("./Data.txt", "utf-8", function (error, data) {
    if (error) {
      callback(error);
    } else {
      if (data.length === 0) {
        data = "[]";
      }
      try {
        let users = JSON.parse(data);
        callback(null, users);
      } catch (error) {
        callback(null, []);
      }
    }
  });
}

// function save the user
function saveUser(newuser, callback) {
  getAllusers(function (error, users) {
    if (error) {
      callback(error);
    } else {
      const user = users.find(function (user) {
        return user.email === newuser.email;
      });
      if (user) {
        callback(null, true);
      } else {
        users.push(newuser);

        fs.writeFile("./Data.txt", JSON.stringify(users), function (error) {
          if (error) {
            callback(error);
          } else {
            callback();
          }
        });
      }
    }
  });
}
