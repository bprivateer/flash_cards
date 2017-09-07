const request = require('supertest');
const app = require('../server');
//
// the return request is a promise, so you can do dot notation after if
// if its a get call its .get if its a post call its .post.  and after your
// dot notation you .expect() and you put what you expect inside.
// describe("GET /api/test", function(){
//   test("test should render success", function(){
//     return request(app)
//     .get('api/test')
//     .expect(200)
//   })
// })

describe("GET /api/test", function(){
  test("should retrieve user id and name successfully", function(){
    return request(app)
    .get('/api/test')
    .expect(200)
    .then(function(res){
      expect(res.body).toHaveProperty("id");
      expect(res.body).toHaveProperty("username");

    })

  })
})
