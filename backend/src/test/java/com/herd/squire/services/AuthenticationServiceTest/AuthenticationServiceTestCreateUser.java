package com.herd.squire.services.AuthenticationServiceTest;

import com.herd.squire.services.AuthenticationService;
import com.herd.squire.services.EmailService;
import com.herd.squire.services.UserService;
import com.herd.squire.utilities.SquireProperties;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.powermock.api.mockito.PowerMockito;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.modules.junit4.PowerMockRunner;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.fail;
import static org.mockito.Matchers.eq;

@RunWith(PowerMockRunner.class)
@PrepareForTest({UserService.class, EmailService.class})
public class AuthenticationServiceTestCreateUser extends AuthenticationService {
    @Before
    public void setUp() {
        SquireProperties.setTesting(true);
    }

    @Test
    public void createUserSuccess() {
        String username = "username";
        String password = "Password123";
        String email = "test@gmail.com";
        int expectedUserId = 1;

        PowerMockito.mockStatic(UserService.class);
        PowerMockito.mockStatic(EmailService.class);
        try {
            Mockito.when(UserService.createUser(eq(username), Mockito.anyString(), Mockito.anyString(), eq(email))).thenReturn(expectedUserId);
            PowerMockito.doNothing().when(UserService.class, "createUserVerifyEmail", Mockito.anyString(), Mockito.anyString());
            PowerMockito.doNothing().when(EmailService.class, "sendVerificationEmail", Mockito.anyString(), Mockito.anyString());
            int userId = AuthenticationService.createUser(username, password, email);
            assertEquals(expectedUserId, userId);
        } catch (Exception e) {
            fail("not supposed to throw an exception");
        }
    }

    @Test
    public void createUserFailed() {
        String username = "username";
        String password = "Password123";
        String email = "test@gmail.com";
        int expectedUserId = -1;

        PowerMockito.mockStatic(UserService.class);
        PowerMockito.mockStatic(EmailService.class);
        try {
            Mockito.when(UserService.createUser(eq(username), Mockito.anyString(), Mockito.anyString(), eq(email))).thenReturn(expectedUserId);
            PowerMockito.doNothing().when(UserService.class, "createUserVerifyEmail", Mockito.anyString(), Mockito.anyString());
            PowerMockito.doNothing().when(EmailService.class, "sendVerificationEmail", Mockito.anyString(), Mockito.anyString());
            AuthenticationService.createUser(username, password, email);
            fail("supposed to throw an exception");
        } catch (Exception e) {
            String message = e.getMessage();
            assertEquals("Failed to create user", message);
        }
    }
}
