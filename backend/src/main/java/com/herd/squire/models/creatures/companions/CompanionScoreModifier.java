package com.herd.squire.models.creatures.companions;

public class CompanionScoreModifier extends CompanionModifier {
    private String abilityId;
    private boolean useCharactersScore;

    public CompanionScoreModifier() {
        super();
    }

    public CompanionScoreModifier(boolean includeCharactersProf, int misc, String abilityId, boolean useCharactersScore) {
        super(includeCharactersProf, misc);
        this.abilityId = abilityId;
        this.useCharactersScore = useCharactersScore;
    }

    public String getAbilityId() {
        return abilityId;
    }

    public void setAbilityId(String abilityId) {
        this.abilityId = abilityId;
    }

    public boolean isUseCharactersScore() {
        return useCharactersScore;
    }

    public void setUseCharactersScore(boolean useCharactersScore) {
        this.useCharactersScore = useCharactersScore;
    }
}
