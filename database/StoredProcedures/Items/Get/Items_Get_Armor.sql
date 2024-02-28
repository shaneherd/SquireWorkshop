DROP PROCEDURE IF EXISTS Items_Get_Armor;

DELIMITER ;;
CREATE PROCEDURE Items_Get_Armor(
    IN itemId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE armorId INT UNSIGNED;

    SET armorId = (SELECT id FROM items WHERE user_id = userID AND id = itemId UNION SELECT item_id FROM items_shared WHERE user_id = userId AND item_id = itemId);
    IF armorId IS NULL THEN
        SET armorId = (SELECT item_id FROM items_public WHERE item_id = itemId);
    END IF;
    IF armorId IS NULL THEN
        SET armorId = (SELECT item_id FROM items_private WHERE user_id = userId AND item_id = itemId);
    END IF;
    IF armorId IS NULL THEN
        SET armorId = (SELECT ci.item_id
                       FROM creature_items ci
                                JOIN creatures c ON c.id = ci.creature_id AND ci.item_id = itemId
                                JOIN campaign_characters cc ON cc.creature_id = c.id
                                JOIN campaigns c2 ON c2.id = cc.campaign_id AND c2.user_id = userId
                       LIMIT 1);
    END IF;

    SELECT i.id, i.name, i.description, i.sid, i.expendable, i.equippable, i.slot, i.container, i.ignore_weight,
           i.cost, i.cost_unit AS cost_unit_id, cu.name AS cost_unit_name, cu.abbreviation AS cost_unit_abbreviation,
           cu.conversion_unit AS conversion_unit_id, cu.conversion_value, cu.weight AS cost_unit_weight, i.weight,
           a.armor_type_id, at.name AS armor_type_name, at.description AS armor_type_description, at.sid AS armor_type_sid, t.don, t.don_time_unit, t.doff, t.doff_time_unit, at.user_id = userId AS armor_type_is_author, at.version AS armor_type_version,
           a.ability_modifier_id, ab.name AS ability_name, ab.description AS ability_description, ab.sid AS ability_sid, b.abbr, ab.user_id = userId AS ability_is_author, ab.version AS ability_version,
           a.ac, a.max_ability_modifier, a.min_strength, a.stealth_disadvantage,
           i.user_id = userId AS is_author, i.version
    FROM items i
        JOIN armors a ON a.item_id = i.id AND i.id = armorId
        JOIN cost_units cu on i.cost_unit = cu.id
        JOIN attributes at ON at.id = a.armor_type_id
        JOIN armor_types t on a.armor_type_id = t.attribute_id
        LEFT JOIN attributes ab ON ab.id = a.ability_modifier_id
        LEFT JOIN abilities b ON b.attribute_id = ab.id;
END;;

DELIMITER ;

