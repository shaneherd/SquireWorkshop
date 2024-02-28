DROP PROCEDURE IF EXISTS BattleCreatures_GetMissing;

DELIMITER ;;
CREATE PROCEDURE BattleCreatures_GetMissing(
    IN encounterId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE validatedId INT UNSIGNED;
    SET validatedId = (SELECT id FROM encounters WHERE user_id = userId AND id = encounterId);

    CREATE TEMPORARY TABLE IF NOT EXISTS temp_encounter_creatures
    (
        id INT UNSIGNED NOT NULL
    );

    CREATE TEMPORARY TABLE IF NOT EXISTS temp_encounter_monster_groups
    (
        id INT UNSIGNED NOT NULL
    );

    INSERT INTO temp_encounter_creatures (id)
    SELECT id
    FROM encounter_creatures
    WHERE encounter_id = validatedId AND creature_id IS NULL;

    INSERT INTO temp_encounter_monster_groups
    SELECT DISTINCT(g.id)
    FROM temp_encounter_creatures t
        JOIN encounter_monsters m ON m.encounter_creature_id = t.id
        JOIN encounter_monster_groups g ON g.id = m.encounter_monster_group_id;

    # Encounter Characters
    SELECT ecr.id AS encounter_creature_id, ecr.initiative, ecr.round_added, ecr.`order`, ecr.surprised, ec.exp_earned,
           cc.creature_id, cc.id AS campaign_character_id, cc.campaign_character_type_id, c.name AS creature_name,
           ch.exp, p.misc_modifier AS proficiency_misc, ecr.removed
    FROM temp_encounter_creatures t
        JOIN encounter_characters ec ON ec.encounter_creature_id = t.id
        JOIN encounter_creatures ecr ON ecr.id = ec.encounter_creature_id
        JOIN campaign_characters cc ON ec.campaign_character_id = cc.id
        LEFT JOIN creatures c ON c.id = cc.creature_id
        LEFT JOIN characters ch ON ch.creature_id = c.id
        LEFT JOIN creature_attribute_profs p ON p.creature_id = c.id AND p.attribute_id = 220; -- proficiency

    # Encounter Monster Groups
    SELECT g.id, g.display_name, g.health_calculation_type_id, g.grouped_hp, g.grouped_initiative,
           m.id AS monster_id, m.name AS monster_name, m.alignment_id, m.ac, m.hit_dice_num_dice, m.hit_dice_size_id, m.hit_dice_misc_modifier, m.spellcasting_ability_id, m.challenge_rating_id, m.experience,
           m.hit_dice_ability_modifier_id, hitDice.name AS hit_dice_ability_modifier_name, hitDice.description AS hit_dice_ability_modifier_description, hitDice.sid AS hit_dice_ability_modifier_sid, hitDice.user_id = userId AS hit_dice_ability_modifier_is_author, hitDice.version AS hit_dice_ability_modifier_version, hitDice2.abbr AS hit_dice_ability_modifier_abbr,
           m.spellcaster_level_id, level.name AS spellcaster_level_name, level.sid AS spellcaster_level_sid, level.user_id = userId AS spellcaster_level_is_author,
           m.innate_spellcaster_level_id, level2.name AS innate_spellcaster_level_name, level2.sid AS innate_spellcaster_level_sid, level2.user_id = userId AS innate_spellcaster_level_is_author,
           p.attribute_id AS perception_prof, p2.attribute_id AS stealth_prof, m.legendary_points
    FROM temp_encounter_monster_groups t
        JOIN encounter_monster_groups g ON g.id = t.id
        JOIN monsters m ON m.id = g.monster_id
        LEFT JOIN attributes hitDice ON hitDice.id = m.hit_dice_ability_modifier_id
        LEFT JOIN abilities hitDice2 ON hitDice2.attribute_id = hitDice.id
        LEFT JOIN attributes level ON level.id = m.spellcaster_level_id
        LEFT JOIN attributes level2 ON level2.id = m.innate_spellcaster_level_id
        LEFT JOIN monster_attribute_profs p ON p.monster_id = m.id AND p.attribute_id = 113 -- perception
        LEFT JOIN monster_attribute_profs p2 ON p2.monster_id = m.id AND p2.attribute_id = 118; -- stealth

    # Ability Scores
    SELECT g.id AS encounter_monster_group_id, a.id, a.name, a.description, a.sid, a.user_id = userId AS is_author, a.version, ab.abbr, mas.value
    FROM temp_encounter_monster_groups t
        JOIN encounter_monster_groups g ON g.id = t.id
        JOIN monster_ability_scores mas ON mas.monster_id = g.monster_id
        JOIN abilities ab ON ab.attribute_id = mas.ability_id
        JOIN attributes a ON a.id = ab.attribute_id;

    # Encounter Monsters
    SELECT m.encounter_monster_group_id, c.id AS encounter_creature_id, c.initiative, c.round_added, c.`order`, c.surprised,
           m.monster_number, m.hp, c.removed
    FROM temp_encounter_creatures t
        JOIN encounter_creatures c ON c.id = t.id
        JOIN encounter_monsters m ON m.encounter_creature_id = c.id;

    DROP TEMPORARY TABLE IF EXISTS temp_encounter_creatures;
    DROP TEMPORARY TABLE IF EXISTS temp_encounter_monster_groups;

END;;

DELIMITER ;

