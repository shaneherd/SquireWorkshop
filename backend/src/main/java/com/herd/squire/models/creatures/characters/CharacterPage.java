package com.herd.squire.models.creatures.characters;

public class CharacterPage {
    private CharacterPageType characterPageType;
    private int order;
    private boolean visible;

    public CharacterPage() {}

    public CharacterPage(CharacterPageType characterPageType, int order, boolean visible) {
        this.characterPageType = characterPageType;
        this.order = order;
        this.visible = visible;
    }

    public CharacterPageType getCharacterPageType() {
        return characterPageType;
    }

    public void setCharacterPageType(CharacterPageType characterPageType) {
        this.characterPageType = characterPageType;
    }

    public int getOrder() {
        return order;
    }

    public void setOrder(int order) {
        this.order = order;
    }

    public boolean isVisible() {
        return visible;
    }

    public void setVisible(boolean visible) {
        this.visible = visible;
    }
}
