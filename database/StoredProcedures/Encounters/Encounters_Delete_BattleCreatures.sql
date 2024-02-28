DROP PROCEDURE IF EXISTS Encounters_Delete_BattleCreatures;

DELIMITER ;;
CREATE PROCEDURE Encounters_Delete_BattleCreatures(
    IN encounterId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE isOwner BIT;
    DECLARE encounterCreatureId INT UNSIGNED;
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
                FETCH curs INTO encounterCreatureId;
                IF more_rows THEN
                    CALL BattleCreatures_Delete(encounterCreatureId, userId);
                END IF;
            END WHILE;
        CLOSE curs;
    END IF;

    COMMIT;

    DROP TEMPORARY TABLE IF EXISTS temp_creatures;
    SELECT 1 AS result;
END;;

DELIMITER ;

