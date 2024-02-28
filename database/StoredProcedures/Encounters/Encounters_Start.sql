DROP PROCEDURE IF EXISTS Encounters_Start;

DELIMITER ;;
CREATE PROCEDURE Encounters_Start(
    IN encounterId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED,
    IN startedAt TIMESTAMP
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 0 AS valid_request;
    END;

    START TRANSACTION;

    UPDATE encounters SET started_at = startedAt, last_played_at = startedAt, finished_at = NULL, current_round = 1, current_turn = 1 WHERE id = encounterId AND user_id = userId;
    UPDATE encounter_creatures SET removed = 0 WHERE encounter_id = encounterId;

    COMMIT;

    SELECT 1 AS valid_request;
END;;

DELIMITER ;

