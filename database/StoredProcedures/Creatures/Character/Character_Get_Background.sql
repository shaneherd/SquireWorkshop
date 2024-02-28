DROP PROCEDURE IF EXISTS Character_Get_Background;

DELIMITER ;;
CREATE PROCEDURE Character_Get_Background(
    IN creatureId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE characterId INT UNSIGNED;
    DECLARE backgroundId INT UNSIGNED;

    SET characterId = (SELECT id FROM creatures WHERE user_id = userID AND id = creatureId UNION SELECT creature_id FROM creatures_shared WHERE user_id = userId AND creature_id = creatureId);
    SET backgroundId = (SELECT background_id FROM characters WHERE creature_id = characterId);

    SELECT background_id, background_spellcasting_ability_id,
           custom_background_name, custom_background_variation, custom_background_personality,
           custom_background_ideal, custom_background_bond, custom_background_flaw, bio
    FROM characters
    WHERE creature_id = characterId;

    CALL Characteristics_Get_Background(backgroundId, userId);

    # Characteristic Spellcasting
    SELECT prof, double_prof, half_prof, round_up, misc_modifier, advantage, disadvantage, attack_type_id
    FROM character_characteristic_spellcasting
    WHERE character_id = characterId AND characteristic_id = backgroundId AND attack_type_id IN (1,2)
    ORDER BY attack_type_id;

    # Chosen Traits
    SELECT t.id, t.background_trait_type_id, t.description
    FROM character_background_traits c
        JOIN background_traits t ON c.background_trait_id = t.id
    WHERE c.character_id = characterId;
END;;

DELIMITER ;

# CALL Character_Get_Background(1, 1);

