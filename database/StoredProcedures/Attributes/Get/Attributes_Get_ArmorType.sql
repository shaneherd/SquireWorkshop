DROP PROCEDURE IF EXISTS Attributes_Get_ArmorType;

DELIMITER ;;
CREATE PROCEDURE Attributes_Get_ArmorType(
    IN attributeId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE armorTypeId INT UNSIGNED;

    SET armorTypeId = (SELECT id FROM attributes WHERE user_id = userID AND id = attributeId UNION SELECT attribute_id FROM attributes_shared WHERE user_id = userId AND attribute_id = attributeId);
    IF armorTypeId IS NULL THEN
        SET armorTypeId = (SELECT attribute_id FROM attributes_public WHERE attribute_id = attributeId);
    END IF;
    IF armorTypeId IS NULL THEN
        SET armorTypeId = (SELECT attribute_id FROM attributes_private WHERE user_id = userId AND attribute_id = attributeId);
    END IF;
    IF armorTypeId IS NULL THEN
        SET armorTypeId = (SELECT a.id
                           FROM attributes a
                                    JOIN creatures c ON c.user_id = a.user_id AND a.id = attributeId
                                    JOIN campaign_characters cc ON cc.creature_id = c.id
                                    JOIN campaigns c2 ON cc.campaign_id = c2.id AND c2.user_id = userId
                           LIMIT 1);
    END IF;

    SELECT a.id, a.name, a.description, a.sid, at.don, at.don_time_unit, at.doff, at.doff_time_unit, a.user_id = userId AS is_author, a.version
    FROM attributes a
        JOIN armor_types at ON a.id = at.attribute_id AND a.id = armorTypeId;
END;;

DELIMITER ;

