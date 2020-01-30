let express = require("express");
let morgan = require("morgan");
let uuid = require("uuid/v4");
let bodyParser = require("body-parser");
let mongoose = require("mongoose");
let jsonParser = bodyParser.json();
let app = express();
let {ComentariosList} = require("./model");
let server; 
let {DATABASE_URL, PORT} = require("./config");

app.use(express.static("public"));
app.use(morgan("dev"));


/*
let comentarios = [{
    id : "123",
    titulo : "Titulo1",
    contenido: "contenido1",
    autor: "Alix",
    fecha: Date()

},{
    id : uuid(),
    titulo : "Titulo2",
    contenido: "contenido2",
    autor: "Fernando",
    fecha: Date()

},{
    id : uuid(),
    titulo : "Titulo3",
    contenido: "contenido3",
    autor: "Elisa",
    fecha: Date()

}];
*/

app.get("/blog-api/comentarios", (req,res) =>{

    ComentariosList.getAll()
    .then(ComentariosList => {
        return res.status(200).json(ComentariosList);
    })
    .catch(error =>{
        console.log(error);
        res.statusMessage = "Hubo un error de conexion con la base de datos";
        return res.status(500).send();
    })    
});

app.get("/blog-api/comentarios-por-autor", (req,res) =>{
    let autor = req.query.autor;

    if (autor != ""){
        ComentariosList.getAutor(req.query.autor)
        .then((comentario) =>{
            if(comentario){
                return res.status(200).json(comentario);
            }

            return res.status(404).send("Este autor no tiene comentarios");
        })
        .catch ((error) =>{
            res.statusMessage = "Error con la base de datos";
            return res.status(500).json(error);
            

        })  
    }else{
        return res.status(406).send("No se administro correctamente el autor");
    };
});

app.post("/blog-api/nuevo-comentario" , jsonParser , (req, res) =>{
    let newComentario = req.body;
    let titulo = req.body.titulo;
    let contenido = req.body.contenido;
    let autor = req.body.autor;

  
    if(titulo != null && contenido != null && autor != null){
        newComentario.id = uuid();
        newComentario.fecha = Date();

        ComentariosList.create( newComentario )
            .then ((newComentario) =>{
                return res.status(201).json(newComentario);
            }).catch ((error) =>{
                res.statusMessage ="Error en conexion con la base de datos";
                return res.status(500).json(error);
        });
        
        
    }else {
        return res.status(406).send("Falta algun Elemento");
    }
});

app.delete("/blog-api/remover-comentario/:id", jsonParser, (req, res)=>{
    let id = req.params.id;
    let idBody = req.body.id;
    if (idBody != null && idBody != ""){
        if(id == idBody){
            ComentariosList.eliminar(req.body.id)
            .then(result =>{
                return res.status(200).send("Comentario Eliminado");
            
            })
            .catch(error =>{
                return res.status(404).send("No existe el ID");
            });

        }else{
            return res.status(409).send("los ID del cuerpo y parametro no coinciden");
        }

    }else{
        return res.status(406).send("Falta administrar el id en el cuerpo");

    }

});

app.put("/blog-api/actualizar-comentario/:id", jsonParser , (req,res) =>{
    let idBody = req.body.id;
    let titulo = req.body.titulo;
    let autor = req.body.autor;
    let contenido = req.body.contenido;
    let idParam = req.params.id;

    if(idBody != null && idBody != ""){
        if(idBody == idParam){
            if(titulo != null || contenido != null || autor != null){
                ComentariosList.actualizar(titulo,autor,contenido,idBody)
                .then( (comentario) =>{
                    return res.status(202).json(comentario); 
                })
                .catch((error) =>{
                    return res.status(500).send();
                })
                                  
            }else{
                return res.status(406).send("No hay ningun campo a actualizar");
            };
        }else{
            return res.status(409).send("Los id del cuerpo y parametro no son los mismos");
        };
    } else{
        return res.status(406).send("Falta administrar el id en el cuerpo");
    };
});


function runServer(port, databaseUrl){
	return new Promise( (resolve, reject ) => {
		mongoose.connect(databaseUrl, response => {
			if ( response ){
				return reject(response);
			}
			else{
				server = app.listen(port, () => {
					console.log( "App is running on port " + port );
					resolve();
				})
				.on( 'error', err => {
					mongoose.disconnect();
					return reject(err);
				})
			}
		});
	});
}

function closeServer(){
	return mongoose.disconnect()
		.then(() => {
			return new Promise((resolve, reject) => {
				console.log('Closing the server');
				server.close( err => {
					if (err){
						return reject(err);
					}
					else{
						resolve();
					}
				});
			});
		});
}

runServer( PORT, DATABASE_URL );

module.exports = { app, runServer, closeServer }



