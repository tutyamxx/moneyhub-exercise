const app = require("../src/index.js");
const chai = require("chai");
const chaiHttp = require("chai-http");

const { expect } = chai;
chai.use(chaiHttp);

describe("Testing API Endpoint Responses:", () =>
{
    describe("GET default path of the API /", () =>
    {
        it("Should return a message that it is working with a status code of OK (200)", (done) =>
        {
            chai.request(app).get("/").end((err, response) =>
            {
                expect(response).to.have.status(200);
                expect(response.body).to.be.a("object");
                expect(Object.keys(response.body).length).to.be.equal(2);
                expect(response.body).to.have.a.property("message").and.to.be.a("string").and.to.be.equal("💰 API works just fine!");

                done();
            });
        });
    });

    describe("GET /users/:userId/transactions", () =>
    {
        it("Should return an object that contains an array of objects with user's transactions and a status code of OK (200)", (done) =>
        {
            chai.request(app).get("/users/60f9727e58ee30009a1bf7ea/transactions").end((err, response) =>
            {
                expect(response).to.have.status(200);
                expect(response.body).to.be.a("object");
                expect(Object.keys(response.body).length).to.be.equal(1);
                expect(response.body).to.have.property("data").which.is.an("array");

                done();
            });
        });

        it("Should return an object that contains an array of objects with user's transactions and a status code of OK (200)", (done) =>
        {
            chai.request(app).get("/users/60f9727e58ee30009a1bf7ea/transactions").end((err, response) =>
            {
                expect(response).to.have.status(200);
                expect(response.body).to.be.a("object");
                expect(Object.keys(response.body).length).to.be.equal(1);
                expect(response.body).to.have.property("data").which.is.an("array");

                done();
            });
        });
    });

    after(() => chai.request(app).close());
});