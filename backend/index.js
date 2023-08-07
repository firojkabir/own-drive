const express = require("express");
const { exec } = require("child_process");
const cors = require("cors");
const http = require('http');
const { Server } = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

const port = process.env.PORT || 3000;

const baseDir = `~/Desktop/drive`

app.use(cors());
app.use(express.json());

app.get('/files', (req, res) => {

	exec(`ls ${baseDir}`, (error, stdout, stderr) => {
		if (error) {
			console.log(`error: ${error.message}`);
		}
		if (stderr) {
			console.log(`stderr: ${stderr}`);
		}

		const files = stdout.split('\n').filter(Boolean)
		res.json({
			data: files
		})
	});
})

app.get('/files/:fileName', (req, res) => {
	const { fileName } = req.params

	exec(`cat ${baseDir}/${fileName}`, (error, stdout, stderr) => {
		if (error) {
			console.log(`error: ${error.message}`);
		}
		if (stderr) {
			console.log(`stderr: ${stderr}`);
		}

		res.json({
			content: stdout
		})
	});
})

app.post('/files', (req, res) => {
	const { fileName, content } = req.body

	exec(`echo ${content} > ${baseDir}/${fileName}`, (error, stdout, stderr) => {
		if (error) {
			console.log(`error: ${error.message}`);
		}
		if (stderr) {
			console.log(`stderr: ${stderr}`);
		}

		res.status(201).json({
			fileName: fileName
		})

		io.emit('newFileCreated')
	});
})

app.put('/files/:fileName', (req, res) => {
	const { fileName } = req.params
	const { newFileName } = req.body

	exec(`mv ${baseDir}/${fileName} ${baseDir}/${newFileName}`, (error, stdout, stderr) => {
		if (error) {
			console.log(`error: ${error.message}`);
		}
		if (stderr) {
			console.log(`stderr: ${stderr}`);
		}

		res.json({
			message: "File renamed successfully!"
		})

		io.emit('fileRenamed')
	});
})

app.delete('/files', (req, res) => {
	const { fileName } = req.body

	exec(`rm ${baseDir}/${fileName}`, (error, stdout, stderr) => {
		if (error) {
			console.log(`error: ${error.message}`);
			return res.status(400).json({
				message: `Invalid filename: ${fileName}`
			})
		}
		if (stderr) {
			console.log(`stderr: ${stderr}`);
		}
		
		res.status(204).json()

		io.emit('fileDeleted')
	});
})

app.post('/nginx', (req, res) => {
	const { action } = req.body

	exec(`sudo service nginx ${action}`, (error, stdout, stderr) => {
		if (error) {
			console.log(`error: ${error.message}`);
		}
		if (stderr) {
			console.log(`stderr: ${stderr}`);
		}

		res.status(202).json({
			message: `nginx status changed - ${action}`
		})

		io.emit('nginxStatusChanged', action)
	});
})

// app.listen(port, () => {
// 	console.log(`Example app listening on port ${port}`);
// });

io.on('connection', (socket) => {
	console.log('a user connected', socket.id);
	socket.on('message', (data) => {
		console.log('Received:', data)
		data.sentAt = Date.now()
		io.emit('newMessage', data)
	});
});

server.listen(port, () => {
	console.log(`App listening on port ${port}`);
});
