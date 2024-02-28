DROP PROCEDURE IF EXISTS Powers_Update_Spell;

DELIMITER ;;
CREATE PROCEDURE Powers_Update_Spell(
    IN powerId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED,

    IN powerName VARCHAR(50),
    IN attackType TINYINT UNSIGNED,
    IN temporaryHp BIT,
    IN attackMod TINYINT UNSIGNED,
    IN saveTypeId INT UNSIGNED,
    IN halfOnSave BIT,
    IN extraDamage BIT,
    IN numLevelsAboveBase TINYINT UNSIGNED,
    IN isAdvancement BIT,
    IN extraModifiers BIT,
    IN modifiersNumLevelsAboveBase TINYINT UNSIGNED,
    IN modifierAdvancement BIT,
    IN rangeType TINYINT UNSIGNED,
    IN rangeValue SMALLINT UNSIGNED,
    IN rangeUnit TINYINT UNSIGNED,
    IN areaOfEffectId INT UNSIGNED,
    IN radiusValue SMALLINT UNSIGNED,
    IN widthValue SMALLINT UNSIGNED,
    IN heightValue SMALLINT UNSIGNED,
    IN lengthValue SMALLINT UNSIGNED,

    IN levelValue TINYINT UNSIGNED,
    IN spellSchoolId INT UNSIGNED,
    IN isRitual BIT,
    IN castingTime TINYINT UNSIGNED,
    IN castingTimeUnit TINYINT UNSIGNED,
    IN isVerbal BIT,
    IN isSomatic BIT,
    IN isMaterial BIT,
    IN componentsValue VARCHAR(500),
    IN isInstantaneous BIT,
    IN isConcentration BIT,
    IN durationValue VARCHAR(45),
    IN spellDescription VARCHAR(4000),
    IN higherLevels VARCHAR(1000)
)
BEGIN
    DECLARE valid BIT;

#     DECLARE EXIT HANDLER FOR SQLEXCEPTION
#     BEGIN
#         ROLLBACK;
#         SELECT 0 AS valid_request;
#     END;

#     START TRANSACTION;

    SET valid = (SELECT user_id FROM powers WHERE id = powerId) = userId;

    IF valid THEN
        UPDATE powers
        SET name = powerName, attack_type = attackType, temporary_hp = temporaryHp, attack_mod = attackMod, save_type_id = saveTypeId,
            half_on_save = halfOnSave, extra_damage = extraDamage, num_levels_above_base = numLevelsAboveBase, advancement = isAdvancement,
            extra_modifiers = extraModifiers, modifiers_num_levels_above_base = modifiersNumLevelsAboveBase,
            modifier_advancement = modifierAdvancement, range_type = rangeType, `range` = rangeValue, range_unit = rangeUnit,
            area_of_effect_id = areaOfEffectId, radius = radiusValue, width = widthValue, height = heightValue, length = lengthValue,
            version = version + 1
        WHERE user_id = userId AND id = powerId;

        UPDATE spells
        SET level = levelValue, spell_school_id = spellSchoolId, ritual = isRitual, casting_time = castingTime,
            casting_time_unit = castingTimeUnit, verbal = isVerbal, somatic = isSomatic, material = isMaterial,
            components = componentsValue, instantaneous = isInstantaneous, concentration = isConcentration,
            duration = durationValue, description = spellDescription, higher_levels = higherLevels
        WHERE power_id = powerId;
    END IF;

#     COMMIT;

    SELECT valid AS valid_request;
END;;

DELIMITER ;

# CALL Powers_Update_Spell(265, 1, 'test-chanaaaged', 'test-changed-desc', 'ab');
