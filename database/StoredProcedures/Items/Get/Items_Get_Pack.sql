DROP PROCEDURE IF EXISTS Items_Get_Pack;

DELIMITER ;;
CREATE PROCEDURE Items_Get_Pack(
    IN itemId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE packId INT UNSIGNED;

    SET packId = (SELECT id FROM items WHERE user_id = userID AND id = itemId UNION SELECT item_id FROM items_shared WHERE user_id = userId AND item_id = itemId);
    IF packId IS NULL THEN
        SET packId = (SELECT item_id FROM items_public WHERE item_id = itemId);
    END IF;
    IF packId IS NULL THEN
        SET packId = (SELECT item_id FROM items_private WHERE user_id = userId AND item_id = itemId);
    END IF;
    IF packId IS NULL THEN
        SET packId = (SELECT ci.item_id
                      FROM creature_items ci
                               JOIN creatures c ON c.id = ci.creature_id AND ci.item_id = itemId
                               JOIN campaign_characters cc ON cc.creature_id = c.id
                               JOIN campaigns c2 ON c2.id = cc.campaign_id AND c2.user_id = userId
                      LIMIT 1);
    END IF;

    SELECT i.id, i.name, i.description, i.sid, i.user_id = userId AS is_author, i.version
    FROM items i
        JOIN packs p ON p.item_id = i.id AND i.id = packId;

    IF packId IS NOT NULL THEN
        # pack items
        SELECT pi.item_id, i.name AS item_name, i.sid AS item_sid, i.user_id = userId AS item_is_author, pi.quantity, i.cost, i.cost_unit, i.item_type_id, i.version,
               pi.sub_item_id, i2.name AS sub_item_name, i2.sid AS sub_item_sid, i2.user_id = userId AS sub_item_is_author, i2.cost AS sub_item_cost,
               i2.cost_unit AS sub_item_cost_unit, i2.item_type_id AS sub_item_type_id
        FROM pack_items pi
            JOIN items i ON pi.item_id = i.id AND pi.pack_id = packId
            LEFT JOIN items i2 ON i2.id = pi.sub_item_id;
    END IF;
END;;

DELIMITER ;

