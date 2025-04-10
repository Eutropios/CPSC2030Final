(() => {
    const mongodb = require("mongodb");
    const connection = require("./config/config.js");
    const MongoClient = mongodb.MongoClient;
    let mongodbClient = null;

    //-------------------------------------------------------------------------
    /**
     * Connection Strings
     */
    //-------------------------------------------------------------------------
    //----------------------------------------------------------------

    /**
     * Creates and returns a MongoDB client instance.
     * @param {boolean} [local=true] - Whether to use the local MongoDB connection string.
     * @returns {MongoClient} - The MongoDB client instance.
     */
    const getMongoClient = (local = true) => {
        const uri = local
            ? `mongodb://127.0.0.1:27017/${connection.DATABASE}`
            : `mongodb+srv://${connection.USERNAME}:${connection.PASSWORD}@${connection.SERVER}/${connection.DATABASE}?retryWrites=true&w=majority&appName=Test-Cluster`;
        console.log(`Connection String<<${uri}`);
        if (!mongodbClient) mongodbClient = new MongoClient(uri);
        return mongodbClient;
    };

    //-------------------------------------------------------------------------
    /**
     * Data Manipulation Language (DML) functions
     */
    //-------------------------------------------------------------------------
    const findAll = async (collection, query) => {
        return collection
            .find(query)
            .toArray()
            .catch((err) => {
                console.log("Could not find ", query, err.message);
            });
    };

    const findOne = async (collection, query) => {
        return collection.findOne(query).catch((err) => {
            console.log(`Could not find document with query=${query} `, err.message);
        });
    };

    const findOneId = async (collection, id) => {
        return collection.findOne({ _id: new mongodb.ObjectId(id) }).catch((err) => {
            console.log(`Could not find document with id=${id} `, err.message);
        });
    };

    const deleteMany = async (collection, query) => {
        return collection.deleteMany(query).catch((err) => {
            console.log("Could not delete many ", query, err.message);
        });
    };

    const deleteOne = async (collection, query) => {
        return collection.deleteOne(query).catch((err) => {
            console.log("Could not delete one ", query, err.message);
        });
    };

    const insertMany = async (collection, documents) => {
        return collection
            .insertMany(documents)
            .then((res) => console.log("Data inserted with IDs", res.insertedIds))
            .catch((err) => {
                console.log("Could not add data ", err.message);
                //For now, ignore duplicate entry errors, otherwise re-throw the error for the next catch
                if (!(err.name === "BulkWriteError" && err.code === 11000)) throw err;
            });
    };

    const insertOne = async (collection, document) => {
        return await collection
            .insertOne(document)
            .then((res) => console.log("Data inserted with ID", res.insertedId))
            .catch((err) => {
                console.log("Could not add data ", err.message);
                if (!(err.name === "BulkWriteError" && err.code === 11000)) throw err;
            });
    };

    const updateOne = async (collection, id, title, content) => {
        return await collection
            .updateOne(
                { _id: id },
                { $set: { title: title, content: content, dateModified: new Date().toUTCString } },
            )
            .catch((err) => {
                console.log("Could not update data ", err.message);
                if (!(err.name === "BulkWriteError" && err.code === 11000)) throw err;
            });
    };

    //-------------------------------------------------------------------------
    const logRequest = async (req, res) => {
        const client = util.getMongoClient(false);
        client
            .connect()
            .then((conn) => {
                console.log("\t|inside connect()");
                console.log(
                    "\t|Connected successfully to MongoDB!",
                    conn.s.url.replace(/:([^:@]{1,})@/, ":****@"),
                );
                /**
                 * Create a collection in a MongoDB database
                 * Like a database, a collection will be created if it does not exist
                 * The collection will only be created once we insert a document
                 */
                const collection = client.db().collection("Requests");
                const log = {
                    Timestamp: new Date(),
                    Method: req.method,
                    Path: req.url,
                    Query: req.query,
                    "Status Code": res.statusCode,
                };
                util.insertOne(collection, log);
            })
            .catch((err) => console.log(`\t|Could not connect to MongoDB Server\n\t|${err}`))
            .finally(() => {
                //client.close()
                //console.log('Disconnected')
            });
    };

    const util = {
        url: "localhost",
        username: "webuser",
        password: "letmein",
        port: 22643,
        database: "forum",
        collections: ["logs", "notes", "users", "roles"],
        getMongoClient: getMongoClient,
        logRequest: logRequest,
        findAll: findAll,
        findOne: findOne,
        findOneId: findOneId,
        insertOne: insertOne,
        insertMany: insertMany,
        updateOne: updateOne,
        deleteOne: deleteOne,
        deleteMany: deleteMany,
    };
    const moduleExport = util;
    if (typeof __dirname !== "undefined") module.exports = moduleExport;
})();
