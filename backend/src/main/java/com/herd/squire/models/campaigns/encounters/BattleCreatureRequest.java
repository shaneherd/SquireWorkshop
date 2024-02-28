package com.herd.squire.models.campaigns.encounters;

import java.util.ArrayList;
import java.util.List;

public class BattleCreatureRequest {
    private List<EncounterCharacter> characters;
    private List<EncounterMonsterGroup> groups;

    public BattleCreatureRequest() {
        this.characters = new ArrayList<>();
        this.groups = new ArrayList<>();
    }

    public BattleCreatureRequest(List<EncounterCharacter> characters, List<EncounterMonsterGroup> groups) {
        this.characters = characters;
        this.groups = groups;
    }

    public List<EncounterCharacter> getCharacters() {
        return characters;
    }

    public void setCharacters(List<EncounterCharacter> characters) {
        this.characters = characters;
    }

    public List<EncounterMonsterGroup> getGroups() {
        return groups;
    }

    public void setGroups(List<EncounterMonsterGroup> groups) {
        this.groups = groups;
    }
}
