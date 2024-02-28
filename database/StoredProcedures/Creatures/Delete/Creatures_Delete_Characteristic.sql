DROP PROCEDURE IF EXISTS Creatures_Delete_Characteristic;

DELIMITER ;;
CREATE PROCEDURE Creatures_Delete_Characteristic(
    IN creatureId INT UNSIGNED,
    IN characteristicId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    CREATE TEMPORARY TABLE IF NOT EXISTS temp_powers
    (
        id INT UNSIGNED NOT NULL,
        power_id INT UNSIGNED NOT NULL
    );

    CREATE TEMPORARY TABLE IF NOT EXISTS temp_powers_2
    (
        power_id INT UNSIGNED NOT NULL
    );

    CREATE TEMPORARY TABLE IF NOT EXISTS temp_actions
    (
        id INT UNSIGNED NOT NULL
    );

    INSERT INTO temp_powers (id, power_id)
    SELECT cp.id, cp.power_id FROM creature_powers cp JOIN creatures c ON c.id = cp.creature_id AND c.id = creatureId AND c.user_id = userId WHERE assigned_characteristic_id = characteristicId;

    DELETE cs FROM creature_spells cs JOIN creature_powers cp ON cs.creature_power_id = cp.id JOIN temp_powers t ON t.id = cp.id;
    DELETE cp FROM creature_powers cp JOIN temp_powers t ON t.id = cp.id;

    INSERT INTO temp_powers_2 (power_id)
    SELECT tp.power_id FROM temp_powers tp WHERE tp.power_id NOT IN (SELECT DISTINCT power_id FROM creature_powers WHERE creature_id = creatureId);

    INSERT INTO temp_actions (id)
    SELECT ca.id FROM creature_actions ca JOIN creature_action_powers cap ON cap.creature_action_id = ca.id WHERE cap.power_id IN (SELECT power_id FROM temp_powers_2);

    DELETE cai FROM chained_action_items cai JOIN temp_actions ta ON ta.id = cai.creature_action_id;
    DELETE cap FROM creature_action_powers cap JOIN temp_actions ta ON ta.id = cap.creature_action_id;
    DELETE ca FROM creature_actions ca JOIN temp_actions ta ON ta.id = ca.id;

    DROP TEMPORARY TABLE IF EXISTS temp_powers;
    DROP TEMPORARY TABLE IF EXISTS temp_powers_2;
    DROP TEMPORARY TABLE IF EXISTS temp_actions;
END;;

DELIMITER ;
