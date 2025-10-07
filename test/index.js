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

// describe("Back End Api tests", () => {
//   let token;
//   before((done) => {
//     chai
//       .request(app)
//       .post("/api/users/signin")
//       .send({ email: "percy@gmail.com", password: "1234567890" })
//       .end((err, res) => {
//         if (err) return done(err);
//         token = res.body.token;
//         done();
//       });
//   });

//   it("Get users", (done) => {
//     chai
//       .request(app)
//       .get("/api/users/")
//       .set("Authorization", `Bearer ${token}`)
//       .end((err, res) => {
//         if (err) return done(err);
//         console.log(res.body);
//         expect(res).to.have.status(200);
//         expect(res.body).to.be.an("object");
//         expect(res.body.success).to.be.true;
//         expect(res.body.data).to.be.an("array");
//         done();
//       });
//   });
// });

// describe("Back End Api tests", () => {
//   let token;
//   before((done) => {
//     chai
//       .request(app)
//       .post("/api/users/signin")
//       .send({ email: "percy@gmail.com", password: "1234567890" })
//       .end((err, res) => {
//         if (err) return done(err);
//         token = res.body.token;
//         done();
//       });
//   });
//   it("create a job", (done) => {
//     const uniqueTitle = "Software Engineer_" + Date.now();
//     chai
//       .request(app)
//       .post("/api/jobs/")
//       .set("Authorization", `Bearer ${token}`)
//       .send({
//         title: uniqueTitle,
//         description: "Job description",
//         address: "Awae, Douala",
//         location: {
//           type: "Point",
//           coordinates: [9.7489, 4.0511],
//         },
//         category: "68b70f3875299ad29b6dfd4c",
//         salary: 50,
//         jobType: "Full-time",
//         duration: "3 months",
//       })
//       .end((err, res) => {
//         if (err) return done(err);
//         console.log(res.body);
//         expect(res).to.have.status(201);
//         expect(res.body).to.be.an("object");
//         expect(res.body.success).to.be.true;
//         expect(res.body.data).to.be.an("object");
//         expect(res.body.data).to.have.property("_id");
//         expect(res.body.data)
//           .to.have.property("title")
//           .that.equals(uniqueTitle);
//         done();
//       });
//   });
// });

// describe("Apply for a job", () => {
//   let token;
//   let jobId = "68e110b858feaa0b2a0e0e48";

//   before((done) => {
//     chai
//       .request(app)
//       .post("/api/users/signin")
//       .send({ email: "percy@gmail.com", password: "1234567890" })
//       .end((err, res) => {
//         if (err) return done(err);
//         token = res.body.token;
//         done();
//       });
//   });

//   it("should apply for a job", (done) => {
//     chai
//       .request(app)
//       .post("/api/applications/68e110b858feaa0b2a0e0e48")
//       .set("Authorization", `Bearer ${token}`)
//       .send({
//         job: jobId,
//         coverLetter: "I am interested in this job.",
//       })
//       .end((err, res) => {
//         if (err) return done(err);
//         console.log(res.body);
//         expect(res).to.have.status(201);
//         expect(res.body).to.be.an("object");
//         expect(res.body.success).to.be.true;
//         expect(res.body.data).to.have.property("_id");
//         done();
//       });
//   });
// });

describe("Create a new user", () => {
  it("should register a new user", (done) => {
    const uniqueEmail = `testuser_${Date.now()}@example.com`;
    chai
      .request(app)
      .post("/api/users/signup")
      .send({
        name: "Test User",
        email: uniqueEmail,
        password: "testpassword123",
        role: "jobseeker", 
        cv: "http://example.com/cv.pdf",
        phone: "1234567890",

      })
      .end((err, res) => {
        if (err) return done(err);
        console.log(res.body);
        expect(res).to.have.status(201);
        expect(res.body).to.be.an("object");
        expect(res.body.success).to.be.true;
        expect(res.body.data).to.have.property("_id");
        expect(res.body.data)
          .to.have.property("email")
          .that.equals(uniqueEmail);
        done();
      });
  });
});

mochaTimeout(100000);

function mochaTimeout(ms) {
  if (typeof this.timeout === "function") this.timeout(ms);
}

// after(() => {
//   process.exit(0);
// });

//hey Yonta to run your test use this: npx mocha test/index.js
