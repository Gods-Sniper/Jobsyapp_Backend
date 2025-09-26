const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../index");
const expect = chai.expect;

chai.use(chaiHttp);

describe("Back End Api tests", () => {
  it("get all categories", (done) => {
    chai
      .request(app)
      .get("/api/category")
      .end((err, res) => {
        if (err) return done(err);
        expect(res).to.have.status(200);
        // check that res.body.data is an array
        expect(res.body).to.be.an("object");
        expect(res.body.success).to.be.true;
        expect(res.body.data).to.be.an("array");
        done();
      });
  });
});

describe("Back End Api tests", () => {
  it("Add a job category", (done) => {
    chai
      .request(app)
      .post("/api/category")
      .send({ name: "Software" }) 
      .end((err, res) => {
        if (err) return done(err);
        expect(res).to.have.status(201);
        expect(res.body).to.be.an("object");
        expect(res.body.success).to.be.true;
        expect(res.body.data).to.be.an("object"); 
        expect(res.body.data).to.have.property("_id");
        expect(res.body.data).to.have.property("name").that.equals("Software");
        done();
      });
  });
});

//hey Yonta to run your test use this: npx mocha test/index.js