DROP PROCEDURE IF EXISTS Powers_Update_Feature;

DELIMITER ;;
CREATE PROCEDURE Powers_Update_Feature(
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
    IN rechargeMin SMALLINT UNSIGNED,
    IN rechargeMax SMALLINT UNSIGNED,
    IN rechargeOnShortRest BIT,
    IN rechargeOnLongRest BIT,

    IN characterLevelId INT UNSIGNED,
    IN characteristicTypeId TINYINT UNSIGNED,
    IN characteristicId INT UNSIGNED,
    IN prerequisiteValue VARCHAR(45),
    IN featureDescription VARCHAR(4000),
    IN isPassive BIT,
    IN saveProficiencyModifier BIT,
    IN saveAbilityModifierId INT UNSIGNED,
    IN actionId TINYINT UNSIGNED
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
            recharge_min = rechargeMin, recharge_max = rechargeMax, recharge_on_short_rest = rechargeOnShortRest,
            recharge_on_long_rest = rechargeOnLongRest, version = version + 1
        WHERE user_id = userId AND id = powerId;

        UPDATE features
        SET character_level_id = characterLevelId, characteristic_type_id = characteristicTypeId, characteristic_id = characteristicId,
            prerequisite = prerequisiteValue, description = featureDescription,
            passive = isPassive, save_proficiency_modifier = saveProficiencyModifier, save_ability_modifier_id = saveAbilityModifierId,
            action_id = actionId
        WHERE power_id = powerId;
    END IF;

#     COMMIT;

    SELECT valid AS valid_request;
END;;

DELIMITER ;

# CALL Powers_Update_Feature(265, 1, 'test-chanaaaged', 'test-changed-desc', 'ab');
