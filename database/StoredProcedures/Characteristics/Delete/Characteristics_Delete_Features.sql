DROP PROCEDURE IF EXISTS Characteristics_Delete_Features;

DELIMITER ;;
CREATE PROCEDURE Characteristics_Delete_Features(
    IN characteristicId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DELETE cvip FROM character_validation_ignored_powers cvip JOIN creatures c ON c.id = cvip.character_id JOIN features f ON f.power_id = cvip.power_id WHERE f.characteristic_id = characteristicId AND c.user_id = userId;
    DELETE cpt FROM creature_power_tags cpt JOIN creatures c ON c.id = cpt.creature_id JOIN features f ON f.power_id = cpt.power_id WHERE f.characteristic_id = characteristicId AND c.user_id = userId;
    DELETE cp FROM creature_powers cp JOIN creatures c ON c.id = cp.creature_id JOIN features f ON f.power_id = cp.power_id WHERE f.characteristic_id = characteristicId AND c.user_id = userId;
    DELETE pd FROM power_damages pd JOIN powers p ON p.id = pd.power_id JOIN features f ON f.power_id = p.id WHERE f.characteristic_id = characteristicId AND p.user_id = userId;
    DELETE pl FROM power_limited_uses pl JOIN powers p ON p.id = pl.power_id JOIN features f ON f.power_id = p.id WHERE f.characteristic_id = characteristicId AND p.user_id = userId;
    DELETE pm FROM power_modifiers pm JOIN powers p ON p.id = pm.power_id JOIN features f ON f.power_id = p.id WHERE f.characteristic_id = characteristicId AND p.user_id = userId;

    CREATE TEMPORARY TABLE IF NOT EXISTS temp_creature_actions
    (
        id INT UNSIGNED NOT NULL
    );

    INSERT INTO temp_creature_actions
    SELECT ca.id
    FROM creature_action_powers cap
        JOIN features f ON f.power_id = cap.power_id
        JOIN creature_actions ca ON ca.id = cap.creature_action_id
        JOIN creatures c ON c.id = ca.creature_id
    WHERE f.characteristic_id = characteristicId AND c.user_id = userId;

    DELETE cai FROM chained_action_items cai JOIN temp_creature_actions tca ON tca.id = cai.creature_action_id;
    DELETE cap FROM creature_action_powers cap JOIN temp_creature_actions tca ON tca.id = cap.creature_action_id;
    DELETE ca FROM creature_actions ca JOIN temp_creature_actions tca ON tca.id = ca.id;

    DROP TEMPORARY TABLE IF EXISTS temp_creature_actions;

    CREATE TEMPORARY TABLE IF NOT EXISTS temp_feature_ids
    (
        id INT UNSIGNED NOT NULL
    );

    INSERT INTO temp_feature_ids
    SELECT id
    FROM powers p
        JOIN features f ON f.power_id = p.id
    WHERE f.characteristic_id = characteristicId AND user_id = userId;

    UPDATE powers p SET published_parent_id = NULL, published_parent_version = NULL WHERE published_parent_id IN (SELECT id FROM temp_feature_ids);

    DELETE pp FROM powers_public pp JOIN temp_feature_ids p ON p.id = pp.power_id;
    DELETE pp FROM powers_public pp JOIN features f ON f.power_id = pp.power_id AND f.characteristic_id = characteristicId JOIN powers p ON p.id = pp.power_id AND p.user_id = userId;
    DELETE pp FROM powers_private pp JOIN temp_feature_ids p ON p.id = pp.power_id;
    DELETE pp FROM powers_private pp JOIN features f ON f.power_id = pp.power_id AND f.characteristic_id = characteristicId JOIN powers p ON p.id = pp.power_id AND p.user_id = userId;

    DELETE f FROM features f JOIN temp_feature_ids t ON t.id = f.power_id;
    DELETE p FROM powers p JOIN temp_feature_ids t ON t.id = p.id;
    DELETE ps FROM powers_shared ps JOIN temp_feature_ids t ON t.id = ps.power_id WHERE ps.user_id = userId;

    DROP TEMPORARY TABLE IF EXISTS temp_feature_ids;

END;;

DELIMITER ;

# CALL Characteristics_Delete_Features(53,1);
