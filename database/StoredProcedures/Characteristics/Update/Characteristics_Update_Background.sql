DROP PROCEDURE IF EXISTS Characteristics_Update_Background;

DELIMITER ;;
CREATE PROCEDURE Characteristics_Update_Background(
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

    IN backgroundDescription VARCHAR(1000),
    IN startingGold SMALLINT UNSIGNED
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
            num_languages = numLanguages, num_saving_throws = numSavingThrows, num_skills = numSkills,
            num_tools = numTools, spellcasting_ability_id = spellcastingAbilityId, version = version + 1
        WHERE user_id = userId AND id = characteristicId;
        
        UPDATE backgrounds
        SET description = backgroundDescription, starting_gold = startingGold
        WHERE characteristic_id = characteristicId;
    END IF;

#     COMMIT;

    SELECT valid AS valid_request;
END;;

DELIMITER ;

# CALL Characteristics_Update_Background(265, 1, 'test-chanaaaged', 'test-changed-desc', 'ab');
