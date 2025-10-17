import http.server
import os
import socketserver

PORT = 8080

class MyHandler(http.server.SimpleHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/event':
            self.send_response(200)
            self.send_header('Content-type', 'text/plain')
            self.end_headers()
            self.wfile.write(b'Starting the move to production!')
            print("Button event received from client!")
            os.system("npx eas deploy --prod")
        else:
            self.send_error(404)

Handler = MyHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"Serving HTTP on 0.0.0.0:{PORT}")
    httpd.serve_forever()