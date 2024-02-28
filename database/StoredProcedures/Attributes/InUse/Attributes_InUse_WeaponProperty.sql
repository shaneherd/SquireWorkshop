DROP PROCEDURE IF EXISTS Attributes_InUse_WeaponProperty;

DELIMITER ;;
CREATE PROCEDURE Attributes_InUse_WeaponProperty(
    IN attributeId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    CREATE TEMPORARY TABLE IF NOT EXISTS temp_items
    (
        id INT UNSIGNED NOT NULL,
        required BIT
    );

    INSERT INTO temp_items
    SELECT p.weapon_id, 0
    FROM weapon_weapon_properties p
        JOIN items ui ON ui.user_id = userId AND ui.id = p.weapon_id AND p.weapon_property_id = attributeId;

    INSERT INTO temp_items
    SELECT p.weapon_id, 0
    FROM weapon_weapon_properties p
        JOIN items_shared ui ON ui.user_id = userId AND ui.item_id = p.weapon_id AND p.weapon_property_id = attributeId;

    # Get Values
    SELECT 4 AS type_id, i.item_type_id AS sub_type_id, i.id, i.name, t.required
    FROM (SELECT id, MAX(required) AS required FROM temp_items GROUP BY id) AS t
        JOIN items i ON t.id = i.id
    ORDER BY sub_type_id, name;

    DROP TEMPORARY TABLE IF EXISTS temp_items;
END;;

DELIMITER ;

# CALL Attributes_InUse_WeaponProperty(125, 1);

