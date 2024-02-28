DROP PROCEDURE IF EXISTS Characteristics_Update_Class;

DELIMITER ;;
CREATE PROCEDURE Characteristics_Update_Class(
    IN characteristicId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED,

    IN characteristicName VARCHAR(45),
    IN parentCharacteristicId INT UNSIGNED,
    IN numAbilities TINYINT UNSIGNED,
    IN numLanguages TINYINT UNSIGNED,
    IN numSavingThrows TINYINT UNSIGNED,
    IN numSkills TINYINT UNSIGNED,
    IN numTools TINYINT UNSIGNED,
    IN spellcastingAbilityId INT UNSIGNED,

    IN classDescription VARCHAR(2000),
    IN hpAtFirst TINYINT UNSIGNED,
    IN hpAtFirstAbilityModifierId INT UNSIGNED,
    IN hitDiceNumDice TINYINT UNSIGNED,
    IN hitDiceSizeId TINYINT UNSIGNED,
    IN hitDiceMiscModifier TINYINT UNSIGNED,
    IN hpGainNumDice TINYINT UNSIGNED,
    IN hpGainDiceSizeId TINYINT UNSIGNED,
    IN hpGainAbilityModifierId INT UNSIGNED,
    IN hpGainMiscModifier TINYINT UNSIGNED,
    IN spellcasterTypeId INT UNSIGNED,
    IN requiresSpellPreparation BIT,
    IN prepareAbilityModifierId INT UNSIGNED,
    IN prepareIncludeClassLevel BIT,
    IN prepareIncludeHalfClassLevel BIT,
    IN prepareMiscModifier TINYINT UNSIGNED,
    IN startingGoldNumDice TINYINT UNSIGNED,
    IN startingGoldDiceSize TINYINT UNSIGNED,
    IN startingGoldMiscModifier TINYINT UNSIGNED,
    IN numSecondarySkills TINYINT UNSIGNED,
    IN numSecondaryTools TINYINT UNSIGNED
)
BEGIN
    DECLARE valid BIT;

#     DECLARE EXIT HANDLER FOR SQLEXCEPTION
#     BEGIN
#         ROLLBACK;
#         SELECT 0 AS valid_request;
#     END;

#     START TRANSACTION;

    SET valid = (SELECT user_id FROM characteristics WHERE id = characteristicId) = userId;

    IF valid THEN
        UPDATE characteristics
        SET name = characteristicName, parent_characteristic_id = parentCharacteristicId, num_abilities = numAbilities,
            num_languages = numLanguages, num_saving_throws= numSavingThrows, num_skills = numSkills,
            num_tools = numTools, spellcasting_ability_id = spellcastingAbilityId, version = version + 1
        WHERE user_id = userId AND id = characteristicId;
        
        UPDATE classes
        SET description = classDescription, hp_at_first = hpAtFirst, hp_at_first_ability_modifier_id = hpAtFirstAbilityModifierId,
            hit_dice_num_dice = hitDiceNumDice, hit_dice_size_id = hitDiceSizeId, hit_dice_misc_modifier = hitDiceMiscModifier,
            hp_gain_num_dice = hpGainNumDice, hp_gain_dice_size_id = hpGainDiceSizeId, hp_gain_ability_modifier_id = hpGainAbilityModifierId,
            hp_gain_misc_modifier = hpGainMiscModifier, spellcaster_type_id = spellcasterTypeId, requires_spell_preparation = requiresSpellPreparation,
            prepare_ability_modifier_id = prepareAbilityModifierId, prepare_include_class_level = prepareIncludeClassLevel,
            prepare_include_half_class_level = prepareIncludeHalfClassLevel, prepare_misc_modifier = prepareMiscModifier,
            starting_gold_num_dice = startingGoldNumDice, starting_gold_dice_size = startingGoldDiceSize,
            starting_gold_misc_modifier = startingGoldMiscModifier, num_secondary_skills = numSecondarySkills,
            num_secondary_tools = numSecondaryTools
        WHERE characteristic_id = characteristicId;
    END IF;

#     COMMIT;

    SELECT valid AS valid_request;
END;;

DELIMITER ;

# CALL Characteristics_Update_Class(265, 1, 'test-chanaaaged', 'test-changed-desc', 'ab');
