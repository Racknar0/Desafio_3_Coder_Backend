const express = require('express');
const fs = require('fs');
const app = express();
const port = 8080;


class contenedor {
    // Metodo para guardar los productos
    async save(producto) {
        let productoToSave = {
            nombre : producto.nombre,
            precio : producto.precio,
            color : producto.color,
        }

        //! se lee el archivo
        let obj = await this.getall();
        
        //! si no existe el archivo se crea 
        if (obj === undefined ) {

            productoToSave.id = 1;
            console.log('El archivo no existe procedera a crearse');
            try {
                fs.promises.writeFile('./productos.txt', JSON.stringify([productoToSave], null, 2), 'utf-8' );
                return productoToSave.id;
            } catch (error) {
                console.log(error.message);
                return
            }
        }
 
        //! si existe el archivo se le agrega un id
        try {

            //extraer el ultimo id
            productoToSave.id = obj[obj.length - 1].id + 1 ;

            obj.push(productoToSave);
            //console.log('obj ---->', obj);
            fs.promises.writeFile('./productos.txt', JSON.stringify(obj, null, 2), 'utf-8' );
            return productoToSave.id;
        } catch (error) {
            console.log(error.message);
        }
    }

    //!Metodo para extraer por id
    async getByID(id){
        let obj = await this.getall();

        if (obj !== undefined) {
            const busqueda = obj.find(producto => producto.id === id);
            if (busqueda !== undefined) {
                return busqueda;
            } else {
                return 'No se encontro el producto';
            }
        } else {
            return 'No existe el producto';
        }

        
    }

    //! Metodo para extraer todos los objetos
    async getall() {
        try {
            const data = await fs.promises.readFile('./productos.txt', 'utf-8');
            return JSON.parse(data);
        } catch (error) {
           console.log('error', error.message);
        }
    }

    //! Metodo para eliminado 
    async deleteByID(id) {
        let obj = await this.getall();
        //borrar un id espcifico
        if (obj !== undefined){
            const busqueda = obj.filter(producto => producto.id !== id);
            fs.promises.writeFile('./productos.txt', JSON.stringify(busqueda, null, 2), 'utf-8' );

        } else {
            return 'No existe el archivo';
        }
    }
    
    async deleteAll() {
        try {
            fs.promises.unlink('./productos.txt');
            return 'Archivo eliminado';
        } catch (err) {
            console.log('error', err.message);
        }
    }

}

const contenedor1 = new contenedor();




const server = app.listen(port, () => {
    console.log(`Servidor activo en el puerto: ${port}`); 
})
server.on('error', error => console.log(`Error listening on port ${port}`, error)); //! Muestra el error en consola


app.get('/productos', (request, response) => {
    contenedor1.getall().then((data) => {
        response.send(data);
    });
})

app.get('/productoRandom', (request, response) => {
    contenedor1.getall().then((data) => {
        let random = Math.floor(Math.random() * data.length);
        response.send(data[random]);
    });
})