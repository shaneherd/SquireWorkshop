DROP PROCEDURE IF EXISTS Monsters_Delete_MonsterPowers;

DELIMITER ;;
CREATE PROCEDURE Monsters_Delete_MonsterPowers(
    IN monsterId INT UNSIGNED,
    IN userId MEDIUMINT UNSIGNED
)
BEGIN
    DELETE mpp FROM monster_powers_public mpp JOIN monster_powers mp ON mp.id = mpp.monster_power_id JOIN monsters m ON m.id = mp.monster_id WHERE m.user_id = userId AND m.id = monsterId;
    DELETE mpp FROM monster_powers_private mpp JOIN monster_powers mp ON mp.id = mpp.monster_power_id JOIN monsters m ON m.id = mp.monster_id WHERE m.user_id = userId AND m.id = monsterId;
    DELETE ms FROM monster_powers_shared ms JOIN monster_powers mp ON mp.id = ms.monster_power_id JOIN monsters m ON m.id = mp.monster_id WHERE m.user_id = userId AND m.id = monsterId;

    DELETE mf FROM monsters m JOIN monster_powers mp ON mp.monster_id = m.id JOIN monster_features mf ON mf.monster_power_id = mp.id WHERE m.user_id = userId AND m.id = monsterId;
    DELETE mad FROM monsters m JOIN monster_powers mp ON mp.monster_id = m.id JOIN monster_actions ma ON ma.monster_power_id = mp.id JOIN monster_action_damages mad ON mad.monster_action_id = ma.monster_power_id WHERE m.user_id = userId AND m.id = monsterId;
    DELETE ma FROM monsters m JOIN monster_powers mp ON mp.monster_id = m.id JOIN monster_actions ma ON ma.monster_power_id = mp.id WHERE m.user_id = userId AND m.id = monsterId;
    DELETE ml FROM monsters m JOIN monster_powers mp ON mp.monster_id = m.id JOIN monster_power_limited_uses ml ON ml.monster_power_id = mp.id WHERE m.user_id = userId AND m.id = monsterId;
    DELETE mp FROM monsters m JOIN monster_powers mp ON mp.monster_id = m.id WHERE m.user_id = userId AND m.id = monsterId;
END;;

DELIMITER ;

# CALL Monsters_Delete_MonsterPowers(7, 1);


