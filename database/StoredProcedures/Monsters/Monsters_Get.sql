DROP PROCEDURE IF EXISTS Monsters_Get;

DELIMITER ;;
CREATE PROCEDURE Monsters_Get(
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

    SELECT m.id, m.name, m.alignment_id, a.name AS alignment_name, a.sid AS alignment_sid, a.user_id = userId AS alignment_is_author, m.sid,
           m.version, m.spellcasting_ability_id, m.monster_type_id, m.type_variation, m.size_id, m.challenge_rating_id, m.experience,
           m.hover, m.legendary_points, m.user_id = userId AS is_author,
           m.description, m.ac, m.hit_dice_num_dice, m.hit_dice_size_id, m.hit_dice_misc_modifier,
           m.hit_dice_ability_modifier_id, hitDice.name AS hit_dice_ability_modifier_name, hitDice.description AS hit_dice_ability_modifier_description, hitDice.sid AS hit_dice_ability_modifier_sid, hitDice.user_id = userId AS hit_dice_ability_modifier_is_author, hitDice.version AS hit_dice_ability_modifier_version, hitDice2.abbr AS hit_dice_ability_modifier_abbr,
           m.spellcaster, m.caster_type_id, casterType.name AS caster_type_name, casterType.sid AS caster_type_sid, casterType.user_id = userId AS caster_type_is_author,
           m.spellcaster_level_id, level.name AS spellcaster_level_name, level.sid AS spellcaster_level_sid, level.user_id = userId AS spellcaster_level_is_author,
           m.innate_spellcaster_level_id, level2.name AS innate_spellcaster_level_name, level2.sid AS innate_spellcaster_level_sid, level2.user_id = userId AS innate_spellcaster_level_is_author,
           m.spell_attack_modifier, m.spell_save_modifier, m.innate_spellcaster, m.innate_spellcasting_ability_id, m.innate_spell_attack_modifier, m.innate_spell_save_modifier
    FROM monsters m
        LEFT JOIN alignments al ON m.alignment_id = al.attribute_id
        LEFT JOIN attributes a ON al.attribute_id = a.id
        LEFT JOIN attributes hitDice ON hitDice.id = m.hit_dice_ability_modifier_id
        LEFT JOIN abilities hitDice2 ON hitDice2.attribute_id = hitDice.id
        LEFT JOIN attributes casterType ON casterType.id = m.caster_type_id
        LEFT JOIN attributes level ON level.id = m.spellcaster_level_id
        LEFT JOIN attributes level2 ON level2.id = m.innate_spellcaster_level_id
    WHERE m.id = monsterId;

    # Ability Scores
    SELECT a.id, a.name, a.description, a.sid, a.user_id = userId AS is_author, a.version, ab.abbr, mas.value
    FROM monster_ability_scores mas
        JOIN abilities ab ON ab.attribute_id = mas.ability_id
        JOIN attributes a ON a.id = ab.attribute_id
    WHERE mas.monster_id = monsterId;

    # Attribute Profs
    SELECT p.attribute_id, a.name, a.description, a.attribute_type_id, a.sid, a.user_id = userId AS is_author, a.version
    FROM monster_attribute_profs p
        JOIN attributes a ON p.attribute_id = a.id
    WHERE monster_id = monsterId;

    # Item Profs
    SELECT p.item_id, i.name, i.description, i.item_type_id, i.sid, i.user_id = userId AS is_author, i.version,
           a.armor_type_id, w.weapon_type_id
    FROM monster_item_profs p
        JOIN items i ON p.item_id = i.id
        LEFT JOIN armors a ON a.item_id = i.id
        LEFT JOIN weapons w ON w.item_id = i.id
    WHERE monster_id = monsterId;

    # Damage Modifiers
    SELECT damage_type_id, damage_modifier_type_id, `condition`, damageType.name AS damage_type_name,
           damageType.description AS damage_type_description, damageType.sid AS damage_type_sid,
           damageType.user_id = userId AS damage_type_is_author, damageType.version AS damage_type_version
    FROM monster_damage_modifiers
        JOIN attributes damageType ON damageType.id = damage_type_id
    WHERE monster_id = monsterId;

    # Condition Immunities
    SELECT a.id, a.name, a.sid, a.user_id = userId AS is_author
    FROM monster_condition_immunities mci
        JOIN attributes a ON mci.condition_id = a.id
    WHERE mci.monster_id = monsterId;

    # Senses
    SELECT sense_id, `range`
    FROM monster_senses
    WHERE monster_id = monsterId;

    # Speeds
    SELECT `speed_id`, `value`
    FROM monster_speeds
    WHERE monster_id = monsterId;

    # Spell Slots
    SELECT slot_1, slot_2, slot_3, slot_4, slot_5, slot_6, slot_7, slot_8, slot_9
    FROM monster_spell_slots
    WHERE monster_id = monsterId;

    # Spells
    SELECT p.id, p.name, p.sid, p.user_id = userId AS is_author, ms.user_id = userId AS config_is_author
    FROM monster_spells ms
        JOIN spells s ON ms.spell_id = s.power_id
        JOIN powers p ON s.power_id = p.id
        JOIN monsters m ON m.id = ms.monster_id
    WHERE ms.monster_id = monsterId AND (ms.user_id = monsterUserId OR ms.user_id = m.user_id);

    # Innate Spells
    SELECT p.id, p.name, p.sid, p.user_id = userId AS is_author, ms.user_id = userId AS config_is_author,
           ms.limited_use_type_id, ms.quantity, ms.ability_modifier_id, ms.dice_size_id, ms.slot
    FROM monster_innate_spells ms
        JOIN spells s ON ms.spell_id = s.power_id
        JOIN powers p ON s.power_id = p.id
        JOIN monsters m ON m.id = ms.monster_id
    WHERE ms.monster_id = monsterId AND (ms.user_id = monsterUserId OR ms.user_id = m.user_id OR ms.user_id = userId);

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

