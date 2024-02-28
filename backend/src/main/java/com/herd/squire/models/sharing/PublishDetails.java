package com.herd.squire.models.sharing;

import java.util.ArrayList;
import java.util.List;

public class PublishDetails {
    private boolean published;
    private PublishType publishType;
    private List<String> users;

    public PublishDetails() {
        this.published = false;
        this.publishType = PublishType.NONE;
        this.users = new ArrayList<>();
    }

    public boolean isPublished() {
        return published;
    }

    public void setPublished(boolean published) {
        this.published = published;

        if (published) {
            setPublishType(this.users.isEmpty() ? PublishType.PUBLIC : PublishType.PRIVATE);
        }
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
