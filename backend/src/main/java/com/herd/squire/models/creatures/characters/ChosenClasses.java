package com.herd.squire.models.creatures.characters;

import java.util.ArrayList;
import java.util.List;

public class ChosenClasses {
    private List<ChosenClass> chosenClasses;

    public ChosenClasses() {
        this.chosenClasses = new ArrayList<>();
    }

    public ChosenClasses(List<ChosenClass> chosenClasses) {
        this.chosenClasses = chosenClasses;
    }

    public List<ChosenClass> getChosenClasses() {
        return chosenClasses;
    }

    public void setChosenClasses(List<ChosenClass> chosenClasses) {
        this.chosenClasses = chosenClasses;
    }
}
