const bcrypt = require("bcryptjs");

let students;
 

class Student {
	static async injectDB(conn) {
		students = await conn.db("Assignment").collection("students")
	}

	/**
	 * @remarks
	 * This method is not implemented yet. To register a new user, you need to call this method.
	 * 
	 * @param {*} username 
	 * @param {*} password 
	 * @param {*} phone 
	 */
	static async register(username,password,destination,purpose,duration,timein,timeout,info) {
		// TODO: Check if username exists
		var result = await students.find({"username": username}).count()
		if(result !== 0){
			console.log("Username already exists")
			await students.updateOne({"username": username},{$set:{"destination":destination,"purpose":purpose,"duration":duration,"timein":timein,"timeout":timeout,"info":info}})
			return "Entry with studentname updated";
		}else{
			// TODO: Hash password
			var hashedPassword = await bcrypt.hash(password, 10)
			// TODO: Save user to database
			await students.insertOne({username:username,password:hashedPassword,destination:destination,purpose:purpose,duration:duration,timein:timein,timeout:timeout,info:info,role:"student"})
			return 'Register Successfully';
		}
	}

	static async view(username, password) {
		// TODO: Check if username exists
		var result = await students.find({"username": username}).count()
		if(result !== 0){
			var login = await students.find({"username": username}).map( function(p) { return p.password; } ).toArray().then(res => {return res})
			var login = String(login)
			//var login = await users.aggregate([{$match:{username: username}},{$project:{password:1,_id:0}}]).password.toArray().then(res => {return res});
			//console.log(login)
			// TODO: Validate password
			var compare = await bcrypt.compare(password, login)
			console.log(compare)
			if(compare == true){
				console.log("Login Successfully");
				// TODO: Return user object
				await students.find({"username": username}).toArray().then(res => {console.log(res)})
				return (students.find({"username":username}).toArray());
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
		var result = await students.find({"username": username}).count()
		if(result !== 0){
			var login = await students.find({"username": username}).map( function(p) { return p.password; } ).toArray().then(res => {return res})
			var login = String(login)
			//var login = await users.aggregate([{$match:{username: username}},{$project:{password:1,_id:0}}]).password.toArray().then(res => {return res});
			//console.log(login)
			// TODO: Validate password
			var compare = await bcrypt.compare(password, login)
			console.log(compare)
			if(compare == true){
				console.log("Login Successfully");
				// TODO: Return user object
				await students.find({"username": username}).toArray().then(res => {console.log(res)})
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

module.exports = Student;