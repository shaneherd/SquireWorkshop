package com.herd.squire.models.powers;

import com.herd.squire.models.ListObject;
import com.herd.squire.models.Tag;
import com.herd.squire.models.characteristics.CharacteristicType;

import java.util.ArrayList;
import java.util.List;

public class FeatureListObject extends ListObject {
    private ListObject characteristic;
    private CharacteristicType characteristicType;
    private boolean passive;
    private List<Tag> tags;

    public FeatureListObject() {
        super();
        tags = new ArrayList<>();
    }

//    public FeatureListObject(int id, String name, int sid, ListObject characteristic, CharacteristicType characteristicType) {
//        super(id, name, sid);
//        this.characteristic = characteristic;
//        this.characteristicType = characteristicType;
//    }

    public FeatureListObject(String id, String name, int sid, boolean author, ListObject characteristic, CharacteristicType characteristicType, boolean passive) {
        super(id, name, sid, author);
        this.characteristic = characteristic;
        this.characteristicType = characteristicType;
        this.passive = passive;
        this.tags = new ArrayList<>();
    }

//    public FeatureListObject(String id, String name, String description, int sid, ListObject characteristic, CharacteristicType characteristicType) {
//        super(id, name, description, sid);
//        this.characteristic = characteristic;
//        this.characteristicType = characteristicType;
//    }

    public ListObject getCharacteristic() {
        return characteristic;
    }

    public void setCharacteristic(ListObject characteristic) {
        this.characteristic = characteristic;
    }

    public CharacteristicType getCharacteristicType() {
        return characteristicType;
    }

    public void setCharacteristicType(CharacteristicType characteristicType) {
        this.characteristicType = characteristicType;
    }

    public boolean isPassive() {
        return passive;
    }

    public void setPassive(boolean passive) {
        this.passive = passive;
    }

    public List<Tag> getTags() {
        return tags;
    }

    public void setTags(List<Tag> tags) {
        this.tags = tags;
    }
}
