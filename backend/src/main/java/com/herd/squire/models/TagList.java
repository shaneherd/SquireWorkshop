package com.herd.squire.models;

import java.util.ArrayList;
import java.util.List;

public class TagList {
    private List<Tag> tags;

    public TagList() {
        this.tags = new ArrayList<>();
    }

    public TagList(List<Tag> tags) {
        this.tags = tags;
    }

    public List<Tag> getTags() {
        return tags;
    }

    public void setTags(List<Tag> tags) {
        this.tags = tags;
    }
}
