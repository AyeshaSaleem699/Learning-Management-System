const express = require('express');
const mysql = require('mysql');
var bodyParser = require("body-parser");
var expbs = require('express-handlebars')




//create db connection
const db = mysql.createConnection({
    host     : 'localhost',
    user     : 'user', //user name and pwd for db
    password : 'password',
    database : 'lms_db', //name of db

  });

//connect
db.connect(function(err){
    if(err){
        throw err;
    }
    else{
    console.log("Mysql Connected...");}
});

const app = express();

// // create db
// app.get("/createdb",function(req,res){
//     let sql = 'CREATE DATABASE lms_db';
//     db.query(sql,function(err,result){
//         if(err) throw err;
//         console.log(result);
//         res.send("DataBase Created...");
//     })
// });

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.engine('handlebars',expbs()); //expbs() othervise
app.set('view engine','handlebars');
app.use(express.static(__dirname + '../public'));





// let sqlForUser = "SELECT * FROM users";
// let query = db.query(sqlForUser,function(err,result){
//         users = result;
//         console.log(users)});


//landing page...
app.get("/",function(req,res){
    res.sendFile(__dirname+"/Landing Page.html")
});



var user_authenticated = false;
var userData;
var role = "";
var batch_no;
var semester;
var courseList;

app.post("/authenticating_user",function(req,res){
    let sql1 = `SELECT *  FROM users WHERE username = "${req.body.uname}" And pwd = "${req.body.pwd}"`;
    let query = db.query(sql1,function(err,result){
        if(err) throw err;
        if(result.length != 0){
            user_authenticated = true;
            console.log(result, user_authenticated);
            userData = result[0];
            // console.log(user_id)
        }
        else{
            user_authenticated = false;
        }
        // console.log(user_authenticated);
        if(user_authenticated){
            console.log(user_authenticated);
            res.redirect("/dashboard")
        }
        else{
            console.log(user_authenticated);
            res.redirect("/")
        }
        
        // res.send("postS  fetched...");
    })
    
    
});



app.get("/dashboard",function(req,res){
    //res.sendFile(__dirname+"/main_dashboard.html")
    if(userData.role_id == 10010){
        role = "teacher";
        let sqla =  `SELECT * FROM courses WHERE ins_id = ${userData.user_id}`
        let querya = db.query(sqla,function(err,result){
            if(err) throw err;
            courseList = result;

            // console.log(result)
            console.log(courseList)
            let sqlb =  `SELECT semester FROM batch WHERE batch_id = ${courseList[0].b_id}`;
            let queryb = db.query(sqlb,function(err,result){
                if(err) throw err;
                sem1 = result[0].semester;
                console.log(result)
                console.log(sem1)

                let sqlc =  `SELECT semester FROM batch WHERE batch_id = ${courseList[1].b_id}`;
            let queryc = db.query(sqlc,function(err,result){
                if(err) throw err;
                sem2 = result[0].semester;
                console.log(result)
                console.log(sem2)

                let sqld =  `SELECT semester FROM batch WHERE batch_id = ${courseList[2].b_id}`;
            let queryd = db.query(sqld,function(err,result){
                if(err) throw err;
                sem3 = result[0].semester;
                console.log(result)
                console.log(sem3)


            

        res.render('main_dashboard',
        {
            username:userData.name, 
            teacher: true,
            coursecode1:courseList[0].course_code,
            coursename1:courseList[0].course_name, 
            coursecode2:courseList[1].course_code,
            coursename2:courseList[1].course_name,
            coursecode3:courseList[2].course_code,
            coursename3:courseList[2].course_name,
            semester1:sem1,
            semester2:sem2,
            semester3:sem3

        });
        })})})})
    }
    else if(userData.role_id == 10020){
        role = "student";
        let sql2 =  `SELECT batch_no,semester FROM batch WHERE batch_id = ANY (SELECT b_id FROM student WHERE st_id = ${userData.user_id})`;
        let query = db.query(sql2,function(err,result){
            if(err) throw err;
            console.log("Batch: ");
            console.log(result);
            batch_no = result[0].batch_no;
            semester = result[0].semester;
            console.log(batch_no);
            // res.send("postS  fetched...");
        
        console.log("b"+batch_no)

        let sql3 = `SELECT * FROM courses WHERE b_id = ANY (SELECT batch_id FROM batch WHERE semester = ${semester})`;
        let query1 = db.query(sql3,function(err,result){
            if(err) throw err;
            console.log("couselist: ");
            // console.log(result);
            courseList = result;
            // semester = result[0].semester;
            console.log(courseList);
            // res.send("postS  fetched...");
        
        console.log("b"+batch_no)

        let sql4 = `SELECT name FROM users WHERE user_id = ANY (SELECT ins_id FROM courses WHERE course_id = ${courseList[0].course_id})`;
        let query2 = db.query(sql4,function(err,result){
            if(err) throw err;
            console.log("couselist: ");
            // console.log(result);
            instructor1 = result[0];
            // semester = result[0].semester;
            console.log(instructor1);
            // res.send("postS  fetched...");
        
        console.log("b"+batch_no)

        let sql5 = `SELECT name FROM users WHERE user_id = ANY (SELECT ins_id FROM courses WHERE course_id = ${courseList[1].course_id})`;
        let query3 = db.query(sql5,function(err,result){
            if(err) throw err;
            console.log("couselist: ");
            // console.log(result);
            instructor2 = result[0];
            // semester = result[0].semester;
            console.log(instructor1);
            // res.send("postS  fetched...");
        
        console.log("b"+batch_no)

        let sql6 = `SELECT name FROM users WHERE user_id = ANY (SELECT ins_id FROM courses WHERE course_id = ${courseList[2].course_id})`;
        let query4 = db.query(sql6,function(err,result){
            if(err) throw err;
            console.log("couselist: ");
            // console.log(result);
            instructor3 = result[0];
            // semester = result[0].semester;
            console.log(instructor3);
            // res.send("postS  fetched...");
        
        console.log("b"+batch_no)
        
        res.render('main_dashboard',{username:userData.name, student: true, batch: batch_no, semester:semester, coursecode1:courseList[0].course_code,coursename1:courseList[0].course_name,Instructor1:instructor1.name, coursecode2:courseList[1].course_code,coursename2:courseList[1].course_name,Instructor2:instructor2.name, coursecode3:courseList[2].course_code,coursename3:courseList[2].course_name,Instructor3:instructor3.name});
    })
})})

        })
        })
        }
    else if(userData.role_id == 10030){
        role = "admin";
        res.render('main_dashboard',
        {
            username:userData.name, 
            admin: true,})

    }
    
});
app.get("/course_dashboard",function(req,res){
    

    res.render('Course_Dashboard',{username:userData.name})
})


//select records
// app.get("/records",function(req,res){
//     let sql = "SELECT * FROM users";
//     let query = db.query(sql,function(err,result){
//         if(err) throw err;
//         console.log(result);
//         res.send("postS  fetched...");
//     })
//     });

app.get("/weekly_statistics",function(req,res){
    // if(userData.role_id == 10010){
    //     role= "teacher";
    //     res.render('weekly stats',
    //     {username:userData.name,
    //     teacher: true})
    // }
    
    if(userData.role_id == 10020 || userData.role_id == 10010 ){
        role= "other";
        res.render('weekly stats',
        {username:userData.name,
        other: true})
    }
    else if(userData.role_id == 10030){
        role= "admin";
        res.render('weekly stats',
        {username:userData.name,
        admin: true})
    }
});

    app.get("/ask_help",function(req,res){
        res.render('ask help',{username:userData.name})
        }); 
    
app.get("/help_center",function(req,res){
    res.render('help center',{username:userData.name})
            });         

app.get("/profile",function(req,res){
    res.render('profile',{username:userData.name})
                }); 

    app.get("/edit_profile",function(req,res){
    res.render('edit profile',{username:userData.name})
                }); 
 
app.get("/calender",function(req,res){
    res.render('calender',{username:userData.name})
            }); 

app.get("/enrolled_courses",function(req,res){
    res.render('enrolled courses',{username:userData.name})
            }); 
 
app.get("/instructor_attendence", function(req, res){

    if(userData.role_id == 10010){
        role= "teacher";
        res.render('inst_atndnc page',
        {username:userData.name,
        teacher: true})
    }
    
    else if(userData.role_id == 10020){
        role= "student";
        res.render('inst_atndnc page',
        {username:userData.name,
        student: true})
    }
});

app.get("/assignments", function(req, res){

    if(userData.role_id == 10010){
        role= "teacher";
        res.render('assignment page',
        {username:userData.name,
        teacher: true})
    }
    
    else if(userData.role_id == 10020){
        role= "student";
        res.render('assignment page',
        {username:userData.name,
        student: true})
    }
});


app.get("/instructor_view_attendance" , function(req, res){
    res.render('previous attendnc',{username:userData.name})
});

app.get("/instructor_datewise_attendance" , function(req, res){
    res.render('view_datewise atndnc',{username:userData.name})
});
app.get("/instructor_upload_assignment" , function(req, res){
    res.render('inst_upload_assign',{username:userData.name})
});            


app.get("/add_activity" , function(req, res){
    res.render('add activity',{username:userData.name})
});

app.get("/student_upload_assignment" , function(req, res){
    res.render('st_upload_assignmnt',{username:userData.name})
}); 

app.get("/report_attendance" , function(req, res){
    res.render('atndnc_report',{username:userData.name})
});

app.get("/lectures", function(req, res){

    if(userData.role_id == 10010){
        role= "teacher";
        res.render('lecture page',
        {username:userData.name,
        teacher: true})
    }
    
    else if(userData.role_id == 10020){
        role= "student";
        res.render('lecture page',
        {username:userData.name,
        student: true})
    }
});

app.get("/add_lecture" , function(req, res){
    res.render('add_lecture',{username:userData.name})
});

app.get("/upload_lecture" , function(req, res){
    res.render('inst_upload_lec',{username:userData.name})
});

app.get("/announcements", function(req, res){

    if(userData.role_id == 10010){
        role= "teacher";
        res.render('announcement',
        {username:userData.name,
        teacher: true})
    }
    
    else if(userData.role_id == 10020){
        role= "student";
        res.render('announcement',
        {username:userData.name,
        student: true})
    }
});

app.get("/grade_page", function(req, res){

    if(userData.role_id == 10010){
        role= "teacher";
        res.render('grade_page',
        {username:userData.name,
        teacher: true})
    }
    
    else if(userData.role_id == 10020){
        role= "student";
        res.render('grade_page',
        {username:userData.name,
        student: true})
    }
});

app.get("/ungraded_activity" , function(req, res){
    res.render('view_ungraded_activity',{username:userData.name})
});

app.get("/view_marks" , function(req, res){
    res.render('view_marks',{username:userData.name})
});

app.get("/edit_marks" , function(req, res){
    res.render('edit_marks',{username:userData.name})
});

app.get("/grade_activity" , function(req, res){
    res.render('grade_activity',{username:userData.name})
});

app.listen(3000, function () {
    console.log('Node server is running..');
});