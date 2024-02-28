DROP PROCEDURE IF EXISTS Items_Get_Ammo;

DELIMITER ;;
CREATE PROCEDURE Items_Get_Ammo(
    IN itemId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE ammoId INT UNSIGNED;

    SET ammoId = (SELECT id FROM items WHERE user_id = userID AND id = itemId UNION SELECT item_id FROM items_shared WHERE user_id = userId AND item_id = itemId);
    IF ammoId IS NULL THEN
        SET ammoId = (SELECT item_id FROM items_public WHERE item_id = itemId);
    END IF;
    IF ammoId IS NULL THEN
        SET ammoId = (SELECT item_id FROM items_private WHERE user_id = userId AND item_id = itemId);
    END IF;
    IF ammoId IS NULL THEN
        SET ammoId = (SELECT ci.item_id
                      FROM creature_items ci
                               JOIN creatures c ON c.id = ci.creature_id AND ci.item_id = itemId
                               JOIN campaign_characters cc ON cc.creature_id = c.id
                               JOIN campaigns c2 ON c2.id = cc.campaign_id AND c2.user_id = userId
                      LIMIT 1);
    END IF;

    SELECT i.id, i.name, i.description, i.sid,
           i.cost, i.cost_unit AS cost_unit_id, cu.name AS cost_unit_name, cu.abbreviation AS cost_unit_abbreviation,
           cu.conversion_unit AS conversion_unit_id, cu.conversion_value, cu.weight AS cost_unit_weight, i.weight,
           a.attack_modifier, a.attack_ability_modifier_id, ab.name AS attack_ability_name, ab.description AS attack_ability_description,
           ab.sid AS attack_ability_sid, b.abbr, ab.user_id = userId AS attack_ability_is_author, ab.version AS attack_ability_version,
           i.user_id = userId AS is_author, i.version
    FROM items i
        JOIN ammos a ON a.item_id = i.id AND i.id = ammoId
        JOIN cost_units cu on i.cost_unit = cu.id
        LEFT JOIN attributes ab ON ab.id = a.attack_ability_modifier_id
        LEFT JOIN abilities b ON b.attribute_id = ab.id;

    IF ammoId IS NOT NULL THEN
        SELECT num_dice, dice_size, misc_mod, versatile,
               ability_modifier_id, a.name AS ability_name, a.description AS ability_description, a.sid AS ability_sid, ab.abbr,
               a.user_id = userId AS ability_is_author, a.version AS ability_version,
               damage_type_id, dt.name AS damage_type_name, dt.description AS damage_type_description, dt.sid AS damage_type_sid,
               dt.user_id = userId AS damage_type_is_author, dt.version AS damage_type_version
        FROM items i
            JOIN item_damages d ON d.item_id = i.id AND i.id = ammoId AND d.versatile = 0
            LEFT JOIN attributes a ON a.id = d.ability_modifier_id
            LEFT JOIN abilities ab ON ab.attribute_id = a.id
            LEFT JOIN attributes dt ON dt.id = d.damage_type_id;
    END IF;
END;;

DELIMITER ;

