## mongo-ticket

simple implementation of a single use "ticket", built with mongodb and node.js

## Installation

`npm install mongo-ticket`

## Options

  - `autoConnect` whether you want **mongo-ticket** to immediately connect to the database.  If set to false you will have to call the [connect method](#methods) directly (default: true)
  - `collection` the name to use for the collection that will store tickets (default: 'mongoTicket')
  - `stringify` whether you want **mongo-ticket** to `try` to use `JSON.stringify` and `JSON.parse` when storing and retrieving tickets (default: true)

## Usage

### initialization

You must provide a [mongodb connection string](http://docs.mongodb.org/manual/reference/connection-string/) as the first argument when creating a new instance of **mongo-ticket**, then you may optionally provide an options object, and/or a callback

### example

```javascript
var MongoTicket = require('mongo-ticket');
var mt = new MongoTicket('mongodb://localhost:27017/mydatabase', {
    autoConnect: true,
    collection: 'mycollection',
    stringify: true
}, function (err, db) {
    if (err) // ...

    mongoTicket.set('qwerty', 'keyboard cat', function (err) {
        // ...
    });
});
```

Later on...
```Javascript
mongoTicket.get('qwerty', function (err, val) {
    if (err) // ....
    console.log(val); // => 'keyboard cat'
});
```

## Methods

  - `connect(callback)` connects to the database with the provided mongodb uri.  This is called for you unless to specify `autoConnect: false` in the options
  - `get(ticket, callback)` gets a ticket and removes it if found.  The arity of the callback is (error, ticketValue), where error is null unless something went wrong, and ticketValue is the (optionally parsed) value stored in the ticket, or if no ticket was found it is undefined.
  - `set(ticket, ticketValue, callback)` sets ticket with the given value.  The callback is passed directly to the mongodb driver's insert method
