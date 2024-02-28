package com.herd.squire.models.sharing;

import com.herd.squire.models.monsters.MonsterPower;

public class MonsterAddToMyStuffDetails extends AddToMyStuffDetails {
    private MonsterPower authorMonsterPower;

    public MonsterAddToMyStuffDetails(long authorPowerId, int authorUserId, int authorTypeId, long existingPowerId, int existingTypeId, MonsterPower authorMonsterPower) {
        super(authorPowerId, authorUserId, authorTypeId, existingPowerId, existingTypeId);
        this.authorMonsterPower = authorMonsterPower;
    }

    public MonsterPower getAuthorMonsterPower() {
        return authorMonsterPower;
    }

    public void setAuthorMonsterPower(MonsterPower authorMonsterPower) {
        this.authorMonsterPower = authorMonsterPower;
    }
}