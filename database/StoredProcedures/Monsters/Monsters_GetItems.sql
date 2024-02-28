DROP PROCEDURE IF EXISTS Monsters_GetItems;

DELIMITER ;;
CREATE PROCEDURE Monsters_GetItems(
    IN creatureId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE monsterId INT UNSIGNED;
    DECLARE monsterUserId MEDIUMINT UNSIGNED;

    SET monsterId = (SELECT id FROM monsters WHERE user_id = userID AND id = creatureId UNION SELECT monster_id FROM monsters_shared WHERE user_id = userId AND monster_id = creatureId);
    IF monsterId IS NULL THEN
        SET monsterId = (SELECT monster_id FROM monsters_public WHERE monster_id = creatureId);
    END IF;
    IF monsterId IS NULL THEN
        SET monsterId = (SELECT monster_id FROM monsters_private WHERE user_id = userId AND monster_id = creatureId);
    END IF;
    IF monsterId IS NULL THEN
        SET monsterId = (SELECT m.id
                         FROM monsters m
                                  JOIN companions c ON m.id = c.monster_id AND c.monster_id = creatureId
                                  JOIN character_companions cc ON c.creature_id = cc.companion_id
                                  JOIN campaign_characters cc2 ON cc.character_id = cc2.creature_id
                                  JOIN campaigns c2 ON cc2.campaign_id = c2.id AND c2.user_id = userId
                         LIMIT 1);
    END IF;
    SET monsterUserId = (SELECT user_id FROM monsters WHERE id = monsterId);

    # Items
    SELECT mi.item_id, i.name AS item_name, i.sid AS item_sid, i.user_id = userId AS item_is_author, mi.quantity, mi.user_id = userId AS item_quantity_author,
           i.cost,i.cost_unit,i.item_type_id,i.version,
           mi.sub_item_id, i2.name AS sub_item_name, i2.sid AS sub_item_sid, i2.user_id = userId AS sub_item_is_author, i2.cost AS sub_item_cost,
           i2.cost_unit AS sub_item_cost_unit, i2.item_type_id AS sub_item_type_id
    FROM monster_items mi
        JOIN items i ON mi.item_id = i.id AND mi.monster_id = monsterId
        LEFT JOIN items i2 ON i2.id = mi.sub_item_id
        JOIN monsters m ON m.id = mi.monster_id
    WHERE mi.user_id = monsterUserId OR mi.user_id = m.user_id
    ORDER BY i.name;
END;;

DELIMITER ;

