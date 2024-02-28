DROP PROCEDURE IF EXISTS Creatures_Create_Character;

DELIMITER ;;
CREATE PROCEDURE Creatures_Create_Character(
    IN creatureName VARCHAR(150),
    IN spellcastingAbilityId INT UNSIGNED,
    IN alignmentId INT UNSIGNED,

    IN raceId INT UNSIGNED,
    IN raceSpellcastingAbilityId INT UNSIGNED,
    IN backgroundId INT UNSIGNED,
    IN backgroundSpellcastingAbilityId INT UNSIGNED,
    IN customBackgroundName VARCHAR(45),
    IN customBackgroundVariation VARCHAR(1000),
    IN customBackgroundPersonality VARCHAR(1000),
    IN customBackgroundIdeal VARCHAR(1000),
    IN customBackgroundBond VARCHAR(1000),
    IN customBackgroundFlaw VARCHAR(1000),
    IN bioValue VARCHAR(3000),
    IN heightValue VARCHAR(45),
    IN eyesValue VARCHAR(45),
    IN hairValue VARCHAR(45),
    IN skinValue VARCHAR(45),
    IN genderId TINYINT UNSIGNED,
    IN ageValue SMALLINT UNSIGNED,
    IN weightValue DECIMAL(6,2),
    IN deityId INT UNSIGNED,
    IN expValue MEDIUMINT UNSIGNED,
    IN hpGainModifier TINYINT UNSIGNED,
    IN healthCalculationTypeId TINYINT UNSIGNED,

    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE creatureId INT UNSIGNED;

#     DECLARE EXIT HANDLER FOR SQLEXCEPTION
#     BEGIN
#         ROLLBACK;
#         SELECT -1 AS creature_id;
#     END;

#     START TRANSACTION;
    
    INSERT INTO creatures (name, creature_type_id, spellcasting_ability_id, alignment_id, user_id)
    VALUES (creatureName, 1, spellcastingAbilityId, alignmentId, userId);

    SET creatureId = (SELECT LAST_INSERT_ID());
    
    INSERT INTO characters (creature_id, race_id, background_id, custom_background_name, custom_background_variation,
                            custom_background_personality, custom_background_ideal, custom_background_bond,
                            custom_background_flaw, bio, height, eyes, hair, skin, gender_id, age, weight,
                            deity_id, inspiration, exp, hp_gain_modifier, health_calculation_type_id,
                            race_spellcasting_ability_id, background_spellcasting_ability_id)
    VALUES (creatureId, raceId, backgroundId, customBackgroundName, customBackgroundVariation, customBackgroundPersonality,
            customBackgroundIdeal, customBackgroundBond, customBackgroundFlaw, bioValue, heightValue, eyesValue, hairValue,
            skinValue, genderId, ageValue, weightValue, deityId, 0, expValue, hpGainModifier, healthCalculationTypeId,
            raceSpellcastingAbilityId, backgroundSpellcastingAbilityId);

#     COMMIT;

    SELECT creatureId AS creature_id;
END;;

DELIMITER ;

# CALL Creatures_Create_Character('test', 'test_description', 1, 'tst', 1);
