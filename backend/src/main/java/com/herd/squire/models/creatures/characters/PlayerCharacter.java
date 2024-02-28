package com.herd.squire.models.creatures.characters;

import com.herd.squire.models.ListObject;
import com.herd.squire.models.SquireImage;
import com.herd.squire.models.creatures.Creature;
import com.herd.squire.models.creatures.CreatureAction;
import com.herd.squire.models.creatures.CreatureFeatures;
import com.herd.squire.models.creatures.CreatureType;
import com.herd.squire.models.creatures.characters.settings.CharacterSettings;
import com.herd.squire.models.creatures.companions.CompanionListObject;
import com.herd.squire.services.ImageService;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class PlayerCharacter extends Creature {
    private CharacterRace characterRace;
    private int exp;
    private List<ChosenClass> classes;
    private CharacterBackground characterBackground;
    private Characteristics characteristics;
    private CharacterSettings characterSettings;
    private boolean inspiration;
    private int hpGainModifier;
    private HealthCalculationType healthCalculationType;
    private List<ListObject> abilitiesToIncreaseByOne;
    private List<CharacterNote> characterNotes;
    private CreatureFeatures creatureFeatures;
    private List<CreatureAction> favoriteActions;
    private List<CompanionListObject> companions;
    private String campaignToken;
    private SquireImage image;

    public PlayerCharacter() {}

    public PlayerCharacter(String id, String name, ListObject alignment, int exp, boolean inspiration, int hpGainModifier,
                           HealthCalculationType healthCalculationType, Characteristics characteristics, String campaignToken,
                           String imageFileLocation, String subDirectory) {
        super(id, name, CreatureType.CHARACTER, 0, 0, alignment);
        this.exp = exp;
        this.inspiration = inspiration;
        this.hpGainModifier = hpGainModifier;
        this.healthCalculationType = healthCalculationType;
        this.characteristics = characteristics;
        this.campaignToken = campaignToken;

        this.characterRace = new CharacterRace();
        this.classes = new ArrayList<>();
        this.characterBackground = new CharacterBackground();
        this.characterSettings = new CharacterSettings();
        this.abilitiesToIncreaseByOne = new ArrayList<>();
        this.characterNotes = new ArrayList<>();
        this.favoriteActions = new ArrayList<>();

        this.creatureFeatures = new CreatureFeatures();
        this.companions = new ArrayList<>();

        try {
            this.image = ImageService.getImage(imageFileLocation, subDirectory);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public CharacterRace getCharacterRace() {
        return characterRace;
    }

    public void setCharacterRace(CharacterRace characterRace) {
        this.characterRace = characterRace;
    }

    public int getExp() {
        return exp;
    }

    public void setExp(int exp) {
        this.exp = exp;
    }

    public List<ChosenClass> getClasses() {
        return classes;
    }

    public void setClasses(List<ChosenClass> classes) {
        this.classes = classes;
    }

    public CharacterBackground getCharacterBackground() {
        return characterBackground;
    }

    public void setCharacterBackground(CharacterBackground characterBackground) {
        this.characterBackground = characterBackground;
    }

    public Characteristics getCharacteristics() {
        return characteristics;
    }

    public void setCharacteristics(Characteristics characteristics) {
        this.characteristics = characteristics;
    }

    public CharacterSettings getCharacterSettings() {
        return characterSettings;
    }

    public void setCharacterSettings(CharacterSettings characterSettings) {
        this.characterSettings = characterSettings;
    }

    public boolean isInspiration() {
        return inspiration;
    }

    public void setInspiration(boolean inspiration) {
        this.inspiration = inspiration;
    }

    public int getHpGainModifier() {
        return hpGainModifier;
    }

    public void setHpGainModifier(int hpGainModifier) {
        this.hpGainModifier = hpGainModifier;
    }

    public HealthCalculationType getHealthCalculationType() {
        return healthCalculationType;
    }

    public void setHealthCalculationType(HealthCalculationType healthCalculationType) {
        this.healthCalculationType = healthCalculationType;
    }

    public List<ListObject> getAbilitiesToIncreaseByOne() {
        return abilitiesToIncreaseByOne;
    }

    public void setAbilitiesToIncreaseByOne(List<ListObject> abilitiesToIncreaseByOne) {
        this.abilitiesToIncreaseByOne = abilitiesToIncreaseByOne;
    }

    public List<CharacterNote> getCharacterNotes() {
        return characterNotes;
    }

    public void setCharacterNotes(List<CharacterNote> characterNotes) {
        this.characterNotes = characterNotes;
    }

    public CreatureFeatures getCreatureFeatures() {
        return creatureFeatures;
    }

    public void setCreatureFeatures(CreatureFeatures creatureFeatures) {
        this.creatureFeatures = creatureFeatures;
    }

    public List<CreatureAction> getFavoriteActions() {
        return favoriteActions;
    }

    public void setFavoriteActions(List<CreatureAction> favoriteActions) {
        this.favoriteActions = favoriteActions;
    }

    public List<CompanionListObject> getCompanions() {
        return companions;
    }

    public void setCompanions(List<CompanionListObject> companions) {
        this.companions = companions;
    }

    public String getCampaignToken() {
        return campaignToken;
    }

    public void setCampaignToken(String campaignToken) {
        this.campaignToken = campaignToken;
    }

    public SquireImage getImage() {
        return image;
    }

    public void setImage(SquireImage image) {
        this.image = image;
    }
}
