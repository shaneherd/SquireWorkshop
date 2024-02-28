DROP PROCEDURE IF EXISTS CreatureActions_Get_BonusAction;

DELIMITER ;;
CREATE PROCEDURE CreatureActions_Get_BonusAction(
    IN creatureId INT UNSIGNED
)
BEGIN
    DECLARE actionCastingTime TINYINT UNSIGNED;
    DECLARE actionId TINYINT UNSIGNED;

    SET actionCastingTime = 2;
    SET actionId = 2;

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
    ) AS a
    ORDER BY action_item_name;
END;;

DELIMITER ;

CALL CreatureActions_Get_BonusAction(1);
