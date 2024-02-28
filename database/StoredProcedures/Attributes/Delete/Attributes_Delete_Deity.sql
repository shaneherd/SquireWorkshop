DROP PROCEDURE IF EXISTS Attributes_Delete_Deity;

DELIMITER ;;
CREATE PROCEDURE Attributes_Delete_Deity(
    IN attributeId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE deityId INT UNSIGNED;
    DECLARE isOwner BIT;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT -1 AS result;
    END;

    START TRANSACTION;

    SELECT id, user_id = userId
    INTO deityId, isOwner
    FROM attributes
    WHERE user_id IN (0, userId) AND id = attributeId;

    IF deityId IS NOT NULL THEN
        UPDATE characters ch JOIN creatures c ON c.id = ch.creature_id SET deity_id = NULL WHERE deity_id = deityId AND c.user_id = userId;
        CALL Attributes_Delete_Common(deityId, userId);

        IF isOwner THEN
            DELETE FROM attributes_public WHERE attribute_id = attributeId;
            DELETE FROM attributes_private WHERE attribute_id = attributeId;
            UPDATE attributes SET published_parent_id = NULL, published_parent_version = NULL WHERE published_parent_id = attributeId;

            DELETE d FROM deities d JOIN attributes a ON a.id = d.attribute_id WHERE attribute_id = deityId AND user_id = userId;
            DELETE FROM attributes WHERE user_id = userId AND id = deityId;
        ELSE
            DELETE FROM attributes_shared WHERE user_id = userId AND attribute_id = deityId;
        END IF;
    END IF;

    COMMIT;

    SELECT 1 AS result;
END;;

DELIMITER ;

# CALL Attributes_Delete_Deity(265, 1, 0);
