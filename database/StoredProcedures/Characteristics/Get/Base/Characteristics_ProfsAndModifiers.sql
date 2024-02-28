DROP PROCEDURE IF EXISTS Characteristics_ProfsAndModifiers;

DELIMITER ;;
CREATE PROCEDURE Characteristics_ProfsAndModifiers(
    IN characteristicId INT UNSIGNED
)
BEGIN
    CREATE TEMPORARY TABLE IF NOT EXISTS temp_characteristic_attribute_modifiers
    (
        attribute_id INT UNSIGNED NOT NULL,
        value TINYINT
    );

    CREATE TEMPORARY TABLE IF NOT EXISTS temp_characteristic_attribute_profs
    (
        attribute_id INT UNSIGNED NOT NULL,
        advantage BIT,
        disadvantage BIT,
        double_prof BIT,
        half_prof BIT,
        round_up BIT,
        misc_modifier TINYINT
    );

    CREATE TEMPORARY TABLE IF NOT EXISTS temp_characteristic_choice_profs
    (
        attribute_id INT UNSIGNED NOT NULL,
        advantage BIT,
        disadvantage BIT,
        double_prof BIT,
        half_prof BIT,
        round_up BIT,
        misc_modifier TINYINT
    );

    CREATE TEMPORARY TABLE IF NOT EXISTS temp_characteristic_item_profs
    (
        item_id INT UNSIGNED NOT NULL,
        advantage BIT,
        disadvantage BIT,
        double_prof BIT,
        half_prof BIT,
        round_up BIT,
        misc_modifier TINYINT
    );

    INSERT INTO temp_characteristic_attribute_modifiers
    SELECT attribute_id, value
    FROM characteristic_attribute_modifiers
    WHERE characteristic_id = characteristicId;

    INSERT INTO temp_characteristic_attribute_profs
    SELECT attribute_id, advantage, disadvantage, double_prof, half_prof, round_up, misc_modifier
    FROM characteristic_attribute_profs
    WHERE characteristic_id = characteristicId;

    INSERT INTO temp_characteristic_choice_profs
    SELECT attribute_id, advantage, disadvantage, double_prof, half_prof, round_up, misc_modifier
    FROM characteristic_choice_profs
    WHERE characteristic_id = characteristicId;

    INSERT INTO temp_characteristic_item_profs
    SELECT item_id, advantage, disadvantage, double_prof, half_prof, round_up, misc_modifier
    FROM characteristic_item_profs
    WHERE characteristic_id = characteristicId;

    # Ability Modifiers
    SELECT modifierTable.*, a.name, a.description, a.sid, a.attribute_type_id
    FROM temp_characteristic_attribute_modifiers modifierTable
    JOIN abilities joinTable ON modifierTable.attribute_id = joinTable.attribute_id
    JOIN attributes a ON modifierTable.attribute_id = a.id;

    # Misc Modifiers
    SELECT modifierTable.*, a.name, a.description, a.sid, a.attribute_type_id
    FROM characteristic_attribute_modifiers modifierTable
    JOIN misc_attributes joinTable ON modifierTable.attribute_id = joinTable.attribute_id
    JOIN attributes a ON modifierTable.attribute_id = a.id;

    # Ability Profs
    SELECT profTable.*, a.name, a.description, a.sid, a.attribute_type_id
    FROM temp_characteristic_attribute_profs profTable
    JOIN abilities joinTable ON profTable.attribute_id = joinTable.attribute_id
    JOIN attributes a ON profTable.attribute_id = a.id;

    # Armor Type Profs
    SELECT profTable.*, a.name, a.description, a.sid, a.attribute_type_id
    FROM temp_characteristic_attribute_profs profTable
    JOIN armor_types joinTable ON profTable.attribute_id = joinTable.attribute_id
    JOIN attributes a ON profTable.attribute_id = a.id;

    # Language Profs
    SELECT profTable.*, a.name, a.description, a.sid, a.attribute_type_id
    FROM temp_characteristic_attribute_profs profTable
    JOIN languages joinTable ON profTable.attribute_id = joinTable.attribute_id
    JOIN attributes a ON profTable.attribute_id = a.id;

    # Skill Profs
    SELECT profTable.*, a.name, a.description, a.sid, a.attribute_type_id
    FROM temp_characteristic_attribute_profs profTable
    JOIN skills joinTable ON profTable.attribute_id = joinTable.attribute_id
    JOIN attributes a ON profTable.attribute_id = a.id;

    # Tool Category Profs
    SELECT profTable.*, a.name, a.description, a.sid, a.attribute_type_id
    FROM temp_characteristic_attribute_profs profTable
    JOIN tool_categories joinTable ON profTable.attribute_id = joinTable.attribute_id
    JOIN attributes a ON profTable.attribute_id = a.id;

    # Weapon Type Profs
    SELECT profTable.*, a.name, a.description, a.sid, a.attribute_type_id
    FROM temp_characteristic_attribute_profs profTable
    JOIN weapon_types joinTable ON profTable.attribute_id = joinTable.attribute_id
    JOIN attributes a ON profTable.attribute_id = a.id;

    # Skill Choice Profs
    SELECT profTable.*, a.name, a.description, a.sid, a.attribute_type_id
    FROM temp_characteristic_choice_profs profTable
    JOIN skills joinTable ON profTable.attribute_id = joinTable.attribute_id
    JOIN attributes a ON profTable.attribute_id = a.id;

    # Tool Category Choice Profs
    SELECT profTable.*, a.name, a.description, a.sid, a.attribute_type_id
    FROM temp_characteristic_choice_profs profTable
    JOIN tool_categories joinTable ON profTable.attribute_id = joinTable.attribute_id
    JOIN attributes a ON profTable.attribute_id = a.id;

    # Armor Profs
    SELECT profTable.*, i.name, i.description, i.sid, i.item_type_id, joinTable.armor_type_id AS category_id
    FROM temp_characteristic_item_profs profTable
    JOIN armors joinTable ON profTable.item_id = joinTable.item_id
    JOIN items i ON profTable.item_id = i.id;

    # Tool Profs
    SELECT profTable.*, i.name, i.description, i.sid, i.item_type_id, null AS category_id
    FROM temp_characteristic_item_profs profTable
    JOIN tools joinTable ON profTable.item_id = joinTable.item_id
    JOIN items i ON profTable.item_id = i.id;

    # Weapon Profs
    SELECT profTable.*, i.name, i.description, i.sid, i.item_type_id, joinTable.weapon_type_id AS category_id
    FROM temp_characteristic_item_profs profTable
    JOIN weapons joinTable ON profTable.item_id = joinTable.item_id
    JOIN items i ON profTable.item_id = i.id;

    DROP TEMPORARY TABLE IF EXISTS temp_characteristic_attribute_modifiers;
    DROP TEMPORARY TABLE IF EXISTS temp_characteristic_attribute_profs;
    DROP TEMPORARY TABLE IF EXISTS temp_characteristic_choice_profs;
    DROP TEMPORARY TABLE IF EXISTS temp_characteristic_item_profs;
END;;

DELIMITER ;

# CALL Characteristics_ProfsAndModifiers(2);
