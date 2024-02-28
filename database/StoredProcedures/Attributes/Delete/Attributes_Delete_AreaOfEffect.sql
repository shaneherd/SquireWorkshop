DROP PROCEDURE IF EXISTS Attributes_Delete_AreaOfEffect;

DELIMITER ;;
CREATE PROCEDURE Attributes_Delete_AreaOfEffect(
    IN attributeId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE areaOfEffectId INT UNSIGNED;
    DECLARE isOwner BIT;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT -1 AS result;
    END;

    START TRANSACTION;

    SELECT id, user_id = userId
    INTO areaOfEffectId, isOwner
    FROM attributes
    WHERE user_id IN (0, userId) AND id = attributeId;

    IF areaOfEffectId IS NOT NULL THEN
        UPDATE powers SET area_of_effect_id = NULL WHERE area_of_effect_id = areaOfEffectId AND user_id = userId;
        CALL Attributes_Delete_Common(areaOfEffectId, userId);

        IF isOwner THEN
            DELETE FROM attributes_public WHERE attribute_id = attributeId;
            DELETE FROM attributes_private WHERE attribute_id = attributeId;
            UPDATE attributes SET published_parent_id = NULL, published_parent_version = NULL WHERE published_parent_id = attributeId;

            DELETE aoe FROM area_of_effects aoe JOIN attributes a ON a.id = aoe.attribute_id WHERE attribute_id = areaOfEffectId AND user_id = userId;
            DELETE FROM attributes WHERE user_id = userId AND id = areaOfEffectId;
        ELSE
            DELETE FROM attributes_shared WHERE user_id = userId AND attribute_id = areaOfEffectId;
        END IF;
    END IF;

    COMMIT;

    SELECT 1 AS result;
END;;

DELIMITER ;

# CALL Attributes_Delete_AreaOfEffect(265, 1, 0);
