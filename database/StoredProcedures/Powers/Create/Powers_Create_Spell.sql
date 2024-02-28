DROP PROCEDURE IF EXISTS Powers_Create_Spell;

DELIMITER ;;
CREATE PROCEDURE Powers_Create_Spell(
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
    IN higherLevels VARCHAR(1000),

    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE powerId INT UNSIGNED;

#     DECLARE EXIT HANDLER FOR SQLEXCEPTION
#     BEGIN
#         ROLLBACK;
#         SELECT -1 AS power_id;
#     END;

#     START TRANSACTION;

    INSERT INTO powers (name, power_type_id, attack_type, temporary_hp, attack_mod, save_type_id, half_on_save,
                        extra_damage, num_levels_above_base, advancement, extra_modifiers, modifiers_num_levels_above_base,
                        modifier_advancement, range_type, `range`, range_unit, area_of_effect_id, radius, width, height,
                        length, recharge_min, recharge_max, recharge_on_short_rest, recharge_on_long_rest, user_id)
    VALUES (powerName, 1, attackType, temporaryHp, attackMod, saveTypeId, halfOnSave, extraDamage, numLevelsAboveBase,
            isAdvancement, extraModifiers, modifiersNumLevelsAboveBase, modifierAdvancement, rangeType, rangeValue,
            rangeUnit, areaOfEffectId, radiusValue, widthValue, heightValue, lengthValue, 0, 0,
            0, 0, userId);

    SET powerId = (SELECT LAST_INSERT_ID());

    INSERT INTO spells (power_id, level, spell_school_id, ritual, casting_time, casting_time_unit, verbal, somatic,
                        material, components, instantaneous, concentration, duration, description, higher_levels)
    VALUES (powerId, levelValue, spellSchoolId, isRitual, castingTime, castingTimeUnit, isVerbal, isSomatic, isMaterial,
            componentsValue, isInstantaneous, isConcentration, durationValue, spellDescription, higherLevels);

#     COMMIT;

    SELECT powerId AS power_id;
END;;

DELIMITER ;

# CALL Powers_Create_Spell('test', 'test_description', 1, 'tst', 1);
