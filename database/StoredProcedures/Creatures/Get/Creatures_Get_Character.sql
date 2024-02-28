DROP PROCEDURE IF EXISTS Creatures_Get_Character;

DELIMITER ;;
CREATE PROCEDURE Creatures_Get_Character(
    IN creatureId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE characterId INT UNSIGNED;
    DECLARE characterUserId MEDIUMINT UNSIGNED;

    SET characterId = (SELECT id FROM creatures WHERE user_id = userID AND id = creatureId UNION SELECT creature_id FROM creatures_shared WHERE user_id = userId AND creature_id = creatureId);
    IF characterId IS NULL THEN
        SET characterId = (SELECT creature_id FROM creatures_public WHERE creature_id = creatureId);
    END IF;
    IF characterId IS NULL THEN
        SET characterId = (SELECT creature_id FROM creatures_private WHERE user_id = userId AND creature_id = creatureId);
    END IF;

    SET characterUserId = (SELECT user_id FROM creatures WHERE id = characterId);

    SELECT c.id, c.user_id AS character_user_id, c.name, c.alignment_id, alignment.name AS alignment_name, alignment.sid AS alignment_sid,
           alignment.user_id = characterUserId AS alignment_is_author, c.spellcasting_ability_id,
           ch.race_id, ch.race_spellcasting_ability_id, ch.exp, ch.background_id, ch.background_spellcasting_ability_id,
           ch.custom_background_name, ch.custom_background_variation, ch.custom_background_personality,
           ch.custom_background_ideal, ch.custom_background_bond, ch.custom_background_flaw, ch.bio,
           ch.height, ch.eyes, ch.hair, ch.skin, ch.gender_id, ch.age, ch.weight, ch.deity_id,
           deity.name AS deity_name, deity.sid AS deity_sid, deity.user_id = characterUserId AS deity_is_author, ch.inspiration,
           ch.hp_gain_modifier, ch.health_calculation_type_id, c3.token AS campaign_token, ch.image_file_location
    FROM creatures c
        JOIN characters ch ON ch.creature_id = c.id AND c.id = characterId
        LEFT JOIN alignments al ON c.alignment_id = al.attribute_id
        LEFT JOIN attributes alignment ON al.attribute_id = alignment.id
        LEFT JOIN deities d ON ch.deity_id = d.attribute_id
        LEFT JOIN attributes deity ON d.attribute_id = deity.id
        LEFT JOIN campaign_characters cc2 on ch.creature_id = cc2.creature_id
        LEFT JOIN campaigns c3 on cc2.campaign_id = c3.id;

    # todo - if not null

    CALL Creatures_Get_StoredFilters(creatureId);
    CALL Creatures_Get_StoredSorts(creatureId);
    CALL Character_Get_Race(creatureId, characterUserId);
    CALL Character_Get_Classes(creatureId, characterUserId);
    CALL Character_Get_Background(creatureId, characterUserId);

    # Ability Scores
    SELECT a.id, a.name, a.description, a.sid, a.user_id = characterUserId AS is_author, a.version, ab.abbr, cas.value, cas.misc_modifier, cas.asi_modifier
    FROM creature_ability_scores cas
        JOIN abilities ab ON ab.attribute_id = cas.ability_id
        JOIN attributes a ON a.id = ab.attribute_id
    WHERE cas.creature_id = characterId;

    # AC Abilities
    SELECT a.id, a.name, a.description, a.sid, a.user_id = characterUserId AS is_author
    FROM creature_ac_abilities cas
        JOIN attributes a ON a.id = cas.ability_id
    WHERE cas.creature_id = characterId;

    # Wealth
    SELECT cost_unit_id, cu.name AS cost_unit_name, abbreviation AS cost_unit_abbreviation, conversion_unit AS conversion_unit_id, conversion_value, cu.weight AS cost_unit_weight, quantity, display, display_order
    FROM creature_wealth cw
        JOIN cost_units cu ON cw.cost_unit_id = cu.id
    WHERE creature_id = characterId
    ORDER BY display_order;

    # Creature Health
    SELECT current_hp, temp_hp, max_hp_mod, num_death_saving_throw_successes, num_death_saving_throw_failures, death_save_mod, death_save_advantage, death_save_disadvantage, resurrection_penalty, exhaustion_level, creature_state
    FROM creature_health
    WHERE creature_id = characterId;

    # Creature Hit Dice
    SELECT dice_size_id, remaining
    FROM creature_hit_dice
    WHERE creature_id = characterId;

    # Attribute Profs
    SELECT p.attribute_id, a.name, a.description, a.attribute_type_id, a.sid, a.user_id = characterUserId AS is_author, a.version,
           p.proficient, p.misc_modifier, p.advantage, p.disadvantage, p.double_prof, p.half_prof, p.round_up
    FROM creature_attribute_profs p
        JOIN attributes a ON p.attribute_id = a.id
    WHERE creature_id = characterId;

    # Item Profs
    SELECT p.item_id, i.name, i.description, i.item_type_id, i.sid, i.user_id = characterUserId AS is_author, i.version,
           p.misc_modifier, p.advantage, p.disadvantage, p.double_prof, p.half_prof, p.round_up,
           a.armor_type_id, w.weapon_type_id
    FROM creature_item_profs p
        JOIN items i ON p.item_id = i.id
        LEFT JOIN armors a ON a.item_id = i.id
        LEFT JOIN weapons w ON w.item_id = i.id
    WHERE creature_id = characterId;

    # Damage Modifiers
    SELECT damage_type_id, damage_modifier_type_id, `condition`, damageType.name AS damage_type_name,
           damageType.description AS damage_type_description, damageType.sid AS damage_type_sid,
           damageType.user_id = characterUserId AS damage_type_is_author, damageType.version AS damage_type_version
    FROM creature_damage_modifiers
        JOIN attributes damageType ON damageType.id = damage_type_id
    WHERE creature_id = characterId;

    # Condition Immunities
    SELECT a.id, a.name, a.sid, a.user_id = characterUserId AS is_author
    FROM creature_condition_immunities cci
        JOIN attributes a ON cci.condition_id = a.id
    WHERE cci.creature_id = characterId;

    # Senses
    SELECT sense_id, `range`
    FROM creature_senses
    WHERE creature_id = characterId;

    # Active Conditions
    CALL Creature_ActiveConditions(characterId, characterUserId);

    # Spell Tags
    SELECT id, power_type_id, title, color
    FROM creature_tags
    WHERE creature_id = characterId AND power_type_id = 1;

    # Feature Tags
    SELECT id, power_type_id, title, color
    FROM creature_tags
    WHERE creature_id = characterId AND power_type_id = 2;

    # Creature Spellcasting - Attack
    SELECT prof, double_prof, half_prof, round_up, misc_modifier, advantage, disadvantage, attack_type_id
    FROM creature_spellcasting
    WHERE creature_id = characterId AND attack_type_id = 1;

    # Creature Spellcasting - Save
    SELECT prof, double_prof, half_prof, round_up, misc_modifier, advantage, disadvantage, attack_type_id
    FROM creature_spellcasting
    WHERE creature_id = characterId AND attack_type_id = 2;

    # Spell Slots
    SELECT slot_level, max_modifier, remaining
    FROM creature_spell_slots
    WHERE creature_id = characterId;

    # Spell Configurations
    SELECT p.id, p.name, p.sid, p.user_id = characterUserId AS is_author,
           cs.level_gained, a.name AS level_name, a.sid AS level_sid, a.user_id = characterUserId AS level_is_author,
           cs.always_prepared,
           cs.counts_towards_prepared_limit, cs.notes, cs.user_id = characterUserId AS config_is_author
    FROM creature_spell_configurations cs
        JOIN spells s ON cs.spell_id = s.power_id
        JOIN powers p ON s.power_id = p.id
        LEFT JOIN attributes a ON cs.level_gained = a.id
    WHERE cs.creature_id = characterId;

    # Character Settings
    CALL Character_Settings_Get(characterId);

    # Ability Scores to Increase by One
    SELECT a.id, a.name, a.sid, a.user_id = characterUserId AS is_author
    FROM character_ability_scores_to_increase casi
        JOIN attributes a ON casi.ability_id = a.id
    WHERE casi.character_id = characterId;

    # Favorite Actions
    CALL CreatureActions_Get_Favorites(characterId);

    # Items
    CALL CreatureItems_Get(characterId, characterUserId);

    # Companions
    SELECT c2.id, c2.name, c2.sid, c2.user_id = characterUserId AS is_author, c.companion_type_id, c.max_hp,
        current_hp, temp_hp, max_hp_mod, num_death_saving_throw_successes, num_death_saving_throw_failures, death_save_mod, death_save_advantage, death_save_disadvantage, resurrection_penalty, exhaustion_level, creature_state
    FROM character_companions cc
        JOIN companions c ON c.creature_id = cc.companion_id
        JOIN creatures c2 ON c2.id = c.creature_id
        LEFT JOIN creature_health h ON c2.id = h.creature_id
    WHERE cc.character_id = characterId
    ORDER BY c2.name;
END;;

DELIMITER ;

