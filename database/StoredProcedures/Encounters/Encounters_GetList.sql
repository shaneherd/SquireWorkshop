DROP PROCEDURE IF EXISTS Encounters_GetList;

DELIMITER ;;
CREATE PROCEDURE Encounters_GetList(
    IN campaignId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE validatedId INT UNSIGNED;

    SET validatedId = (SELECT id FROM campaigns WHERE user_id = userId AND id = campaignId);

    SELECT id, name, description, started_at, last_played_at, finished_at
    FROM encounters
    WHERE campaign_id = validatedId AND user_id = userId
    ORDER BY last_played_at desc, name;
END;;

DELIMITER ;

