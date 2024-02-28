DROP PROCEDURE IF EXISTS Powers_Get_Spell;

DELIMITER ;;
CREATE PROCEDURE Powers_Get_Spell(
    IN powerId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE spellId INT UNSIGNED;

    SET spellId = (SELECT id FROM powers WHERE user_id = userID AND id = powerId UNION SELECT power_id FROM powers_shared WHERE user_id = userId AND power_id = powerId);
    IF spellId IS NULL THEN
        SET spellId = (SELECT power_id FROM powers_public WHERE power_id = powerId);
    END IF;
    IF spellId IS NULL THEN
        SET spellId = (SELECT power_id FROM powers_private WHERE user_id = userId AND power_id = powerId);
    END IF;
    IF spellId IS NULL THEN
        Set spellId = (SELECT cp.power_id
                       FROM creature_powers cp
                                JOIN creatures c ON c.id = cp.creature_id AND cp.power_id = powerId
                                JOIN campaign_characters cc ON cc.creature_id = c.id
                                JOIN campaigns c2 ON c2.id = cc.campaign_id AND c2.user_id = userId
                       LIMIT 1);
    END IF;
    IF spellId IS NULL THEN
        Set spellId = (SELECT ms.spell_id
                       FROM monster_spells ms
                                JOIN companions c ON ms.monster_id = c.monster_id AND ms.spell_id = powerId
                                JOIN character_companions cc ON c.creature_id = cc.companion_id
                                JOIN campaign_characters cc2 ON cc.character_id = cc2.creature_id
                                JOIN campaigns c2 ON cc2.campaign_id = c2.id AND c2.user_id = userId
                       LIMIT 1);
    END IF;
    IF spellId IS NULL THEN
        Set spellId = (SELECT ms.spell_id
                       FROM monster_innate_spells ms
                                JOIN companions c ON ms.monster_id = c.monster_id AND ms.spell_id = powerId
                                JOIN character_companions cc ON c.creature_id = cc.companion_id
                                JOIN campaign_characters cc2 ON cc.character_id = cc2.creature_id
                                JOIN campaigns c2 ON cc2.campaign_id = c2.id AND c2.user_id = userId
                       LIMIT 1);
    END IF;

    SELECT p.id AS power_id, p.name, p.sid, p.user_id = userId AS is_author, p.version, p.attack_type, p.temporary_hp, p.attack_mod,
           p.save_type_id, saveType.name AS save_type_name, saveType.description AS save_type_description, saveType.sid AS save_type_sid, saveType.user_id = userId AS save_type_is_author, saveType.version AS save_type_version, saveType2.abbr AS save_type_abbr,
           p.half_on_save, p.extra_damage, p.num_levels_above_base, p.advancement, p.extra_modifiers, p.modifiers_num_levels_above_base,
           p.modifier_advancement, s.level, s.spell_school_id, ssa.name AS spell_school_name, ssa.description AS spell_school_description,
           ssa.sid AS spell_school_sid, ssa.user_id = userId AS spell_school_is_author, ssa.version AS spell_school_version,
           s.ritual, s.casting_time, s.casting_time_unit, p.range_type, p.range, p.range_unit, p.area_of_effect_id,
           p.radius, p.width, p.height, p.length, aoea.name AS area_of_effect_name, aoea.description AS area_of_effect_description, aoea.sid AS area_of_effect_sid,
           aoea.user_id = userId AS area_of_effect_is_author, aoea.version AS area_of_effect_version,
           aoe.radius AS area_of_effect_radius, aoe.width AS area_of_effect_width, aoe.height AS area_of_effect_height, aoe.length AS area_of_effect_length,
           s.verbal, s.somatic, s.material, s.components, s.instantaneous,
           s.concentration, s.duration, s.description, s.higher_levels
    FROM powers p
        JOIN spells s on p.id = s.power_id AND p.id = spellId
        JOIN spell_schools ss ON s.spell_school_id = ss.attribute_id
        JOIN attributes ssa ON ss.attribute_id = ssa.id
        LEFT JOIN area_of_effects aoe ON p.area_of_effect_id = aoe.attribute_id
        LEFT JOIN attributes aoea ON aoe.attribute_id = aoea.id
        LEFT JOIN attributes saveType ON saveType.id = p.save_type_id
        LEFT JOIN abilities saveType2 ON saveType2.attribute_id = saveType.id;

    # TODO - IF !NULL
    
    CALL Powers_Get_DamageConfigurations(spellId, 0, 0, userId);
    CALL Powers_Get_DamageConfigurations(spellId, 0, 1, userId);
    CALL Powers_Get_DamageConfigurations(spellId, 1, 0, userId);

    CALL Powers_Get_ModifierConfigurations(spellId, 0, 0, userId);
    CALL Powers_Get_ModifierConfigurations(spellId, 0, 1, userId);
    CALL Powers_Get_ModifierConfigurations(spellId, 1, 0, userId);

END;;

DELIMITER ;

