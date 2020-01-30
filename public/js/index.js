function loadBlog(){
    let url = "/blog-api/comentarios"; 
    let settings = {
        method: "GET"
    }

    fetch(url , settings).then(response  => {
        if (response.ok){
            return response.json();
        }
    }).then (responseJSON => {
        displayResults(responseJSON);

    });
};

function displayResults(responseJSON){
    let comentarios  = $("#comentarios");

    console.log(responseJSON);

    comentarios.empty();
    /*
    for (let i = 0; i < responseJSON.length; i++) {
  
      comentarios.append(`<div id="result">
                        <h3>ID: ${responseJSON[i].id}</h3>
                        <h2>Titulo: ${responseJSON[i].titulo}</h2>
                        <h3>Autor: ${responseJSON[i].autor}</h3>
                        <p>Contenido: ${responseJSON[i].contenido}</p>
                        <h3>Fecha: ${responseJSON[i].fecha}</h3>
                        <button class="button" id="eliminar" value="${responseJSON[i].id}">Eliminar</button>
                      </div>`);
    } */
    responseJSON.forEach(element => {
        comentarios.append(`<div id="result">
        <h3>ID: ${element.id}</h3>
        <h2>Titulo: ${element.titulo}</h2>
        <h3>Autor: ${element.autor}</h3>
        <p>Contenido: ${element.contenido}</p>
        <h3>Fecha: ${element.fecha}</h3>
        
      </div>`);
        
    });

};

function buttons(){
    let newComment = $("#submitButton");

    newComment.on("click", (event)=>{
        event.preventDefault();
        let titulo = $("#titulo").val();
        let autor = $("#autor").val();
        let contenido = $("#contenido").val();
        if(titulo != "" && autor != "" && contenido !=""){
            let url = "/blog-api/nuevo-comentario";
            let bodyJSON = {
                "titulo" : titulo,
                "autor" : autor,
                "contenido" : contenido
            }
            let settings = {
                method : "POST",
                body : JSON.stringify(bodyJSON),
                headers:{
                    "Content-Type": "application/json"
                }
            }
            fetch(url , settings).then(response  => {
                if (response.ok){
                    return response.json();
                }
                throw new Error(response.statusText);
            }).then((responseJSON)=>{
                loadBlog(responseJSON);
            });
        }else{
            //$("#titulo").removeClass( "quitar" ).addClass( "mostrar" );
        }
        $("#comentarios").empty();
        $("#commentForm").trigger("reset");
        scroll(0,0);
    });

    $("#eliminar").on("click", (event)=>{
        event.preventDefault(); 
        
        let id = $("#idEliminar").val();
        let url = `/blog-api/remover-comentario/${id}`;
        /*
        let settings = {
            method : "DELETE",
    
            body: JSON.stringify(bodyJSON),
            headers:{
                "Content-Type": "application/json"
            }
        }
        fetch(url , settings).then(response  => {
            if (response.ok){
                return response.json();
            }
            throw new Error(response.statusText);
        }).then((responseJSON)=>{
            loadBlog();
        });*/


        $.ajax({
            url: url,
            method: "DELETE",
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function(resposeJSON) {
                console.log(resposeJSON);
                loadBlog();
            },
            error: function(err) {
                if (err.status == 404) {
                    alert("Error: ID proporcionado no existe");
                }
                console.log(err);
                loadBlog();
            }
        });

        $("#eliminarForm").trigger("reset");
        scroll(0,0);
    });

    let editComment = $("#submit"); 

    editComment.on("click", (event)=>{
        event.preventDefault();

        let id = $("#idb").val();
        let titulo = $("#titulob").val();
        let autor = $("#autorb").val();
        let contenido = $("#contenidob").val();

        if(id != "" ){
            let url = `/blog-api/actualizar-comentario/${id}`;
            let bodyJSON = {
                "titulo" : titulo,
                "autor" : autor,
                "contenido" : contenido,
                "id": id
            }
            let settings = {
                method : "PUT",
                body : JSON.stringify(bodyJSON),
                headers:{
                    "Content-Type": "application/json"
                }
            }
            fetch(url , settings).then(response  => {
                if (response.ok){
                    return response.json();
                }
                throw new Error(response.statusText);
            }).then((responseJSON)=>{
                loadBlog(responseJSON);
            });
        }
        
        $("#EditForm").trigger("reset");
        scroll(0,0);
    });

    let buscar = $("#busb");

    buscar.on("click", (event)=>{
        event.preventDefault();
        let autor = $("#nomb").val();
        if(autor != "" ){
            let url = "/blog-api/comentarios-por-autor?autor="+autor;
            let settings = {
                method : "GET"
            }
            fetch(url , settings).then(response  => {
                if (response.ok){
                    return response.json();
                }
                throw new Error(response.statusText);
            }).then((responseJSON)=>{
                displayResults(responseJSON);
            });
        }
       
        $("#buscar").trigger("reset");
        scroll(0,0);

    });

};
function init(){
    loadBlog();
    buttons();
    
}

init();