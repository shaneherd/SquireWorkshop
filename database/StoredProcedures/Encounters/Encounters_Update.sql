DROP PROCEDURE IF EXISTS Encounters_Update;

DELIMITER ;;
CREATE PROCEDURE Encounters_Update(
    IN encounterId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED,
    IN encounterName VARCHAR(50),
    IN encounterDescription VARCHAR(255),
    IN customSort BIT,
    IN hideKilled BIT
)
BEGIN
    DECLARE valid BIT;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 0 AS valid_request;
    END;

    START TRANSACTION;

    SET valid = (SELECT user_id FROM encounters WHERE id = encounterId) = userId;

    IF valid THEN
        UPDATE encounters
        SET name = encounterName, description = encounterDescription, custom_sort = customSort, hide_killed = hideKilled
        WHERE id = encounterId;
    END IF;

    COMMIT;

    SELECT valid AS valid_request;
END;;

DELIMITER ;

