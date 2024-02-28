DROP PROCEDURE IF EXISTS Creatures_Get_Companion;

DELIMITER ;;
CREATE PROCEDURE Creatures_Get_Companion(
    IN creatureId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE companionId INT UNSIGNED;
    DECLARE companionUserId MEDIUMINT UNSIGNED;

    SET companionId = (SELECT id FROM creatures WHERE user_id = userID AND id = creatureId UNION SELECT creature_id FROM creatures_shared WHERE user_id = userId AND creature_id = creatureId);
    IF companionId IS NULL THEN
        SET companionId = (SELECT creature_id FROM creatures_public WHERE creature_id = creatureId);
    END IF;
    IF companionId IS NULL THEN
        SET companionId = (SELECT creature_id FROM creatures_private WHERE user_id = userId AND creature_id = creatureId);
    END IF;
    IF companionId IS NULL THEN
        SET companionId = (SELECT c.companion_id
                           FROM character_companions c
                                    JOIN campaign_characters cc ON cc.creature_id = c.character_id AND c.companion_id = creatureId
                                    JOIN campaigns c2 ON c2.id = cc.campaign_id AND c2.user_id = userId
                           LIMIT 1);
    END IF;

    SET companionUserId = (SELECT user_id FROM creatures WHERE id = companionId);

    SELECT c.id, c.name, ch.companion_type_id, ch.max_hp, ch.roll_over_damage, ch.ac_include_characters_prof,
           ch.ac_misc, ch.saving_throws_include_characters_prof, ch.saving_throws_misc,
           ch.skill_checks_include_characters_prof, ch.skill_checks_misc, ch.attack_include_characters_prof,
           ch.attack_misc, ch.damage_include_characters_prof, ch.damage_misc, ch.include_character_saves,
           ch.include_character_skills
    FROM creatures c
        JOIN companions ch ON ch.creature_id = c.id AND c.id = companionId;

    # Companion Score Modifiers
    SELECT ability_id, use_characters_score, include_characters_prof, misc
    FROM companion_score_modifiers
    WHERE companion_id = companionId;

    # Creature Health
    SELECT current_hp, temp_hp, max_hp_mod, num_death_saving_throw_successes, num_death_saving_throw_failures, death_save_mod, death_save_advantage, death_save_disadvantage, resurrection_penalty, exhaustion_level, creature_state
    FROM creature_health
    WHERE creature_id = companionId;

    # Monster
    SELECT m.id, m.name, m.alignment_id, m.ac, m.hit_dice_num_dice, m.hit_dice_size_id, m.hit_dice_misc_modifier, m.spellcasting_ability_id, m.challenge_rating_id, m.experience,
           m.hit_dice_ability_modifier_id, hitDice.name AS hit_dice_ability_modifier_name, hitDice.description AS hit_dice_ability_modifier_description, hitDice.sid AS hit_dice_ability_modifier_sid, hitDice.user_id = userId AS hit_dice_ability_modifier_is_author, hitDice.version AS hit_dice_ability_modifier_version, hitDice2.abbr AS hit_dice_ability_modifier_abbr,
           m.spellcaster_level_id, level.name AS spellcaster_level_name, level.sid AS spellcaster_level_sid, level.user_id = userId AS spellcaster_level_is_author,
           m.innate_spellcaster_level_id, level2.name AS innate_spellcaster_level_name, level2.sid AS innate_spellcaster_level_sid, level2.user_id = userId AS innate_spellcaster_level_is_author,
           p.attribute_id AS perception_prof, p2.attribute_id AS stealth_prof, m.legendary_points
    FROM monsters m
        JOIN companions c ON c.monster_id = m.id AND c.creature_id = companionId
        LEFT JOIN attributes hitDice ON hitDice.id = m.hit_dice_ability_modifier_id
        LEFT JOIN abilities hitDice2 ON hitDice2.attribute_id = hitDice.id
        LEFT JOIN attributes level ON level.id = m.spellcaster_level_id
        LEFT JOIN attributes level2 ON level2.id = m.innate_spellcaster_level_id
        LEFT JOIN monster_attribute_profs p ON p.monster_id = m.id AND p.attribute_id = 113 -- perception
        LEFT JOIN monster_attribute_profs p2 ON p2.monster_id = m.id AND p2.attribute_id = 118; -- stealth

    # Monster Ability Scores
    SELECT a.id, a.name, a.description, a.sid, a.user_id = userId AS is_author, a.version, ab.abbr, mas.value
    FROM monster_ability_scores mas
        JOIN companions c ON c.monster_id = mas.monster_id AND c.creature_id = companionId
        JOIN abilities ab ON ab.attribute_id = mas.ability_id
        JOIN attributes a ON a.id = ab.attribute_id;

    # Active Conditions
    CALL Creature_ActiveConditions(companionId, companionUserId);
END;;

DELIMITER ;

