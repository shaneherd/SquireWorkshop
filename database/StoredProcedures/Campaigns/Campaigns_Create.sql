DROP PROCEDURE IF EXISTS Campaigns_Create;

DELIMITER ;;
CREATE PROCEDURE Campaigns_Create(
    IN campaignName VARCHAR(255),
    IN campaignDescription VARCHAR(1000),
    IN inviteToken VARCHAR(36),
    IN createdAt DATETIME,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE campaignId INT UNSIGNED;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT -1 AS id;
    END;

    START TRANSACTION;

    INSERT INTO `campaigns` (`name`, `description`, `user_id`, token, created_at)
    VALUES (campaignName, campaignDescription, userId, inviteToken, createdAt);

    SET campaignId = (SELECT LAST_INSERT_ID());

    COMMIT;

    SELECT campaignId AS id;
END;;

DELIMITER ;

