import { Transport } from "../transports";
import { create as createFunctionsFactory } from "../FunctionsFactory";
import { deserialize, serialize } from "./utils";

export function createService(
    transport: Transport,
    serviceName: string = "mongo-db"
) {
    return { db: createDatabase.bind(null, transport, serviceName) };
}

export function createDatabase(
    transport: Transport,
    serviceName: string,
    databaseName: string
) {
    return {
        // 👇 is using "as" since it's too complicated to force the result of bind to remain generic over T
        collection: createCollection.bind(
            null,
            transport,
            serviceName,
            databaseName
        ) as <T extends Realm.Services.RemoteMongoDB.Document = any>(
            name: string
        ) => Realm.Services.RemoteMongoDB.RemoteMongoDBCollection<T>
    };
}

// This class is implemented to an interface documented in the services.d.ts - no need to duplicate that
// tslint:disable:completed-docs

export function createCollection<
    T extends Realm.Services.RemoteMongoDB.Document = any
>(
    transport: Transport,
    serviceName: string,
    databaseName: string,
    collectionName: string
): Realm.Services.RemoteMongoDB.RemoteMongoDBCollection<T> {
    return new RemoteMongoDBCollection<T>(
        transport,
        serviceName,
        databaseName,
        collectionName
    );
}

export class RemoteMongoDBCollection<
    T extends Realm.Services.RemoteMongoDB.Document
> implements Realm.Services.RemoteMongoDB.RemoteMongoDBCollection<T> {
    private functions: Realm.FunctionsFactory;

    constructor(
        transport: Transport,
        serviceName: string,
        private readonly databaseName: string,
        private readonly collectionName: string
    ) {
        this.functions = createFunctionsFactory({
            transport,
            serviceName,
            responseTransformation: deserialize
        });
    }

    find(
        filter: Realm.Services.RemoteMongoDB.Filter = {},
        options: Realm.Services.RemoteMongoDB.FindOptions = {}
    ) {
        return this.functions.find({
            database: this.databaseName,
            collection: this.collectionName,
            query: serialize(filter),
            project: options.projection,
            sort: options.sort,
            limit: options.limit
        });
    }

    findOne(
        filter: Realm.Services.RemoteMongoDB.Filter = {},
        options: Realm.Services.RemoteMongoDB.FindOneOptions = {}
    ) {
        return this.functions.findOne({
            database: this.databaseName,
            collection: this.collectionName,
            query: serialize(filter),
            project: options.projection,
            sort: options.sort
        });
    }

    findOneAndUpdate(
        filter: Realm.Services.RemoteMongoDB.Filter = {},
        update: object,
        options: Realm.Services.RemoteMongoDB.FindOneAndModifyOptions = {}
    ) {
        return this.functions.findOneAndUpdate({
            database: this.databaseName,
            collection: this.collectionName,
            filter: serialize(filter),
            update: serialize(update),
            sort: options.sort,
            projection: options.projection,
            upsert: options.upsert,
            returnNewDocument: options.returnNewDocument
        });
    }

    findOneAndReplace(
        filter: Realm.Services.RemoteMongoDB.Filter = {},
        update: object,
        options: Realm.Services.RemoteMongoDB.FindOneAndModifyOptions = {}
    ) {
        return this.functions.findOneAndReplace({
            database: this.databaseName,
            collection: this.collectionName,
            filter: serialize(filter),
            update: serialize(update),
            sort: options.sort,
            projection: options.projection,
            upsert: options.upsert,
            returnNewDocument: options.returnNewDocument
        });
    }

    findOneAndDelete(
        filter: Realm.Services.RemoteMongoDB.Filter = {},
        options: Realm.Services.RemoteMongoDB.FindOneOptions = {}
    ) {
        return this.functions.findOneAndReplace({
            database: this.databaseName,
            collection: this.collectionName,
            filter: serialize(filter),
            sort: options.sort,
            projection: options.projection
        });
    }

    aggregate(pipeline: object[]) {
        return this.functions.aggregate({
            database: this.databaseName,
            collection: this.collectionName,
            pipeline: pipeline.map(serialize)
        });
    }

    count(
        filter: Realm.Services.RemoteMongoDB.Filter = {},
        options: Realm.Services.RemoteMongoDB.CountOptions = {}
    ) {
        return this.functions.count({
            database: this.databaseName,
            collection: this.collectionName,
            query: serialize(filter),
            limit: options.limit
        });
    }

    insertOne(document: T) {
        return this.functions.insertOne({
            database: this.databaseName,
            collection: this.collectionName,
            document
        });
    }

    insertMany(documents: T[]) {
        return this.functions.insertMany({
            database: this.databaseName,
            collection: this.collectionName,
            documents: documents.map(serialize)
        });
    }

    deleteOne(filter: Realm.Services.RemoteMongoDB.Filter = {}) {
        return this.functions.deleteOne({
            database: this.databaseName,
            collection: this.collectionName,
            query: serialize(filter)
        });
    }

    deleteMany(filter: Realm.Services.RemoteMongoDB.Filter = {}) {
        return this.functions.deleteMany({
            database: this.databaseName,
            collection: this.collectionName,
            query: serialize(filter)
        });
    }

    updateOne(
        filter: Realm.Services.RemoteMongoDB.Filter,
        update: object,
        options: Realm.Services.RemoteMongoDB.UpdateOptions = {}
    ) {
        return this.functions.updateOne({
            database: this.databaseName,
            collection: this.collectionName,
            query: serialize(filter),
            update,
            upsert: options.upsert
        });
    }

    updateMany(
        filter: Realm.Services.RemoteMongoDB.Filter,
        update: object,
        options: Realm.Services.RemoteMongoDB.UpdateOptions = {}
    ) {
        return this.functions.updateMany({
            database: this.databaseName,
            collection: this.collectionName,
            query: serialize(filter),
            update,
            upsert: options.upsert
        });
    }
}
