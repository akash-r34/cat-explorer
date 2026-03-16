const https = require('https');

const data = JSON.stringify({ name: "Simba3", age: "3", description: "test" });

const options = {
  hostname: 'gps6cdg7h9.execute-api.eu-central-1.amazonaws.com',
  port: 443,
  path: '/prod/create',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = https.request(options, res => {
  console.log(`statusCode: ${res.statusCode}`);
  res.on('data', d => {
    process.stdout.write(d);
  });
});

req.on('error', error => {
  console.error(error);
});

req.write(data);
req.end();
