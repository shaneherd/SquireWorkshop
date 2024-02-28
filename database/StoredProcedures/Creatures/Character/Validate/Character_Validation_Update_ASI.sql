DROP PROCEDURE IF EXISTS Character_Validation_Update_ASI;

DELIMITER ;;
CREATE PROCEDURE Character_Validation_Update_ASI(
    IN characterId INT UNSIGNED,
    IN abilityId INT UNSIGNED,
    IN amount TINYINT UNSIGNED
)
BEGIN
    UPDATE creature_ability_scores
    SET asi_modifier = asi_modifier + amount
    WHERE creature_id = characterId AND ability_id = abilityId;
END;;

DELIMITER ;

# CALL Character_Validation_Update_ASI(1, 2, 2);
