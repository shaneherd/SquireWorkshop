DROP PROCEDURE IF EXISTS Powers_Get_VersionInfo;

DELIMITER ;;
CREATE PROCEDURE Powers_Get_VersionInfo(
    IN powerId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE userPowerId INT UNSIGNED;
    DECLARE parentPowerId INT UNSIGNED;
    DECLARE publishedPowerId INT UNSIGNED;
    DECLARE currentVersion SMALLINT UNSIGNED;
    DECLARE authorVersion SMALLINT UNSIGNED;

    SET userPowerId = (SELECT id FROM powers WHERE user_id = userID AND id = powerId UNION SELECT power_id FROM powers_shared WHERE user_id = userId AND power_id = powerId);

    IF userPowerId IS NOT NULL THEN
        SET parentPowerId = (SELECT published_parent_id FROM powers WHERE id = userPowerId);
        SET publishedPowerId = (SELECT power_id FROM powers_public WHERE power_id = parentPowerId);
        IF publishedPowerId IS NULL THEN
            SET publishedPowerId = (SELECT power_id FROM powers_private WHERE user_id = userId AND power_id = parentPowerId);
        END IF;

        SELECT p2.version, p1.published_parent_version
        INTO authorVersion, currentVersion
        FROM powers p1
            LEFT JOIN powers p2 ON p1.published_parent_id = p2.id AND p1.id = userPowerId AND p2.id = publishedPowerId
        WHERE p2.version IS NOT NULL;
    ELSE
        SET userPowerId = (SELECT id FROM powers WHERE published_parent_id = powerId AND user_id = userId);
        IF userPowerId IS NOT NULL THEN
            SELECT p2.version, p1.published_parent_version
            INTO authorVersion, currentVersion
            FROM powers p1
                LEFT JOIN powers p2 ON p1.published_parent_id = p2.id AND p1.id = userPowerId
            WHERE p2.version IS NOT NULL;
        ELSE
            SET userPowerId = (SELECT power_id FROM powers_public WHERE power_id = powerId);
            IF userPowerId IS NULL THEN
                SET userPowerId = (SELECT power_id FROM powers_private WHERE user_id = userId AND power_id = powerId);
            END IF;

            IF userPowerId IS NOT NULL THEN
                SELECT version, 0
                INTO authorVersion, currentVersion
                FROM powers WHERE id = userPowerId;
            END IF;
        END IF;
    END IF;

    SELECT currentVersion AS version, authorVersion AS author_version;
END;;

DELIMITER ;

# CALL Powers_Get_VersionInfo(273, 1);
