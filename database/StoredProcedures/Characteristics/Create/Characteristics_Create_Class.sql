DROP PROCEDURE IF EXISTS Characteristics_Create_Class;

DELIMITER ;;
CREATE PROCEDURE Characteristics_Create_Class(
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
    IN numSecondaryTools TINYINT UNSIGNED,

    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE characteristicId INT UNSIGNED;

#     DECLARE EXIT HANDLER FOR SQLEXCEPTION
#     BEGIN
#         ROLLBACK;
#         SELECT -1 AS characteristic_id;
#     END;

#     START TRANSACTION;

    INSERT INTO characteristics (name, characteristic_type_id, parent_characteristic_id, num_abilities, num_languages, num_saving_throws, num_skills, num_tools, spellcasting_ability_id, user_id)
    VALUES (characteristicName, 1, parentCharacteristicId, numAbilities, numLanguages, numSavingThrows, numSkills, numTools, spellcastingAbilityId, userId);

    SET characteristicId = (SELECT LAST_INSERT_ID());
    
    INSERT INTO classes (characteristic_id, description, hp_at_first, hp_at_first_ability_modifier_id,  hit_dice_num_dice,
                         hit_dice_size_id, hit_dice_misc_modifier, hp_gain_num_dice, hp_gain_dice_size_id, hp_gain_ability_modifier_id,
                         hp_gain_misc_modifier, spellcaster_type_id, requires_spell_preparation, prepare_ability_modifier_id,
                         prepare_include_class_level, prepare_include_half_class_level, prepare_misc_modifier,
                         starting_gold_num_dice, starting_gold_dice_size, starting_gold_misc_modifier,
                         num_secondary_skills, num_secondary_tools)
    VALUES (characteristicId, classDescription, hpAtFirst, hpAtFirstAbilityModifierId, hitDiceNumDice, hitDiceSizeId, hitDiceMiscModifier,
            hpGainNumDice, hpGainDiceSizeId, hpGainAbilityModifierId, hpGainMiscModifier, spellcasterTypeId, requiresSpellPreparation,
            prepareAbilityModifierId, prepareIncludeClassLevel, prepareIncludeHalfClassLevel, prepareMiscModifier, startingGoldNumDice,
            startingGoldDiceSize, startingGoldMiscModifier, numSecondarySkills, numSecondaryTools);

#     COMMIT;

    SELECT characteristicId AS characteristic_id;
END;;

DELIMITER ;

# CALL Characteristics_Create_Class('test', 'test_description', 1, 'tst', 1);
