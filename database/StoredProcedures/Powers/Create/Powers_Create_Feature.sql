DROP PROCEDURE IF EXISTS Powers_Create_Feature;

DELIMITER ;;
CREATE PROCEDURE Powers_Create_Feature(
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
    IN rechargeMin SMALLINT UNSIGNED,
    IN rechargeMax SMALLINT UNSIGNED,
    IN rechargeOnShortRest BIT,
    IN rechargeOnLongRest BIT,

    IN characterLevelId MEDIUMINT UNSIGNED,
    IN characteristicTypeId TINYINT UNSIGNED,
    IN characteristicId MEDIUMINT UNSIGNED,
    IN prerequisiteValue VARCHAR(45),
    IN featureDescription VARCHAR(4000),
    IN isPassive BIT,
    IN saveProficiencyModifier BIT,
    IN saveAbilityModifierId MEDIUMINT UNSIGNED,
    IN actionId TINYINT UNSIGNED,

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
    VALUES (powerName, 2, attackType, temporaryHp, attackMod, saveTypeId, halfOnSave, extraDamage, numLevelsAboveBase,
            isAdvancement, extraModifiers, modifiersNumLevelsAboveBase, modifierAdvancement, rangeType, rangeValue,
            rangeUnit, areaOfEffectId, radiusValue, widthValue, heightValue, lengthValue, rechargeMin, rechargeMax,
            rechargeOnShortRest, rechargeOnLongRest, userId);

    SET powerId = (SELECT LAST_INSERT_ID());

    INSERT INTO features (power_id, character_level_id, characteristic_type_id, characteristic_id, prerequisite, description, passive, save_proficiency_modifier, save_ability_modifier_id, action_id)
    VALUES (powerId, characterLevelId, characteristicTypeId, characteristicId, prerequisiteValue, featureDescription, isPassive, saveProficiencyModifier, saveAbilityModifierId, actionId);

#     COMMIT;

    SELECT powerId AS power_id;
END;;

DELIMITER ;

# CALL Powers_Create_Feature('test', 'test_description', 1, 'tst', 1);
