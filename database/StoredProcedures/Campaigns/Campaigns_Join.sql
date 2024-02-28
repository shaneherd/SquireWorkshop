DROP PROCEDURE IF EXISTS Campaigns_Join;

DELIMITER ;;
CREATE PROCEDURE Campaigns_Join(
    IN characterId INT UNSIGNED,
    IN campaignToken VARCHAR(36),
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE valid BIT;
    DECLARE campaignId INT UNSIGNED;
    DECLARE campaignAuthorUserName VARCHAR(45);

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 0 AS valid_request;
    END;

    START TRANSACTION;

    SELECT c.id, u.username
    INTO campaignId, campaignAuthorUserName
    FROM campaigns c
        JOIN users u ON u.id = c.user_id
    WHERE token = campaignToken;

    SET valid = (SELECT user_id FROM creatures WHERE id = characterId) = userId AND campaignId IS NOT NULL;

    IF valid THEN
        INSERT INTO campaign_characters (campaign_id, campaign_character_type_id, creature_id, exp) VALUES (campaignId, 1, characterId, 0);
        CALL Creatures_Share_Private (characterId,userId,campaignAuthorUserName);
    END IF;

    COMMIT;

    SELECT valid AS valid_request;
END;;

DELIMITER ;

