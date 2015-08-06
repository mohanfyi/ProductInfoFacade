var should = require('should');
var request = require('supertest');
var server = require('../../../app');

process.env.A127_ENV = 'test';

describe('controllers', function() {

  describe('dashboard', function() {

    describe('GET /ping', function() {

      it('should pass invariably', function() {
         ('test').should.eql('test');
      })
      
      it('should return functioning normally string', function(done) {
        request(server)
          .get('/v1/ping')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            should.not.exist(err);
            console.log(res.body);
            res.body.should.eql('This service is functioning normally!!');
            done();
          });
      });

      it('should accept a name parameter and return a JSON string', function(done) {
        request(server)
          .get('/v1/client/100/dashboard')
          //.query({ clientid: 100})
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            should.not.exist(err);
            //res.body.should.eql('Hello, Scott!');
            done();
          });
      });

    });

  });

});
