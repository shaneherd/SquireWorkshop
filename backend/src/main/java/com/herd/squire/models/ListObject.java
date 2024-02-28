package com.herd.squire.models;

public class ListObject {
    protected String id;
    protected String name;
    protected String description;
    protected int sid;
    protected boolean author;

    public ListObject() {}

    public ListObject(int id, String name, int sid) { //todo - remove this method
        this.id = String.valueOf(id);
        this.name = name;
        this.sid = sid;
        this.author = false;
    }

    public ListObject(String id, String name, int sid, boolean author) {
        this.id = id;
        this.name = name;
        this.description = "";
        this.sid = sid;
        this.author = author;
    }

    public ListObject(String id, String name, String description, int sid, boolean author) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.sid = sid;
        this.author = author;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getSid() {
        return sid;
    }

    public void setSid(int sid) {
        this.sid = sid;
    }

    public boolean isAuthor() {
        return author;
    }

    public void setAuthor(boolean author) {
        this.author = author;
    }
}
