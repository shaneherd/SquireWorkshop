package com.herd.squire.services.monsters.api;

public class MonsterTypeApi {
    private int id;
    private String name;

    public MonsterTypeApi() {
        id = 0;
        name = "";
    }

    public MonsterTypeApi(int id, String name) {
        this.id = id;
        this.name = name;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
