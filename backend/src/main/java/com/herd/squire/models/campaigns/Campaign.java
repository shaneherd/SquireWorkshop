package com.herd.squire.models.campaigns;

import com.herd.squire.models.campaigns.encounters.EncounterListObject;
import com.herd.squire.models.campaigns.settings.CampaignSettings;

import java.util.ArrayList;
import java.util.List;

public class Campaign {
    private String id;
    private String name;
    private String description;
    private String token;
    private boolean author;

    private List<CampaignCharacter> characters;
    private List<EncounterListObject> encounters;
    private CampaignSettings settings;

    public Campaign() {}

    public Campaign(String id, String name, String description, String token, boolean author) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.token = token;
        this.author = author;
        this.characters = new ArrayList<>();
        this.encounters = new ArrayList<>();
        this.settings = new CampaignSettings();
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public boolean isAuthor() {
        return author;
    }

    public void setAuthor(boolean author) {
        this.author = author;
    }

    public List<CampaignCharacter> getCharacters() {
        return characters;
    }

    public void setCharacters(List<CampaignCharacter> characters) {
        this.characters = characters;
    }

    public List<EncounterListObject> getEncounters() {
        return encounters;
    }

    public void setEncounters(List<EncounterListObject> encounters) {
        this.encounters = encounters;
    }

    public CampaignSettings getSettings() {
        return settings;
    }

    public void setSettings(CampaignSettings settings) {
        this.settings = settings;
    }
}
