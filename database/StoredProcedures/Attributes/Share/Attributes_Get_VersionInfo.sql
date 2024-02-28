DROP PROCEDURE IF EXISTS Attributes_Get_VersionInfo;

DELIMITER ;;
CREATE PROCEDURE Attributes_Get_VersionInfo(
    IN attributeId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE userAttributeId INT UNSIGNED;
    DECLARE parentAttributeId INT UNSIGNED;
    DECLARE publishedAttributeId INT UNSIGNED;
    DECLARE currentVersion SMALLINT UNSIGNED;
    DECLARE authorVersion SMALLINT UNSIGNED;

    SET userAttributeId = (SELECT id FROM attributes WHERE user_id = userID AND id = attributeId UNION SELECT attribute_id FROM attributes_shared WHERE user_id = userId AND attribute_id = attributeId);

    IF userAttributeId IS NOT NULL THEN
        SET parentAttributeId = (SELECT published_parent_id FROM attributes WHERE id = userAttributeId);
        SET publishedAttributeId = (SELECT attribute_id FROM attributes_public WHERE attribute_id = parentAttributeId);
        IF publishedAttributeId IS NULL THEN
            SET publishedAttributeId = (SELECT attribute_id FROM attributes_private WHERE user_id = userId AND attribute_id = parentAttributeId);
        END IF;

        SELECT a2.version, a1.published_parent_version
        INTO authorVersion, currentVersion
        FROM attributes a1
            LEFT JOIN attributes a2 ON a1.published_parent_id = a2.id AND a1.id = userAttributeId AND a2.id = publishedAttributeId
        WHERE a2.version IS NOT NULL;
    ELSE
        SET userAttributeId = (SELECT id FROM attributes WHERE published_parent_id = attributeId AND user_id = userId);
        IF userAttributeId IS NOT NULL THEN
            SELECT a2.version, a1.published_parent_version
            INTO authorVersion, currentVersion
            FROM attributes a1
                LEFT JOIN attributes a2 ON a1.published_parent_id = a2.id AND a1.id = userAttributeId
            WHERE a2.version IS NOT NULL;
        ELSE
            SET userAttributeId = (SELECT attribute_id FROM attributes_public WHERE attribute_id = attributeId);
            IF userAttributeId IS NULL THEN
                SET userAttributeId = (SELECT attribute_id FROM attributes_private WHERE user_id = userId AND attribute_id = attributeId);
            END IF;

            IF userAttributeId IS NOT NULL THEN
                SELECT version, 0
                INTO authorVersion, currentVersion
                FROM attributes WHERE id = userAttributeId;
            END IF;
        END IF;
    END IF;

    SELECT currentVersion AS version, authorVersion AS author_version;
END;;

DELIMITER ;

# CALL Attributes_Get_VersionInfo(279, 1);
