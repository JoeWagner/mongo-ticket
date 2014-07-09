var should = require('should');
var MongoClient = require('mongodb').MongoClient;
var MongoTicket = require('../index');

describe('MongoTicket', function () {

    var testConnection;
    before(function (done) {
        MongoClient.connect('mongodb://localhost:27017/mongo-ticket', function (err, db) {
            if (err) return done(err);
            testConnection = db;
            done();
        });
    })

    beforeEach(function (done) {
        testConnection.collection('mongoTicket').remove({}, done);
    });

    it('should be able to connect to mongodb', function (done) {
        var mongoTicket = new MongoTicket('mongodb://localhost:27017/mongo-ticket', done);
    });

    it('should not require a callback or options', function (done) {
        var mongoTicket = new MongoTicket('mongodb://localhost:27017/mongo-ticket');
        setTimeout(done, 1000);
    });

    it('should allow setting tickets', function (done) {
        var mongoTicket = new MongoTicket('mongodb://localhost:27017/mongo-ticket', function (err, db) {
            if (err) return done(err);

            mongoTicket.set('qwerty', 'identifyingdata', done);
        });
    });

    it('should allow getting tickets', function (done) {
        var mongoTicket = new MongoTicket('mongodb://localhost:27017/mongo-ticket', function (err, db) {
            if (err) return done(err);

            mongoTicket.set('qwerty', 'ilovecats', function (err) {
                if (err) return done(err);
                mongoTicket.get('qwerty', function (err, val) {
                    if (err) return done(err);
                    val.should.equal('ilovecats');
                    done();
                });
            });
        });
    });

    it('should not allow setting more than one ticket with the same key', function (done) {
        var mongoTicket = new MongoTicket('mongodb://localhost:27017/mongo-ticket', function (err, db) {
            if (err) return done(err);

            mongoTicket.set('qwerty', 'ilovecats', function (err) {
                if (err) return done(err);
                mongoTicket.set('qwerty', 'ilovecats', function (err) {
                    err.should.be.an.instanceOf(Error);
                    done();
                });
            });
        });
    });

    it('should remove tickets after first "get"', function (done) {
        var mongoTicket = new MongoTicket('mongodb://localhost:27017/mongo-ticket', function (err, db) {
            if (err) return done(err);

            mongoTicket.set('qwerty', 'hodorhodorhodor', function (err) {
                if (err) return done(err);
                mongoTicket.get('qwerty', function (err, val) {
                    if (err) return done(err);
                    val.should.equal('hodorhodorhodor');
                    testConnection.collection('mongoTicket').find({}, function (err, allDocs) {
                        if (err) return done(err);
                        allDocs.toArray(function (err, arr) {
                            if (err) return done(err);
                            arr.length.should.equal(0);
                            done();
                        });
                    });
                });
            });
        });
    });

    describe('stringify option', function () {

        it.skip('should be able to be set to false', function (done) {

        });

        it.skip('should be able to be set to true', function (done) {

        });

    });

    describe('collection option', function () {

        it.skip('should default to mongoTicket', function (done) {

        });

        it.skip('should be able to be set', function (done) {

        });

    });

    describe('uri option', function () {

        it.skip('should accept mongodb uri string', function (done) {

        });

    });

});
