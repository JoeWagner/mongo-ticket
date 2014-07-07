
var MongoClient = require('mongodb').MongoClient;

var MongoTicket = function MongoTicket(uri, options, done) {
    if (typeof options === 'function') {
        done = options;
        options = {};
    }
    options || (options = {});
    this.uri = uri;
    this.collection = options.collection || 'mongoTicket'
    // optionally supply a stringify function, or set to false to use the passed object directly
    this.stringify = options.stringify || true;
    this.parse = options.parse || JSON.parse;
    var autoConnect = (typeof options.autoConnect === 'undefined') ? true : options.autoConnect;

    if (autoConnect) this.connect(done);
};

module.exports = MongoTicket;

MongoTicket.prototype.connect = function (done) {
    var self = this;
    MongoClient.connect(this.uri, function (err, db) {
        if (err) return done(err);
        self.db = db;
        // setup unique index for the key, to ensure no duplicates are set
        db.collection(self.collection).ensureIndex({key: 1}, {unique: true}, function (err) {
            done(err, db);
        });
    });
};

MongoTicket.prototype.set = function (key, val, done) {
    // the application is responsible for connecting before trying to set and get
    if (!this.db) {
        console.warn('Can\'t set without valid db connection');
        return;
    }
    if (this.stringify) val = this._stringify(val);

    this.db.collection(this.collection).insert({key: key, val: val}, done);
};

MongoTicket.prototype.get = function (key, done) {
    // the application is responsible for connecting before trying to set and get
    if (!this.db) {
        console.warn('Can\'t set without valid db connection');
        return;
    }
    var self = this;
    this.db.collection(this.collection).findAndModify({key: key}, null, null, { remove: true }, function (err, doc) {
        if (err) return done(err);

        var val = doc && doc.val;
        if (!val) return done();

        if (self.stringify) {
            return done(null, self._parse(val));
        }
        done(null, val);
    });
};

// sync method, to isolate the try-catch
MongoTicket.prototype._parse = function (val) {
    var ret;
    try {
        ret = this.parse(val);
    } catch (e) {
        ret = val;
    }
    return ret;
};

// sync method, to isolate the try-catch
MongoTicket.prototype._stringify = function (val) {
    var ret;
    try {
        ret = JSON.stringify(val);
    } catch (e) {
        ret = val;
    }
    return ret;
};
