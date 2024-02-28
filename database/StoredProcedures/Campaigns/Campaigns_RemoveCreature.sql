DROP PROCEDURE IF EXISTS Campaigns_RemoveCreature;

DELIMITER ;;
CREATE PROCEDURE Campaigns_RemoveCreature(
    IN campaignId INT UNSIGNED,
    IN creatureId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE creatureTypeId TINYINT UNSIGNED;
    DECLARE creatureUserId MEDIUMINT UNSIGNED;
    DECLARE campaignUserId MEDIUMINT UNSIGNED;
    DECLARE valid BIT;

    DECLARE encounterCreatureId INT UNSIGNED;
    DECLARE more_rows BOOLEAN DEFAULT TRUE;
    DECLARE curs CURSOR FOR SELECT id
                            FROM encounter_creatures WHERE creature_id = creatureId;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET more_rows = FALSE;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 0 AS count_creatures;
        SELECT 0 AS valid_request;
    END;

    START TRANSACTION;

    SELECT cc.campaign_character_type_id, cr.user_id, c.user_id
    INTO creatureTypeId, creatureUserId, campaignUserId
    FROM campaigns c
        JOIN campaign_characters cc ON cc.campaign_id = c.id
        JOIN creatures cr ON cr.id = cc.creature_id
    WHERE c.id = campaignId AND cc.creature_id = creatureId;

    SET valid = (userId = creatureUserId OR userId = campaignUserId);
    IF valid THEN
        IF creatureTypeId = 1 THEN -- CHARACTER
            CALL Creatures_Share_UnPublish (creatureId,creatureUserId);
#         ELSEIF creatureTypeId = 2 THEN -- NPC
#             CALL Creatures_Delete_BattleNpc(creatureId, userId);
#         ELSEIF creatureTypeId = 3 THEN -- OTHER
        END IF;

        DELETE ec FROM encounter_characters ec JOIN campaign_characters cc ON cc.id = ec.campaign_character_id WHERE cc.creature_id = creatureId AND cc.campaign_id = campaignId;
        DELETE FROM campaign_characters WHERE creature_id = creatureId AND campaign_id = campaignId;

        SELECT COUNT(*) AS count_creatures FROM encounter_creatures WHERE creature_id = creatureId;

        OPEN curs;
        WHILE more_rows DO
            FETCH curs INTO encounterCreatureId;
            IF more_rows THEN
                CALL BattleCreatures_Delete(encounterCreatureId, campaignUserId);
                DELETE FROM encounter_creatures WHERE id = encounterCreatureId;
            END IF;
        END WHILE;
        CLOSE curs;
    END IF;

    COMMIT;

    SELECT valid AS valid_request;
END;;

DELIMITER ;

