DROP PROCEDURE IF EXISTS Character_Validation_Reset_IgnoredPowers;

DELIMITER ;;
CREATE PROCEDURE Character_Validation_Reset_IgnoredPowers(
    IN characterId INT UNSIGNED
)
BEGIN
    DELETE FROM character_validation_ignored_powers WHERE character_id = characterId;
END;;

DELIMITER ;

# CALL Character_Validation_Reset_IgnoredPowers(1);
# SELECT * FROM character_validation
