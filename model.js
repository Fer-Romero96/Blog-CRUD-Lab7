let mongoose = require("mongoose");
let uuid = require("uuid/v4");

mongoose.Promise = global.Promise;

let blogCollection = mongoose.Schema({
    id : {type:String},
    titulo: {type:String},
    autor : {type: String},
    contenido: {type:String},
    fecha : { type: String}
    /*    matricula : {
        type: Number,
        required : true,
        unique : true
    }
     */
});

let Comentario = mongoose.model( "comentarios", blogCollection );

let ComentariosList = {
    getAll : function() {
        return Comentario.find()
        .then(Comentario =>{
            return Comentario;

        })
        .catch( error => {
            throw Error (error);
        });
    },
    create : function(newComentario){
        return Comentario.create(newComentario)
        .then( comentario => {
            return comentario;
        })
        .catch(error => {
            throw Error(error);
        });
    },
    getAutor : function (autor){
        return Comentario.find({autor : autor})
        .then(comentario =>{
            return comentario;
        })
        .catch(error =>{
            throw Error(error);
        });
    },
    eliminar : function(id){
        return Comentario.findOneAndRemove({id})
        .then(result =>{
            return result;

        })
        .catch(error =>{
            throw Error(error);

        });
    },
    actualizar : function (titulo, autor, contenido, id){
        let act = {
            id
        }
        if(titulo){
            act.titulo = titulo;
        }
        if(autor){
            act.autor = autor;
        }
        if (contenido){
            act.contenido = contenido; 
        }
        return Comentario.updateMany({id},act)
        .then(comentario =>{
            return comentario;

        })
        .catch(error =>{
            throw Error(error);
        });

    }
};

module.exports = {
    ComentariosList
};
