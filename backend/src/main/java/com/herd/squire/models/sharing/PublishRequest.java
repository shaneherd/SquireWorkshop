package com.herd.squire.models.sharing;

import java.util.ArrayList;
import java.util.List;

public class PublishRequest {
    private PublishType publishType;
    private List<String> users;

    public PublishRequest() {
        this.users = new ArrayList<>();
    }

    public PublishRequest(PublishType publishType, List<String> users) {
        this.publishType = publishType;
        this.users = users;
    }

    public PublishType getPublishType() {
        return publishType;
    }

    public void setPublishType(PublishType publishType) {
        this.publishType = publishType;
    }

    public List<String> getUsers() {
        return users;
    }

    public void setUsers(List<String> users) {
        this.users = users;
    }
}
