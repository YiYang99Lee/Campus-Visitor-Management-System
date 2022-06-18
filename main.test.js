const supertest = require('supertest');
const request = supertest('http://localhost:3000');
// require("./main")

const adminToken = 'Bearer ' + "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXIxMiIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjU1NDcyNTk1LCJleHAiOjQ4MTEyMzI1OTV9.6blnCzGLgsWTJzn0RLxN_-zM61-gPuEnCjvcCcUuNDU";
const staffToken = 'Bearer ' + "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXIxMiIsInJvbGUiOiJzdGFmZiIsImlhdCI6MTY1NTQ3MjY2NCwiZXhwIjo0ODExMjMyNjY0fQ.lSFp3tNPKrimoNQdSquFCkeCaow4WCwTpyWSF7ZD33c";
const studentToken = 'Bearer ' + "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXIxMiIsInJvbGUiOiJzdHVkZW50IiwiaWF0IjoxNjU1NDcyNzAxLCJleHAiOjQ4MTEyMzI3MDF9.tGILE13Qo1vMBymeGszfLBluMegrEIJdtyik6RY6maQ";

describe('Express Route Test', function () {
	//  it('should return hello world', async () => {
	//  	return request.get('/hello')
	//  		.expect(200)
	//  		.expect('Content-Type', /text/)
	//  		.then(res => {
	//  		expect(res.text).toBe('Hello BENR2423');
	//  		});
	//  })

	/////////////////////////////////Admin//////////////////////////////////////////////
	it('login successfully', async () => {
		return request
			.post('/adminlogin')
			.send({username: 'user12', password: "1234" })
			.expect('Content-Type', /json/)
			.expect(200).then(response => {
				expect(response.body).toEqual(
					// {}
					{message: "Login Successfully",
					accesstoken: expect.any(String)
					// _id: expect.any(String),
					// name: expect.any(String),
					// age: expect.any(Number),
					
			});
			});
	});

	it('login failed', async () => {
		return request
		.post('/adminlogin')
		.send({username: 'user12', password: "23456" })
		.expect('Content-Type', /text/)
		.expect(400).then(response => {
			expect(response.text).toEqual(
					'Invalid username or password'
					// 'Invalid username or password'
					// _id: expect.any(String),
					// name: expect.any(String),
					// age: expect.any(Number),
				
			);
		});
	})

	it('register', async () => {
		return request
		.post('/adminregister')
		.send({username: 'user1adsfgt', password: "123456" })
		.expect('Content-Type', /text/)
		.expect(200).then(response => {
			expect(response.text).toBe(
					'Register Successfully'
					// 'Register Successfully'
					// _id: expect.any(String),
					// name: expect.any(String),
					// age: expect.any(Number),
			);
		});
	});

	it('register failed', async () => {
		return request
		.post('/adminregister')
		.send({username: 'user12', password: "123456" })
		.expect('Content-Type', /text/)
		.expect(402).then(response => {
			expect(response.text).toBe(
					'Username already exists'
					// 'Username already exists'
					// _id: expect.any(String),
					// name: expect.any(String),
					// age: expect.any(Number),
			);
		});
	})

	it('delete success', async () => {
		return request
		.delete('/admindelete')
		.set("authorization", adminToken)
		.send({username: 'userusername3'})
		.expect('Content-Type', /text/)
		.expect(200).then(response => {
			expect(response.text).toBe(
					'Student entry deleted'
					// 'Username already exists'
					// _id: expect.any(String),
					// name: expect.any(String),
					// age: expect.any(Number),
			);
		});
	})

	it('update success', async () => {
		return request
		.patch('/adminupdate')
		.set("authorization", adminToken)
		.send({username: 'user1adsf',studentname:"adfadfi",password:"123456", userpassword:"56789",destination:"library",purpose:"56789", duration:"56789", timein:"56789", timeout:"56789", info:"56789"})
		.expect('Content-Type', /text/)
		.expect(200).then(response => {
			expect(response.text).toBe(
					'Entry Changed'
					// 'Username already exists'
					// _id: expect.any(String),
					// name: expect.any(String),
					// age: expect.any(Number),
			);
		});
	})

	it('view success', async () => {
		return request
		.post('/adminview')
		.set("authorization", adminToken)
		.send({username: 'user1adsfgt', password:"123456"})
		.expect('Content-Type', /json/)
		.expect(200).then(response => {
			expect(response.body).toEqual(
					expect.anything()
					// 'Username already exists'
					// _id: expect.any(String),
					// name: expect.any(String),
					// age: expect.any(Number),
			);
		});
	})
//////////////////////////////////////Staff//////////////////////////////////////////////////////
	it('staff register', async () => {
			return request
			.post('/staffregister')
			.send({username: 'user1adsfgt', password: "123456" })
			.expect('Content-Type', /text/)
			.expect(200).then(response => {
				expect(response.text).toBe(
						'Register Successfully'
						// 'Register Successfully'
						// _id: expect.any(String),
						// name: expect.any(String),
						// age: expect.any(Number),
				);
			});
		});

	it('staff register failed', async () => {
		return request
		.post('/staffregister')
		.send({username: 'user1adsfgt', password: "12345" })
		.expect('Content-Type', /text/)
		.expect(402).then(response => {
			expect(response.text).toBe(
					'Username already exists'
					// 'Username already exists'
					// _id: expect.any(String),
					// name: expect.any(String),
					// age: expect.any(Number),
			);
		});
	})

	it('staff view success', async () => {
			return request
			.post('/staffview')
			.set("authorization", staffToken)
			.send({username: 'user1adsfgt', password:"123456"})
			.expect('Content-Type', /json/)
			.expect(200).then(response => {
				expect(response.body).toEqual(
						expect.anything()
						// 'Username already exists'
						// _id: expect.any(String),
						// name: expect.any(String),
						// age: expect.any(Number),
				);
			});
		})

		it('Staff update success', async () => {
			return request
			.patch('/staffupdate')
			.set("authorization", staffToken)
			.send({username: 'user1adsfgt',userusername:"test", password:"123456", userpassword:"56789"})
			.expect('Content-Type', /text/)
			.expect(200).then(response => {
				expect(response.text).toBe(
						'Password Changed'
						// 'Username already exists'
						// _id: expect.any(String),
						// name: expect.any(String),
						// age: expect.any(Number),
				);
			});
		})

		it('staff login successfully', async () => {
			return request
				.post('/stafflogin')
				.send({username: 'user1adsfgt', password: "123456" })
				.expect('Content-Type', /json/)
				.expect(200).then(response => {
					expect(response.body).toEqual(
						// {}
						{message: "Login Successfully",
						accesstoken: expect.any(String)
						// _id: expect.any(String),
						// name: expect.any(String),
						// age: expect.any(Number),
						
				});
				});
		});


	it('staff delete success', async () => {
			return request
			.delete('/staffdelete')
			.set("authorization", staffToken)
			.send({username: 'user1adsfgt'})
			.expect('Content-Type', /text/)
			.expect(200).then(response => {
				expect(response.text).toBe(
						"Staff Entry deleted"
						// 'Username already exists'
						// _id: expect.any(String),
						// name: expect.any(String),
						// age: expect.any(Number),
				);
			});
		})


	it('staff login failed', async () => {
		return request
		.post('/stafflogin')
		.send({username: 'user12', password: "23456" })
		.expect('Content-Type', /text/)
		.expect(400).then(response => {
			expect(response.text).toEqual(
					'Invalid username or password'
					// 'Invalid username or password'
					// _id: expect.any(String),
					// name: expect.any(String),
					// age: expect.any(Number),
				
			);
		});
	})

/////////////////////////////////////////Student///////////////////////////////////////////
it('student register success', async () => {
	return request
	.put('/studentregister')
	.send({username: 'user1adsfgt', password: "12345", destination: "12345", duration: "12345", purpose: "12345", timein: "12345", timeout: "12345", info: "12345" })
	.expect('Content-Type', /text/)
	.expect(200).then(response => {
		expect(response.text).toBe(
				'Entry created'
				// 'Register Successfully'
				// _id: expect.any(String),
				// name: expect.any(String),
				// age: expect.any(Number),
		);
	});
});

it('student update success', async () => {
return request
.put('/studentregister')
.send({username: 'user1adsfgt', password: "12345", destination: "12345", duration: "12345", purpose: "12345", timein: "12345", timeout: "12345", info: "12345"})
.expect('Content-Type', /text/)
.expect(200).then(response => {
	expect(response.text).toBe(
			'Entry updated'
			// 'Username already exists'
			// _id: expect.any(String),
			// name: expect.any(String),
			// age: expect.any(Number),
	);
});
})

it('student view success', async () => {
	return request
	.post('/studentview')
	.set("authorization", studentToken)
	.send({username: 'user1adsfgt', password:"123456"})
	.expect('Content-Type', /json/)
	.expect(200).then(response => {
		expect(response.body).toEqual(
				expect.anything()
				// 'Username already exists'
				// _id: expect.any(String),
				// name: expect.any(String),
				// age: expect.any(Number),
		);
	});
})

it('student login successful', async () => {
	return request
		.post('/studentlogin')
		.send({username: 'user1adsfgt', password: "12345" })
		.expect('Content-Type', /json/)
		.expect(200).then(response => {
			expect(response.body).toEqual(
				// {}
				{message: "Login Successfully",
				accesstoken: expect.any(String)
				// _id: expect.any(String),
				// name: expect.any(String),
				// age: expect.any(Number),
				
		});
		});
});

it('student login failed', async () => {
	return request
	.post('/studentlogin')
	.send({username: 'user12', password: "23456" })
	.expect('Content-Type', /text/)
	.expect(400).then(response => {
		expect(response.text).toEqual(
				'Invalid username or password'
				// 'Invalid username or password'
				// _id: expect.any(String),
				// name: expect.any(String),
				// age: expect.any(Number),
			
		);
	});
})


});