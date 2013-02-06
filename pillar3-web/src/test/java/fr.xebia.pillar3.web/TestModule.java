package fr.xebia.pillar3.web;

import com.mongodb.DB;
import com.mongodb.Mongo;

import java.net.UnknownHostException;

public class TestModule extends Module {
    protected DB getDb() throws UnknownHostException {
        // utiliser une base locale pour les tests
        return new Mongo().getDB("yawl");
    }
}
