DROP PROCEDURE IF EXISTS Character_Get_Race;

DELIMITER ;;
CREATE PROCEDURE Character_Get_Race(
    IN creatureId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE characterId INT UNSIGNED;
    DECLARE raceId INT UNSIGNED;

    SET characterId = (SELECT id FROM creatures WHERE user_id = userID AND id = creatureId UNION SELECT creature_id FROM creatures_shared WHERE user_id = userId AND creature_id = creatureId);
    SET raceId = (SELECT race_id FROM characters WHERE creature_id = characterId);

    SELECT race_spellcasting_ability_id
    FROM characters
    WHERE creature_id = characterId;

    CALL Characteristics_Get_Race(raceId, userId);

    # Characteristic Spellcasting
    SELECT prof, double_prof, half_prof, round_up, misc_modifier, advantage, disadvantage, attack_type_id
    FROM character_characteristic_spellcasting
    WHERE character_id = characterId AND characteristic_id = raceId AND attack_type_id IN (1,2)
    ORDER BY attack_type_id;
END;;

DELIMITER ;

# CALL Character_Get_Race(1, 1);

