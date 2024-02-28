DROP PROCEDURE IF EXISTS CreatureActions_Items_Add;

DELIMITER ;;
CREATE PROCEDURE CreatureActions_Items_Add(
    IN creatureId INT UNSIGNED,
    IN itemId INT UNSIGNED,
    IN subItemId INT UNSIGNED
)
BEGIN
    DECLARE creatureActionId INT UNSIGNED;
    DECLARE newCreatureActionId INT UNSIGNED;
    DECLARE quantity SMALLINT UNSIGNED;

    SET quantity = (SELECT COUNT(*)
        FROM creature_items
        WHERE creature_id = creatureId
          AND item_id = itemId
          AND (subItemId IS NULL OR magic_item_type_id = subItemId));

    SET creatureActionId = (SELECT ca.id
        FROM creature_action_items cai
            JOIN creature_actions ca ON ca.id = cai.creature_action_id
        WHERE creature_id = creatureId
          AND item_id = itemId
          AND ((sub_item_id IS NULL AND subItemId IS NULL) OR (sub_item_id = subItemId)));

    IF quantity > 0 && creatureActionId IS NULL THEN
        INSERT INTO creature_actions (creature_id, creature_action_type_id, favorite, favorite_order) VALUE
        (creatureId, 3, 0, 0);

        SET newCreatureActionId = (SELECT LAST_INSERT_ID());

        INSERT INTO creature_action_items (creature_action_id, item_id, sub_item_id) VALUE
        (newCreatureActionId, itemId, subItemId);
    END IF;
END;;

DELIMITER ;

# CALL CreatureActions_Items_Add(1, 1, 1, 1);
