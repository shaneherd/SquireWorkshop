DROP PROCEDURE IF EXISTS Encounters_Delete;

DELIMITER ;;
CREATE PROCEDURE Encounters_Delete(
    IN encounterId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE isOwner BIT;
    DECLARE battleCreatureId INT UNSIGNED;
    DECLARE more_rows BOOLEAN DEFAULT TRUE;
    DECLARE curs CURSOR FOR SELECT id
                            FROM temp_creatures ;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET more_rows = FALSE;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
        BEGIN
            ROLLBACK;
            SELECT -1 AS result;
        END;

    START TRANSACTION;

    CREATE TEMPORARY TABLE IF NOT EXISTS temp_creatures
    (
        id INT UNSIGNED NOT NULL
    );

    SET isOwner = (SELECT user_id = userId FROM encounters WHERE user_id in (0, userId) AND id = encounterId);

    IF isOwner THEN
        # delete encounter creatures
        INSERT INTO temp_creatures (id)
        SELECT id
        FROM encounter_creatures
        WHERE encounter_id = encounterId;

        OPEN curs;
        WHILE more_rows DO
                FETCH curs INTO battleCreatureId;
                IF more_rows THEN
                    CALL BattleCreatures_Delete(battleCreatureId, userId);
                END IF;
            END WHILE;
        CLOSE curs;

        DELETE m FROM encounter_monsters m JOIN encounter_monster_groups g ON g.id = m.encounter_monster_group_id JOIN encounters e ON e.id = g.encounter_id WHERE g.encounter_id = encounterId AND e.user_id = userId;
        DELETE g FROM encounter_monster_groups g JOIN encounters e ON e.id = g.encounter_id WHERE encounter_id = encounterId AND e.user_id = userId;
        DELETE c FROM encounter_characters c JOIN encounter_creatures ec ON ec.id = c.encounter_creature_id JOIN encounters e ON e.id = ec.encounter_id WHERE encounter_id = encounterId AND e.user_id = userId;
        DELETE ec FROM encounter_creatures ec JOIN encounters e ON e.id = ec.encounter_id WHERE encounter_id = encounterId AND e.user_id = userId;
        DELETE FROM encounters WHERE user_id = userId AND id = encounterId;
    END IF;

    COMMIT;

    DROP TEMPORARY TABLE IF EXISTS temp_creatures;
    SELECT 1 AS result;
END;;

DELIMITER ;

