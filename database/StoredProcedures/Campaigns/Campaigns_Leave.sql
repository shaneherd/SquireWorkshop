DROP PROCEDURE IF EXISTS Campaigns_Leave;

DELIMITER ;;
CREATE PROCEDURE Campaigns_Leave(
    IN characterId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE valid BIT;
    DECLARE campaignId INT UNSIGNED;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 0 AS count_creatures;
        SELECT 0 AS valid_request;
    END;

    START TRANSACTION;

    SELECT c.id, cr.user_id = userId
    INTO campaignId, valid
    FROM campaigns c
         JOIN campaign_characters cc ON cc.campaign_id = c.id
         JOIN creatures cr ON cr.id = cc.creature_id
    WHERE cc.creature_id = characterId;

    IF valid THEN
        CALL Campaigns_RemoveCreature (campaignId, characterId,userId);
    END IF;

    COMMIT;

    SELECT valid AS valid_request;
END;;

DELIMITER ;

