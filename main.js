const jwt = require("jsonwebtoken");
const MongoClient = require("mongodb").MongoClient;
const User = require("./user");//calling the function we created in user.js as library
const Staff = require("./staff");//calling the fuction we created in staff.js as library
const Student = require("./student");//calling the function we created in student.js as library

function generateToken(payload) {
  return jwt.sign(payload, "secret", { expiresIn: "100y" });
}

MongoClient.connect(
	// TODO: Connection 
	"mongodb+srv://m001-student:m001-mongodb-basics@sandbox.shin9.mongodb.net/?retryWrites=true&w=majority",
	{ useNewUrlParser: true },
).catch(err => {
	console.error(err.stack)
	process.exit(1)
}).then(async client => {
	console.log('Connected to MongoDB');
	await User.injectDB(client)
	await Student.injectDB(client)
	await Staff.injectDB(client)
})

const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'Campus Visitor Management API',
			version: '1.0.0',
		},
		components:{
			securitySchemes:{
				jwt:{
					type:'http',
					scheme:'bearer',
					in:"header",
					bearerFormat:'JWT'
				}
			},
			security:[
				{jwt:[]}
			]
		}
	},
	apis: ['./main.js'],
};

const swaggerSpec = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

function verification(req,res,next ) {
	const authHeader = req.headers['authorization']
	const token = authHeader && authHeader.split(' ')[1]
	if(token == null) return res.sendStatus(401)
	jwt.verify(token, 'secret', (err, user) => {
		console.log(err)

		if(err) return res.sendStatus(403)
		req.user = user
		next()
})
};
 

app.get('/', (req, res) => {
	res.send('Hello World')
})

app.get('/hello', (req, res) => {
	res.send('Hello BENR2423')
})

//////ADMIN//////////
/**
 * @swagger
 * /adminlogin:
 *   post:
 *     description: Admin login
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful Admin login
 *       400:
 *         description: Invalid username or password
 */
app.post('/adminlogin', async (req, res) => {
	console.log(req.body);
	
	const user = await User.login(req.body.username, req.body.password);//variable for storing string passed from login function in staff.js
	if (user=="Login Successfully"){
		const accesstoken = generateToken({ username: req.body.username, role:"user"});
		res.status(200).json({
			message: 'Login Successfully',
			accesstoken: accesstoken
		});//response for successful login
	}else{
		res.status(400).send('Invalid username or password');//response for invalid username or password
	}
		
		// res.json({
	// 	_id: '123456',
	// 	name: 'test',
	// 	age: 18,
	// })	
})

/**
 * @swagger
 * /adminview:
 *   post:
 *     security:
 *       - jwt: []
 *     description: View all students
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful student view
 *       400:
 *         description: Invalid username or password
 */

app.post('/adminview',verification, async (req, res) => {
	console.log(req.body);
	if(req.user.role=="user"){
	const user = await User.view(req.body.username, req.body.password);//variable for storing string passed from login function in staff.js
	if (user=="Password is incorrect"){
		res.status(400).send("Password incorrect");//response for successful login
	}else if(user=="Username is incorrect"){
		res.status(400).send('Invalid username');//response for invalid username or password
	}else{
		res.status(200).send(
			user
		)
		}
	}else{
		res.status(403).send("You are not admin");
		// res.json({
	// 	_id: '123456',
	// 	name: 'test',
	// 	age: 18,
	// })	
}})

/**
 * @swagger
 * /adminregister:
 *   post:
 *     description: Register new admin
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful admin registration
 *       402:
 *         description: Duplicate username
 */

app.post('/adminregister', async (req, res) => {
	console.log(req.body);
	const user = await User.register(req.body.username, req.body.password);//variable for storing string passed from register function in user.js

	if (user == 'Register Successfully'){
		res.status(200).send('Register Successfully');//response for successful registration
	}else{
		res.status(402).send('Username already exists');//response for duplicate username
	}
		// res.json({
		// 	_id: '123456',
		// 	name: 'test',
		// 	age: 18,
		// })
	
	
})

/**
 * @swagger
 * /adminupdate:
 *   patch:
 *     security:
 *       - jwt: []
 *     description: Update student entry
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               studentname:
 *                 type: string
 *               password:
 *                 type: string
 *               userpassword:
 *                 type: string
 *               destination:
 *                 type: string
 *               purpose:
 *                 type: string
 *               duration:
 *                 type: string
 *               timein:
 *                 type: string
 *               timeout:
 *                 type: string
 *               info:
 *                 type: string
 *     responses:
 *       200:
 *         description: Entry updated
 *       401:
 *         description: Invalid username or password
 *       403:
 *         description: Unauthorised
 */

app.patch('/adminupdate', verification, async (req, res) => {
	console.log(req.user.role);
	if (req.user.role == "user"){
		const user=await User.update(req.body.username, req.body.studentname,req.body.password,req.body.userpassword,req.body.destination,req.body.purpose,req.body.duration,req.body.timein,req.body.timeout,req.body.info);
		if (user == 'Password Modified'){
			res.status(200).send('Entry Changed');//response for successful password change
		}else{
			res.status(401).send('Invalid Authorization');//response for duplicate username
		}
	}else{
		res.status(403).send('Forbidden');//response for forbidden
	}
})

/**
 * @swagger
 * /admindelete:
 *   delete:
 *     security:
 *       - jwt: []
 *     description: Delete Student entry
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *              
 *     responses:
 *       200:
 *         description: Student entry deleted
 *       401:
 *         description: Student entry not found
 *       403:
 *         description: Unauthorised
 */

app.delete('/admindelete',verification, async (req, res) => {
	if(req.user.role=="user"){
	const user=await User.delete(req.body.username);
	if (user == 'Data with the username is deleted'){
		res.status(200).send('Student entry deleted');//response for successful user delete
	}else{
		res.status(401).send('Error deleting student');//response for illegal username
	}
	}else{
		res.status(403).send('Forbidden');//response for forbidden
	}
})

////////////STAFF////////////

/**
 * @swagger
 * /stafflogin:
 *   post:
 *     description: Staff login
 *     tags: [Staff]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful Staff login
 *       400:
 *         description: Invalid username or password
 */

app.post('/stafflogin', async (req, res) => {

	const staff = await Staff.login(req.body.username, req.body.password);//variable for storing string passed from login function in staff.js
	if (staff=="Login Successfully"){
		const accesstoken = generateToken({ username: req.body.username, role:"staff"});
		res.status(200).json({
			message: 'Login Successfully',
			accesstoken: accesstoken
		});//response for successful login
	}else{
		res.status(400).send('Invalid username or password');//response for invalid username or password
	}
		// res.json({
	// 	_id: '123456',
	// 	name: 'test',
	// 	age: 18,
	// })	
})

/**
 * @swagger
 * /staffregister:
 *   post:
 *     description: Register new staff
 *     tags: [Staff]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful staff registration
 *       402:
 *         description: Duplicate username
 */

app.post('/staffregister', async (req, res) => {
	const staff= await Staff.register(req.body.username, req.body.password);//variable for storing string passed from register function in staff.js
	if (staff=="Register Successfully"){
		res.status(200).send("Register Successfully");//response for successful registration
	}else{
		res.status(402).send('Username already exists');//response for duplicate username
	}
})

/**
 * @swagger
 * /staffview:
 *   post:
 *     security:
 *       - jwt: []
 *     description: View all admins
 *     tags: [Staff]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful admin view
 *       400:
 *         description: Invalid username or password
 *       403:
 *         description: Unauthorised
 */

app.post('/staffview',verification, async (req, res) => {
	console.log(req.body);
	if(req.user.role=="staff"){
	const staff = await Staff.view(req.body.username, req.body.password);//variable for storing string passed from login function in staff.js
	if (staff=="Password is incorrect"){
		res.status(400).send("Password incorrect");//response for successful login
	}else if(staff=="Username is incorrect"){
		res.status(400).send('Invalid username');//response for invalid username or password
	}else{
		res.send(staff);//response for successful login
	}
	}else{
		res.status(403).send("You are not staff");
	}
})

/**
 * @swagger
 * /staffdelete:
 *   delete:
 *     security:
 *       - jwt: []
 *     description: Delete staff
 *     tags: [Staff]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *              
 *     responses:
 *       200:
 *         description: Staff deleted
 *       401:
 *         description: Staff not found
 *       403:
 *         description: Unauthorised
 */

app.delete('/staffdelete',verification, async (req, res) => { 
	if(req.user.role=="staff"){
	const staff = await Staff.delete(req.body.username);//variable for storing string passed from login function in staff.js
	if (staff=="Data with the username is deleted"){
		res.status(200).send("Staff Entry deleted");//response for successful delete
	}else{
		res.status(401).send('Staff not found');//response for invalid username or password
	}
}else{
	res.status(403).send("You are not staff");
}
})

/**
 * @swagger
 * /staffupdate:
 *   patch:
 *     security:
 *       - jwt: []
 *     description: Update admin password
 *     tags: [Staff]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               userusername:
 *                 type: string
 *               password:
 *                 type: string
 *               userpassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Admin password updated
 *       401:
 *         description: Invalid username or password
 *       403:
 *         description: Unauthorised
 */

app.patch('/staffupdate',verification, async (req, res) => {
	if(req.user.role=="staff"){
	const staff = await Staff.update(req.body.username,req.body.userusername,req.body.password,req.body.userpassword);//variable for storing string passed from login function in staff.js
	if (staff=="Password Modified"){
		res.status(200).send("Password Changed");//response for successful password change
	}else{
		res.status(401).send('Invalid username or password');//response for invalid username or password
	}
	}else{
		res.status(403).send("You are not staff");
	}
})


////////////STUDENT////////////

/**
 * @swagger
 * /studentregister:
 *   put:
 *     tags: [Student]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               userpassword:
 *                 type: string
 *               purpose:
 *                 type: string
 *               duration:
 *                 type: string
 *               timein:
 *                 type: string
 *               timeout:
 *                 type: string
 *               info:
 *                 type: string
 *     responses:
 *       200:
 *         description: Entry updated or created
 *       402:
 *         description: Invalid
 */

app.put('/studentregister', async (req, res) => {
	const student = await Student.register(req.body.username, req.body.password, req.body.destination, req.body.purpose, req.body.duration, req.body.timein, req.body.timeout, req.body.info);//variable for storing string passed from register function in student.js
	if (student=="Entry with studentname updated"){
		res.status(200).send("Entry updated");//response for successful registration
	}else if(student=="Register Successfully"){
		res.status(200).send("Entry created");//response for successful registration
		const accesstoken = generateToken({ username: req.body.username, role:"student"});
	}else{
		res.status(402).send('Invalid');//response for duplicate username
	}
})

/**
 * @swagger
 * /studentlogin:
 *   post:
 *     description: Student login
 *     tags: [Student]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful student login
 *       400:
 *         description: Invalid username or password
 */

app.post('/studentlogin', async (req, res) => {
	console.log(req.body);
	
	const student = await Student.login(req.body.username, req.body.password);//variable for storing string passed from login function in staff.js
	if (student=="Login Successfully"){
		const accesstoken = generateToken({ username: req.body.username, role:"student"});
		res.status(200).json({
			message: 'Login Successfully',
			accesstoken: accesstoken
		});//response for successful login
	}else{
		res.status(400).send('Invalid username or password');//response for invalid username or password
	}
		
		// res.json({
	// 	_id: '123456',
	// 	name: 'test',
	// 	age: 18,
	// })	
})

/**
 * @swagger
 * /studentview:
 *   post:
 *     security:
 *       - jwt: []
 *     description: View self entry
 *     tags: [Student]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful student view
 *       403:
 *         description: Invalid username or password
 */

app.post('/studentview',verification, async (req, res) => {
	if(req.user.role=="student"){
	const student = await Student.view(req.body.username, req.body.password);//variable for storing string passed from login function in student.js
	res.status(200).json([{
		_id: student[0]._id,
		username: student[0].username,
		destination: student[0].destination,
		purpose: student[0].purpose,
		duration: student[0].duration,
		timein: student[0].timein,
		timeout: student[0].timeout,
		info: student[0].info,
		role: student[0].role
	}])
}else{
	res.status(403).send("You are not student");
}}
)

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})
