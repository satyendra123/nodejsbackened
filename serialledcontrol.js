/*
// EXAMPLE-1 it receive the serial data from arduino and print it on the console
const { SerialPort } = require('serialport');
const { ByteLengthParser } = require('@serialport/parser-byte-length');
const parser = new ByteLengthParser({ length: 1 });
const config = {
  path: 'COM6',
  baudRate: 9600,
  dataBits: 8,
  parity: 'none',
  stopBits: 1,
  autoOpen: false,
};
const port = new SerialPort(config);
let receivedData = ''; // Define receivedData outside the callback
port.open((err) => {
  if (err) {
    console.log('error opening the port' + err.messages);
  }
});
port.write('Hi From Node js', (err) => {
  if (err) {
    console.log('Error writing ' + err.message);
  }
});

port.pipe(parser);
parser.on('data', (data) => {
    if (data.toString() === '\n') {
      console.log('Received message:', receivedData);
      receivedData = ''; // Reset the accumulator for the next message
    } else {
      receivedData += data.toString(); // Accumulate the received data
    }
  });
*/

// EXAMPLE-2 send data to arduino and control the led
/*
const readline = require('readline');
const { SerialPort } = require('serialport');
const { ByteLengthParser } = require('@serialport/parser-byte-length');

const config = {
  path: 'COM6',
  baudRate: 9600,
  dataBits: 8,
  parity: 'none',
  stopBits: 1,
  autoOpen: false,
};
const port = new SerialPort(config);
const parser = port.pipe(new ByteLengthParser({ length: 1 }));

let receivedData = '';

port.open((err) => {
  if (err) {
    console.error('Error opening the port:', err.message);
  }
});

parser.on('data', (data) => {
  if (data.toString() === '\n') {
    console.log('Received message:', receivedData);
    receivedData = '';
  } else {
    receivedData += data.toString();
  }
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askForInput() {
    rl.question('Enter "on" or "off" to control the LED: ', (answer) => {
      if (answer === 'on' || answer === 'off') {
        port.write(answer.toUpperCase(), (err) => {
          if (err) {
            console.error('Error writing:', err.message);
          } else {
            console.log(`Sent command to turn LED ${answer}`);
          }
          askForInput(); // Ask for input again after processing the current input
        });
      } else {
        console.log('Invalid input. Please enter "on" or "off".');
        askForInput(); // Ask for input again
      }
    });
  }
  
  // Initial call to start the input loop
  askForInput();
  */

//EXAMPLE-3 read the data from arduino and insert it into the database

const readline = require('readline');
const { SerialPort } = require('serialport');
const { ByteLengthParser } = require('@serialport/parser-byte-length');
const mysql = require('mysql');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const config = {
  path: 'COM6',
  baudRate: 9600,
  dataBits: 8,
  parity: 'none',
  stopBits: 1,
  autoOpen: false,
};
const port = new SerialPort(config);
const parser = port.pipe(new ByteLengthParser({ length: 1 }));

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'sensor_data_db'
};
const connection = mysql.createConnection(dbConfig);

let receivedData = '';

port.open((err) => {
  if (err) {
    console.error('Error opening the port:', err.message);
  }
});

parser.on('data', (data) => {
  if (data.toString() === '\n') {
    console.log('Received message:', receivedData);
    const [temperatureStr, humidityStr] = receivedData.split(',').map((item) => item.split(':')[1]); // Assuming data format is "temperature:<temperature_value>,humidity:<humidity_value>"
    const temperature = parseFloat(temperatureStr);
    const humidity = parseFloat(humidityStr);
    
    console.log('Parsed temperature:', temperature);
    console.log('Parsed humidity:', humidity);

    // Get current date and time
    const now = new Date();
    const createdAt = now.toISOString().slice(0, 19).replace('T', ' '); // Format: 'YYYY-MM-DD HH:MM:SS'

    // Store data in the database
    connection.query('INSERT INTO sensor (device_id, temperature, humidity, created_at) VALUES (?, ?, ?, ?)', ['M1D4', temperature, humidity, createdAt], (error, results, fields) => {
      if (error) {
        console.error('Error storing data:', error.message);
      } else {
        console.log('Data stored successfully');
      }
    });

    receivedData = '';
  } else {
    receivedData += data.toString();
  }
});
