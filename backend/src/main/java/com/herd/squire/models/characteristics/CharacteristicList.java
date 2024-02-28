package com.herd.squire.models.characteristics;

import com.herd.squire.models.ListObject;

import java.util.ArrayList;
import java.util.List;

public class CharacteristicList {
    private List<ListObject> characteristics;

    public CharacteristicList() {
        this.characteristics = new ArrayList<>();
    }

    public CharacteristicList(List<ListObject> characteristics) {
        this.characteristics = characteristics;
    }

    public List<ListObject> getCharacteristics() {
        return characteristics;
    }

    public void setCharacteristics(List<ListObject> characteristics) {
        this.characteristics = characteristics;
    }
}
