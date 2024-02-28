package com.herd.squire.models.creatures.characters;

import java.util.ArrayList;
import java.util.List;

public class CharacterNoteOrder {
    private List<CharacterNote> notes;

    public CharacterNoteOrder() {
        this.notes = new ArrayList<>();
    }

    public CharacterNoteOrder(List<CharacterNote> notes) {
        this.notes = notes;
    }

    public List<CharacterNote> getNotes() {
        return notes;
    }

    public void setNotes(List<CharacterNote> notes) {
        this.notes = notes;
    }
}
