DROP PROCEDURE IF EXISTS Attributes_Delete_Condition;

DELIMITER ;;
CREATE PROCEDURE Attributes_Delete_Condition(
    IN attributeId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE conditionId INT UNSIGNED;
    DECLARE isOwner BIT;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT -1 AS result;
    END;

    START TRANSACTION;

    SELECT id, user_id = userId
    INTO conditionId, isOwner
    FROM attributes
    WHERE user_id IN (0, userId) AND id = attributeId;

    IF conditionId IS NOT NULL THEN
        DELETE cci FROM characteristic_condition_immunities cci JOIN characteristics c ON c.id = cci.characteristic_id WHERE condition_id = conditionId AND user_id = userId;
        DELETE cci FROM creature_condition_immunities cci JOIN creatures c ON c.id = cci.creature_id WHERE condition_id = conditionId AND user_id = userId;
        DELETE cc FROM creature_conditions cc JOIN creatures c ON c.id = cc.creature_id WHERE condition_id = conditionId AND user_id = userId;
        DELETE cc FROM connecting_conditions cc JOIN attributes a ON a.id = cc.parent_condition_id WHERE child_condition_id = conditionId AND user_id = userId;
        DELETE cc FROM connecting_conditions cc JOIN attributes a ON a.id = cc.parent_condition_id WHERE parent_condition_id = conditionId AND user_id = userId;
        DELETE d FROM encounter_creature_condition_damages d JOIN encounter_creature_conditions cc ON cc.id = d.encounter_creature_condition_id JOIN attributes a ON a.id = cc.condition_id WHERE condition_id = conditionId AND user_id = userId;
        DELETE cc FROM encounter_creature_conditions cc JOIN attributes a ON a.id = cc.condition_id WHERE condition_id = conditionId AND user_id = userId;
        CALL Attributes_Delete_Common(conditionId, userId);

        IF isOwner THEN
            DELETE FROM attributes_public WHERE attribute_id = attributeId;
            DELETE FROM attributes_private WHERE attribute_id = attributeId;
            UPDATE attributes SET published_parent_id = NULL, published_parent_version = NULL WHERE published_parent_id = attributeId;

            DELETE c FROM conditions c JOIN attributes a ON a.id = c.attribute_id WHERE attribute_id = conditionId AND user_id = userId;
            DELETE FROM attributes WHERE user_id = userId AND id = conditionId;
        ELSE
            DELETE FROM attributes_shared WHERE user_id = userId AND attribute_id = conditionId;
        END IF;
    END IF;

    COMMIT;

    SELECT 1 AS result;
END;;

DELIMITER ;

