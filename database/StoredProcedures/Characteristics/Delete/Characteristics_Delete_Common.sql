DROP PROCEDURE IF EXISTS Characteristics_Delete_Common;

DELIMITER ;;
CREATE PROCEDURE Characteristics_Delete_Common(
    IN characteristicId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DELETE ccs FROM character_characteristic_spellcasting ccs JOIN creatures c ON c.id = ccs.character_id WHERE characteristic_id = characteristicId AND c.user_id = userId;
    DELETE cv FROM character_validation cv JOIN creatures c ON c.id = cv.character_id WHERE characteristic_id = characteristicId AND c.user_id = userId;

    CALL Characteristics_Delete_Features(characteristicId, userId);

    DELETE cam FROM characteristic_attribute_modifiers cam JOIN characteristics c ON c.id = cam.characteristic_id WHERE characteristic_id = characteristicId AND c.user_id = userId;
    DELETE cap FROM characteristic_attribute_profs cap JOIN characteristics c ON c.id = cap.characteristic_id WHERE characteristic_id = characteristicId AND c.user_id = userId;
    DELETE ccp FROM characteristic_choice_profs ccp JOIN characteristics c ON c.id = ccp.characteristic_id WHERE characteristic_id = characteristicId AND c.user_id = userId;
    DELETE cci FROM characteristic_condition_immunities cci JOIN characteristics c ON c.id = cci.characteristic_id WHERE characteristic_id = characteristicId AND c.user_id = userId;
    DELETE cdm FROM characteristic_damage_modifiers cdm JOIN characteristics c ON c.id = cdm.characteristic_id WHERE characteristic_id = characteristicId AND c.user_id = userId;
    DELETE cip FROM characteristic_item_profs cip JOIN characteristics c ON c.id = cip.characteristic_id WHERE characteristic_id = characteristicId AND c.user_id = userId;
    DELETE cs FROM characteristic_senses cs JOIN characteristics c ON c.id = cs.characteristic_id WHERE characteristic_id = characteristicId AND c.user_id = userId;
    DELETE csc FROM characteristic_spell_configurations csc JOIN characteristics c ON c.id = csc.characteristic_id WHERE characteristic_id = characteristicId AND (c.user_id = userId OR csc.user_id = userId);
    DELETE cse FROM characteristic_starting_equipments cse JOIN characteristics c ON c.id = cse.characteristic_id WHERE characteristic_id = characteristicId AND c.user_id = userId;
    DELETE cs FROM creatures c JOIN creature_powers cp ON cp.creature_id = c.id JOIN creature_spells cs ON cs.creature_power_id = cp.id WHERE cp.assigned_characteristic_id = characteristicId AND c.user_id = userId;
    DELETE cp FROM creature_powers cp JOIN creatures c ON c.id = cp.creature_id WHERE assigned_characteristic_id = characteristicId AND c.user_id = userId;
    UPDATE characteristics SET parent_characteristic_id = NULL WHERE parent_characteristic_id = characteristicId AND user_id = userId;
END;;

DELIMITER ;

# CALL Characteristics_Delete_Common(49, 1);

