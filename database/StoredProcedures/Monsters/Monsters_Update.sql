DROP PROCEDURE IF EXISTS Monsters_Update;

DELIMITER ;;
CREATE PROCEDURE Monsters_Update(
    IN monsterId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED,

    IN creatureName VARCHAR(150),
    IN spellcastingAbilityId INT UNSIGNED,
    IN alignmentId INT UNSIGNED,

    IN monsterTypeId TINYINT UNSIGNED,
    IN typeVariation VARCHAR(45),
    IN sizeId TINYINT UNSIGNED,
    IN challengeRatingId TINYINT UNSIGNED,
    IN exp MEDIUMINT UNSIGNED,
    IN isHover BIT,
    IN legendaryPoints TINYINT UNSIGNED,
    IN notes VARCHAR(255),
    IN armorClass SMALLINT UNSIGNED,
    IN hitDiceNumDice TINYINT UNSIGNED,
    IN hitDiceSizeId TINYINT UNSIGNED,
    IN hitDiceAbilityModifierId INT UNSIGNED,
    IN hitDiceMiscModifier TINYINT UNSIGNED,
    IN isSpellcaster BIT,
    IN casterTypeId INT UNSIGNED,
    IN spellcasterLevelId INT UNSIGNED,
    IN spellAttackModifier TINYINT UNSIGNED,
    IN spellSaveModifier TINYINT UNSIGNED,

    IN isInnateSpellcaster BIT,
    IN innateSpellcasterLevelId INT UNSIGNED,
    IN innateSpellcastingAbilityId INT UNSIGNED,
    IN innateSpellAttackModifier TINYINT UNSIGNED,
    IN innateSpellSaveModifier TINYINT UNSIGNED
)
BEGIN
    DECLARE valid BIT;

    SET valid = (SELECT user_id FROM monsters WHERE id = monsterId) = userId;

    IF valid THEN
        UPDATE monsters
        SET monster_type_id = monsterTypeId, type_variation = typeVariation, size_id = sizeId, challenge_rating_id = challengeRatingId,
            experience = exp, hover = isHover, legendary_points = legendaryPoints, description = notes, ac = armorClass,
            hit_dice_num_dice = hitDiceNumDice, hit_dice_size_id = hitDiceSizeId, hit_dice_ability_modifier_id = hitDiceAbilityModifierId,
            hit_dice_misc_modifier = hitDiceMiscModifier, caster_type_id = casterTypeId, spellcaster_level_id = spellcasterLevelId,
            spell_attack_modifier = spellAttackModifier, spell_save_modifier = spellSaveModifier, name = creatureName,
            spellcasting_ability_id = spellcastingAbilityId, innate_spellcaster = isInnateSpellcaster, innate_spellcaster_level_id = innateSpellcasterLevelId,
            innate_spell_attack_modifier = innateSpellAttackModifier, innate_spell_save_modifier = innateSpellSaveModifier,
            innate_spellcasting_ability_id = innateSpellcastingAbilityId, alignment_id = alignmentId, spellcaster = isSpellcaster
        WHERE user_id = userId AND id = monsterId;
    END IF;

    SELECT valid AS valid_request;
END;;

DELIMITER ;