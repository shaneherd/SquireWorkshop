DROP PROCEDURE IF EXISTS Creatures_Delete_Companion;

DELIMITER ;;
CREATE PROCEDURE Creatures_Delete_Companion(
    IN creatureId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE companionId INT UNSIGNED;
    DECLARE companionUserId MEDIUMINT UNSIGNED;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
        BEGIN
            GET DIAGNOSTICS condition 1 @SQLState = RETURNED_SQLSTATE, @SQLMessage = MESSAGE_TEXT;
            ROLLBACK;
            INSERT INTO exception_logs (state, message) VALUES (@SQLState, @SQLMessage);
            SELECT -1 AS result;
        END;

    START TRANSACTION;

    SET companionId = (SELECT id FROM creatures WHERE user_id = userId AND id = creatureId);
    IF companionId IS NULL THEN
        SET companionId = (SELECT c.companion_id
                           FROM character_companions c
                                    JOIN campaign_characters cc ON cc.creature_id = c.character_id AND c.companion_id = creatureId
                                    JOIN campaigns c2 ON c2.id = cc.campaign_id AND c2.user_id = userId
                           LIMIT 1);
    END IF;
    SET companionUserId = (SELECT user_id FROM creatures WHERE id = companionId);

    IF companionId IS NOT NULL THEN
        DELETE csm FROM companion_score_modifiers csm JOIN companions co ON co.creature_id = csm.companion_id JOIN creatures c ON c.id = co.creature_id WHERE c.id = companionId AND c.user_id = companionUserId;
        DELETE cc FROM character_companions cc JOIN companions co ON co.creature_id = cc.companion_id JOIN creatures c ON c.id = co.creature_id WHERE c.id = companionId AND c.user_id = companionUserId;
        DELETE mps FROM monster_power_states mps JOIN companions co ON co.creature_id = mps.creature_id JOIN creatures c ON c.id = co.creature_id WHERE c.id = companionId AND c.user_id = companionUserId;

        CALL Creatures_Delete_Common(companionId, companionUserId);

        DELETE ch FROM companions ch JOIN creatures c ON c.id = ch.creature_id WHERE creature_id = companionId AND c.user_id = companionUserId;
        DELETE FROM creatures WHERE user_id = companionUserId AND id = companionId;
    END IF;

    COMMIT;

    SELECT 1 AS result;
END;;

DELIMITER ;

