package com.herd.squire.models.powers;

import com.herd.squire.models.characteristics.SpellConfiguration;
import com.herd.squire.models.monsters.InnateSpellConfiguration;

import java.util.ArrayList;
import java.util.List;

public class SpellConfigurationList {
    private List<SpellConfiguration> configurations;
    private List<InnateSpellConfiguration> innateConfigurations;

    public SpellConfigurationList() {
        this.configurations = new ArrayList<>();
        this.innateConfigurations = new ArrayList<>();
    }

    public SpellConfigurationList(List<SpellConfiguration> configurations, List<InnateSpellConfiguration> innateConfigurations) {
        this.configurations = configurations;
        this.innateConfigurations = innateConfigurations;
    }

    public List<SpellConfiguration> getConfigurations() {
        return configurations;
    }

    public void setConfigurations(List<SpellConfiguration> configurations) {
        this.configurations = configurations;
    }

    public List<InnateSpellConfiguration> getInnateConfigurations() {
        return innateConfigurations;
    }

    public void setInnateConfigurations(List<InnateSpellConfiguration> innateConfigurations) {
        this.innateConfigurations = innateConfigurations;
    }
}
