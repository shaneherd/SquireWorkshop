DROP PROCEDURE IF EXISTS Character_Validation_Update;

DELIMITER ;;
CREATE PROCEDURE Character_Validation_Update(
    IN characterId INT UNSIGNED,
    IN characteristicId INT UNSIGNED,
    IN levelId INT UNSIGNED,
    IN abilityScoreIncreasesApplied BIT,
    IN featSelected BIT
)
BEGIN
    REPLACE INTO character_validation (character_id, characteristic_id, level_id, ability_score_increases_applied, feat_selected) VALUES
    (characterId, characteristicId, levelId, abilityScoreIncreasesApplied, featSelected);
END;;

DELIMITER ;

# CALL Character_Validation_Update(1, 2, 8, 1, 0);
# SELECT * FROM character_validation
