package com.herd.squire.services.AuthenticationServiceTest;

import com.herd.squire.models.user.User;
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

@RunWith(PowerMockRunner.class)
@PrepareForTest({UserService.class, EmailService.class})
public class AuthenticationServiceTestUnlockAccount {
    @Before
    public void setUp() {
        SquireProperties.setTesting(true);
    }

    @Test
    public void unlockInvalidToken() {
        String unlockToken = "unlockToken";

        PowerMockito.mockStatic(UserService.class);
        try {
            Mockito.when(UserService.getUsernameByUnlockToken(unlockToken)).thenReturn("");
            AuthenticationService.unlockAccount(unlockToken);
            fail("supposed to throw an exception");
        } catch (Exception e) {
            String message = e.getMessage();
            assertEquals("Invalid Token", message);
        }
    }

    @Test
    public void unlockFailedToFindUser() {
        String unlockToken = "unlockToken";
        String username = "username";
        User user = null;

        PowerMockito.mockStatic(UserService.class);
        try {
            Mockito.when(UserService.getUsernameByUnlockToken(unlockToken)).thenReturn(username);
            Mockito.when(UserService.getUser(username)).thenReturn(user);
            AuthenticationService.unlockAccount(unlockToken);
            fail("supposed to throw an exception");
        } catch (Exception e) {
            String message = e.getMessage();
            assertEquals("Failed to find user", message);
        }
    }

    @Test
    public void unlockUnexpectedToken() {
        String username = "username";
        String email = "test@gmail.com";
        String salt = "salt";
        String unlockToken = AuthenticationService.getSecurePassword(email, salt);
        if (unlockToken.length() > 45) {
            unlockToken = unlockToken.substring(0, 45);
        }
        unlockToken += "changed";
        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setSalt(salt);

        PowerMockito.mockStatic(UserService.class);
        try {
            Mockito.when(UserService.getUsernameByUnlockToken(unlockToken)).thenReturn(username);
            Mockito.when(UserService.getUser(username)).thenReturn(user);
            AuthenticationService.unlockAccount(unlockToken);
            fail("supposed to throw an exception");
        } catch (Exception e) {
            String message = e.getMessage();
            assertEquals("Invalid Token", message);
        }
    }

    @Test
    public void unlockAccountValid() {
        String username = "username";
        String email = "test@gmail.com";
        String salt = "salt";
        String unlockToken = AuthenticationService.getSecurePassword(email, salt);
        if (unlockToken.length() > 45) {
            unlockToken = unlockToken.substring(0, 45);
        }
        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setSalt(salt);

        PowerMockito.mockStatic(UserService.class);
        try {
            Mockito.when(UserService.getUsernameByUnlockToken(unlockToken)).thenReturn(username);
            Mockito.when(UserService.getUser(username)).thenReturn(user);
            PowerMockito.doNothing().when(UserService.class, "unlockAccount", Mockito.anyString());
            PowerMockito.doNothing().when(UserService.class, "deleteUnlockToken", Mockito.anyString());
            String unlockedUsername = AuthenticationService.unlockAccount(unlockToken);
            assertEquals(username, unlockedUsername);
        } catch (Exception e) {
            fail("not supposed to throw an exception");
        }
    }
}
