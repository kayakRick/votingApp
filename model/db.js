/**
 * Created by rdevansjr on 6/20/17.
 */

//connect to database
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI,
    {
        useMongoClient: true,
    });
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));
process.on('SIGINT', function() {
    mongoose.connection.close(function () {
        console.log('Mongoose disconnected through app termination');
        process.exit(0);
    });
});
