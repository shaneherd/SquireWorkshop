DROP PROCEDURE IF EXISTS CreatureItems_Get;

DELIMITER ;;
CREATE PROCEDURE CreatureItems_Get(
    IN creatureId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE creatureUserId MEDIUMINT UNSIGNED;
    DECLARE itemId INT UNSIGNED;
    DECLARE magicItemId INT UNSIGNED;
    DECLARE more_rows BOOLEAN DEFAULT TRUE;
    DECLARE curs CURSOR FOR SELECT DISTINCT item_id FROM creature_items WHERE creature_id = creatureId;
    DECLARE curs2 CURSOR FOR SELECT DISTINCT magic_item_type_id FROM creature_items WHERE creature_id = creatureId AND magic_item_type_id IS NOT NULL;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET more_rows = FALSE;

    SET creatureUserId = (SELECT user_id FROM creatures WHERE id = creatureId);

    SELECT
        ci.id,
        ci.item_id,
        i.name AS item_name,
        i.sid AS item_sid,
        i.item_type_id,
        i.container AS is_container,
        i.ignore_weight,
        i.weight,
        ci.quantity,
        ci.equipped_slot_id,
        es.name AS equipped_slot_name,
        es.equipment_slot_type_id,
        ci.container_id,
        ci.creature_item_state_id,
        ci.expanded,
        ci.poisoned,
        ci.silvered,
        ci.full,
        ci.attuned,
        ci.charges AS charges_remaining,
        mi.max_charges,
        ci.cursed,
        ci.magic_item_type_id,
        ci.notes
    FROM creature_items ci
    JOIN items i ON ci.item_id = i.id
    LEFT JOIN equipment_slots es ON ci.equipped_slot_id = es.id
    LEFT JOIN magical_items mi ON mi.item_id = i.id
    WHERE creature_id = creatureId
    ORDER BY i.name;

    SELECT COUNT(DISTINCT item_id) AS item_count FROM creature_items WHERE creature_id = creatureId;

    OPEN curs;

    WHILE more_rows DO
        FETCH curs INTO itemId;

        IF more_rows THEN
            CALL Items_Get(itemId, creatureUserId);
        END IF;
    END WHILE;

    CLOSE curs;

    SELECT COUNT(DISTINCT magic_item_type_id) AS magic_item_count FROM creature_items WHERE creature_id = creatureId AND magic_item_type_id IS NOT NULL;

    OPEN curs2;

    SET more_rows = 1;
    WHILE more_rows DO
        FETCH curs2 INTO magicItemId;

        IF more_rows THEN
            CALL Items_Get(magicItemId, creatureUserId);
        END IF;
    END WHILE;

    CLOSE curs2;

    # spells
    CREATE TEMPORARY TABLE IF NOT EXISTS temp_additional_spells
    (
        creature_item_id INT UNSIGNED NOT NULL,
        item_id INT UNSIGNED NOT NULL,
        spell_id INT UNSIGNED NOT NULL
    );

    CREATE TEMPORARY TABLE IF NOT EXISTS temp_magical_item_spells
    (
        creature_item_id INT UNSIGNED NOT NULL,
        item_id INT UNSIGNED NOT NULL,
        spell_id INT UNSIGNED NOT NULL
    );

    CREATE TEMPORARY TABLE IF NOT EXISTS temp_all_spells
    (
        spell_id INT UNSIGNED NOT NULL
    );

    INSERT INTO temp_additional_spells
    SELECT ci.id, ci.item_id, cis.spell_id
    FROM creature_items ci
    JOIN creature_item_spells cis ON cis.creature_item_id = ci.id AND ci.creature_id = creatureId;

    INSERT INTO temp_magical_item_spells
    SELECT ci.id, ci.item_id, mis.spell_id
    FROM creature_items ci
    JOIN magical_item_spells mis ON mis.magical_item_id = ci.item_id AND ci.creature_id = creatureId;

    INSERT INTO temp_all_spells
    SELECT DISTINCT spell_id FROM (
        SELECT spell_id FROM temp_additional_spells
        UNION
        SELECT spell_id FROM temp_magical_item_spells
    ) AS a;

    SELECT creature_item_id, additional, spell_id, stored_level, charges, allow_casting_at_higher_level, charges_per_level_above_stored_level,
           max_level, remove_on_casting, override_spell_attack_calculation, spell_attack_modifier, spell_save_dc,
           p.name AS spell_name, p.sid AS spell_sid, p.user_id = userId AS spell_is_author, s.level AS spell_level,
           caster_level_id, level_name, level_description, level_sid, level_is_author, level_version, min_exp, prof_bonus
    FROM
    (
        SELECT t.creature_item_id, 1 AS additional, cis.spell_id, cis.stored_level, cis.charges,
               cis.allow_casting_at_higher_level, cis.charges_per_level_above_stored_level, cis.max_level,
               cis.remove_on_casting, cis.override_spell_attack_calculation, cis.spell_attack_modifier, cis.spell_save_dc,
               cis.caster_level_id, a.name AS level_name, a.description AS level_description, a.sid AS level_sid,
               a.user_id = userId AS level_is_author, a.version AS level_version, cl.min_exp, cl.prof_bonus
        FROM creature_item_spells cis
        JOIN temp_additional_spells t ON cis.creature_item_id = t.creature_item_id AND cis.spell_id = t.spell_id
        LEFT JOIN attributes a ON a.id = cis.caster_level_id
        LEFT JOIN character_levels cl ON a.id = cl.attribute_id

        UNION

        SELECT t.creature_item_id, 0 AS additional, mis.spell_id, mis.stored_level, mis.charges,
               mis.allow_casting_at_higher_level, mis.charges_per_level_above_stored_level, mis.max_level,
               mis.remove_on_casting, mis.override_spell_attack_calculation, mis.spell_attack_modifier, mis.spell_save_dc,
               mis.caster_level_id, a.name AS level_name, a.description AS level_description, a.sid AS level_sid,
               a.user_id = userId AS level_is_author, a.version AS level_version, cl.min_exp, cl.prof_bonus
        FROM magical_item_spells mis
        JOIN temp_magical_item_spells t ON mis.magical_item_id = t.item_id AND mis.spell_id = t.spell_id
        LEFT JOIN attributes a ON a.id = mis.caster_level_id
        LEFT JOIN character_levels cl ON a.id = cl.attribute_id
    ) AS cis
    JOIN powers p ON p.id = cis.spell_id
    JOIN spells s ON s.power_id = p.id
    ORDER BY p.name;

    # spell tags
    SELECT p.power_id, t.id, t.power_type_id, t.title, t.color
    FROM creature_power_tags p
        JOIN creature_tags t ON p.creature_tag_id = t.id
    WHERE p.creature_id = creatureId and p.power_id IN (SELECT spell_id FROM temp_all_spells);

    DROP TEMPORARY TABLE IF EXISTS temp_additional_spells;
    DROP TEMPORARY TABLE IF EXISTS temp_magical_item_spells;
    DROP TEMPORARY TABLE IF EXISTS temp_all_spells;
END;;

DELIMITER ;

# CALL CreatureItems_Get(1, 1);

