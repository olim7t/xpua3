package fr.xebia.pillar3.model;

import com.google.common.collect.Lists;
import com.mongodb.BasicDBList;
import com.mongodb.BasicDBObject;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;
import org.bson.types.ObjectId;

import java.util.ArrayList;
import java.util.List;

public class User {

    private String id;

    public String login;

    public double latitude;

    public double longitude;

    public List<String> artists = Lists.newArrayList();

    public User(DBObject dbUser) {
        ObjectId mongoId = (ObjectId) dbUser.get("_id");

        if (mongoId != null) {
            this.id = mongoId.toString();
        }

        this.login = (String) dbUser.get("login");
        this.longitude = (Double) ((BasicDBList)dbUser.get("coordinates")).get(0);
        this.latitude = (Double) ((BasicDBList)dbUser.get("coordinates")).get(1);

        BasicDBList dbArtists = (BasicDBList) dbUser.get("artists");

        if(dbArtists != null) {
            for (Object artist : dbArtists) {
                artists.add((String) artist);
            }
        }
    }

    public void addArtist(String name) {
        artists.add(name);
    }

    public DBObject toDBOject() {
        DBObject dbUser = new BasicDBObject();

        dbUser.put("_id", new ObjectId(id));
        dbUser.put("login", login);
        dbUser.put("latitude", latitude);
        dbUser.put("longitude", longitude);
        dbUser.put("artists", createDBListArtists());

        return dbUser;
    }

    private BasicDBList createDBListArtists() {
        BasicDBList dBListArtists = new BasicDBList();

        for (String name : artists) {
            dBListArtists.add(new BasicDBObject("name", name));
        }

        return dBListArtists;
    }

    public static List<User> toUsers(DBCursor dbCursor) {
        List<User> users = new ArrayList<User>();
        for (DBObject dbObject : dbCursor) {
            users.add(new User(dbObject));
        }
        return users;
    }

}
