import http from 'http';
import fs from 'fs';
import { WebSocketServer, WebSocket } from 'ws';

const PORT = 3001;

const server = http.createServer(async (req, res)=>{
    // const file = await fs.promises.readFile("./public/index.html")
    // res.statusCode = 200
    // res.setHeader("Content-Type", "text/html")
    // res.end(file)

    if (req.url === '/' || req.url === '/index.html') {
            const file = await fs.promises.readFile("./public/index.html");
            res.statusCode = 200;
            res.setHeader("Content-Type", "text/html");
            return res.end(file);
        }

        // If the browser requests your client-side JavaScript file
        if (req.url === '/script.js') {
            const file = await fs.promises.readFile("./public/script.js");
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/javascript");
            return res.end(file);
        }

})

const wss = new WebSocketServer({server})

wss.on("connection", (socket, req)=>{
    const username = new URL(req.url, "http://localhost").searchParams.get(
  "username",
);

    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: "system", text: `${username} joined` }))
        }
        
    });

    socket.on("message", (data)=>{
        const { username: user, text } = JSON.parse(data.toString())
        wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: 'chat', username: user, text }) )
        }
    })
    })

    socket.on("close", ()=>{
        wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: 'system', text: `${username} left`}))
            }
    })
    })
    

})

server.listen(PORT, ()=>{
    console.log(`Chat server running at http://localhost:${PORT}`)
})
