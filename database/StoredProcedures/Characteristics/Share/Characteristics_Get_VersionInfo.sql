DROP PROCEDURE IF EXISTS Characteristics_Get_VersionInfo;

DELIMITER ;;
CREATE PROCEDURE Characteristics_Get_VersionInfo(
    IN characteristicId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE userCharacteristicId INT UNSIGNED;
    DECLARE parentCharacteristicId INT UNSIGNED;
    DECLARE publishedCharacteristicId INT UNSIGNED;
    DECLARE currentVersion SMALLINT UNSIGNED;
    DECLARE authorVersion SMALLINT UNSIGNED;

    SET userCharacteristicId = (SELECT id FROM characteristics WHERE user_id = userID AND id = characteristicId UNION SELECT characteristic_id FROM characteristics_shared WHERE user_id = userId AND characteristic_id = characteristicId);

    IF userCharacteristicId IS NOT NULL THEN
        SET parentCharacteristicId = (SELECT published_parent_id FROM characteristics WHERE id = userCharacteristicId);
        SET publishedCharacteristicId = (SELECT characteristic_id FROM characteristics_public WHERE characteristic_id = parentCharacteristicId);
        IF publishedCharacteristicId IS NULL THEN
            SET publishedCharacteristicId = (SELECT characteristic_id FROM characteristics_private WHERE user_id = userId AND characteristic_id = parentCharacteristicId);
        END IF;

        SELECT c2.version, c1.published_parent_version
        INTO authorVersion, currentVersion
        FROM characteristics c1
            LEFT JOIN characteristics c2 ON c1.published_parent_id = c2.id AND c1.id = userCharacteristicId AND c2.id = publishedCharacteristicId
        WHERE c2.version IS NOT NULL;
    ELSE
        SET userCharacteristicId = (SELECT id FROM characteristics WHERE published_parent_id = characteristicId AND user_id = userId);
        IF userCharacteristicId IS NOT NULL THEN
            SELECT c2.version, c1.published_parent_version
            INTO authorVersion, currentVersion
            FROM characteristics c1
                LEFT JOIN characteristics c2 ON c1.published_parent_id = c2.id AND c1.id = userCharacteristicId
            WHERE c2.version IS NOT NULL;
        ELSE
            SET userCharacteristicId = (SELECT characteristic_id FROM characteristics_public WHERE characteristic_id = characteristicId);
            IF userCharacteristicId IS NULL THEN
                SET userCharacteristicId = (SELECT characteristic_id FROM characteristics_private WHERE user_id = userId AND characteristic_id = characteristicId);
            END IF;

            IF userCharacteristicId IS NOT NULL THEN
                SELECT version, 0
                INTO authorVersion, currentVersion
                FROM characteristics WHERE id = userCharacteristicId;
            END IF;
        END IF;
    END IF;

    SELECT currentVersion AS version, authorVersion AS author_version;
END;;

DELIMITER ;

# CALL Characteristics_Get_VersionInfo(273, 1);
