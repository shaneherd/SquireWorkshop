package com.herd.squire.models.characteristics;

import com.herd.squire.models.Size;
import com.herd.squire.models.Speed;

import java.util.ArrayList;
import java.util.List;

public class Race extends Characteristic {
    private Size size;
    private String description;
    private List<Speed> speeds;
    private boolean hover;
    private int startingGold;
    private List<Race> subRaces;

    public Race() {}

    public Race(String id, String name, int sid, boolean author, int version,
                int numAbilities, int numLanguages, int numSavingThrows,
                int numSkills, int numTools, String spellCastingAbility, Size size, String description, boolean hover, int startingGold) {
        super(id, name, sid, author, version, CharacteristicType.RACE, numAbilities, numLanguages, numSavingThrows, numSkills, numTools, spellCastingAbility);
        this.size = size;
        this.description = description;
        this.hover = hover;
        this.startingGold = startingGold;

        this.speeds = new ArrayList<>();
        this.subRaces = new ArrayList<>();
    }

    public Size getSize() {
        return size;
    }

    public void setSize(Size size) {
        this.size = size;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<Speed> getSpeeds() {
        return speeds;
    }

    public void setSpeeds(List<Speed> speeds) {
        this.speeds = speeds;
    }

    public boolean isHover() {
        return hover;
    }

    public void setHover(boolean hover) {
        this.hover = hover;
    }

    public int getStartingGold() {
        return startingGold;
    }

    public void setStartingGold(int startingGold) {
        this.startingGold = startingGold;
    }

    public List<Race> getSubRaces() {
        return subRaces;
    }

    public void setSubRaces(List<Race> subRaces) {
        this.subRaces = subRaces;
    }
}
