const request = require("supertest");
const mongoose = require("mongoose");
const createServer = require("../server");

beforeEach((done) => {
	mongoose.connect(
		process.env.TEST_DB_STRING,
		{useNewUrlParser: true, useUnifiedTopology: true},
		() => done()
	);
})

afterEach((done) => {
	mongoose.connection.db.dropDatabase(() => {
		mongoose.connection.close(() => done())
	});
})

const app = createServer();

describe("GET /", function() {
    
    it("it should has status code 200", (done) => {
        request(app)
        .get('/')
        .then(response => {
            expect(response.statusCode).toBe(200);
            expect(response.body.message).toBe("Welcome to PerfAnalytics App");
        });
        done();
    });
});