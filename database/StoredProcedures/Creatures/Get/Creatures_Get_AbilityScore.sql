DROP PROCEDURE IF EXISTS Creatures_Get_AbilityScore;

DELIMITER ;;
CREATE PROCEDURE Creatures_Get_AbilityScore(
    IN creatureId INT UNSIGNED,
    IN abilityId INT UNSIGNED
)
BEGIN
    DECLARE score TINYINT UNSIGNED;
    DECLARE tempScore TINYINT;
    DECLARE misc TINYINT;
    DECLARE asi TINYINT UNSIGNED;
    DECLARE classId INT UNSIGNED;
    DECLARE subClassId INT UNSIGNED;
    DECLARE raceId INT UNSIGNED;
    DECLARE parentRaceId INT UNSIGNED;
    DECLARE backgroundId INT UNSIGNED;
    DECLARE parentBackgroundId INT UNSIGNED;

    DECLARE more_rows BOOLEAN DEFAULT TRUE;
    DECLARE curs CURSOR FOR SELECT class_id, subclass_id
                            FROM character_chosen_classes
                            WHERE character_id = creatureId;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET more_rows = FALSE;

    SELECT value, misc_modifier, asi_modifier
    INTO score, misc, asi
    FROM creature_ability_scores
    WHERE creature_id = creatureId AND ability_id = abilityId;

    SET score = score + misc + asi;

    OPEN curs;

    # Class/Subclass Modifiers
    WHILE more_rows DO
        FETCH curs INTO classId, subClassId;

        IF more_rows THEN
            SET tempScore = (SELECT IFNULL(SUM(value), 0) FROM characteristic_attribute_modifiers WHERE characteristic_id = classId AND attribute_id = abilityId);
            SET score = score + tempScore;

            IF subClassId IS NOT NULL THEN
                SET tempScore = (SELECT IFNULL(SUM(value), 0) FROM characteristic_attribute_modifiers WHERE characteristic_id = subClassId AND attribute_id = abilityId);
                SET score = score + tempScore;
            END IF;
        END IF;
    END WHILE;

    CLOSE curs;

    # Race Modifiers
    SELECT c.id, c.parent_characteristic_id
    INTO raceId, parentRaceId
    FROM characters ch
        JOIN characteristics c ON c.id = ch.race_id
    WHERE ch.creature_id = creatureId;

    IF raceId IS NOT NULL THEN
        SET tempScore = (SELECT IFNULL(SUM(value), 0) FROM characteristic_attribute_modifiers WHERE characteristic_id = raceId AND attribute_id = abilityId);
        SET score = score + tempScore;

        IF parentRaceId IS NOT NULL THEN
            SET tempScore = (SELECT IFNULL(SUM(value), 0) FROM characteristic_attribute_modifiers WHERE characteristic_id = parentRaceId AND attribute_id = abilityId);
            SET score = score + tempScore;
        END IF;
    END IF;

    # Background modifiers
    SELECT c.id, c.parent_characteristic_id
    INTO backgroundId, parentBackgroundId
    FROM characters ch
             JOIN characteristics c ON c.id = ch.background_id
    WHERE ch.creature_id = creatureId;

    IF backgroundId IS NOT NULL THEN
        SET tempScore = (SELECT IFNULL(SUM(value), 0) FROM characteristic_attribute_modifiers WHERE characteristic_id = backgroundId AND attribute_id = abilityId);
        SET score = score + tempScore;

        IF parentBackgroundId IS NOT NULL THEN
            SET tempScore = (SELECT IFNULL(SUM(value), 0) FROM characteristic_attribute_modifiers WHERE characteristic_id = parentBackgroundId AND attribute_id = abilityId);
            SET score = score + tempScore;
        END IF;
    END IF;

    # todo - power modifiers

    SELECT score AS ability_score;
END;;

DELIMITER ;

