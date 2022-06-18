const MongoClient = require("mongodb").MongoClient;
const Staff = require("./staff");
const Student = require("./student");
const User = require("./user")

describe("User Account Management", () => {
	let client;
	beforeAll(async () => {
		client = await MongoClient.connect(
			"mongodb+srv://m001-student:m001-mongodb-basics@sandbox.shin9.mongodb.net/?retryWrites=true&w=majority",
			{ useNewUrlParser: true },
		);
		await Student.injectDB(client);
		await User.injectDB(client);
		await Staff.injectDB(client);
	})

	afterAll(async () => {
		await client.close();
	})
///////////////////////////////////////////////////Admin///////////////////////////////////////////////////////////
	test("New user registration", async () => {//usertest for new user registration
		const res = await User.register("username167", "123")
		expect(res).toBe('Register Successfully')
	})

	test("Duplicate username", async () => {//usertest for duplicate username
		const res = await User.register("user167", "1234")
		expect(res).toBe("Username already exists")
	})

	test("User login invalid username", async () => {//test for invalid username
		const res = await User.login("user1", "43567")
		expect(res).toBe("Username is incorrect")
	})

	test("User login invalid password", async () => {//test for invalid password
		const res = await User.login("username167", "9876543")
		expect(res).toBe("Password is incorrect") 
	})

	test("User login successfully", async () => {//test for successful login
		const res = await User.login("username167", "123")
		expect(res).toBe("Login Successfully")
	})

	test("Student delete successfully", async () => {//test for successful delete
		const res = await User.delete("Student")
		expect(res).toBe("Data with the username is deleted")
	})

	test("User update successfully", async () => {//test for successful update
		const res = await User.update("username167","teststudent", "123", "123456","competition","4g","yfb","gfg","ertwrg")
		expect(res).toBe("Password Modified")
	})
//////////////////////////////////////////////////////////////Staff//////////////////////////////////////////////////////////////////
test("Staff register successfully", async () => {//test for successful update
	const res = await Staff.register("user12396", "987654")
	expect(res).toBe("Register Successfully")
})

test("Staff login successfully", async () => {//test for successful update
	const res = await Staff.login("user12396", "987654")
	expect(res).toBe("Login Successfully")
})

test("Staff view successfully", async () => {//test for successful update
	const res = await Staff.view("user12396", "987654")
	expect(res).toEqual(expect.anything())
})

test("Staff update successfully", async () => {//test for successful update
	const res = await Staff.update("user12396", "useruser", "987654","78910")
	expect(res).toBe("Password Modified")
})

test("Staff delete successfully", async () => {//test for successful update
	const res = await Staff.delete("user12396")
	expect(res).toBe("Data with the username is deleted")
})

/////////////////////////////////////////////////Student//////////////////////////////////////////////////////////////
test("Student register successfully", async () => {//test for successful update
	const res = await Student.register("user12396", "987654", "home","school","2h","4am","4pm","-")
	expect(res).toBe("Register Successfully")
})

test("Student login successfully", async () => {//test for successful update
	const res = await Student.login("user123", "987654")
	expect(res).toBe("Login Successfully")
})

test("Student view successfully", async () => {//test for successful update
	const res = await Student.view("user123", "987654")
	expect(res).toEqual(expect.arrayContaining(
		[{   _id: res[0]._id,
			username: expect.any(String),
			password: expect.any(String),
			destination:expect.any(String),
			purpose:expect.any(String),
			duration:expect.any(String),
			timein:expect.any(String),
			timeout:expect.any(String),
			info:expect.any(String),
			role:expect.any(String)
}]))
})

	test('should run', () => {
	});
});
