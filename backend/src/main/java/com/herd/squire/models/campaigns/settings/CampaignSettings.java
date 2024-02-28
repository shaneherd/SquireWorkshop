package com.herd.squire.models.campaigns.settings;

public class CampaignSettings {
    private CampaignHealthSettings health;
    private CampaignInitiativeSettings initiative;
    private CampaignExperienceSettings experience;
    private CampaignSurpriseRoundSettings surpriseRound;
//    private List<CharacterPage> pages;

    public CampaignSettings() {
        this.health = new CampaignHealthSettings();
        this.initiative = new CampaignInitiativeSettings();
        this.experience = new CampaignExperienceSettings();
        this.surpriseRound = new CampaignSurpriseRoundSettings();
    }

    public CampaignSettings(CampaignHealthSettings health, CampaignInitiativeSettings initiative,
                            CampaignExperienceSettings experience, CampaignSurpriseRoundSettings surpriseRound) {
        this.health = health;
        this.initiative = initiative;
        this.experience = experience;
        this.surpriseRound = surpriseRound;
    }

    public CampaignHealthSettings getHealth() {
        return health;
    }

    public void setHealth(CampaignHealthSettings health) {
        this.health = health;
    }

    public CampaignInitiativeSettings getInitiative() {
        return initiative;
    }

    public void setInitiative(CampaignInitiativeSettings initiative) {
        this.initiative = initiative;
    }

    public CampaignExperienceSettings getExperience() {
        return experience;
    }

    public void setExperience(CampaignExperienceSettings experience) {
        this.experience = experience;
    }

    public CampaignSurpriseRoundSettings getSurpriseRound() {
        return surpriseRound;
    }

    public void setSurpriseRound(CampaignSurpriseRoundSettings surpriseRound) {
        this.surpriseRound = surpriseRound;
    }
}
