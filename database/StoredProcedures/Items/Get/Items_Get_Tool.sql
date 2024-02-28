DROP PROCEDURE IF EXISTS Items_Get_Tool;

DELIMITER ;;
CREATE PROCEDURE Items_Get_Tool(
    IN itemId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE toolId INT UNSIGNED;

    SET toolId = (SELECT id FROM items WHERE user_id = userID AND id = itemId UNION SELECT item_id FROM items_shared WHERE user_id = userId AND item_id = itemId);
    IF toolId IS NULL THEN
        SET toolId = (SELECT item_id FROM items_public WHERE item_id = itemId);
    END IF;
    IF toolId IS NULL THEN
        SET toolId = (SELECT item_id FROM items_private WHERE user_id = userId AND item_id = itemId);
    END IF;
    IF toolId IS NULL THEN
        SET toolId = (SELECT ci.item_id
                      FROM creature_items ci
                               JOIN creatures c ON c.id = ci.creature_id AND ci.item_id = itemId
                               JOIN campaign_characters cc ON cc.creature_id = c.id
                               JOIN campaigns c2 ON c2.id = cc.campaign_id AND c2.user_id = userId
                      LIMIT 1);
    END IF;

    SELECT i.id, i.name, i.description, i.sid, i.expendable, i.equippable, i.slot, i.container, i.ignore_weight,
           i.cost, i.cost_unit AS cost_unit_id, cu.name AS cost_unit_name, cu.abbreviation AS cost_unit_abbreviation,
           cu.conversion_unit AS conversion_unit_id, cu.conversion_value, cu.weight AS cost_unit_weight, i.weight,
           t.tool_category_id, tc.name AS tool_category_name, tc.description AS tool_category_description, tc.sid AS tool_category_sid, tc.user_id = userId AS tool_category_is_author, tc.version AS tool_category_version,
           i.user_id = userId AS is_author, i.version
    FROM items i
        JOIN tools t ON t.item_id = i.id AND i.id = toolId
        JOIN cost_units cu on i.cost_unit = cu.id
        JOIN attributes tc ON t.tool_category_id = tc.id;
END;;

DELIMITER ;

