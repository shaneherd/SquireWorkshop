package com.herd.squire.models.creatures.battle_npcs;

import com.herd.squire.models.campaigns.CampaignCharacter;
import com.herd.squire.models.creatures.Creature;
import com.herd.squire.models.creatures.CreatureType;

public class BattleNpc extends Creature {
    private CampaignCharacter campaignCharacter;

    public BattleNpc() {
        super();
    }

    public BattleNpc(String id, CampaignCharacter campaignCharacter) {
        super(id, campaignCharacter.getName(), CreatureType.NPC, 0, 0, null);
        this.campaignCharacter = campaignCharacter;
    }

    public CampaignCharacter getCampaignCharacter() {
        return campaignCharacter;
    }

    public void setCampaignCharacter(CampaignCharacter campaignCharacter) {
        this.campaignCharacter = campaignCharacter;
    }
}
