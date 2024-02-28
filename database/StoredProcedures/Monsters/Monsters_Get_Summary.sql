DROP PROCEDURE IF EXISTS Monsters_Get_Summary;

DELIMITER ;;
CREATE PROCEDURE Monsters_Get_Summary(
    IN creatureId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE monsterId INT UNSIGNED;

    SET monsterId = (SELECT id FROM monsters WHERE user_id = userID AND id = creatureId UNION SELECT monster_id FROM monsters_shared WHERE user_id = userId AND monster_id = creatureId);
    IF monsterId IS NULL THEN
        SET monsterId = (SELECT monster_id FROM monsters_public WHERE monster_id = creatureId);
    END IF;
    IF monsterId IS NULL THEN
        SET monsterId = (SELECT monster_id FROM monsters_private WHERE user_id = userId AND monster_id = creatureId);
    END IF;

    SELECT m.id, m.name, m.alignment_id, m.ac, m.hit_dice_num_dice, m.hit_dice_size_id, m.hit_dice_misc_modifier, m.spellcasting_ability_id, m.challenge_rating_id, m.experience,
           m.hit_dice_ability_modifier_id, hitDice.name AS hit_dice_ability_modifier_name, hitDice.description AS hit_dice_ability_modifier_description, hitDice.sid AS hit_dice_ability_modifier_sid, hitDice.user_id = userId AS hit_dice_ability_modifier_is_author, hitDice.version AS hit_dice_ability_modifier_version, hitDice2.abbr AS hit_dice_ability_modifier_abbr,
           m.spellcaster_level_id, level.name AS spellcaster_level_name, level.sid AS spellcaster_level_sid, level.user_id = userId AS spellcaster_level_is_author,
           m.innate_spellcaster_level_id, level2.name AS innate_spellcaster_level_name, level2.sid AS innate_spellcaster_level_sid, level2.user_id = userId AS innate_spellcaster_level_is_author,
           p.attribute_id AS perception_prof, p2.attribute_id AS stealth_prof, m.legendary_points
    FROM monsters m
        LEFT JOIN attributes hitDice ON hitDice.id = m.hit_dice_ability_modifier_id
        LEFT JOIN abilities hitDice2 ON hitDice2.attribute_id = hitDice.id
        LEFT JOIN attributes level ON level.id = m.spellcaster_level_id
        LEFT JOIN attributes level2 ON level2.id = m.innate_spellcaster_level_id
        LEFT JOIN monster_attribute_profs p ON p.monster_id = m.id AND p.attribute_id = 113 -- perception
        LEFT JOIN monster_attribute_profs p2 ON p2.monster_id = m.id AND p2.attribute_id = 118 -- stealth
    WHERE m.id = monsterId;

    # Ability Scores
    SELECT a.id, a.name, a.description, a.sid, a.user_id = userId AS is_author, a.version, ab.abbr, mas.value
    FROM monster_ability_scores mas
        JOIN abilities ab ON ab.attribute_id = mas.ability_id
        JOIN attributes a ON a.id = ab.attribute_id
    WHERE mas.monster_id = monsterId;
END;;

DELIMITER ;

