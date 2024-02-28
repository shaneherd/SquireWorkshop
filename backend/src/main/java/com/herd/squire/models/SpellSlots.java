package com.herd.squire.models;


public class SpellSlots {
    private ListObject characterLevel;
    private int slot1;
    private int slot2;
    private int slot3;
    private int slot4;
    private int slot5;
    private int slot6;
    private int slot7;
    private int slot8;
    private int slot9;

    public SpellSlots(){ }

    public SpellSlots(ListObject characterLevel, int slot1, int slot2, int slot3, int slot4, int slot5, int slot6, int slot7, int slot8, int slot9){
        this.characterLevel = characterLevel;
        this.slot1 = slot1;
        this.slot2 = slot2;
        this.slot3 = slot3;
        this.slot4 = slot4;
        this.slot5 = slot5;
        this.slot6 = slot6;
        this.slot7 = slot7;
        this.slot8 = slot8;
        this.slot9 = slot9;
    }

    public ListObject getCharacterLevel() {
        return characterLevel;
    }

    public void setCharacterLevel(ListObject characterLevel) {
        this.characterLevel = characterLevel;
    }

    public int getSlot1() {
        return slot1;
    }

    public void setSlot1(int slot1) {
        this.slot1 = slot1;
    }

    public int getSlot2() {
        return slot2;
    }

    public void setSlot2(int slot2) {
        this.slot2 = slot2;
    }

    public int getSlot3() {
        return slot3;
    }

    public void setSlot3(int slot3) {
        this.slot3 = slot3;
    }

    public int getSlot4() {
        return slot4;
    }

    public void setSlot4(int slot4) {
        this.slot4 = slot4;
    }

    public int getSlot5() {
        return slot5;
    }

    public void setSlot5(int slot5) {
        this.slot5 = slot5;
    }

    public int getSlot6() {
        return slot6;
    }

    public void setSlot6(int slot6) {
        this.slot6 = slot6;
    }

    public int getSlot7() {
        return slot7;
    }

    public void setSlot7(int slot7) {
        this.slot7 = slot7;
    }

    public int getSlot8() {
        return slot8;
    }

    public void setSlot8(int slot8) {
        this.slot8 = slot8;
    }

    public int getSlot9() {
        return slot9;
    }

    public void setSlot9(int slot9) {
        this.slot9 = slot9;
    }
}
