DROP PROCEDURE IF EXISTS Powers_Delete_Feature;

DELIMITER ;;
CREATE PROCEDURE Powers_Delete_Feature(
    IN powerId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE characteristicId INT UNSIGNED;
    DECLARE featureId INT UNSIGNED;
    DECLARE isOwner BIT;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT -1 AS result;
    END;

    START TRANSACTION;

    SELECT id, user_id = userId, f.characteristic_id
    INTO featureId, isOwner, characteristicId
    FROM powers p
    JOIN features f ON f.power_id = p.id
    WHERE user_id IN (0, userId) AND id = powerId;

    IF featureId IS NOT NULL THEN
        CALL Powers_Delete_Common(featureId, userId);

        IF isOwner THEN
            DELETE FROM powers_public WHERE power_id = powerId;
            DELETE FROM powers_private WHERE power_id = powerId;
            UPDATE powers SET published_parent_id = NULL, published_parent_version = NULL WHERE published_parent_id = powerId;

            DELETE f FROM features f JOIN powers p ON p.id = f.power_id WHERE power_id = featureId AND p.user_id = userId;
            DELETE FROM powers WHERE user_id = userId AND id = featureId;
        ELSE
            DELETE FROM powers_shared WHERE user_id = userId AND power_id = featureId;
        END IF;

        IF characteristicId IS NOT NULL THEN
            UPDATE characteristics SET version = version + 1 WHERE user_id = userId AND id = characteristicId;
        END IF;
    END IF;

    COMMIT;

    SELECT 1 AS result;
END;;

DELIMITER ;

# CALL Powers_Delete_Feature(265, 1, 0);
