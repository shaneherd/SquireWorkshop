DROP PROCEDURE IF EXISTS Powers_Delete_Common;

DELIMITER ;;
CREATE PROCEDURE Powers_Delete_Common(
    IN powerId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DELETE cvip FROM character_validation_ignored_powers cvip JOIN creatures c ON c.id = cvip.character_id WHERE power_id = powerId AND c.user_id = userId;
    DELETE cpt FROM creature_power_tags cpt JOIN creatures c ON c.id = cpt.creature_id WHERE cpt.power_id = powerId AND c.user_id = userId;
    DELETE cp FROM creature_powers cp JOIN creatures c ON c.id = cp.creature_id WHERE cp.power_id = powerId AND c.user_id = userId;
    DELETE pd FROM power_damages pd JOIN powers p ON p.id = pd.power_id WHERE pd.power_id = powerId AND p.user_id = userId;
    DELETE pl FROM power_limited_uses pl JOIN powers p ON p.id = pl.power_id WHERE pl.power_id = powerId AND p.user_id = userId;
    DELETE pm FROM power_modifiers pm JOIN powers p ON p.id = pm.power_id WHERE pm.power_id = powerId AND p.user_id = userId;

    CREATE TEMPORARY TABLE IF NOT EXISTS temp_creature_actions
    (
        id INT UNSIGNED NOT NULL
    );

    INSERT INTO temp_creature_actions
    SELECT ca.id
    FROM creature_action_powers cap JOIN creature_actions ca ON ca.id = cap.creature_action_id JOIN creatures c ON c.id = ca.creature_id WHERE power_id = powerId AND c.user_id = userId;

    DELETE cai FROM chained_action_items cai JOIN temp_creature_actions tca ON tca.id = cai.creature_action_id;
    DELETE cap FROM creature_action_powers cap JOIN temp_creature_actions tca ON tca.id = cap.creature_action_id;
    DELETE ca FROM creature_actions ca JOIN temp_creature_actions tca ON tca.id = ca.id;

    DROP TEMPORARY TABLE IF EXISTS temp_creature_actions;
END;;

DELIMITER ;

# CALL Powers_Delete_Feature(265, 1, 0);
