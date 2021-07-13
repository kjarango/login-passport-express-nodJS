// se corre con node server.js
const express = require('express');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passportLocal = require('passport-local').Strategy; //Strategy es para configurar el comportamiento de la estrategia  
// para las librerias se debe ejecutar npm install express ejs passport express-session cookies-parser
const app = express();

//middleware
// permite leer lo datos ingresados en un formulario.
app.use(express.urlencoded({ extended: true}))

//se debe de configurar sesion y cookieParser para que express pueda manejas sesiones
app.use(cookieParser('mi super secreto')); // se debe de pasar un secreto

app.use(session({
    secret:'mi super secreto',
    //definir el comportamiento de las sesiones
    resave:true, // en cualquier peticion aunque la sesion no halla sido modificada se va ha guardar
    saveUninitialized:true // signifique si no se inicializa en una pticion aun asi se va ha gaurdar
}));

//passport
app.use(passport.initialize());
app.use(passport.session());

// estrategia de autenticacion con passport llamada passport local para loguearse con usurio y/o correo y contraseña
// instalar npm install passport-local
 passport.use(new passportLocal(function(username,password,done){
    
     if(username === "holamundo" && password === "123456")
     // done envia el resultado del proceso de autenticacion
     // done se puede llamar con 3 argunetos, 1: posible error, 2:usuario, 3: serie de opciones
        return done(null, {id:1, name:"Pneuma"})//simulacion de un usuario que iniciop sesion- entorno normal "BD-buscar usuario...."
    done(null, false);
 }));

 // configurar con se va serializar y como se va ha deserializar un usuario
 // passport guarda  toda la informacion {id:1, name:"Pneuma" } pero no es recomendado, se puede guardar el id para serializarlo

 //serializacion
 passport.serializeUser(function(user,done){
    done(null,user.id);
 });

 //deserializacion
passport.deserializeUser(function(id,done){
    done(null,{id:1, name:"Pneuma"});
})

//vista en ejs es similar a html
app.set('view engine','ejs');


app.get("/", (req, res,next)=>{
    // isAuthenticated responde verdadero o falso si el usuario a iniciado sesion 
    // si ya se inicio sesion se muestra la vista de bienvenida
    if(req.isAuthenticated()) return next(); //el next es para enviar la respuesta al siguiente middllware
        res.redirect("/login")
        //si no se redirecciona a /login 
    },
    (req, res)=>{
    
    //mensaje de pantalla bienvenida 
    res.send("HOLA!!")
})

app.get("/login", (re,res)=>{
    // Mostrar el formulario de login 
    res.render("login")
});

app.post("/login", passport.authenticate('local',{
    successRedirect: "/",
    failureRedirect:"/login"
    }));

app.get("/login", (re,res)=>{
    // recibir credenciales e iniciar sesion 
    
});

app.listen(8080,()=> console.log("server started"))