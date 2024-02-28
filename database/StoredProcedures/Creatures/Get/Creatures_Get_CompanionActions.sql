DROP PROCEDURE IF EXISTS Creatures_Get_CompanionActions;

DELIMITER ;;
CREATE PROCEDURE Creatures_Get_CompanionActions(
    IN creatureId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE companionId INT UNSIGNED;
    DECLARE monsterId INT UNSIGNED;
    DECLARE companionUserId MEDIUMINT UNSIGNED;

    SET companionId = (SELECT id FROM creatures WHERE user_id = userID AND id = creatureId UNION SELECT creature_id FROM creatures_shared WHERE user_id = userId AND creature_id = creatureId);
    IF companionId IS NULL THEN
        SET companionId = (SELECT c.companion_id
                           FROM character_companions c
                                    JOIN campaign_characters cc ON cc.creature_id = c.character_id AND c.companion_id = creatureId
                                    JOIN campaigns c2 ON c2.id = cc.campaign_id AND c2.user_id = userId
                           LIMIT 1);
    END IF;
    SET companionUserId = (SELECT user_id FROM creatures WHERE id = companionId);
    SET monsterId = (SELECT monster_id FROM companions WHERE creature_id = companionId);

    SELECT mps.id AS creature_power_id, mp.id AS action_id, mp.name AS action_name, mp.sid AS action_sid, mp.user_id = userId AS action_is_author,
           mps.active, mps.active_target_creature_id, mps.uses_remaining, ma.action_type_id, ma.legendary_cost
    FROM monster_powers mp
    JOIN monster_actions ma ON mp.id = ma.monster_power_id AND mp.monster_id = monsterId
    LEFT JOIN monster_power_states mps ON mps.creature_id = creatureId AND mps.monster_power_id = mp.id;

    CALL MonsterPowers_GetList_Actions(monsterId, companionUserId);
END;;

DELIMITER ;

