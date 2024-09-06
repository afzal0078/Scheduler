const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const pool = mysql.createPool({
  connectionLimit: 100,
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});



// exports.login = async (req, res) => {
//   try {
//       const { email, password } = req.body;
//       if (!email || !password) {
//           return res.status(401).render('login', {
//               message: 'Please enter email and password.'
//           });
//       }

//       pool.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
//           if (err) {
//               console.error(err);
//               return res.status(500).send('Internal Server Error');
//           }

//           if (results.length === 0) {
//               return res.status(401).render('login', {
//                   message: 'The email or password is incorrect'
//               });
//           }

//           const user = results[0];

//           // Compare hashed password
//           const isPasswordMatch = await bcrypt.compare(password, user.password);

//           if (!isPasswordMatch) {
//               return res.status(401).render('login', {
//                   message: 'The email or password is incorrect'
//               });
//           }

//           // Check if user is an admin or regular user based on email domain
//           let redirectPath = "/user"; // Default redirection for regular users
//           if (email.endsWith("@mitsfaculty.com")) {
//               redirectPath = "/dashboard"; // Redirect admin to admin dashboard
//           }
//           else{
//               redirectPath = "/user";
//           }

//           const id = user.id;
//           const token = jwt.sign({ id, role: redirectPath === "/dashboard" ? "admin" : "user" }, process.env.JWT_SECRET, {
//               expiresIn: process.env.JWT_EXPIRE_IN
//           });

//           const cookieOptions = {
//               expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
//               httpOnly: true,
//           };

//           res.cookie('jwt', token, cookieOptions);
//           res.status(200).redirect(redirectPath);
//       });
//   } catch (error) {
//       console.error(error);
//       res.status(500).send('Internal Server Error');
//   }
// };






// exports.register = (req, res) => {
//   console.log(req.body);

//   const { name, email, password, passwordConfirm } = req.body;

//   pool.query('SELECT email FROM users WHERE email = ?', [email], async (error, results) => {
//       if(error){
//           console.log(error);
//       }
//       if(results.length > 0) {
//           return res.render('register', {
//               message: 'That email is already in use'
//           })
//       }else if(password !== passwordConfirm ) {
//           return res.render('register', {
//               message: 'Password do not match'
//           });
//       }

//       let hashedPassword = await bcrypt.hash(password, 8);
//       console.log(hashedPassword);

//       pool.query('INSERT INTO users SET ? ',{name: name , email: email , password: hashedPassword}, (err, result) => {
//           if(error) {
//               console.log(error);
//           }else{
//               console.log(results);
//               return res.render('register', {
//                   message: 'User registered'
//               });
//           }
//       })
//   });

// }













exports.view = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("connected as ID" + connection.threadId);
    connection.query(
      'SELECT * FROM users WHERE status = "active"',
      (err, rows) => {
        connection.release();

        if (!err) {
          let removedUser = req.query.removed;
          res.render("dashboard", { rows, removedUser });
        } else {
          console.log(err);
        }

        console.log("The data from user table: \n", rows);
      }
    );
  });
};

exports.userPage = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("connected as ID" + connection.threadId);
    connection.query(
      'SELECT * FROM users WHERE status = "active"',
      (err, rows) => {
        connection.release();

        if (!err) {
          // let removedUser = req.query.removed;
          // res.render("dashboard", { rows, removedUser });
          res.render("user", { rows});
        } else {
          console.log(err);
        }

        console.log("The data from user table: \n", rows);
      }
    );
  });

  // res.render("user");
};

exports.find = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("connected as ID" + connection.threadId);

    let searchTerm = req.body.search;

    connection.query(
      "SELECT * FROM users WHERE name LIKE ? OR enrollment_no LIKE ? OR branch LIKE ? ",
      ["%" + searchTerm + "%", "%" + searchTerm + "%", "%" + searchTerm + "%"],
      (err, rows) => {
        connection.release();

        if (!err) {
          res.render("dashboard", { rows });
        } else {
          console.log(err);
        }

        console.log("The data from user table: \n", rows);
      }
    );
  });
};

exports.form = (req, res) => {
  res.render("add-user");
};

exports.create = (req, res) => {
  const { name, email, enrollment_no, branch, year } = req.body;

  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("connected as ID" + connection.threadId);

    let searchTerm = req.body.search;

    connection.query(
      "INSERT INTO users SET name = ? , email=?, enrollment_no=? ,branch=?,year=?",
      [name, email, enrollment_no, branch, year],
      (err, rows) => {
        connection.release();

        if (!err) {
          res.render("add-user", { alert: `User ${name} added successfully` });
        } else {
          console.log(err);
        }

        console.log("The data from user table: \n", rows);
      }
    );
  });
};

exports.edit = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("connected as ID" + connection.threadId);
    connection.query(
      "SELECT * FROM users WHERE id = ?",
      [req.params.id],
      (err, rows) => {
        connection.release();

        if (!err) {
          res.render("edit-user", { rows });
        } else {
          console.log(err);
        }

        console.log("The data from user table: \n", rows);
      }
    );
  });
};

exports.update = (req, res) => {
  const { name, email, enrollment_no, branch, year, phone } = req.body;

  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("connected as ID" + connection.threadId);
    connection.query(
      "UPDATE users SET name = ?,  email = ?, enrollment_no = ? ,branch = ?,year = ?, phone = ? WHERE id = ?",
      [name, email, enrollment_no, branch, year, phone, req.params.id],

      (err, rows) => {
        connection.release();

        if (!err) {
          pool.getConnection((err, connection) => {
            if (err) throw err;
            console.log("connected as ID" + connection.threadId);
            connection.query(
              "SELECT * FROM users WHERE id = ?",
              [req.params.id],
              (err, rows) => {
                connection.release();

                if (!err) {
                  res.render("edit-user", {
                    rows,
                    alert: `${name} has been Updated`,
                  });
                } else {
                  console.log(err);
                }

                console.log("The data from user table: \n", rows);
              }
            );
          });
        } else {
          console.log(err);
        }

        console.log("The data from user table: \n", rows);
      }
    );
  });
};

// exports.delete = (req, res) => {
//   pool.getConnection((err, connection) => {
//     if (err) throw err;
//     console.log("connected as ID" + connection.threadId);
//     connection.query('UPDATE users SET status = ? WHERE id = ?', ['removed', req.params.id], (err, rows) => {
//         connection.release();

//         if (!err) {
//           res.redirect("/dashboard");
//         } else {
//           console.log(err);
//         }

//         console.log("The data from user table: \n", rows);
//       }
//     );
//   });

//   // pool.getConnection((err, connection) => {
//   //   if (err) throw err;
//   //   console.log("connected as ID" + connection.threadId);
//   //   connection.query('UPDATE users SET status = ? WHERE id = ?', ['removed', req.params.id], (err, rows) => {
//   //     if (!err) {
//   //       // let removedUser = encodeURIComponent('User successeflly removed.');
//   //       res.redirect('/dashboard');
//   //       // let removedUser = encodeURIComponent('User successeflly removed.');
//   //       // res.redirect('/dashboard?removed=' + removedUser);
//   //     } else {
//   //       console.log(err);
//   //     }
//   //     console.log('The data from beer table are: \n', rows);
//   //     }
//   //   );
//   // });

  
// };

// exports.delete = (req, res) => {

  // Delete a record

  // User the connection
  // connection.query('DELETE FROM user WHERE id = ?', [req.params.id], (err, rows) => {

  //   if(!err) {
  //     res.redirect('/');
  //   } else {
  //     console.log(err);
  //   }
  //   console.log('The data from user table: \n', rows);

  // });

//   // Hide a record

//   connection.query('UPDATE user SET status = ? WHERE id = ?', ['removed', req.params.id], (err, rows) => {
//     if (!err) {
//       let removedUser = encodeURIComponent('User successeflly removed.');
//       res.redirect('/?removed=' + removedUser);
//     } else {
//       console.log(err);
//     }
//     console.log('The data from beer table are: \n', rows);
//   });

// }

// exports.deleteUser = (req, res) => {
//   const userId = req.params.id;

//   db.query('DELETE FROM users WHERE id = ?', [userId], (err, result) => {
//       if (err) {
//           console.error(err);
//           return res.status(500).send('Internal Server Error');
//       }

//       if (result.affectedRows === 0) {
//           return res.status(404).send('User not found');
//       }

//       res.status(200).send('User deleted successfully');
//   });
// };





exports.viewall = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("connected as ID" + connection.threadId);
    connection.query(
      "SELECT * FROM users WHERE id = ?",
      [req.params.id],
      (err, rows) => {
        connection.release();

        if (!err) {
          res.render("view-user", { rows });
        } else {
          console.log(err);
        }

        console.log("The data from user table: \n", rows);
      }
    );
  });
};
