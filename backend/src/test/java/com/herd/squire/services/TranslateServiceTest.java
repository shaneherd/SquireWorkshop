package com.herd.squire.services;

import com.herd.squire.utilities.SquireProperties;
import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class TranslateServiceTest {
    @Before
    public void setUp() throws Exception {
        SquireProperties.setTesting(true);
    }

    @Test
    public void translateTestKeyOnly() {
        String message = TranslateService.translate("verifyEmailSubject");
        assertEquals("Squire Verify Email", message);
    }

    @Test
    public void translateTestKeyAndParams() {
        String message = TranslateService.translate("forgotUsernameMessage", "testUsername");
        assertEquals("Your username is testUsername", message);
    }
}
