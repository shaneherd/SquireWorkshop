DROP PROCEDURE IF EXISTS Attributes_Delete_Skill;

DELIMITER ;;
CREATE PROCEDURE Attributes_Delete_Skill(
    IN attributeId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE skillId INT UNSIGNED;
    DECLARE isOwner BIT;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT -1 AS result;
    END;

    START TRANSACTION;

    SELECT id, user_id = userId
    INTO skillId, isOwner
    FROM attributes
    WHERE user_id IN (0, userId) AND id = attributeId;

    IF skillId IS NOT NULL THEN
        CALL Attributes_Delete_Common(skillId, userId);

        IF isOwner THEN
            DELETE FROM attributes_public WHERE attribute_id = attributeId;
            DELETE FROM attributes_private WHERE attribute_id = attributeId;
            UPDATE attributes SET published_parent_id = NULL, published_parent_version = NULL WHERE published_parent_id = attributeId;

            DELETE s FROM skills s JOIN attributes a ON a.id = s.attribute_id WHERE attribute_id = skillId AND user_id = userId;
            DELETE FROM attributes WHERE user_id = userId AND id = skillId;
        ELSE
            DELETE FROM attributes_shared WHERE user_id = userId AND attribute_id = skillId;
        END IF;
    END IF;

    COMMIT;

    SELECT 1 AS result;
END;;

DELIMITER ;

# CALL Attributes_Delete_Skill(265, 1, 0);
