DROP PROCEDURE IF EXISTS Attributes_Get_Deity;

DELIMITER ;;
CREATE PROCEDURE Attributes_Get_Deity(
    IN attributeId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE deityId INT UNSIGNED;

    SET deityId = (SELECT id FROM attributes WHERE user_id = userID AND id = attributeId UNION SELECT attribute_id FROM attributes_shared WHERE user_id = userId AND attribute_id = attributeId);
    IF deityId IS NULL THEN
        SET deityId = (SELECT attribute_id FROM attributes_public WHERE attribute_id = attributeId);
    END IF;
    IF deityId IS NULL THEN
        SET deityId = (SELECT attribute_id FROM attributes_private WHERE user_id = userId AND attribute_id = attributeId);
    END IF;
    IF deityId IS NULL THEN
        SET deityId = (SELECT a.id
                       FROM attributes a
                                JOIN creatures c ON c.user_id = a.user_id AND a.id = attributeId
                                JOIN campaign_characters cc ON cc.creature_id = c.id
                                JOIN campaigns c2 ON cc.campaign_id = c2.id AND c2.user_id = userId
                       LIMIT 1);
    END IF;

    SELECT a.id, a.name, a.description, a.sid, d.deity_category_id, a2.name AS category_name,
           a2.description AS category_description, a2.sid AS category_sid, a2.user_id = userId AS category_is_author, a2.version AS category_version,
           d.alignment_id, a3.name AS alignment_name, a3.description AS alignment_description, a3.sid AS alignment_sid,
           a3.user_id = userId AS alignment_is_author, a3.version AS alignment_version,
           d.symbol, a.user_id = userId AS is_author, a.version
    FROM attributes a
        JOIN deities d ON a.id = d.attribute_id AND a.id = deityId
        LEFT JOIN deity_categories dc ON d.deity_category_id = dc.attribute_id
        LEFT JOIN attributes a2 ON a2.id = dc.attribute_id
        LEFT JOIN alignments al ON al.attribute_id = d.alignment_id
        LEFT JOIN attributes a3 ON al.attribute_id = a3.id;
END;;

DELIMITER ;

