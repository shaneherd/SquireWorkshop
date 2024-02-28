DROP PROCEDURE IF EXISTS CreatureActions_Items_Validate;

DELIMITER ;;
CREATE PROCEDURE CreatureActions_Items_Validate(
    IN creatureId INT UNSIGNED
)
BEGIN
    DECLARE quantity SMALLINT UNSIGNED;
    DECLARE creatureActionId INT UNSIGNED;
    DECLARE itemId INT UNSIGNED;
    DECLARE subItemId INT UNSIGNED;

    DECLARE more_rows BOOLEAN DEFAULT TRUE;
    DECLARE curs CURSOR FOR SELECT ca.id, cai.item_id, cai.sub_item_id
                            FROM creature_actions ca
                                JOIN creature_action_items cai ON ca.id = cai.creature_action_id
                            WHERE ca.creature_id = creatureId;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET more_rows = FALSE;

    CREATE TEMPORARY TABLE IF NOT EXISTS temp_creature_actions
    (
        id INT UNSIGNED NOT NULL
    );

    OPEN curs;
    WHILE more_rows DO
        FETCH curs INTO creatureActionId, itemId, subItemId;

        IF more_rows THEN
            SET quantity = (SELECT COUNT(*)
                            FROM creature_items
                            WHERE creature_id = creatureId
                              AND item_id = itemId
                              AND (subItemId IS NULL OR magic_item_type_id = subItemId));
            IF quantity = 0 THEN
                INSERT INTO temp_creature_actions (id) VALUE (creatureActionId);
            END IF;
        END IF;
    END WHILE;
    CLOSE curs;

    DELETE cai
    FROM chained_action_items cai
    JOIN temp_creature_actions tca ON cai.creature_action_id = tca.id;

    DELETE cai
    FROM creature_action_items cai
    JOIN temp_creature_actions t ON t.id = cai.creature_action_id;

    DELETE ca
    FROM creature_actions ca
    JOIN temp_creature_actions t ON t.id = ca.id;

    DROP TEMPORARY TABLE IF EXISTS temp_creature_actions;
END;;

DELIMITER ;

# CALL CreatureActions_Items_Validate(1);
