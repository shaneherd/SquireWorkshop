DROP PROCEDURE IF EXISTS Attributes_Get_Condition;

DELIMITER ;;
CREATE PROCEDURE Attributes_Get_Condition(
    IN attributeId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE conditionId INT UNSIGNED;

    SET conditionId = (SELECT id FROM attributes WHERE user_id = userID AND id = attributeId UNION SELECT attribute_id FROM attributes_shared WHERE user_id = userId AND attribute_id = attributeId);
    IF conditionId IS NULL THEN
        SET conditionId = (SELECT attribute_id FROM attributes_public WHERE attribute_id = attributeId);
    END IF;
    IF conditionId IS NULL THEN
        SET conditionId = (SELECT attribute_id FROM attributes_private WHERE user_id = userId AND attribute_id = attributeId);
    END IF;
    IF conditionId IS NULL THEN
        SET conditionId = (SELECT a.id
                           FROM attributes a
                                    JOIN creatures c ON c.user_id = a.user_id AND a.id = attributeId
                                    JOIN campaign_characters cc ON cc.creature_id = c.id
                                    JOIN campaigns c2 ON cc.campaign_id = c2.id AND c2.user_id = userId
                           LIMIT 1);
    END IF;

    SELECT a.id, a.name, a.description, a.sid, a.user_id = userId AS is_author, a.version
    FROM attributes a
        JOIN conditions c on a.id = c.attribute_id AND a.id = conditionId;

    IF conditionId IS NOT NULL THEN
        SELECT acc.id, acc.name, acc.description, acc.sid, acc.user_id = userId AS is_author, acc.user_id = userId AS is_author, acc.version
        FROM attributes a
            JOIN connecting_conditions cc ON cc.parent_condition_id = a.id AND a.id = conditionId
            JOIN attributes acc ON acc.id = cc.child_condition_id;
    END IF;
END;;

DELIMITER ;

