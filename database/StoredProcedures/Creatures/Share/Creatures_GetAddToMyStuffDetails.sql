DROP PROCEDURE IF EXISTS Creatures_GetAddToMyStuffDetails;

DELIMITER ;;
CREATE PROCEDURE Creatures_GetAddToMyStuffDetails(
    IN creatureId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED,
    IN checkRights BIT
)
BEGIN
    DECLARE authorCreatureId INT UNSIGNED;
    DECLARE existingCreatureId INT UNSIGNED;
    DECLARE authorUserId MEDIUMINT UNSIGNED;
    DECLARE authorCreatureTypeId TINYINT UNSIGNED;
    DECLARE existingCreatureTypeId TINYINT UNSIGNED;

    IF checkRights = 0 THEN
        SET authorCreatureId = creatureId;
    ELSE
        SET authorCreatureId = (SELECT published_parent_id FROM creatures WHERE user_id = userId AND id = creatureId);
        IF authorCreatureId IS NULL THEN
            SET authorCreatureId = (SELECT creature_id FROM creatures_public WHERE creature_id = creatureId);
        END IF;
        IF authorCreatureId IS NULL THEN
            SET authorCreatureId = (SELECT creature_id FROM creatures_private WHERE user_id = userId AND creature_id = creatureId);
        END IF;
    END IF;

    SELECT user_id, creature_type_id
    INTO authorUserId, authorCreatureTypeId
    FROM creatures WHERE id = authorCreatureId;

    SELECT id, creature_type_id
    INTO existingCreatureId, existingCreatureTypeId
    FROM creatures WHERE published_parent_id = authorCreatureId AND user_id = userId;

    SELECT authorCreatureId AS author_creature_id,
           authorUserId AS author_user_id,
           existingCreatureId AS existing_creature_id,
           authorCreatureTypeId AS author_creature_type_id,
           existingCreatureTypeId AS existing_creature_type_id;
END;;

DELIMITER ;

# CALL Creatures_GetAddToMyStuffDetails(253, 12);
