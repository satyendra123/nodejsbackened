// ye chiz humne code step by step se sikha hai
/*
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const port = 3000;

app.use(bodyParser.json()); // we will use this when i need to take the data from the postman in json format

const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'test',
});

// EXAMPLE-1 post request this will send the static data to the database
app.post('/', (req, res) => {
  const data= {name:"bhaskar",password:"3030",user_type:"visitor"};
  conn.query('INSERT INTO users set?',data, (err, results,fields) => {
    if (err) throw err;
    res.send('result');
  });
});

// EXAMPLE-2 it will receive the data send by the postman and insert the data into the database
app.post('/', (req, res) => {
  const data= req.body;
  conn.query('INSERT INTO users set?',data, (err, results,fields) => {
    if (err) throw err;
    res.send('result');
  });
});

// EXAMPLE-1 get request. get all the records from the database using get request
app.get('/', (req, res) => {
  conn.query('SELECT * FROM users', (err, results) => {
    if (err)
    {
      res.send("error");
    }
    else
    {
      res.send(results);
    }
   
  });
});

// EXAMPLE-1 Update the data into the database
app.put('/:id', (req, res) => {
  const data = [req.body.name,req.body.password,req.body.user_type,req.params.id];
  conn.query('UPDATE users SET name=?, password=? user_type=?,where id=?,data', (err, results) => {
    if (err) throw err;
    res.send('User updated successfully');
  });
});

// EXAMPLE-2 Update the data into the database and if the data is not matched then insert this data into the database
app.put('/:id', (req, res) => {
  const id = req.params.id;
  const name = req.body.name;
  const password = req.body.password;
  const user_type = req.body.user_type;

  // Check if user exists
  conn.query('SELECT * FROM users WHERE id = ?', id, (err, results) => {
    if (err) throw err;

    if (results.length > 0) {
      // User exists, update the record
      conn.query('UPDATE users SET name = ?, password = ?, user_type = ? WHERE id = ?', [name, password, user_type, id], (err, results) => {
        if (err) throw err;
        res.send('User updated successfully');
      });
    } else {
      // User does not exist, insert a new record
      conn.query('INSERT INTO users (id, name, password, user_type) VALUES (?, ?, ?, ?)', [id, name, password, user_type], (err, results) => {
        if (err) throw err;
        res.send('User inserted successfully');
      });
    }
  });
});

//EXAMPLE-3 we can do the same thing using on dublicate 
app.put('/:id', (req, res) => {
  const data = [req.body.name, req.body.password, req.body.user_type, req.params.id];
  const query = ` INSERT INTO users (name, password, user_type, id) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE name = VALUES(name), password = VALUES(password), user_type = VALUES(user_type)`;
  conn.query(query, data, (err, results) => {
    if (err) throw err;
    res.send('User updated successfully');
  });
});

// EXAMPLE-1 just to check whether my delete api  is working or not
app.delete('/:id',(req,res)=>{
  res.send(req.params.id)
})

// Delete
app.delete('/:id', (req, res) => {
  const id = req.params.id;  // postman se jo id aa rhi hai use hum store kara lenge ek variable me
  conn.query('DELETE FROM users WHERE id=?', [id], (err, results) => {
    if (err) throw err;
    res.send('User deleted successfully');
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
*/

const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const port = 8080;

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'jplearn'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to database');
});

app.use(bodyParser.json());

// Handle CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  next();
});

app.post('/', (req, res) => {
  const { device_id, type, value } = req.body;
  const created = new Date().toISOString().slice(0, 19).replace('T', ' ');

  const query = `INSERT INTO events (device_id, type, value, created) VALUES ('${device_id}', '${type}', '${value}', '${created}')`;

  db.query(query, (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ response: 'Error creating new data :(' });
      return;
    }
    res.status(201).json({ response: 'New data created successfully :)' });
  });
});

// Handle GET requests
// Handle GET requests
app.get('/', (req, res) => {
  // Handle GET requests with query parameters "device_id", "type", and "limit"
  if (req.query.device_id && req.query.type && req.query.limit) {
    const { device_id, type, limit } = req.query;

    const sql = `SELECT * FROM events WHERE device_id = '${device_id}' AND type = '${type}' ORDER BY id DESC LIMIT ${limit};`;
    db.query(sql, (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
      res.json(result);
    });
  } 
  // Handle GET requests with query parameters "device_id" and "type"
  else if (req.query.device_id && req.query.type) {
    const { device_id, type } = req.query;

    const sql = `SELECT * FROM events WHERE device_id = '${device_id}' AND type = '${type}' ORDER BY id DESC LIMIT 10;`;
    db.query(sql, (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
      res.json(result);
    });
  } 
  // Handle GET requests with query parameter "device_id"
  else if (req.query.device_id) {
    const { device_id } = req.query;

    const queries = [
      `SELECT * FROM events WHERE device_id = '${device_id}' AND type = 'Temperature' ORDER BY id DESC LIMIT 1;`,
      `SELECT * FROM events WHERE device_id = '${device_id}' AND type = 'Humidity' ORDER BY id DESC LIMIT 1;`,
      `SELECT * FROM events WHERE device_id = '${device_id}' AND type = 'Light' ORDER BY id DESC LIMIT 1;`
    ];

    Promise.all(queries.map(q => new Promise((resolve, reject) => {
      db.query(q, (err, result) => {
        if (err) reject(err);
        resolve(result[0]);
      });
    })))
    .then(data => {
      const [temperature, humidity, light] = data;
      res.json({ temperature, humidity, light });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    });
  }
});
app.put('/', (req, res) => {
  const { id, device_id, type, value } = req.body;
  const created = new Date().toISOString().slice(0, 19).replace('T', ' ');

  const query = `UPDATE events SET created = '${created}' WHERE id = ${id}`;

  db.query(query, (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ response: 'Error updating data :(' });
      return;
    }
    res.status(200).json({ response: 'Data updated successfully :)' });
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
