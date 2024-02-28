package com.herd.squire.models.creatures.characters;

public class CharacterNoteCategory {
    private String id;
    private String name;
    private boolean expanded;

    public CharacterNoteCategory() {}

    public CharacterNoteCategory(String id, String name, boolean expanded) {
        this.id = id;
        this.name = name;
        this.expanded = expanded;
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

    public boolean isExpanded() {
        return expanded;
    }

    public void setExpanded(boolean expanded) {
        this.expanded = expanded;
    }
}
