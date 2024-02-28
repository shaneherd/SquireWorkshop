package com.herd.squire.models.campaigns.encounters;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

public class Encounter {
    private String id;
    private String campaignId;
    private String name;
    private String description;
    private int currentRound;
    private int currentTurn;
    private Timestamp startedAt;
    private Timestamp lastPlayedAt;
    private Timestamp finishedAt;
    private int expEarned;
    private boolean customSort;
    private boolean hideKilled;

//    private EncounterSettings settings;
    private List<EncounterCharacter> encounterCharacters;
    private List<EncounterMonsterGroup> encounterMonsterGroups;
    private List<BattleCreature> battleCreatures;

    public Encounter() {
        this.encounterCharacters = new ArrayList<>();
        this.encounterMonsterGroups = new ArrayList<>();
        this.battleCreatures = new ArrayList<>();
    }

    public Encounter(String id, String campaignId, String name, String description, int currentRound, int currentTurn,
                     Timestamp startedAt, Timestamp lastPlayedAt, Timestamp finishedAt, int expEarned,
                     boolean customSort, boolean hideKilled) {
        this.id = id;
        this.campaignId = campaignId;
        this.name = name;
        this.description = description;
        this.currentRound = currentRound;
        this.currentTurn = currentTurn;
        this.startedAt = startedAt;
        this.lastPlayedAt = lastPlayedAt;
        this.finishedAt = finishedAt;
        this.expEarned = expEarned;
        this.customSort = customSort;
        this.hideKilled = hideKilled;
        this.encounterCharacters = new ArrayList<>();
        this.encounterMonsterGroups = new ArrayList<>();
        this.battleCreatures = new ArrayList<>();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCampaignId() {
        return campaignId;
    }

    public void setCampaignId(String campaignId) {
        this.campaignId = campaignId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getCurrentRound() {
        return currentRound;
    }

    public void setCurrentRound(int currentRound) {
        this.currentRound = currentRound;
    }

    public int getCurrentTurn() {
        return currentTurn;
    }

    public void setCurrentTurn(int currentTurn) {
        this.currentTurn = currentTurn;
    }

    public Timestamp getStartedAt() {
        return startedAt;
    }

    public void setStartedAt(Timestamp startedAt) {
        this.startedAt = startedAt;
    }

    public Timestamp getLastPlayedAt() {
        return lastPlayedAt;
    }

    public void setLastPlayedAt(Timestamp lastPlayedAt) {
        this.lastPlayedAt = lastPlayedAt;
    }

    public Timestamp getFinishedAt() {
        return finishedAt;
    }

    public void setFinishedAt(Timestamp finishedAt) {
        this.finishedAt = finishedAt;
    }

    public int getExpEarned() {
        return expEarned;
    }

    public void setExpEarned(int expEarned) {
        this.expEarned = expEarned;
    }

    public boolean isCustomSort() {
        return customSort;
    }

    public void setCustomSort(boolean customSort) {
        this.customSort = customSort;
    }

    public boolean isHideKilled() {
        return hideKilled;
    }

    public void setHideKilled(boolean hideKilled) {
        this.hideKilled = hideKilled;
    }

    public List<EncounterCharacter> getEncounterCharacters() {
        return encounterCharacters;
    }

    public void setEncounterCharacters(List<EncounterCharacter> encounterCharacters) {
        this.encounterCharacters = encounterCharacters;
    }

    public List<EncounterMonsterGroup> getEncounterMonsterGroups() {
        return encounterMonsterGroups;
    }

    public void setEncounterMonsterGroups(List<EncounterMonsterGroup> encounterMonsterGroups) {
        this.encounterMonsterGroups = encounterMonsterGroups;
    }

    public List<BattleCreature> getBattleCreatures() {
        return battleCreatures;
    }

    public void setBattleCreatures(List<BattleCreature> battleCreatures) {
        this.battleCreatures = battleCreatures;
    }
}
