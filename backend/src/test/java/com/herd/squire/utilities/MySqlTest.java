package com.herd.squire.utilities;

import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.fail;

public class MySqlTest {

    @Test
    public void encodeAndDecode() {
        long id = 202;
        int userId = 1;
        try {
            String encodedId = MySql.encodeId(id, userId);
            long decodedId = MySql.decodeId(encodedId, userId);
            assertEquals(id, decodedId);
        } catch (Exception e) {
            fail();
        }
    }
}