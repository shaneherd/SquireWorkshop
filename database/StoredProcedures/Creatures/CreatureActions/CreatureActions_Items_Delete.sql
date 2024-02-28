DROP PROCEDURE IF EXISTS CreatureActions_Items_Delete;

DELIMITER ;;
CREATE PROCEDURE CreatureActions_Items_Delete(
    IN creatureId INT UNSIGNED,
    IN itemId INT UNSIGNED,
    IN subItemId INT UNSIGNED
)
BEGIN
    DECLARE quantity SMALLINT UNSIGNED;
    DECLARE creatureActionId INT UNSIGNED;

    SET quantity = (SELECT COUNT(*)
        FROM creature_items
        WHERE creature_id = creatureId
          AND item_id = itemId
          AND (subItemId IS NULL OR magic_item_type_id = subItemId));

    IF quantity = 0 THEN
        SET creatureActionId = (SELECT id
            FROM creature_actions ca
                JOIN creature_action_items cai ON ca.id = cai.creature_action_id
            WHERE creature_id = creatureId AND item_id = itemId AND (subItemId IS NULL OR sub_item_id = subItemId));

        IF creatureActionId IS NOT NULL THEN
            DELETE FROM chained_action_items
            WHERE creature_action_id = creatureActionId;

            DELETE FROM creature_action_items
            WHERE creature_action_id = creatureActionId;

            DELETE FROM creature_actions
            WHERE id = creatureActionId;
        END IF;
    END IF;
END;;

DELIMITER ;

# CALL CreatureActions_Items_Delete(1, 1, 1, 1);
