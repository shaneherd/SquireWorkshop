package com.herd.squire.models;

import com.herd.squire.models.proficiency.Proficiency;

import java.util.ArrayList;
import java.util.List;

public class ProficiencyList {
    private List<Proficiency> proficiencies;

    public ProficiencyList() {
        this.proficiencies = new ArrayList<>();
    }

    public ProficiencyList(List<Proficiency> proficiencies) {
        this.proficiencies = proficiencies;
    }

    public List<Proficiency> getProficiencies() {
        return proficiencies;
    }

    public void setProficiencies(List<Proficiency> proficiencies) {
        this.proficiencies = proficiencies;
    }
}
