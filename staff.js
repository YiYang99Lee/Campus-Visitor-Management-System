const bcrypt = require("bcryptjs");
let students;
let users;
let staffs;

class Staff {
	static async injectDB(conn) {
		students = await conn.db("Assignment").collection("students");
        users = await conn.db("Assignment").collection("users");
        staffs = await conn.db("Assignment").collection("staffs");
	}

	/**
	 * @remarks
	 * This method is not implemented yet. To register a new user, you need to call this method.
	 * 
	 * @param {*} username 
	 * @param {*} password 
	 * @param {*} phone 
	 */
     static async register(username, password) {
		// TODO: Check if username exists
		var result = await staffs.find({"username": username}).count()
		if(result !== 0){
			console.log("Username already exists")
			return "Username already exists";
		}else{
			// TODO: Hash password
			var hashedPassword = await bcrypt.hash(password, 10)
			// TODO: Save user to database
			await staffs.insertOne({username:username,password:hashedPassword,role:"staff"});
			return 'Register Successfully';
		}
	}

	static async view(username, password) {
		// TODO: Check if username exists
		var result = await staffs.find({"username": username}).count()
		if(result !== 0){
			var login = await staffs.find({"username": username}).map( function(p) { return p.password; } ).toArray().then(res => {return res})
			var login = String(login)
			//var login = await users.aggregate([{$match:{username: username}},{$project:{password:1,_id:0}}]).password.toArray().then(res => {return res});
			//console.log(login)
			// TODO: Validate password
			var compare = await bcrypt.compare(password, login)
			console.log(compare)
			if(compare == true){
				console.log("Login Successfully");
				// TODO: Return user object
				await users.find().toArray().then(res => {console.log(res)})
				return users.find().toArray();
			}else{
				console.log("Password is incorrect");
				return "Password is incorrect";
			}
		}else{
			console.log("Username is incorrect");
			return "Username is incorrect";
		}
	}

	static async delete(username) {
		// TODO: Check if username exists
		var result = await staffs.find({"username": username}).count()
		if(result !== 1){
			return "Username does not exist";
		}else{
			await staffs.deleteOne({username:username})
			return "Data with the username is deleted";
		}
	}

	static async update(username,userusername, password, userpassword) {
		// TODO: Check if username exists
		var result = await staffs.find({"username": username}).count()
		console.log("connected")
		if(result !== 0){
			var login = await staffs.find({"username": username}).map( function(p) { return p.password; } ).toArray().then(res => {return res})
			var login = String(login)
			//var login = await users.aggregate([{$match:{username: username}},{$project:{password:1,_id:0}}]).password.toArray().then(res => {return res});
			//console.log(login)
			// TODO: Validate password
			var compare = await bcrypt.compare(password, login)
			console.log(compare)
			if(compare == true){
				console.log("Login Successfully");
				var hashedPassword = await bcrypt.hash(userpassword, 10)
				// TODO: Return user object
				await users.find({"username": userusername}).toArray().then(res => {console.log(res)})
				await users.updateOne({"username": userusername},{$set:{"password":hashedPassword}})
				return "Password Modified";
			}else{
				console.log("Password is incorrect");
				return "Password is incorrect";
			}
		}else{
			console.log("Username is incorrect");
			return "Username is incorrect";
		}
	}

	static async login(username, password) {
		// TODO: Check if username exists
		var result = await staffs.find({"username": username}).count()
		if(result !== 0){
			var login = await staffs.find({"username": username}).map( function(p) { return p.password; } ).toArray().then(res => {return res})
			var login = String(login)
			//var login = await users.aggregate([{$match:{username: username}},{$project:{password:1,_id:0}}]).password.toArray().then(res => {return res});
			//console.log(login)
			// TODO: Validate password
			var compare = await bcrypt.compare(password, login)
			console.log(compare)
			if(compare == true){
				console.log("Login Successfully");
				// TODO: Return user object
				await staffs.find({"username": username}).toArray().then(res => {console.log(res)})
				return ("Login Successfully");
			}else{
				console.log("Password is incorrect");
				return "Password is incorrect";
			}
		}else{
			console.log("Username is incorrect");
			return "Username is incorrect";
		}
	}
}

module.exports = Staff;
