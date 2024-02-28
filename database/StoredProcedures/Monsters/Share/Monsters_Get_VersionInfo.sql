DROP PROCEDURE IF EXISTS Monsters_Get_VersionInfo;

DELIMITER ;;
CREATE PROCEDURE Monsters_Get_VersionInfo(
    IN monsterId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE userMonsterId INT UNSIGNED;
    DECLARE parentMonsterId INT UNSIGNED;
    DECLARE publishedMonsterId INT UNSIGNED;
    DECLARE currentVersion SMALLINT UNSIGNED;
    DECLARE authorVersion SMALLINT UNSIGNED;

    SET userMonsterId = (SELECT id FROM monsters WHERE user_id = userID AND id = monsterId UNION SELECT monster_id FROM monsters_shared WHERE user_id = userId AND monster_id = monsterId);

    IF userMonsterId IS NOT NULL THEN
        SET parentMonsterId = (SELECT published_parent_id FROM monsters WHERE id = userMonsterId);
        SET publishedMonsterId = (SELECT monster_id FROM monsters_public WHERE monster_id = parentMonsterId);
        IF publishedMonsterId IS NULL THEN
            SET publishedMonsterId = (SELECT monster_id FROM monsters_private WHERE user_id = userId AND monster_id = parentMonsterId);
        END IF;

        SELECT c2.version, c1.published_parent_version
        INTO authorVersion, currentVersion
        FROM monsters c1
            LEFT JOIN monsters c2 ON c1.published_parent_id = c2.id AND c1.id = userMonsterId AND c2.id = publishedMonsterId
        WHERE c2.version IS NOT NULL;
    ELSE
        SET userMonsterId = (SELECT id FROM monsters WHERE published_parent_id = monsterId AND user_id = userId);
        IF userMonsterId IS NOT NULL THEN
            SELECT c2.version, c1.published_parent_version
            INTO authorVersion, currentVersion
            FROM monsters c1
                LEFT JOIN monsters c2 ON c1.published_parent_id = c2.id AND c1.id = userMonsterId
            WHERE c2.version IS NOT NULL;
        ELSE
            SET userMonsterId = (SELECT monster_id FROM monsters_public WHERE monster_id = monsterId);
            IF userMonsterId IS NULL THEN
                SET userMonsterId = (SELECT monster_id FROM monsters_private WHERE user_id = userId AND monster_id = monsterId);
            END IF;

            IF userMonsterId IS NOT NULL THEN
                SELECT version, 0
                INTO authorVersion, currentVersion
                FROM monsters WHERE id = userMonsterId;
            END IF;
        END IF;
    END IF;

    SELECT currentVersion AS version, authorVersion AS author_version;
END;;

DELIMITER ;

# CALL Monsters_Get_VersionInfo(273, 1);
