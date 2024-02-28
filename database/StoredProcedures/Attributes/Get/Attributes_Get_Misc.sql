DROP PROCEDURE IF EXISTS Attributes_Get_Misc;

DELIMITER ;;
CREATE PROCEDURE Attributes_Get_Misc(
    IN attributeId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE miscId INT UNSIGNED;

    SET miscId = (SELECT id FROM attributes WHERE user_id = userID AND id = attributeId UNION SELECT attribute_id FROM attributes_shared WHERE user_id = userId AND attribute_id = attributeId);
    IF miscId IS NULL THEN
        SET miscId = (SELECT attribute_id FROM attributes_public WHERE attribute_id = attributeId);
    END IF;
    IF miscId IS NULL THEN
        SET miscId = (SELECT attribute_id FROM attributes_private WHERE user_id = userId AND attribute_id = attributeId);
    END IF;
    IF miscId IS NULL THEN
        SET miscId = (SELECT a.id
                      FROM attributes a
                               JOIN creatures c ON c.user_id = a.user_id AND a.id = attributeId
                               JOIN campaign_characters cc ON cc.creature_id = c.id
                               JOIN campaigns c2 ON cc.campaign_id = c2.id AND c2.user_id = userId
                      LIMIT 1);
    END IF;

    SELECT a.id AS attribute_id, a.name, a.description, a.sid, ma.modifier_category_id, ma.characteristic_dependant, a.user_id = userId AS is_author, a.version
    FROM attributes a
        JOIN misc_attributes ma on a.id = ma.attribute_id AND a.id = miscId;
END;;

DELIMITER ;

