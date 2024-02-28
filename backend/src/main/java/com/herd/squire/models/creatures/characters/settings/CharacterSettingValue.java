package com.herd.squire.models.creatures.characters.settings;

public class CharacterSettingValue {
    private CharacterSettingCategory category;
    private CharacterSetting setting;
    private int value;

    public CharacterSettingValue() {}

    public CharacterSettingValue(CharacterSettingCategory category, CharacterSetting setting, int value) {
        this.category = category;
        this.setting = setting;
        this.value = value;
    }

    public CharacterSettingValue(CharacterSettingCategory category, CharacterSetting setting, boolean value) {
        this.category = category;
        this.setting = setting;
        this.value = value ? 1 : 0;
    }

    public CharacterSettingCategory getCategory() {
        return category;
    }

    public void setCategory(CharacterSettingCategory category) {
        this.category = category;
    }

    public CharacterSetting getSetting() {
        return setting;
    }

    public void setSetting(CharacterSetting setting) {
        this.setting = setting;
    }

    public int getValue() {
        return value;
    }

    public void setValue(int value) {
        this.value = value;
    }
}
