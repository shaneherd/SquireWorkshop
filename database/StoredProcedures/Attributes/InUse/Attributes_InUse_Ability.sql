DROP PROCEDURE IF EXISTS Attributes_InUse_Ability;

DELIMITER ;;
CREATE PROCEDURE Attributes_InUse_Ability(
    IN attributeId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    CREATE TEMPORARY TABLE IF NOT EXISTS temp_attributes
    (
        id INT UNSIGNED NOT NULL,
        required BIT
    );

    CREATE TEMPORARY TABLE IF NOT EXISTS temp_characteristics
    (
        id INT UNSIGNED NOT NULL,
        required BIT
    );

    CREATE TEMPORARY TABLE IF NOT EXISTS temp_powers
    (
        id INT UNSIGNED NOT NULL,
        required BIT
    );

    CREATE TEMPORARY TABLE IF NOT EXISTS temp_items
    (
        id INT UNSIGNED NOT NULL,
        required BIT
    );

    CREATE TEMPORARY TABLE IF NOT EXISTS temp_creatures
    (
        id INT UNSIGNED NOT NULL,
        required BIT
    );

    CREATE TEMPORARY TABLE IF NOT EXISTS temp_monsters
    (
        id INT UNSIGNED NOT NULL,
        required BIT
    );

    INSERT INTO temp_characteristics
    SELECT am.characteristic_id, 0
    FROM characteristic_attribute_modifiers am
        JOIN characteristics uc ON uc.user_id = userId AND uc.id = am.characteristic_id AND am.attribute_id = attributeId;

    INSERT INTO temp_characteristics
    SELECT am.characteristic_id, 0
    FROM characteristic_attribute_modifiers am
        JOIN characteristics_shared uc ON uc.user_id = userId AND uc.characteristic_id = am.characteristic_id AND am.attribute_id = attributeId;

    INSERT INTO temp_powers
    SELECT pm.power_id, 0
    FROM power_modifiers pm
        JOIN powers up ON up.user_id = userId AND up.id = pm.power_id AND pm.attribute_id = attributeId;

    INSERT INTO temp_powers
    SELECT pm.power_id, 0
    FROM power_modifiers pm
        JOIN powers_shared up ON up.user_id = userId AND up.power_id = pm.power_id AND pm.attribute_id = attributeId;

    INSERT INTO temp_powers
    SELECT pm.power_id, 0
    FROM power_modifiers pm
             JOIN powers up ON up.user_id = userId AND up.id = pm.power_id AND pm.ability_modifier_id = attributeId;

    INSERT INTO temp_powers
    SELECT pm.power_id, 0
    FROM power_modifiers pm
             JOIN powers_shared up ON up.user_id = userId AND up.power_id = pm.power_id AND pm.ability_modifier_id = attributeId;

    INSERT INTO temp_characteristics
    SELECT p.characteristic_id, 0
    FROM characteristic_attribute_profs p
        JOIN characteristics uc ON uc.user_id = userId AND uc.id = p.characteristic_id AND p.attribute_id = attributeId;

    INSERT INTO temp_characteristics
    SELECT p.characteristic_id, 0
    FROM characteristic_attribute_profs p
        JOIN characteristics_shared uc ON uc.user_id = userId AND uc.characteristic_id = p.characteristic_id AND p.attribute_id = attributeId;

    INSERT INTO temp_characteristics
    SELECT p.characteristic_id, 0
    FROM characteristic_choice_profs p
        JOIN characteristics uc ON uc.user_id = userId AND uc.id = p.characteristic_id AND p.attribute_id = attributeId;

    INSERT INTO temp_characteristics
    SELECT p.characteristic_id, 0
    FROM characteristic_choice_profs p
        JOIN characteristics_shared uc ON uc.user_id = userId AND uc.characteristic_id = p.characteristic_id AND p.attribute_id = attributeId;

    INSERT INTO temp_characteristics
    SELECT class_id, 0
    FROM class_secondary_attribute_profs p
        JOIN characteristics uc ON uc.user_id = userId AND uc.id = p.class_id AND p.attribute_id = attributeId;

    INSERT INTO temp_characteristics
    SELECT class_id, 0
    FROM class_secondary_attribute_profs p
        JOIN characteristics_shared uc ON uc.user_id = userId AND uc.characteristic_id = p.class_id AND p.attribute_id = attributeId;

    INSERT INTO temp_characteristics
    SELECT class_id, 0
    FROM class_secondary_choice_profs p
        JOIN characteristics uc ON uc.user_id = userId AND uc.id = p.class_id AND p.attribute_id = attributeId;

    INSERT INTO temp_characteristics
    SELECT class_id, 0
    FROM class_secondary_choice_profs p
        JOIN characteristics_shared uc ON uc.user_id = userId AND uc.characteristic_id = p.class_id AND p.attribute_id = attributeId;

    INSERT INTO temp_creatures
    SELECT p.creature_id, 0
    FROM creature_attribute_profs p
        JOIN creatures uc ON uc.user_id = userId AND uc.id = p.creature_id AND p.attribute_id = attributeId
            AND (advantage = 1 OR disadvantage = 1 OR proficient = 1 OR double_prof = 1 OR half_prof = 1 OR misc_modifier != 0);

    INSERT INTO temp_creatures
    SELECT p.creature_id, 0
    FROM creature_attribute_profs p
        JOIN creatures_shared uc ON uc.user_id = userId AND uc.creature_id = p.creature_id AND p.attribute_id = attributeId
            AND (advantage = 1 OR disadvantage = 1 OR proficient = 1 OR double_prof = 1 OR half_prof = 1 OR misc_modifier != 0);

    INSERT INTO temp_monsters
    SELECT p.monster_id, 0
    FROM monster_attribute_profs p
             JOIN monsters uc ON uc.user_id = userId AND uc.id = p.monster_id AND p.attribute_id = attributeId;

    INSERT INTO temp_monsters
    SELECT p.monster_id, 0
    FROM monster_attribute_profs p
             JOIN monsters_shared uc ON uc.user_id = userId AND uc.monster_id = p.monster_id AND p.attribute_id = attributeId;

    INSERT INTO temp_creatures
    SELECT ac.creature_id, 1
    FROM creature_ac_abilities ac
        JOIN creatures uc ON uc.user_id = userId AND uc.id = ac.creature_id AND ac.ability_id = attributeId;

    INSERT INTO temp_creatures
    SELECT ac.creature_id, 1
    FROM creature_ac_abilities ac
        JOIN creatures_shared uc ON uc.user_id = userId AND uc.creature_id = ac.creature_id AND ac.ability_id = attributeId;

    INSERT INTO temp_items
    SELECT a.item_id, 0
    FROM ammos a
        JOIN items ui ON ui.user_id = userId AND ui.id = a.item_id AND a.attack_ability_modifier_id = attributeId;

    INSERT INTO temp_items
    SELECT a.item_id, 0
    FROM ammos a
        JOIN items_shared ui ON ui.user_id = userId AND ui.item_id = a.item_id AND a.attack_ability_modifier_id = attributeId;

    INSERT INTO temp_items
    SELECT a.item_id, 0
    FROM armors a
        JOIN items ui ON ui.user_id = userId AND ui.id = a.item_id AND a.ability_modifier_id = attributeId;

    INSERT INTO temp_items
    SELECT a.item_id, 0
    FROM armors a
        JOIN items_shared ui ON ui.user_id = userId AND ui.item_id = a.item_id AND a.ability_modifier_id = attributeId;

    INSERT INTO temp_creatures
    SELECT asi.character_id, 1
    FROM character_ability_scores_to_increase asi
        JOIN creatures uc ON uc.user_id = userId AND uc.id = asi.character_id AND asi.ability_id = attributeId;

    INSERT INTO temp_creatures
    SELECT asi.character_id, 1
    FROM character_ability_scores_to_increase asi
        JOIN creatures_shared uc ON uc.user_id = userId AND uc.creature_id = asi.character_id AND asi.ability_id = attributeId;

    INSERT INTO temp_creatures
    SELECT character_id, 0
    FROM character_chosen_classes ccc
        JOIN creatures uc ON uc.user_id = userId AND uc.id = ccc.character_id AND ccc.spellcasting_ability_id = attributeId;

    INSERT INTO temp_creatures
    SELECT character_id, 0
    FROM character_chosen_classes ccc
        JOIN creatures_shared uc ON uc.user_id = userId AND uc.creature_id = ccc.character_id AND ccc.spellcasting_ability_id = attributeId;

    INSERT INTO temp_creatures
    SELECT ch.creature_id, 0
    FROM characters ch
        JOIN creatures uc ON uc.user_id = userId AND uc.id = ch.creature_id AND ch.background_spellcasting_ability_id = attributeId;

    INSERT INTO temp_creatures
    SELECT ch.creature_id, 0
    FROM characters ch
        JOIN creatures_shared uc ON uc.user_id = userId AND uc.creature_id = ch.creature_id AND ch.background_spellcasting_ability_id = attributeId;

    INSERT INTO temp_creatures
    SELECT ch.creature_id, 0
    FROM characters ch
        JOIN creatures uc ON uc.user_id = userId AND uc.id = ch.creature_id AND ch.race_spellcasting_ability_id = attributeId;

    INSERT INTO temp_creatures
    SELECT ch.creature_id, 0
    FROM characters ch
        JOIN creatures_shared uc ON uc.user_id = userId AND uc.creature_id = ch.creature_id AND ch.race_spellcasting_ability_id = attributeId;

    INSERT INTO temp_characteristics
    SELECT c.id, 0
    FROM characteristics c
        JOIN characteristics uc ON uc.user_id = userId AND uc.id = c.id AND c.spellcasting_ability_id = attributeId;

    INSERT INTO temp_characteristics
    SELECT id, 0
    FROM characteristics c
        JOIN characteristics_shared uc ON uc.user_id = userId AND uc.characteristic_id = c.id AND c.spellcasting_ability_id = attributeId;

    INSERT INTO temp_characteristics
    SELECT cl.characteristic_id, 0
    FROM classes cl
        JOIN characteristics c ON c.user_id = userId AND c.id = cl.characteristic_id AND cl.hp_at_first_ability_modifier_id = attributeId;

    INSERT INTO temp_characteristics
    SELECT cl.characteristic_id, 0
    FROM classes cl
        JOIN characteristics_shared c ON c.user_id = userId AND c.characteristic_id = cl.characteristic_id AND cl.hp_at_first_ability_modifier_id = attributeId;

    INSERT INTO temp_characteristics
    SELECT cl.characteristic_id, 0
    FROM classes cl
        JOIN characteristics c ON c.user_id = userId AND c.id = cl.characteristic_id AND cl.hp_gain_ability_modifier_id = attributeId;

    INSERT INTO temp_characteristics
    SELECT cl.characteristic_id, 0
    FROM classes cl
        JOIN characteristics_shared c ON c.user_id = userId AND c.characteristic_id = cl.characteristic_id AND cl.hp_gain_ability_modifier_id = attributeId;

    INSERT INTO temp_characteristics
    SELECT cl.characteristic_id, 0
    FROM classes cl
        JOIN characteristics c ON c.user_id = userId AND c.id = cl.characteristic_id AND cl.prepare_ability_modifier_id = attributeId;

    INSERT INTO temp_characteristics
    SELECT cl.characteristic_id, 0
    FROM classes cl
        JOIN characteristics_shared c ON c.user_id = userId AND c.characteristic_id = cl.characteristic_id AND cl.prepare_ability_modifier_id = attributeId;

    INSERT INTO temp_creatures
    SELECT cas.creature_id, 1
    FROM creature_ability_scores cas
        JOIN creatures uc ON uc.user_id = userId AND cas.creature_id = uc.id AND cas.ability_id = attributeId;

    INSERT INTO temp_creatures
    SELECT cas.creature_id, 1
    FROM creature_ability_scores cas
        JOIN creatures_shared uc ON uc.user_id = userId AND cas.creature_id = uc.creature_id AND cas.ability_id = attributeId;

    INSERT INTO temp_monsters
    SELECT cas.monster_id, 1
    FROM monster_ability_scores cas
        JOIN monsters uc ON uc.user_id = userId AND cas.monster_id = uc.id AND cas.ability_id = attributeId;

    INSERT INTO temp_monsters
    SELECT cas.monster_id, 1
    FROM monster_ability_scores cas
        JOIN monsters_shared uc ON uc.user_id = userId AND cas.monster_id = uc.monster_id AND cas.ability_id = attributeId;

    INSERT INTO temp_monsters
    SELECT id, 0
    FROM monsters
    WHERE user_id = userId AND (spellcasting_ability_id = attributeId OR innate_spellcasting_ability_id = attributeId OR hit_dice_ability_modifier_id = attributeId);

    INSERT INTO temp_monsters
    SELECT m.id, 0
    FROM monsters m
        JOIN monsters_shared uc ON uc.user_id = userId AND m.id = uc.monster_id AND (spellcasting_ability_id = attributeId OR innate_spellcasting_ability_id = attributeId OR hit_dice_ability_modifier_id = attributeId);

    INSERT INTO temp_monsters
    SELECT mis.monster_id, 0
    FROM monster_innate_spells mis
        JOIN monsters uc ON uc.user_id = userId AND mis.monster_id = uc.id AND mis.ability_modifier_id = attributeId;

    INSERT INTO temp_monsters
    SELECT mis.monster_id, 0
    FROM monster_innate_spells mis
        JOIN monsters_shared uc ON uc.user_id = userId AND mis.monster_id = uc.monster_id AND mis.ability_modifier_id = attributeId;

    INSERT INTO temp_creatures
    SELECT c.id, 0
    FROM creatures c
        JOIN creatures uc ON uc.user_id = userId AND uc.id = c.id AND c.spellcasting_ability_id = attributeId;

    INSERT INTO temp_creatures
    SELECT id, 0
    FROM creatures c
        JOIN creatures_shared uc ON uc.user_id = userId AND uc.creature_id = c.id AND c.spellcasting_ability_id = attributeId;

    INSERT INTO temp_powers
    SELECT f.power_id, 0
    FROM features f
        JOIN powers up ON up.user_id = userId AND up.id = f.power_id AND f.save_ability_modifier_id = attributeId;

    INSERT INTO temp_powers
    SELECT f.power_id, 0
    FROM features f
        JOIN powers_shared up ON up.user_id = userId AND up.power_id = f.power_id AND f.save_ability_modifier_id = attributeId;

    INSERT INTO temp_items
    SELECT d.item_id, 0
    FROM item_damages d
        JOIN items ui ON ui.user_id = userId AND  ui.id = d.item_id AND d.ability_modifier_id = attributeId;

    INSERT INTO temp_items
    SELECT d.item_id, 0
    FROM item_damages d
        JOIN items_shared ui ON ui.user_id = userId AND  ui.item_id = d.item_id AND d.ability_modifier_id = attributeId;

    INSERT INTO temp_creatures
    SELECT mp.monster_id, 0
    FROM monster_action_damages d
        JOIN monster_actions ma ON d.monster_action_id = ma.monster_power_id AND d.ability_modifier_id = attributeId
        JOIN monster_powers mp ON mp.id = ma.monster_power_id
        JOIN creatures uc ON uc.user_id = userId AND uc.id = mp.monster_id;

    INSERT INTO temp_creatures
    SELECT mp.monster_id, 0
    FROM monster_action_damages d
        JOIN monster_actions ma ON d.monster_action_id = ma.monster_power_id AND d.ability_modifier_id = attributeId
        JOIN monster_powers mp ON mp.id = ma.monster_power_id
        JOIN creatures_shared uc ON uc.user_id = userId AND uc.creature_id = mp.monster_id;

    INSERT INTO temp_creatures
    SELECT mp.monster_id, 0
    FROM monster_actions ma
        JOIN monster_powers mp ON mp.id = ma.monster_power_id AND ma.attack_ability_modifier_id = attributeId
        JOIN creatures uc ON uc.user_id = userId AND uc.id = mp.monster_id;

    INSERT INTO temp_creatures
    SELECT mp.monster_id, 0
    FROM monster_actions ma
        JOIN monster_powers mp ON mp.id = ma.monster_power_id AND ma.attack_ability_modifier_id = attributeId
        JOIN creatures_shared uc ON uc.user_id = userId AND uc.creature_id = mp.monster_id;

    INSERT INTO temp_creatures
    SELECT mp.monster_id, 0
    FROM monster_actions ma
        JOIN monster_powers mp ON mp.id = ma.monster_power_id AND ma.save_ability_modifier_id = attributeId
        JOIN creatures uc ON uc.user_id = userId AND uc.id = mp.monster_id;

    INSERT INTO temp_creatures
    SELECT mp.monster_id, 0
    FROM monster_actions ma
        JOIN monster_powers mp ON mp.id = ma.monster_power_id AND ma.save_ability_modifier_id = attributeId
        JOIN creatures_shared uc ON uc.user_id = userId AND uc.creature_id = mp.monster_id;

    INSERT INTO temp_creatures
    SELECT mp.monster_id, 0
    FROM monster_actions ma
        JOIN monster_powers mp ON mp.id = ma.monster_power_id AND ma.save_type_id = attributeId
        JOIN creatures uc ON uc.user_id = userId AND uc.id = mp.monster_id;

    INSERT INTO temp_creatures
    SELECT mp.monster_id, 0
    FROM monster_actions ma
        JOIN monster_powers mp ON mp.id = ma.monster_power_id AND ma.save_type_id = attributeId
        JOIN creatures_shared uc ON uc.user_id = userId AND uc.creature_id = mp.monster_id;

    INSERT INTO temp_powers
    SELECT d.power_id, 0
    FROM power_damages d
        JOIN powers up ON up.user_id = userId AND up.id = d.power_id AND d.ability_modifier_id = attributeId;

    INSERT INTO temp_powers
    SELECT d.power_id, 0
    FROM power_damages d
        JOIN powers_shared up ON up.user_id = userId AND up.power_id = d.power_id AND d.ability_modifier_id = attributeId;

    INSERT INTO temp_powers
    SELECT l.power_id, 0
    FROM power_limited_uses l
        JOIN powers up ON up.user_id = userId AND up.id = l.power_id AND l.ability_modifier_id = attributeId;

    INSERT INTO temp_powers
    SELECT l.power_id, 0
    FROM power_limited_uses l
        JOIN powers_shared up ON up.user_id = userId AND up.power_id = l.power_id AND l.ability_modifier_id = attributeId;

    INSERT INTO temp_powers
    SELECT p.id, 1
    FROM powers p
        JOIN powers up ON up.user_id = userId AND up.id = p.id AND p.save_type_id = attributeId;

    INSERT INTO temp_powers
    SELECT id, 1
    FROM powers p
        JOIN powers_shared up ON up.user_id = userId AND up.power_id = p.id AND p.save_type_id = attributeId;

    INSERT INTO temp_attributes
    SELECT s.attribute_id, 0
    FROM skills s
        JOIN attributes a ON a.user_id = userId AND a.id = s.attribute_id AND s.ability_id = attributeId;

    INSERT INTO temp_attributes
    SELECT s.attribute_id, 0
    FROM skills s
        JOIN attributes_shared a ON a.user_id = userId AND a.attribute_id = s.attribute_id AND s.ability_id = attributeId;

    # Get Values
    SELECT * FROM (
        SELECT 1 AS type_id, c.creature_type_id AS sub_type_id, c.id, c.name, t.required
        FROM (SELECT id, MAX(required) AS required FROM temp_creatures GROUP BY id) AS t
            JOIN creatures c ON t.id = c.id

        UNION

        SELECT 2 AS type_id, c.characteristic_type_id AS sub_type_id, c.id, c.name, t.required
        FROM (SELECT id, MAX(required) AS required FROM temp_characteristics GROUP BY id) AS t
            JOIN characteristics c ON t.id = c.id

        UNION

        SELECT 3 AS type_id, p.power_type_id AS sub_type_id, p.id, p.name, t.required
        FROM (SELECT id, MAX(required) AS required FROM temp_powers GROUP BY id) AS t
            JOIN powers p ON t.id = p.id

        UNION

        SELECT 4 AS type_id, i.item_type_id AS sub_type_id, i.id, i.name, t.required
        FROM (SELECT id, MAX(required) AS required FROM temp_items GROUP BY id) AS t
            JOIN items i ON t.id = i.id

        UNION

        SELECT 5 AS type_id, null AS sub_type_id, m.id, m.name, t.required
        FROM (SELECT id, MAX(required) AS required FROM temp_monsters GROUP BY id) AS t
                 JOIN monsters m ON t.id = m.id
    ) AS a
    ORDER BY type_id, sub_type_id, name;

    DROP TEMPORARY TABLE IF EXISTS temp_attributes;
    DROP TEMPORARY TABLE IF EXISTS temp_characteristics;
    DROP TEMPORARY TABLE IF EXISTS temp_powers;
    DROP TEMPORARY TABLE IF EXISTS temp_items;
    DROP TEMPORARY TABLE IF EXISTS temp_creatures;
    DROP TEMPORARY TABLE IF EXISTS temp_monsters;
END;;

DELIMITER ;

# CALL Attributes_InUse_Ability(1, 1);

