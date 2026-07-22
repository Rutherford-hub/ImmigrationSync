import urllib.request
import json

url = "http://localhost:8080/api/v1/auth/register"
data = json.dumps({"email": "test-py@test.com", "password": "password123"}).encode('utf-8')

# Test OPTIONS
req_options = urllib.request.Request(url, method="OPTIONS")
req_options.add_header("Origin", "http://localhost:8087")
req_options.add_header("Access-Control-Request-Method", "POST")
try:
    with urllib.request.urlopen(req_options) as res:
        print("OPTIONS Response:", res.status)
        print("OPTIONS Headers:", res.headers)
except Exception as e:
    print("OPTIONS Error:", e)

# Test POST
req_post = urllib.request.Request(url, data=data, method="POST")
req_post.add_header("Content-Type", "application/json")
req_post.add_header("Origin", "http://localhost:8087")
try:
    with urllib.request.urlopen(req_post) as res:
        print("POST Response:", res.status)
        print("POST Headers:", res.headers)
        print("POST Body:", res.read().decode('utf-8'))
except Exception as e:
    print("POST Error:", e)
