package fr.xebia.pillar3.web;

import com.google.inject.AbstractModule;
import com.google.inject.Provides;
import com.google.inject.name.Named;
import com.mongodb.BasicDBObjectBuilder;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.Mongo;
import com.mongodb.MongoOptions;
import fr.xebia.pillar3.repository.NotificationsRepository;
import org.scribe.builder.ServiceBuilder;
import org.scribe.builder.api.TwitterApi;
import org.scribe.oauth.OAuthService;

import java.net.UnknownHostException;

public class Module extends AbstractModule {

    public static final String USERS_COLLECTION = "users";
    public static final String NOTIFS_COLLECTION = "notifications";

    @Override
    protected void configure() {
    }

    protected DB getDb() throws UnknownHostException {
        if (System.getProperty("XPUA_ENV") == "DEV") {
            return new Mongo().getDB("yawl");
        } else {
            String host = "tempest.mongohq.com";
            int port = 10052;

            DB db = new Mongo(host, port).getDB("Yloh05kyeaoxxkLK6OXQ");

            String username = "xpua3";
            String password = "xpua3";

            db.authenticate(username, password.toCharArray());
            return db;
        }
    }

    @Provides
    @Named(USERS_COLLECTION)
    public DBCollection createUsersCollection() throws UnknownHostException {
        DBCollection collection = getDb().getCollection(USERS_COLLECTION);
        collection.ensureIndex("artists");
        return collection;
    }

    @Provides
    @Named(NOTIFS_COLLECTION)
    public DBCollection createNotificationsCollection() throws UnknownHostException {
        DB db = getDb();
        if (db.collectionExists(NOTIFS_COLLECTION)) return db.getCollection(NOTIFS_COLLECTION);
        else {
            DBCollection collection = db.createCollection(NOTIFS_COLLECTION,
                    BasicDBObjectBuilder.start("capped", true)
                            .add("size", 1000).get());
            collection.ensureIndex("date");
            return collection;
        }
    }

    @Provides
    private OAuthService createOAuthServiceForTwitter() {
        return new ServiceBuilder()
                .provider(TwitterApi.class)
                .apiKey("6EK0Es2zfIx4SHaazCNuGg")
                .apiSecret("NJW1RaSzylevlg0Awfv00mRsmr0Tiq3eyRgojHzA")
                .callback("http://x.x.x.x:8080/login/twitter/verify/")
                .build();
    }

}
