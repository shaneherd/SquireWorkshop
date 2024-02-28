package com.herd.squire.models.monsters;

import com.herd.squire.models.ListObject;

public class MonsterListObject extends ListObject {
    private ChallengeRating challengeRating;

    public MonsterListObject() {
        this.challengeRating = ChallengeRating.ZERO;
    }

    public MonsterListObject(String id, String name, int sid, boolean author, ChallengeRating challengeRating) {
        super(id, name, sid, author);
        this.challengeRating = challengeRating;
    }

    public ChallengeRating getChallengeRating() {
        return challengeRating;
    }

    public void setChallengeRating(ChallengeRating challengeRating) {
        this.challengeRating = challengeRating;
    }
}
