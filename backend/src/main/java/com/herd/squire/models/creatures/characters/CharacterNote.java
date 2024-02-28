package com.herd.squire.models.creatures.characters;

import java.util.Date;

public class CharacterNote {
    private String id;
    private CharacterNoteCategory characterNoteCategory;
    private String note;
    private Date date;

    public CharacterNote() {}

    public CharacterNote(String id, CharacterNoteCategory characterNoteCategory, String note, Date date) {
        this.id = id;
        this.characterNoteCategory = characterNoteCategory;
        this.note = note;
        this.date = date;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public CharacterNoteCategory getCharacterNoteCategory() {
        return characterNoteCategory;
    }

    public void setCharacterNoteCategory(CharacterNoteCategory characterNoteCategory) {
        this.characterNoteCategory = characterNoteCategory;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }
}
