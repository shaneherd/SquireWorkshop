DROP PROCEDURE IF EXISTS Attributes_Get_Skill;

DELIMITER ;;
CREATE PROCEDURE Attributes_Get_Skill(
    IN attributeId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE skillId INT UNSIGNED;

    SET skillId = (SELECT id FROM attributes WHERE user_id = userID AND id = attributeId UNION SELECT attribute_id FROM attributes_shared WHERE user_id = userId AND attribute_id = attributeId);
    IF skillId IS NULL THEN
        SET skillId = (SELECT attribute_id FROM attributes_public WHERE attribute_id = attributeId);
    END IF;
    IF skillId IS NULL THEN
        SET skillId = (SELECT attribute_id FROM attributes_private WHERE user_id = userId AND attribute_id = attributeId);
    END IF;
    IF skillId IS NULL THEN
        SET skillId = (SELECT a.id
                       FROM attributes a
                                JOIN creatures c ON c.user_id = a.user_id AND a.id = attributeId
                                JOIN campaign_characters cc ON cc.creature_id = c.id
                                JOIN campaigns c2 ON cc.campaign_id = c2.id AND c2.user_id = userId
                       LIMIT 1);
    END IF;

    SELECT a.id, a.name, a.description, a.sid, s.ability_id, a2.name AS ability_name,
           a2.description AS ability_description, ab.abbr AS ability_abbr, a2.sid AS ability_sid,
           a2.user_id = userId AS ability_is_author, a2.version AS ability_version,
           a.user_id = userId AS is_author, a.version
    FROM attributes a
        JOIN skills s ON a.id = s.attribute_id AND a.id = skillId
        LEFT JOIN abilities ab ON s.ability_id = ab.attribute_id
        LEFT JOIN attributes a2 ON a2.id = ab.attribute_id;
END;;

DELIMITER ;

