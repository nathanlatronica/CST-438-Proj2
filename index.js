//NEED TO EDIT

/*App Configuration*/
var express = require("express");
var bodyParser = require('body-parser');
var app = express();
var mysql = require('mysql');
var session = require('express-session');


app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
    secret: 'top secret code!',
    resave: true,
    saveUninitialized: true
}));
app.set('view engine', 'ejs');


// /*Configure MySQL DBMS*/
// const connection = mysql.createConnection({
//     host: 'u3r5w4ayhxzdrw87.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
//     user: 'oay7fmy9wz9efy09',
//     password: 'g87s2cv4jtshuxju',
//     database: 'co5viz7plrvpj9nr'
// });
// connection.connect();


///////////////////////////////////////////////////////////////////
//              LOG IN/OUT INFORMATION                           //
///////////////////////////////////////////////////////////////////

/* Middleware */
function isAuthenticated(req, res, next){
    if(!req.session.authenticated) res.redirect('/login');
    else next();
}

function checkUsername(username){
    let stmt = 'SELECT * FROM loginInfo WHERE username=?';
    return new Promise(function(resolve, reject){
       connection.query(stmt, [username], function(error, results){
           if(error) throw error;
           resolve(results);
       }); 
    });
}

function checkPassword(password, hash){
    if(password == hash){
        return true;
    } else {
        return false;
    }
}

app.get('/login', function(req,res){
    res.render('login');
})

app.post('/login', async function(req, res){
    let isUserExist   = await checkUsername(req.body.username);
    let hashedPasswd  = isUserExist.length > 0 ? isUserExist[0].password : '';
    let passwordMatch = await checkPassword(req.body.password, hashedPasswd);
    console.log(hashedPasswd);
    console.log(isUserExist);
    if(passwordMatch){
        req.session.authenticated = true;
        req.session.user = isUserExist[0].id;
        res.redirect('welcome');
    }
    else{
        res.render('login', {error: true});
    }
});

/* Function to Logout of session */
app.get('/logout', function(req, res){
   req.session.destroy();
   console.log("DONE");
   res.redirect('/');
});

///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
//
//
///////////////////////////////////////////////////////////////////
//              CREATE ACCOUNT INFORMATION                       //
///////////////////////////////////////////////////////////////////

app.get('/account_new', function(req,res){
    res.render('account_new');
})

app.post('/account_new', function(req, res){
  //console.log(req.body);
  let salt = 10;
  bcrypt.hash(req.body.password, salt, function(error, hash){
        if(error) throw error;
        connection.query('SELECT * FROM loginInfo;', function(error, result){
            if(error) throw error;
            if(result.length){
                var userID = result[result.length - 1].id + 1;
                let stmt = 'INSERT INTO loginInfo (id, username, password) VALUES (?, ?, ?)';
                let data = [userID, req.body.username, req.body.password];
                connection.query(stmt, data, function(error, result){
                  if(error) throw error;
                  res.redirect('/login');
                })
            }
        });
    });
});

/* The handler for the ACCOUNT route */
app.get('/account', isAuthenticated, function(req, res){
    var stmt = 'select * from loginInfo where id=' + req.session.user + ';';
	connection.query(stmt, function(error, results){
	    var profile = null;
	    if(error) throw error;
	    if (results.length) {
	        profile = results[0];
	    }
	    res.render('account', {profile: profile});
	});
});

/* Check ACCOUNT Password before Deletion from Profile Page*/
app.post('/account/:id/checkdelete', isAuthenticated, function(req, res){
    var stmt = 'Select * from loginInfo WHERE id='+ req.params.id + ';';
    connection.query(stmt, async function(error, result){
        if(error) throw error;
        if (result.length) {
        	let passwordMatch = await checkPassword(req.body.psw, result[0].password);
    		if (passwordMatch){
    			res.redirect('/account/' + req.params.id + '/delete');
    		} else {
    			res.render('account', {profile: result[0], error: true});
    		}
        }
    });
});

/* Delete a ACCOUNT from Profile Page*/
app.get('/account/:id/delete', isAuthenticated, function(req, res){
    var stmt = 'DELETE from loginInfo WHERE id='+ req.params.id + ';';
    connection.query(stmt, function(error, result){
        if(error) throw error;
        res.redirect('/');
    });
});

/* The handler for the EDIT ACCOUNT route */
app.get('/account/:id/edit', isAuthenticated, function(req, res){
    var stmt = 'select * from loginInfo where id=' + req.params.id + ';';
	connection.query(stmt, function(error, results){
	    var profile = null;
	    if(error) throw error;
	    if (results.length) {
	        profile = results[0];
	    }
	    res.render('account', {profile: profile});
	});
});

app.put('/account/:id', isAuthenticated, function(req, res){
    console.log(req.body);
    var stmt = 'UPDATE loginInfo SET ' +
                'username = "'+ req.body.username + '",' +
                'password = "'+ req.body.password + '"'
                'WHERE id = ' + req.params.id + ";";
    connection.query(stmt, function(error, result){
        if(error) throw error;
        res.redirect('/');
    });
});

///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
//
//
///////////////////////////////////////////////////////////////////
//              Search Developers                                //
///////////////////////////////////////////////////////////////////

app.get('/searchDevelopers', function(req, res){
    if(req.session.authenticated){
        var sql = 'select company_name from gameDevelopers';
            connection.query(sql, function(error, results) {
            if(error) throw error;
            var arr = [];
            results.forEach(function(r) {
                if (!arr.includes(r.company_name)) {
                    arr.push(r.company_name);
                }
            });
    	res.render('premiumpages/prem_searchD', {companies: arr});
    });
    } else {
        var sql = 'select company_name from gameDevelopers';
            connection.query(sql, function(error, results) {
            if(error) throw error;
            var arr = [];
            results.forEach(function(r) {
                if (!arr.includes(r.company_name)) {
                    arr.push(r.company_name);
                }
            });
        	res.render('searchDevelopers', {companies: arr});
        });
    }
});

app.get('/developerSearch', function(req, res){
    if(req.session.authenticated){
        var sql = 'select * from gameDevelopers where company_name=\''  + req.query.company_name + '\';'
	    connection.query(sql, function(error, found){
	        console.log(sql);
	        var company_name = null;
	        if(error) throw error;
	        if(found.length){
	            var company_name = found[0];
                res.render('premiumpages/prem_detailD', {company_name: company_name, games: found});
	        };
	    });
    } else {
        var sql = 'select * from gameDevelopers where company_name=\''  + req.query.company_name + '\';'
	    connection.query(sql, function(error, found){
	        console.log(sql);
	        var company_name = null;
	        if(error) throw error;
	        if(found.length){
	            var company_name = found[0];
                res.render('detailDevelopers', {company_name: company_name, games: found});
	        };
	    });
    }
});

///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
//
//
///////////////////////////////////////////////////////////////////
//              SEARCH GAMES                                     //
///////////////////////////////////////////////////////////////////
app.get('/gameSearch', function(req, res){
    if(req.session.authenticated){
      var sql = 'select * from videoGames where title=\''  + req.query.gameTitle + '\';'
	    connection.query(sql, function(error, found){
	        console.log(sql);
	        var game = null;
	        if(error) throw error;
	        if(found.length){
	            var game = found[0];
                res.render('premiumpages/prem_detailG', {game: game, games: found});
	        };
	    });  
    } else {
        var sql = 'select * from videoGames where title=\''  + req.query.gameTitle + '\';'
    	    connection.query(sql, function(error, found){
    	        console.log(sql);
    	        var game = null;
    	        if(error) throw error;
    	        if(found.length){
    	            var game = found[0];
                    res.render('detailGame', {game: game, games: found});
    	        };
    	 });    
    }
});

app.get('/searchGames', function(req, res){
    if(req.session.authenticated){
        res.render('premiumpages/prem_searchG')
    } else {
        res.render('searchGames');
    }
});
///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
//
//
///////////////////////////////////////////////////////////////////
//              SEARCH GENRES                                    //
///////////////////////////////////////////////////////////////////

app.get('/genreSearch', function(req, res){
    if(req.session.authenticated){
        var sql = 'select * from videoGames where genre=\''  + req.query.gameGenre + '\';'
	    connection.query(sql, function(error, found){
	        console.log(sql);
	        var game = null;
	        if(error) throw error;
	        if(found.length){
	            var name = found[0].title;
                res.render('premiumpages/prem_genreResult', {name: name, games: found});
	        };
	    });
    } else {
      var sql = 'select * from videoGames where genre=\''  + req.query.gameGenre + '\';'
	    connection.query(sql, function(error, found){
	        console.log(sql);
	        var game = null;
	        if(error) throw error;
	        if(found.length){
	            var name = found[0].title;
                res.render('genreSearchResult', {name: name, games: found});
	        };
	    });  
    }
});

///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
//
//
///////////////////////////////////////////////////////////////////
//              SEARCH RATING                                    //
///////////////////////////////////////////////////////////////////

app.get('/ratingSearch', function(req, res){
    if(req.session.authenticated){
     var sql = 'select  * from videoGames where rating=\''  + req.query.gameRating + '\';'
	    connection.query(sql, function(error, found){
	        console.log(sql);
	        var game = null;
	        if(error) throw error;
	        if(found.length){
	            var name = found[0].title;
                res.render('premiumpages/prem_ratingResult', {name: name, games: found});
	        };
	    });   
    } else {
       var sql = 'select  * from videoGames where rating=\''  + req.query.gameRating + '\';'
	    connection.query(sql, function(error, found){
	        console.log(sql);
	        var game = null;
	        if(error) throw error;
	        if(found.length){
	            var name = found[0].title;
                res.render('ratingSearchResult', {name: name, games: found});
	        };
	    }); 
    }
});

///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
//
//
///////////////////////////////////////////////////////////////////
//              SEARCH PRICING                                   //
///////////////////////////////////////////////////////////////////

app.get('/pricingSearch', function(req, res){
    if(req.session.authenticated){
      var sql = 'select  * from videoGames where pricing=\''  + req.query.gamePricing + '\';'
	    connection.query(sql, function(error, found){
	        console.log(sql);
	        var game = null;
	        if(error) throw error;
	        if(found.length){
	            var name = found[0].title;
                res.render('premiumpages/prem_pricingResult', {name: name, games: found});
	        };
	    });  
    } else {
      var sql = 'select  * from videoGames where pricing=\''  + req.query.gamePricing + '\';'
	    connection.query(sql, function(error, found){
	        console.log(sql);
	        var game = null;
	        if(error) throw error;
	        if(found.length){
	            var name = found[0].title;
                res.render('pricingSearchResult', {name: name, games: found});
	        };
	    });  
    }
});

///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
//
//
///////////////////////////////////////////////////////////////////
//             Authenticated Routes                              //
///////////////////////////////////////////////////////////////////

app.get('/account', isAuthenticated, function(req, res){
    res.render('account');
});

app.get('/welcome', isAuthenticated, function(req, res){
    var stmt = 'SELECT * FROM videoGames;';
    console.log(stmt);
    var games = null;
    connection.query(stmt, function(error, results){
        if(error) throw error;
        if(results.length) games = results;
        res.render('premiumpages/prem_welcome', {game: games, username: req.session.username});
        });
});

app.get('/account_edit', isAuthenticated, function(req,res){
    res.render('account_edit');
})

///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
//
//
///////////////////////////////////////////////////////////////////
//             USER Routes                                       //
///////////////////////////////////////////////////////////////////

app.get('/', function(req, res){
    res.render('home');
});

app.get('/gamepicker', function(req, res){
    var stmt = 'SELECT * FROM videoGames;';
    console.log(stmt);
    var games = null;
    connection.query(stmt, function(error, results){
        if(error) throw error;
        if(results.length) games = results;
        res.render('premiumpages/prem_gamePicker', {game: games, username: req.session.username});
    });
});

app.post('/randomGame', function(req, res){
    var stmt = 'SELECT * FROM videoGames;';
    console.log(stmt);
    var games = null;
    connection.query(stmt, function(error, results){
        if(error) throw error;
        if(results.length) games = results;
        res.send(games);
        });
});

app.get('*', function(req, res){
    res.render('error');
});

/* Start the application server */
app.listen(process.env.PORT || 3000, function(){
    console.log("Server has been started");
});
