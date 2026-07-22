const http = require('http');

const data = JSON.stringify({
  email: 'test-node@test.com',
  password: 'password123'
});

// Test OPTIONS
const reqOptions = http.request({
  hostname: 'localhost',
  port: 8080,
  path: '/api/v1/auth/register',
  method: 'OPTIONS',
  headers: {
    'Origin': 'http://localhost:8087',
    'Access-Control-Request-Method': 'POST'
  }
}, (res) => {
  console.log(`OPTIONS STATUS: ${res.statusCode}`);
  console.log('OPTIONS HEADERS:', res.headers);
});
reqOptions.on('error', (e) => console.error(`OPTIONS error: ${e.message}`));
reqOptions.end();

// Test POST
const reqPost = http.request({
  hostname: 'localhost',
  port: 8080,
  path: '/api/v1/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Origin': 'http://localhost:8087',
    'Content-Length': Buffer.byteLength(data)
  }
}, (res) => {
  console.log(`POST STATUS: ${res.statusCode}`);
  console.log('POST HEADERS:', res.headers);
  res.setEncoding('utf8');
  res.on('data', (chunk) => console.log(`POST BODY: ${chunk}`));
});
reqPost.on('error', (e) => console.error(`POST error: ${e.message}`));
reqPost.write(data);
reqPost.end();
