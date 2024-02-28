DROP PROCEDURE IF EXISTS Characteristics_Get_Race;

DELIMITER ;;
CREATE PROCEDURE Characteristics_Get_Race(
    IN characteristicId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE raceId INT UNSIGNED;

    SET raceId = (SELECT id FROM characteristics WHERE user_id = userID AND id = characteristicId UNION SELECT characteristic_id FROM characteristics_shared WHERE user_id = userId AND characteristic_id = characteristicId);
    IF raceId IS NULL THEN
        SET raceId = (SELECT characteristic_id FROM characteristics_public WHERE characteristic_id = characteristicId);
    END IF;
    IF raceId IS NULL THEN
        SET raceId = (SELECT characteristic_id FROM characteristics_private WHERE user_id = userId AND characteristic_id = characteristicId);
    END IF;

    SELECT c.id, c.name, c.sid, c.parent_characteristic_id, c.num_abilities, c.num_languages, c.num_saving_throws,
           c.num_skills, c.num_tools, c.spellcasting_ability_id, r.description, r.size_id, r.hover, r.starting_gold,
           c.user_id = userId AS is_author, c.version
    FROM characteristics c
        JOIN races r on c.id = r.characteristic_id AND c.id = raceId;

    IF raceId IS NOT NULL THEN
        CALL Characteristics_ProfsAndModifiers(raceId);
        CALL Characteristics_SpellConfigurations(raceId, userId);
        CALL Characteristics_StartingEquipment(raceId, 0, userId);
        CALL Characteristics_DamageModifiers(raceId, userId);
        CALL Characteristics_ConditionImmunities(raceId, userId);
        CALL Characteristics_Senses(raceId);

         # Speeds
        SELECT `speed_id`, `value`
        FROM race_speeds
        WHERE race_id = raceId;

        # Sub-races
        SELECT s.id
        FROM characteristics c
            JOIN characteristics s ON s.parent_characteristic_id = c.id AND (s.user_id = c.user_id OR s.user_id IN (0, userId))
        WHERE s.parent_characteristic_id = raceId;
    END IF;
END;;

DELIMITER ;

# CALL Characteristics_Get_Race(32, 1);