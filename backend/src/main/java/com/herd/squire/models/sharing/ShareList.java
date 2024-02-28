package com.herd.squire.models.sharing;

import java.util.ArrayList;
import java.util.List;

public class ShareList {
    private List<String> attributes;
    private List<String> items;
    private List<String> powers;
    private List<String> characteristics;
    private List<String> creatures;
    private List<String> monsters;

    public ShareList() {
        this.attributes = new ArrayList<>();
        this.items = new ArrayList<>();
        this.powers = new ArrayList<>();
        this.characteristics = new ArrayList<>();
        this.creatures = new ArrayList<>();
        this.monsters = new ArrayList<>();
    }

    public List<String> getAttributes() {
        return attributes;
    }

    public void setAttributes(List<String> attributes) {
        this.attributes = attributes;
    }

    public List<String> getItems() {
        return items;
    }

    public void setItems(List<String> items) {
        this.items = items;
    }

    public List<String> getPowers() {
        return powers;
    }

    public void setPowers(List<String> powers) {
        this.powers = powers;
    }

    public List<String> getCharacteristics() {
        return characteristics;
    }

    public void setCharacteristics(List<String> characteristics) {
        this.characteristics = characteristics;
    }

    public List<String> getCreatures() {
        return creatures;
    }

    public void setCreatures(List<String> creatures) {
        this.creatures = creatures;
    }

    public List<String> getMonsters() {
        return monsters;
    }

    public void setMonsters(List<String> monsters) {
        this.monsters = monsters;
    }
}
