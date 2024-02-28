DROP PROCEDURE IF EXISTS Attributes_Delete_DamageType;

DELIMITER ;;
CREATE PROCEDURE Attributes_Delete_DamageType(
    IN attributeId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DECLARE damageTypeId INT UNSIGNED;
    DECLARE isOwner BIT;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT -1 AS result;
    END;

    START TRANSACTION;

    SELECT id, user_id = userId
    INTO damageTypeId, isOwner
    FROM attributes
    WHERE user_id IN (0, userId) AND id = attributeId;

    IF damageTypeId IS NOT NULL THEN
        DELETE cdm FROM characteristic_damage_modifiers cdm JOIN characteristics c ON c.id = cdm.characteristic_id WHERE damage_type_id = damageTypeId AND user_id = userId;
        DELETE cdm FROM creature_damage_modifiers cdm JOIN creatures c ON c.id = cdm.creature_id WHERE damage_type_id = damageTypeId AND user_id = userId;
        UPDATE item_damages d JOIN items i ON i.id = d.item_id SET damage_type_id = NULL WHERE damage_type_id = damageTypeId AND i.user_id = userId;
        UPDATE monster_action_damages mad JOIN monster_actions ma ON ma.monster_power_id = mad.monster_action_id JOIN monster_powers mp ON mp.id = ma.monster_power_id JOIN creatures c ON c.id = mp.monster_id SET damage_type_id = NULL WHERE damage_type_id = damageTypeId AND c.user_id = userId;
        UPDATE power_damages pd JOIN powers p ON p.id = pd.power_id SET damage_type_id = NULL WHERE damage_type_id = damageTypeId AND p.user_id = userId;
        UPDATE roll_dice_results rdr JOIN roll_results rr ON rr.id = rdr.roll_result_id JOIN rolls r ON r.id = rr.roll_id JOIN creatures c ON c.id = r.creature_id SET damage_type_id = NULL WHERE damage_type_id = damageTypeId AND c.user_id = userId;
        UPDATE encounter_creature_condition_damages d JOIN encounter_creature_conditions cc ON cc.id = d.encounter_creature_condition_id AND d.damage_type_id = damageTypeId JOIN encounter_creatures bc ON bc.id = cc.encounter_creature_id JOIN encounters e ON e.id = bc.encounter_id SET d.damage_type_id = NULL WHERE d.damage_type_id = damageTypeId AND e.user_id = userId;
        CALL Attributes_Delete_Common(damageTypeId, userId);

        IF isOwner THEN
            DELETE FROM attributes_public WHERE attribute_id = attributeId;
            DELETE FROM attributes_private WHERE attribute_id = attributeId;
            UPDATE attributes SET published_parent_id = NULL, published_parent_version = NULL WHERE published_parent_id = attributeId;

            DELETE t FROM damage_types t JOIN attributes a ON a.id = t.attribute_id WHERE attribute_id = damageTypeId AND user_id = userId;
            DELETE FROM attributes WHERE user_id = userId AND id = damageTypeId;
        ELSE
            DELETE FROM attributes_shared WHERE user_id = userId AND attribute_id = damageTypeId;
        END IF;
    END IF;

    COMMIT;

    SELECT 1 AS result;
END;;

DELIMITER ;

