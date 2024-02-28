DROP PROCEDURE IF EXISTS Encounters_Create;

DELIMITER ;;
CREATE PROCEDURE Encounters_Create(
    IN campaignId INT UNSIGNED,
    IN encounterName VARCHAR(50),
    IN encounterDescription VARCHAR(255),
    IN customSort BIT,
    IN hideKilled BIT,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE valid BIT;
    DECLARE encounterId INT UNSIGNED;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT -1 AS id;
    END;

    START TRANSACTION;

    SET valid = (SELECT user_id FROM campaigns WHERE id = campaignId) = userId;

    IF valid THEN
        INSERT INTO encounters (campaign_id, name, description, user_id, custom_sort, hide_killed)
        VALUES (campaignId, encounterName, encounterDescription, userId, customSort, hideKilled);

        SET encounterId = (SELECT LAST_INSERT_ID());
    ELSE
        SET encounterId = -1;
    END IF;

    COMMIT;

    SELECT encounterId AS id;
END;;

DELIMITER ;

