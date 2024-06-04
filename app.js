const mysql = require('mysql2');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;
const ip = 'localhost'

app.use(express.static(path.join(__dirname)));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const conexion = mysql.createConnection({
    host: "localhost",
    port: 33060,
    database: "db_consultas",
    user: "root",
    password: "crud"
});

conexion.connect((err) => {
    if (err) {
        console.error('Error de conexión a la base de datos: ' + err.stack);
        return;
    }
    console.log('Conectado a la base de datos.');
});

app.post('/submit-form', (req, res) => {
    const { nombre, apellidos, dni, email, asunto, mensaje } = req.body;
    const query = `INSERT INTO Contactos (nombre, apellidos, dni, email, asunto, mensaje) VALUES (?, ?, ?, ?, ?, ?)`;
    conexion.query(query, [nombre, apellidos, dni, email, asunto, mensaje], (err, result) => {
        if (err) {
            console.error('Error al insertar datos:', err);
            res.status(500).send('Ocurrió un error al procesar tu consulta.');
            return;
        }
        res.status(200).send('Tu consulta ha sido procesada exitosamente.');
    });
});

app.use(express.static('public/'))
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './index.html'))
})

app.listen(port, () => {
    console.log(`Server en http://${ip}:${port}`);
});