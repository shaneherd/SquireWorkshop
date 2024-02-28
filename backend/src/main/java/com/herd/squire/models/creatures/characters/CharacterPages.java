package com.herd.squire.models.creatures.characters;

import java.util.List;

public class CharacterPages {
    private List<CharacterPage> pages;

    public CharacterPages() {}

    public CharacterPages(List<CharacterPage> pages) {
        this.pages = pages;
    }

    public List<CharacterPage> getPages() {
        return pages;
    }

    public void setPages(List<CharacterPage> pages) {
        this.pages = pages;
    }
}
