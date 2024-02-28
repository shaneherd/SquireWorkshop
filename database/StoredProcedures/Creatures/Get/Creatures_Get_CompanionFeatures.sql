DROP PROCEDURE IF EXISTS Creatures_Get_CompanionFeatures;

DELIMITER ;;
CREATE PROCEDURE Creatures_Get_CompanionFeatures(
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

    SELECT mps.id AS creature_power_id, mp.id AS feature_id, mp.name AS feature_name, mp.sid AS feature_sid, mp.user_id = userId AS feature_is_author,
           mps.active, mps.active_target_creature_id, mps.uses_remaining
    FROM monster_powers mp
    JOIN monster_features mf ON mp.id = mf.monster_power_id AND mp.monster_id = monsterId
    LEFT JOIN monster_power_states mps ON mps.creature_id = creatureId AND mps.monster_power_id = mp.id;

    CALL MonsterPowers_GetList_Features(monsterId, companionUserId);
END;;

DELIMITER ;

