DROP PROCEDURE IF EXISTS Campaigns_Get;

DELIMITER ;;
CREATE PROCEDURE Campaigns_Get(
    IN campaignId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    SELECT id, name, description, user_id = userId AS is_author, token
    FROM campaigns
    WHERE user_id = userId AND id = campaignId;

    SELECT cc.id, c.id AS creature_id, c.name,
           cl.id AS class_id, cl.name AS class_name,
           s.id AS subclass_id, s.name AS subclass_name,
           r.id AS race_id, r.name AS race_name,
           b.id AS background_id, b.name AS background_name,
           ch.exp, p.misc_modifier AS proficiency_misc
    FROM campaign_characters cc
        JOIN characters ch ON cc.campaign_id = campaignId AND ch.creature_id = cc.creature_id
        JOIN creatures c ON c.id = ch.creature_id
        LEFT JOIN character_chosen_classes ccc ON ccc.character_id = c.id AND ccc.`primary` = 1
        LEFT JOIN characteristics cl ON cl.id = ccc.class_id
        LEFT JOIN characteristics s ON s.id = ccc.subclass_id
        LEFT JOIN characteristics r ON r.id = ch.race_id
        LEFT JOIN characteristics b ON b.id = ch.background_id
        LEFT JOIN creature_attribute_profs p ON p.creature_id = c.id AND p.attribute_id = 220 -- proficiency
    ORDER BY c.name;

    CALL Encounters_GetList(campaignId, userId);
    CALL Campaign_Settings_Get(campaignId);
END;;

DELIMITER ;

