DROP PROCEDURE IF EXISTS CreatureActions_Get_StandardAction;

DELIMITER ;;
CREATE PROCEDURE CreatureActions_Get_StandardAction(
    IN creatureId INT UNSIGNED
)
BEGIN
    DECLARE actionCastingTime TINYINT UNSIGNED;
    DECLARE actionId TINYINT UNSIGNED;
    DECLARE handSlotId TINYINT UNSIGNED;

    SET actionCastingTime = 1;
    SET actionId = 1;
    SET handSlotId = 2;

    SELECT * FROM (
        SELECT ca.id AS creature_action_id, ca.creature_action_type_id, p.id AS action_item_id, p.name AS action_item_name,
               NULL AS action_sub_item_id, NULL AS action_sub_item_name,
               ca.favorite, ca.favorite_order, cap.default_characteristic_id AS default_id, actionId AS action_id
        FROM creature_actions ca
        JOIN creature_action_powers cap ON cap.creature_action_id = ca.id AND ca.creature_id = creatureId
        JOIN powers p ON cap.power_id = p.id
        JOIN spells s ON s.power_id = p.id
        WHERE s.casting_time_unit = actionCastingTime

        UNION

        SELECT ca.id AS creature_action_id, ca.creature_action_type_id, p.id AS action_item_id, p.name AS action_item_name,
               NULL AS action_sub_item_id, NULL AS action_sub_item_name,
               ca.favorite, ca.favorite_order, cap.default_characteristic_id AS default_id, actionId AS action_id
        FROM creature_actions ca
        JOIN creature_action_powers cap ON cap.creature_action_id = ca.id AND ca.creature_id = creatureId
        JOIN powers p ON cap.power_id = p.id
        JOIN features f ON f.power_id = p.id
        WHERE f.action_id = actionId

        UNION

        SELECT ca.id AS creature_action_id, ca.creature_action_type_id, i.id AS action_item_id, i.name AS action_item_name,
               i2.id AS action_sub_item_id, i2.name AS action_sub_item_name,
               ca.favorite, ca.favorite_order, null AS default_id, actionId AS action_id
        FROM creature_actions ca
        JOIN creature_action_items cai ON cai.creature_action_id = ca.id AND ca.creature_id = creatureId
        JOIN items i ON cai.item_id = i.id
        LEFT JOIN magical_items mi ON mi.item_id = i.id
        LEFT JOIN items i2 ON cai.sub_item_id = i2.id
        WHERE i.slot = handSlotId
            OR mi.magical_item_type_id = 4 -- rod
            OR mi.magical_item_type_id = 5 -- scroll
            OR mi.magical_item_type_id = 6 -- staff
            OR mi.magical_item_type_id = 7 -- wand
    ) AS a
    ORDER BY action_item_name;
END;;

DELIMITER ;

CALL CreatureActions_Get_StandardAction(1);
