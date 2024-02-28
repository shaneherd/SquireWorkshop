DROP PROCEDURE IF EXISTS Items_Get_Vehicle;

DELIMITER ;;
CREATE PROCEDURE Items_Get_Vehicle(
    IN itemId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE vehicleId INT UNSIGNED;

    SET vehicleId = (SELECT id FROM items WHERE user_id = userID AND id = itemId UNION SELECT item_id FROM items_shared WHERE user_id = userId AND item_id = itemId);
    IF vehicleId IS NULL THEN
        SET vehicleId = (SELECT item_id FROM items_public WHERE item_id = itemId);
    END IF;
    IF vehicleId IS NULL THEN
        SET vehicleId = (SELECT item_id FROM items_private WHERE user_id = userId AND item_id = itemId);
    END IF;
    IF vehicleId IS NULL THEN
        SET vehicleId = (SELECT ci.item_id
                         FROM creature_items ci
                                  JOIN creatures c ON c.id = ci.creature_id AND ci.item_id = itemId
                                  JOIN campaign_characters cc ON cc.creature_id = c.id
                                  JOIN campaigns c2 ON c2.id = cc.campaign_id AND c2.user_id = userId
                         LIMIT 1);
    END IF;

    SELECT i.id, i.name, i.description, i.sid,
           i.cost, i.cost_unit AS cost_unit_id, cu.name AS cost_unit_name, cu.abbreviation AS cost_unit_abbreviation,
           cu.conversion_unit AS conversion_unit_id, cu.conversion_value, cu.weight AS cost_unit_weight, i.weight,
           i.user_id = userId AS is_author, i.version
    FROM items i
        JOIN vehicles v ON v.item_id = i.id AND i.id = vehicleId
        JOIN cost_units cu on i.cost_unit = cu.id;
END;;

DELIMITER ;

