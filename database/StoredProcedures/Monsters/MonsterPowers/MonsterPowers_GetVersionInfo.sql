DROP PROCEDURE IF EXISTS MonsterPowers_GetVersionInfo;

DELIMITER ;;
CREATE PROCEDURE MonsterPowers_GetVersionInfo(
    IN monsterPowerId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE userPowerId INT UNSIGNED;
    DECLARE parentPowerId INT UNSIGNED;
    DECLARE publishedPowerId INT UNSIGNED;
    DECLARE currentVersion SMALLINT UNSIGNED;
    DECLARE authorVersion SMALLINT UNSIGNED;

    SET userPowerId = (SELECT id FROM monster_powers WHERE user_id = userID AND id = monsterPowerId UNION SELECT monster_power_id FROM monster_powers_shared WHERE user_id = userId AND monster_power_id = monsterPowerId);

    IF userPowerId IS NOT NULL THEN
        SET parentPowerId = (SELECT published_parent_id FROM monster_powers WHERE id = userPowerId);
        SET publishedPowerId = (SELECT monster_power_id FROM monster_powers_public WHERE monster_power_id = parentPowerId);
        IF publishedPowerId IS NULL THEN
            SET publishedPowerId = (SELECT monster_power_id FROM monster_powers_private WHERE user_id = userId AND monster_power_id = parentPowerId);
        END IF;

        SELECT p2.version, p1.published_parent_version
        INTO authorVersion, currentVersion
        FROM monster_powers p1
            LEFT JOIN monster_powers p2 ON p1.published_parent_id = p2.id AND p1.id = userPowerId AND p2.id = publishedPowerId
        WHERE p2.version IS NOT NULL;
    ELSE
        SET userPowerId = (SELECT id FROM monster_powers WHERE published_parent_id = monsterPowerId AND user_id = userId);
        IF userPowerId IS NOT NULL THEN
            SELECT p2.version, p1.published_parent_version
            INTO authorVersion, currentVersion
            FROM monster_powers p1
                LEFT JOIN monster_powers p2 ON p1.published_parent_id = p2.id AND p1.id = userPowerId
            WHERE p2.version IS NOT NULL;
        ELSE
            SET userPowerId = (SELECT monster_power_id FROM monster_powers_public WHERE monster_power_id = monsterPowerId);
            IF userPowerId IS NULL THEN
                SET userPowerId = (SELECT monster_power_id FROM monster_powers_private WHERE user_id = userId AND monster_power_id = monsterPowerId);
            END IF;

            IF userPowerId IS NOT NULL THEN
                SELECT version, 0
                INTO authorVersion, currentVersion
                FROM monster_powers WHERE id = userPowerId;
            END IF;
        END IF;
    END IF;

    SELECT currentVersion AS version, authorVersion AS author_version;
END;;

DELIMITER ;

# CALL MonsterPowers_GetVersionInfo(1, null, null, 0, 1, 2, 1, null, null, null, null, 0, 1000, 1);

