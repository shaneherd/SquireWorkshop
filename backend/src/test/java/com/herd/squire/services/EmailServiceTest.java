package com.herd.squire.services;

import com.herd.squire.utilities.SquireProperties;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.powermock.api.mockito.PowerMockito;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.modules.junit4.PowerMockRunner;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Transport;

import static org.junit.Assert.fail;

@RunWith(PowerMockRunner.class)
@PrepareForTest({EmailService.class, Transport.class})
public class EmailServiceTest {
    @Before
    public void setUp() throws Exception {
        SquireProperties.setTesting(true);
        PowerMockito.mockStatic(Transport.class);
        PowerMockito.doNothing().when(Transport.class, "send", (Message) Mockito.any());
    }

    @Test
    public void sendForgotUsernameEmail() {
        try {
            EmailService.sendForgotUsernameEmail("ssherds@gmail.com", "token");
        } catch (MessagingException e) {
            fail("not supposed to throw an exception");
        }
    }

    @Test
    public void sendForgotPasswordEmail() {
        try {
            EmailService.sendForgotPasswordEmail("ssherds@gmail.com", "token");
        } catch (MessagingException e) {
            fail("not supposed to throw an exception");
        }
    }

    @Test
    public void sendAccountLockedEmail() {
        try {
            EmailService.sendAccountLockedEmail("ssherds@gmail.com", "token");
        } catch (MessagingException e) {
            fail("not supposed to throw an exception");
        }
    }
}