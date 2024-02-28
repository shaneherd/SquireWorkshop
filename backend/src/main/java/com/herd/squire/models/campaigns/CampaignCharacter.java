package com.herd.squire.models.campaigns;

import com.herd.squire.models.ListObject;
import com.herd.squire.models.proficiency.Proficiency;

public class CampaignCharacter {
    private String id;
    private String creatureId;
    private CampaignCharacterType campaignCharacterType;
    private String name;
    private int exp;
    private Proficiency initiative;
    private Proficiency perception;
    private Proficiency stealth;
    private int profMisc;

    private int characterExp;
    private ListObject characterClass;
    private ListObject subclass;
    private ListObject race;
    private ListObject background;

    public CampaignCharacter() {
    }

    public CampaignCharacter(String id, String creatureId, CampaignCharacterType campaignCharacterType, String name, ListObject characterClass,
                             ListObject subclass, ListObject race, ListObject background,
                             Proficiency initiative, Proficiency perception, Proficiency stealth, int profMisc, int characterExp) {
        this.id = id;
        this.creatureId = creatureId;
        this.campaignCharacterType = campaignCharacterType;
        this.name = name;
        this.characterClass = characterClass;
        this.subclass = subclass;
        this.race = race;
        this.background = background;
        this.initiative = initiative;
        this.perception = perception;
        this.stealth = stealth;
        this.profMisc = profMisc;
        this.characterExp = characterExp;
    }

    public CampaignCharacter(String id, String creatureId, CampaignCharacterType campaignCharacterType, String name,
                             Proficiency initiative, Proficiency perception, Proficiency stealth, int profMisc, int characterExp) {
        this.id = id;
        this.creatureId = creatureId;
        this.campaignCharacterType = campaignCharacterType;
        this.name = name;
        this.initiative = initiative;
        this.perception = perception;
        this.stealth = stealth;
        this.profMisc = profMisc;
        this.characterExp = characterExp;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCreatureId() {
        return creatureId;
    }

    public void setCreatureId(String creatureId) {
        this.creatureId = creatureId;
    }

    public CampaignCharacterType getCampaignCharacterType() {
        return campaignCharacterType;
    }

    public void setCampaignCharacterType(CampaignCharacterType campaignCharacterType) {
        this.campaignCharacterType = campaignCharacterType;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getExp() {
        return exp;
    }

    public void setExp(int exp) {
        this.exp = exp;
    }

    public Proficiency getInitiative() {
        return initiative;
    }

    public void setInitiative(Proficiency initiative) {
        this.initiative = initiative;
    }

    public Proficiency getPerception() {
        return perception;
    }

    public void setPerception(Proficiency perception) {
        this.perception = perception;
    }

    public Proficiency getStealth() {
        return stealth;
    }

    public void setStealth(Proficiency stealth) {
        this.stealth = stealth;
    }

    public ListObject getCharacterClass() {
        return characterClass;
    }

    public void setCharacterClass(ListObject characterClass) {
        this.characterClass = characterClass;
    }

    public ListObject getSubclass() {
        return subclass;
    }

    public void setSubclass(ListObject subclass) {
        this.subclass = subclass;
    }

    public ListObject getRace() {
        return race;
    }

    public void setRace(ListObject race) {
        this.race = race;
    }

    public ListObject getBackground() {
        return background;
    }

    public void setBackground(ListObject background) {
        this.background = background;
    }

    public int getCharacterExp() {
        return characterExp;
    }

    public void setCharacterExp(int characterExp) {
        this.characterExp = characterExp;
    }

    public int getProfMisc() {
        return profMisc;
    }

    public void setProfMisc(int profMisc) {
        this.profMisc = profMisc;
    }
}
