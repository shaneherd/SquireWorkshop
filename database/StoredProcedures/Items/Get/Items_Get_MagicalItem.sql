DROP PROCEDURE IF EXISTS Items_Get_MagicalItem;

DELIMITER ;;
CREATE PROCEDURE Items_Get_MagicalItem(
    IN itemId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE magicalItemId INT UNSIGNED;

    SET magicalItemId = (SELECT id FROM items WHERE user_id = userID AND id = itemId UNION SELECT item_id FROM items_shared WHERE user_id = userId AND item_id = itemId);
    IF magicalItemId IS NULL THEN
        SET magicalItemId = (SELECT item_id FROM items_public WHERE item_id = itemId);
    END IF;
    IF magicalItemId IS NULL THEN
        SET magicalItemId = (SELECT item_id FROM items_private WHERE user_id = userId AND item_id = itemId);
    END IF;
    IF magicalItemId IS NULL THEN
        SET magicalItemId = (SELECT ci.item_id
                             FROM creature_items ci
                                      JOIN creatures c ON c.id = ci.creature_id AND ci.item_id = itemId
                                      JOIN campaign_characters cc ON cc.creature_id = c.id
                                      JOIN campaigns c2 ON c2.id = cc.campaign_id AND c2.user_id = userId
                             LIMIT 1);
    END IF;

    SELECT i.id, i.name, i.description, i.sid, i.expendable, i.equippable, i.slot, i.container, i.ignore_weight,
           i.cost, i.cost_unit AS cost_unit_id, cu.name AS cost_unit_name, cu.abbreviation AS cost_unit_abbreviation,
           cu.conversion_unit AS conversion_unit_id, cu.conversion_value, cu.weight AS cost_unit_weight, i.weight,
           i.user_id = userId AS is_author, i.version,
           mi.magical_item_type_id, mi.rarity_id, mi.requires_attunement, mi.magical_item_attunement_type_id, mi.curse_effect, mi.max_charges,
           mi.rechargeable, mi.recharge_num_dice, mi.recharge_dice_size_id, mi.recharge_misc_mod, mi.recharge_on_long_rest,
           mi.chance_of_destruction, mi.is_vehicle, mi.attack_mod, mi.ac_mod, mi.additional_spells, mi.additional_spells_remove_on_casting,
           mi.attack_type_id, mi.temporary_hp, mi.save_type_id, a.name AS ability_name, a.description AS ability_description, ab.abbr AS ability_abbr,
           a.sid AS ability_sid, a.user_id = userId AS ability_is_author, a.version AS ability_version, mi.half_on_save, mi.spell_attack_calculation_type_id,
           mi.spell_attack_modifier, mi.spell_save_dc
    FROM items i
        JOIN magical_items mi ON mi.item_id = i.id AND i.id = magicalItemId
        JOIN cost_units cu on i.cost_unit = cu.id
        LEFT JOIN attributes a ON a.id = mi.save_type_id
        LEFT JOIN abilities ab ON a.id = ab.attribute_id;

    -- spells
    SELECT p.id AS spell_id, p.name AS spell_name, p.sid AS spell_sid, p.user_id = userId AS spell_is_author,
           s.level AS spell_level, mis.stored_level, mis.charges, mis.allow_casting_at_higher_level,
           mis.charges_per_level_above_stored_level, mis.max_level, mis.remove_on_casting,
           mis.override_spell_attack_calculation, mis.spell_attack_modifier, mis.spell_save_dc,
           mis.caster_level_id, a.name AS level_name, a.description AS level_description, a.sid AS level_sid,
           a.user_id = userId AS level_is_author, a.version AS level_version, cl.min_exp, cl.prof_bonus
    FROM magical_item_spells mis
        JOIN powers p ON p.id = mis.spell_id AND mis.magical_item_id = magicalItemId
        JOIN spells s ON s.power_id = p.id
        LEFT JOIN attributes a ON a.id = mis.caster_level_id
        LEFT JOIN character_levels cl ON a.id = cl.attribute_id
    ORDER BY p.name;

    -- damages
    SELECT num_dice, dice_size, misc_mod, versatile,
           ability_modifier_id, a.name AS ability_name, a.description AS ability_description, a.sid AS ability_sid, ab.abbr,
           a.user_id = userId AS ability_is_author, a.version AS ability_version,
           damage_type_id, dt.name AS damage_type_name, dt.description AS damage_type_description, dt.sid AS damage_type_sid,
           dt.user_id = userId AS damage_type_is_author, dt.version AS damage_type_version
    FROM items i
             JOIN item_damages d ON d.item_id = i.id AND i.id = magicalItemId AND d.versatile = 0
             LEFT JOIN attributes a ON a.id = d.ability_modifier_id
             LEFT JOIN abilities ab ON ab.attribute_id = a.id
             LEFT JOIN attributes dt ON dt.id = d.damage_type_id;

    -- applicable items
    SELECT ai.applicability_type_id, i.id, i.name, i.sid, i.user_id = userId AS is_author, i.cost, i.cost_unit, i.item_type_id, ai.filters
    FROM magical_item_applicable_items ai
         LEFT JOIN items i ON i.id = ai.item_id
    WHERE magical_item_id = magicalItemId;

    -- applicable spells
    SELECT ai.magical_item_id, ai.applicability_type_id, ai.filters,
           p.id AS spell_id, p.name AS spell_name, p.sid AS spell_sid, p.user_id = userId AS spell_is_author, s.level AS spell_level
    FROM magical_item_applicable_spells ai
        LEFT JOIN powers p ON p.id = ai.spell_id
        LEFT JOIN spells s ON s.power_id = p.id
    WHERE magical_item_id = magicalItemId;

    -- attunement classes
    SELECT c.id, c.name, c.sid, c.user_id = userId AS is_author
    FROM magical_item_attunement_classes mic
        JOIN characteristics c ON c.id = mic.class_id AND mic.magical_item_id = magicalItemId;

    -- attunement races
    SELECT c.id, c.name, c.sid, c.user_id = userId AS is_author
    FROM magical_item_attunement_races mir
        JOIN characteristics c ON c.id = mir.race_id AND mir.magical_item_id = magicalItemId;

    -- attunement alignments
    SELECT a.id, a.name, a.sid, a.user_id = userId AS is_author
    FROM magical_item_attunement_alignments mia
        JOIN attributes a ON a.id = mia.alignment_id AND mia.magical_item_id = magicalItemId;

    -- tables
    SELECT id, name
    FROM magical_item_tables
    WHERE magical_item_id = magicalItemId;

    -- table cells
    SELECT id, `row_number`, column_number, value
    FROM magical_item_table_cells mitc
    JOIN magical_item_tables mit ON mitc.table_id = mit.id
    WHERE mit.magical_item_id = magicalItemId
    ORDER BY `row_number`, column_number;
END;;

DELIMITER ;

