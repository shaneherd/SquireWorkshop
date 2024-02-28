package com.herd.squire.models.powers;

import com.herd.squire.models.ListObject;
import com.herd.squire.models.Tag;

import java.util.ArrayList;
import java.util.List;

public class SpellListObject extends ListObject {
    private int level;
    private List<Tag> tags;

    public SpellListObject() {
        super();
        tags = new ArrayList<>();
    }

    public SpellListObject(String id, String name, int sid, boolean author, int level) {
        super(id, name, sid, author);
        this.level = level;
        this.tags = new ArrayList<>();
    }

    public int getLevel() {
        return level;
    }

    public void setLevel(int level) {
        this.level = level;
    }

    public List<Tag> getTags() {
        return tags;
    }

    public void setTags(List<Tag> tags) {
        this.tags = tags;
    }
}
