package com.herd.squire.models.creatures.companions;

public class CompanionModifier {
    private boolean includeCharactersProf;
    private int misc;

    public CompanionModifier() {
    }

    public CompanionModifier(boolean includeCharactersProf, int misc) {
        this.includeCharactersProf = includeCharactersProf;
        this.misc = misc;
    }

    public boolean isIncludeCharactersProf() {
        return includeCharactersProf;
    }

    public void setIncludeCharactersProf(boolean includeCharactersProf) {
        this.includeCharactersProf = includeCharactersProf;
    }

    public int getMisc() {
        return misc;
    }

    public void setMisc(int misc) {
        this.misc = misc;
    }
}
