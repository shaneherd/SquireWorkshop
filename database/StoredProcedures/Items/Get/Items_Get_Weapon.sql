DROP PROCEDURE IF EXISTS Items_Get_Weapon;

DELIMITER ;;
CREATE PROCEDURE Items_Get_Weapon(
    IN itemId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE weaponId INT UNSIGNED;

    SET weaponId = (SELECT id FROM items WHERE user_id = userID AND id = itemId UNION SELECT item_id FROM items_shared WHERE user_id = userId AND item_id = itemId);
    IF weaponId IS NULL THEN
        SET weaponId = (SELECT item_id FROM items_public WHERE item_id = itemId);
    END IF;
    IF weaponId IS NULL THEN
        SET weaponId = (SELECT item_id FROM items_private WHERE user_id = userId AND item_id = itemId);
    END IF;
    IF weaponId IS NULL THEN
        SET weaponId = (SELECT ci.item_id
                        FROM creature_items ci
                                 JOIN creatures c ON c.id = ci.creature_id AND ci.item_id = itemId
                                 JOIN campaign_characters cc ON cc.creature_id = c.id
                                 JOIN campaigns c2 ON c2.id = cc.campaign_id AND c2.user_id = userId
                        LIMIT 1);
    END IF;

    SELECT i.id, i.name, i.description, i.sid, i.expendable, i.container, i.ignore_weight,
           i.cost, i.cost_unit AS cost_unit_id, cu.name AS cost_unit_name, cu.abbreviation AS cost_unit_abbreviation,
           cu.conversion_unit AS conversion_unit_id, cu.conversion_value, cu.weight AS cost_unit_weight, i.weight,
           w.weapon_type_id, wt.name AS weapon_type_name, wt.description AS weapon_type_description, wt.sid AS weapon_type_sid, wt.user_id = userId AS weapon_type_is_author, wt.version AS weapon_type_version,
           w.weapon_range_type, w.normal_range, w.long_range, w.attack_mod, w.ammo_id,
           ai.name AS ammo_name, ai.description AS ammo_description, ai.sid AS ammo_sid, ai.user_id = userId AS ammo_is_author,
           i.user_id = userId AS is_author, i.version
    FROM items i
        JOIN weapons w ON w.item_id = i.id AND i.id = weaponId
        JOIN cost_units cu on i.cost_unit = cu.id
        LEFT JOIN items ai ON w.ammo_id = ai.id
        JOIN attributes wt ON wt.id = w.weapon_type_id;

    IF weaponId IS NOT NULL THEN
        # weapon properties
        SELECT wwp.weapon_property_id, a.name AS weapon_property_name, a.description as weapon_property_description, a.sid as weapon_property_sid,
               a.user_id = userId AS weapon_property_is_author, a.version AS weapon_property_version
        FROM weapon_weapon_properties wwp
            JOIN weapon_properties wp ON wwp.weapon_property_id = wp.attribute_id
            JOIN attributes a ON wp.attribute_id = a.id
        WHERE wwp.weapon_id = weaponId;

        # non-versatile damages
        SELECT num_dice, dice_size, misc_mod, versatile,
               ability_modifier_id, a.name AS ability_name, a.description AS ability_description, a.sid AS ability_sid, ab.abbr,
               a.user_id = userId AS ability_is_author, a.version AS ability_version,
               damage_type_id, dt.name AS damage_type_name, dt.description AS damage_type_description, dt.sid AS damage_type_sid,
               dt.user_id = userId AS damage_type_is_author, dt.version AS damage_type_version
        FROM items i
            JOIN item_damages d ON d.item_id = i.id AND i.id = weaponId AND d.versatile = 0
            LEFT JOIN attributes a ON a.id = d.ability_modifier_id
            LEFT JOIN abilities ab ON ab.attribute_id = a.id
            LEFT JOIN attributes dt ON dt.id = d.damage_type_id;

        # versatile damages
        SELECT num_dice, dice_size, misc_mod, versatile,
               ability_modifier_id, a.name AS ability_name, a.description AS ability_description, a.sid AS ability_sid, ab.abbr,
               a.user_id = userId AS ability_is_author, a.version AS ability_version,
               damage_type_id, dt.name AS damage_type_name, dt.description AS damage_type_description, dt.sid AS damage_type_sid,
               dt.user_id = userId AS damage_type_is_author, dt.version AS damage_type_version
        FROM items i
            JOIN item_damages d ON d.item_id = i.id AND i.id = weaponId AND d.versatile = 1
            LEFT JOIN attributes a ON a.id = d.ability_modifier_id
            LEFT JOIN abilities ab ON ab.attribute_id = a.id
            LEFT JOIN attributes dt ON dt.id = d.damage_type_id;
    END IF;
END;;

DELIMITER ;

