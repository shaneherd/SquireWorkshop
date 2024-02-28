DROP PROCEDURE IF EXISTS Creatures_Get_VersionInfo;

DELIMITER ;;
CREATE PROCEDURE Creatures_Get_VersionInfo(
    IN creatureId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE userCreatureId INT UNSIGNED;
    DECLARE parentCreatureId INT UNSIGNED;
    DECLARE publishedCreatureId INT UNSIGNED;
    DECLARE currentVersion SMALLINT UNSIGNED;
    DECLARE authorVersion SMALLINT UNSIGNED;

    SET userCreatureId = (SELECT id FROM creatures WHERE user_id = userID AND id = creatureId UNION SELECT creature_id FROM creatures_shared WHERE user_id = userId AND creature_id = creatureId);

    IF userCreatureId IS NOT NULL THEN
        SET parentCreatureId = (SELECT published_parent_id FROM creatures WHERE id = userCreatureId);
        SET publishedCreatureId = (SELECT creature_id FROM creatures_public WHERE creature_id = parentCreatureId);
        IF publishedCreatureId IS NULL THEN
            SET publishedCreatureId = (SELECT creature_id FROM creatures_private WHERE user_id = userId AND creature_id = parentCreatureId);
        END IF;

        SELECT c2.version, c1.published_parent_version
        INTO authorVersion, currentVersion
        FROM creatures c1
            LEFT JOIN creatures c2 ON c1.published_parent_id = c2.id AND c1.id = userCreatureId AND c2.id = publishedCreatureId
        WHERE c2.version IS NOT NULL;
    ELSE
        SET userCreatureId = (SELECT id FROM creatures WHERE published_parent_id = creatureId AND user_id = userId);
        IF userCreatureId IS NOT NULL THEN
            SELECT c2.version, c1.published_parent_version
            INTO authorVersion, currentVersion
            FROM creatures c1
                LEFT JOIN creatures c2 ON c1.published_parent_id = c2.id AND c1.id = userCreatureId
            WHERE c2.version IS NOT NULL;
        ELSE
            SET userCreatureId = (SELECT creature_id FROM creatures_public WHERE creature_id = creatureId);
            IF userCreatureId IS NULL THEN
                SET userCreatureId = (SELECT creature_id FROM creatures_private WHERE user_id = userId AND creature_id = creatureId);
            END IF;

            IF userCreatureId IS NOT NULL THEN
                SELECT version, 0
                INTO authorVersion, currentVersion
                FROM creatures WHERE id = userCreatureId;
            END IF;
        END IF;
    END IF;

    SELECT currentVersion AS version, authorVersion AS author_version;
END;;

DELIMITER ;

# CALL Creatures_Get_VersionInfo(273, 1);
