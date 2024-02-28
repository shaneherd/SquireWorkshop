DROP PROCEDURE IF EXISTS Character_Validation_Update_IgnoredPower;

DELIMITER ;;
CREATE PROCEDURE Character_Validation_Update_IgnoredPower(
    IN characterId INT UNSIGNED,
    IN powerId INT UNSIGNED
)
BEGIN
    REPLACE INTO character_validation_ignored_powers (character_id, power_id) VALUES
    (characterId, powerId);
END;;

DELIMITER ;

# CALL UpdateCharacterValidationIgnorePower(1, 2);
# SELECT * FROM character_validation
