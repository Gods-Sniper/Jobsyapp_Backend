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

// describe("Back End Api tests", () => {
//   it("Add a job category", (done) => {
//     const uniqueName = "Househelp_" + Date.now();
//     chai
//       .request(app)
//       .post("/api/category/")
//       .send({ name: uniqueName })
//       .end((err, res) => {
//         if (err) return done(err);
//         expect(res).to.have.status(201);
//         expect(res.body).to.be.an("object");
//         expect(res.body.success).to.be.true;
//         expect(res.body.data).to.be.an("object");
//         expect(res.body.data).to.have.property("_id");
//         expect(res.body.data).to.have.property("name").that.equals(uniqueName);
//         done();
//       });
//   });
// });

describe("Back End Api tests", () => {
  it("Get users", (done) => {
    chai
      .request(app)
      .get("/api/users")
      .end((err, res) => {
        if (err) return done(err);
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        expect(res.body.success).to.be.true;
        expect(res.body.data).to.be.an("array");
        done();
      });
  });
});

after(() => {
  process.exit(0);
});
//hey Yonta to run your test use this: npx mocha test/index.js
