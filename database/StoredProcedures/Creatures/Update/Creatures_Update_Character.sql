DROP PROCEDURE IF EXISTS Creatures_Update_Character;

DELIMITER ;;
CREATE PROCEDURE Creatures_Update_Character(
    IN creatureId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED,

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
    IN hasInspiration BIT,
    IN expValue MEDIUMINT UNSIGNED,
    IN hpGainModifier TINYINT UNSIGNED,
    IN healthCalculationTypeId TINYINT UNSIGNED
)
BEGIN
    DECLARE valid BIT;

#     DECLARE EXIT HANDLER FOR SQLEXCEPTION
#     BEGIN
#         ROLLBACK;
#         SELECT 0 AS valid_request;
#     END;

#     START TRANSACTION;

    SET valid = (SELECT user_id FROM creatures WHERE id = creatureId) = userId;

    IF valid THEN
        UPDATE creatures
        SET name = creatureName, spellcasting_ability_id = spellcastingAbilityId, alignment_id = alignmentId
        WHERE user_id = userId AND id = creatureId;
        
        UPDATE characters
        SET race_id = raceId, race_spellcasting_ability_id = raceSpellcastingAbilityId, background_id = backgroundId,
            background_spellcasting_ability_id = backgroundSpellcastingAbilityId, custom_background_name = customBackgroundName,
            custom_background_variation = customBackgroundVariation, custom_background_personality = customBackgroundPersonality,
            custom_background_ideal = customBackgroundIdeal, custom_background_bond = customBackgroundBond,
            custom_background_flaw = customBackgroundFlaw, bio = bioValue, height = heightValue, eyes = eyesValue,
            hair = hairValue, skin = skinValue, gender_id = genderId, age = ageValue, weight = weightValue,
            deity_id = deityId, inspiration = hasInspiration, exp = expValue, hp_gain_modifier = hpGainModifier,
            health_calculation_type_id = healthCalculationTypeId
        WHERE creature_id = creatureId;
    END IF;

#     COMMIT;

    SELECT valid AS valid_request;
END;;

DELIMITER ;

# CALL Creatures_Update_Character(265, 1, 'test-chanaaaged', 'test-changed-desc', 'ab');
