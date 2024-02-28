DROP PROCEDURE IF EXISTS CreatureActions_Powers_Validate;

DELIMITER ;;
CREATE PROCEDURE CreatureActions_Powers_Validate(
    IN creatureId INT UNSIGNED
)
BEGIN
    DECLARE quantity SMALLINT UNSIGNED;
    DECLARE creatureActionId INT UNSIGNED;
    DECLARE powerId INT UNSIGNED;

    DECLARE more_rows BOOLEAN DEFAULT TRUE;
    DECLARE curs CURSOR FOR SELECT ca.id, cap.power_id
                            FROM creature_actions ca
                                JOIN creature_action_powers cap ON ca.id = cap.creature_action_id
                            WHERE ca.creature_id = creatureId;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET more_rows = FALSE;

    CREATE TEMPORARY TABLE IF NOT EXISTS temp_creature_actions
    (
        id INT UNSIGNED NOT NULL
    );

    OPEN curs;
    WHILE more_rows DO
        FETCH curs INTO creatureActionId, powerId;

        IF more_rows THEN
            SET quantity = (SELECT COUNT(*)
                            FROM creature_powers
                            WHERE creature_id = creatureId AND power_id = powerId);
            IF quantity = 0 THEN
                INSERT INTO temp_creature_actions (id) VALUE (creatureActionId);
            END IF;
        END IF;
    END WHILE;
    CLOSE curs;

    DELETE cai
    FROM chained_action_items cai
    JOIN temp_creature_actions tca ON cai.creature_action_id = tca.id;

    DELETE cap
    FROM creature_action_powers cap
    JOIN temp_creature_actions t ON t.id = cap.creature_action_id;

    DELETE ca
    FROM creature_actions ca
    JOIN temp_creature_actions t ON t.id = ca.id;

    DROP TEMPORARY TABLE IF EXISTS temp_creature_actions;
END;;

DELIMITER ;

# CALL CreatureActions_Powers_Validate(1);
