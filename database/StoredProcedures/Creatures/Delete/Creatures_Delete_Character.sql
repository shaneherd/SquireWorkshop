DROP PROCEDURE IF EXISTS Creatures_Delete_Character;

DELIMITER ;;
CREATE PROCEDURE Creatures_Delete_Character(
    IN creatureId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE characterId INT UNSIGNED;
    DECLARE companionId INT UNSIGNED;
    DECLARE more_rows BOOLEAN DEFAULT TRUE;
    DECLARE curs CURSOR FOR SELECT id
                            FROM temp_creatures ;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET more_rows = FALSE;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
        BEGIN
            GET DIAGNOSTICS condition 1 @SQLState = RETURNED_SQLSTATE, @SQLMessage = MESSAGE_TEXT;
            ROLLBACK;
            INSERT INTO exception_logs (state, message) VALUES (@SQLState, @SQLMessage);
            SELECT -1 AS result;
        END;

    START TRANSACTION;

    CREATE TEMPORARY TABLE IF NOT EXISTS temp_creatures
    (
        id INT UNSIGNED NOT NULL
    );

    SET characterId = (SELECT id FROM creatures WHERE user_id = userId AND id = creatureId);

    IF characterId IS NOT NULL THEN
        CALL Creatures_Share_UnPublish (creatureId,userId);

        DELETE h FROM character_health_gain_results h JOIN character_chosen_classes ccc ON ccc.id = h.chosen_class_id JOIN creatures c ON c.id = ccc.character_id WHERE c.id = characterId AND c.user_id = userId;
        DELETE asi FROM character_ability_scores_to_increase asi JOIN creatures c ON c.id = asi.character_id WHERE character_id = characterId AND c.user_id = userId;
        DELETE bt FROM character_background_traits bt JOIN creatures c ON c.id = bt.character_id WHERE character_id = characterId AND c.user_id = userId;
        DELETE ccs FROM character_characteristic_spellcasting ccs JOIN creatures c ON c.id = ccs.character_id WHERE character_id = characterId AND c.user_id = userId;
        DELETE ccc FROM character_chosen_classes ccc JOIN creatures c ON c.id = ccc.character_id WHERE character_id = characterId AND c.user_id = userId;
        DELETE cn FROM character_notes cn JOIN creatures c ON c.id = cn.character_id WHERE character_id = characterId AND c.user_id = userId;
        DELETE cnc FROM character_note_categories cnc JOIN creatures c ON c.id = cnc.character_id WHERE character_id = characterId AND c.user_id = userId;
        DELETE cp FROM character_pages cp JOIN creatures c ON c.id = cp.character_id WHERE character_id = characterId AND c.user_id = userId;
        DELETE csv FROM character_setting_values csv JOIN creatures c ON c.id = csv.character_id WHERE character_id = characterId AND c.user_id = userId;
        DELETE cv FROM character_validation cv JOIN creatures c ON c.id = cv.character_id WHERE character_id = characterId AND c.user_id = userId;
        DELETE cvip FROM character_validation_ignored_powers cvip JOIN creatures c ON c.id = cvip.character_id WHERE character_id = characterId AND c.user_id = userId;

        # companions
        INSERT INTO temp_creatures (id)
        SELECT companion_id
        FROM character_companions cc
            JOIN characters ch ON ch.creature_id = cc.character_id AND ch.creature_id = characterId
            JOIN creatures c ON c.id = ch.creature_id
        WHERE c.user_id = userId;
        DELETE cc FROM character_companions cc JOIN characters ch ON ch.creature_id = cc.character_id AND ch.creature_id = characterId JOIN creatures c ON c.id = ch.creature_id WHERE c.user_id = userId;

        CALL Creatures_Delete_Common(characterId, userId);

        DELETE ec FROM encounter_characters ec JOIN encounter_creatures e ON ec.encounter_creature_id = e.id JOIN creatures c ON e.creature_id = c.id WHERE e.creature_id = creatureId AND c.user_id = userId;
        DELETE ec FROM encounter_creatures ec JOIN creatures c ON ec.creature_id = c.id WHERE ec.creature_id = creatureId AND c.user_id = userId;
        DELETE ch FROM characters ch JOIN creatures c ON c.id = ch.creature_id WHERE creature_id = characterId AND c.user_id = userId;
        DELETE cc FROM creatures c JOIN campaign_characters cc ON c.id = cc.creature_id AND c.id = creatureId WHERE c.user_id = userId;
        DELETE FROM creatures WHERE user_id = userId AND id = characterId;

        # delete companions creatures
        OPEN curs;
        WHILE more_rows DO
            FETCH curs INTO companionId;
            IF more_rows THEN
                CALL Creatures_Delete_Companion(companionId, userId);
            END IF;
        END WHILE;
        CLOSE curs;
    END IF;

    COMMIT;

    DROP TEMPORARY TABLE IF EXISTS temp_creatures;
    SELECT 1 AS result;
END;;

DELIMITER ;

