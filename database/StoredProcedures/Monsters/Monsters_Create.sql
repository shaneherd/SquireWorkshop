DROP PROCEDURE IF EXISTS Monsters_Create;

DELIMITER ;;
CREATE PROCEDURE Monsters_Create(
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
    IN notes VARCHAR(2000),
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
    IN innateSpellSaveModifier TINYINT UNSIGNED,

    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    INSERT INTO monsters (name, monster_type_id, type_variation, size_id, challenge_rating_id, experience,
                          hit_dice_num_dice, hit_dice_size_id, hit_dice_ability_modifier_id, hit_dice_misc_modifier,
                          legendary_points, description, ac, hover, spellcaster, caster_type_id, spellcaster_level_id,
                          spell_attack_modifier, spell_save_modifier, spellcasting_ability_id, innate_spellcaster,
                          innate_spellcaster_level_id, innate_spell_attack_modifier, innate_spell_save_modifier,
                          innate_spellcasting_ability_id, alignment_id, user_id)
    VALUES (creatureName, monsterTypeId, typeVariation, sizeId, challengeRatingId, exp, hitDiceNumDice, hitDiceSizeId,
            hitDiceAbilityModifierId, hitDiceMiscModifier, legendaryPoints, notes, armorClass, isHover, isSpellcaster, casterTypeId,
            spellcasterLevelId, spellAttackModifier, spellSaveModifier, spellcastingAbilityId, isInnateSpellcaster,
            innateSpellcasterLevelId, innateSpellAttackModifier, innateSpellSaveModifier, innateSpellcastingAbilityId, alignmentId, userId);

    SELECT LAST_INSERT_ID() AS monster_id;
END;;

DELIMITER ;

# CALL Creatures_Create_Monster('test', 'test_description', 1, 'tst', 1);
