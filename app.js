const express = require("express");
const {randomUUID} = require("crypto");
const fs = require("fs");

const app = express();

app.use(express.json())

let products = [];

fs.readFile("products.json", "utf-8", (err, data) => {
    if(err){
        console.log(err);
    } else{
        products = JSON.parse(data);
    }
});

/**
 * POST => Inserir um dado
 * GET => Buscar um/mais dados
 * PUT => Alterar um dado
 * DELETE =>  Remover um dado
 */

/**
 * Body => Sempre que quiser enviar dados para aplicação
 * Params => /product /id
 * Query => /product?id=168464&value=1545234
 */

app.post("/products", (request, response) => {
    //nome e preço => name e price
    const {name, price} = request.body;
    const product = {
        name,
        price,
        id: randomUUID(),
    };
    products.push(product);

    ProductFile();

    return response.json(product);
});

app.get("/products", (request, response) => {
    return response.json(products)
});

app.get("/products/:id", (request, response) => {
    const {id} = request.params;
    const product = products.find(product => product.id === id);
    return response.json(product);
});

app.put("/products/:id", (request, response) => {
    const {id} = request.params;
    const {name, price} = request.body;

    const productIndex = products.findIndex(product => product.id === id);
    products[productIndex] = {
        ...products[productIndex],
        name,
        price
    };

    ProductFile();

    return response.json({message: "Produto alterado com sucesso"});
});

app.delete("/products/:id", (request, response) =>{
    const {id} = request.params;
    const productIndex = products.findIndex(product => product.id === id);

    products.splice(productIndex, 1);

    ProductFile();
    return response.json({message: "Produto removido com sucesso"})
});

function ProductFile(){
    fs.readFile("products.json", "utf-8", (err, data) => {
        if(err){
            console.log(err);
        } else{
            products = JSON.parse(data);
        }
    });
}

app.listen(4002, () => console.log("Servidor está rodando na porta 4002"));