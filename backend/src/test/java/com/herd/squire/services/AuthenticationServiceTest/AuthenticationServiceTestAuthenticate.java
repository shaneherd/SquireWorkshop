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
public class AuthenticationServiceTestAuthenticate {
    @Before
    public void setUp() {
        SquireProperties.setTesting(true);
    }

    @Test
    public void authenticateNull() {
        String username = "username";
        PowerMockito.mockStatic(UserService.class);
        try {
            Mockito.when(UserService.getUser(username)).thenReturn(null);
            AuthenticationService.authenticate(username, "password");
            fail("supposed to throw an exception");
        } catch (Exception e) {
            String message = e.getMessage();
            assertEquals("Invalid Username or Password", message);
        }
    }

    @Test
    public void authenticateLocked() {
        String username = "username";
        User user = new User();
        user.setLocked(true);

        PowerMockito.mockStatic(UserService.class);
        try {
            Mockito.when(UserService.getUser(username)).thenReturn(user);
            AuthenticationService.authenticate(username, "password");
            fail("supposed to throw an exception");
        } catch (Exception e) {
            String message = e.getMessage();
            assertEquals("Account locked", message);
        }
    }

    @Test
    public void authenticateNotVerified() {
        String username = "username";
        User user = new User();
        user.setEmailVerified(false);

        PowerMockito.mockStatic(UserService.class);
        try {
            Mockito.when(UserService.getUser(username)).thenReturn(user);
            AuthenticationService.authenticate(username, "password");
            fail("supposed to throw an exception");
        } catch (Exception e) {
            String message = e.getMessage();
            assertEquals("Email not validated", message);
        }
    }

    @Test
    public void authenticateInvalidPassword() {
        String username = "username";
        String password = "password";
        String salt = "salt";
        String hashedPassword = AuthenticationService.getSecurePassword(password, salt);
        User user = new User();
        user.setUsername(username);
        user.setSalt(salt);
        user.setPassword(hashedPassword);
        user.setEmailVerified(true);

        PowerMockito.mockStatic(UserService.class);
        try {
            Mockito.when(UserService.getUser(username)).thenReturn(user);
            AuthenticationService.authenticate(username, password + "changed");
            fail("supposed to throw an exception");
        } catch (Exception e) {
            String message = e.getMessage();
            assertEquals("Invalid Username or Password", message);
        }
    }

    @Test
    public void authenticateLockAccount() {
        String username = "username";
        String password = "password";
        String salt = "salt";
        String hashedPassword = AuthenticationService.getSecurePassword(password, salt);
        User user = new User();
        user.setUsername(username);
        user.setSalt(salt);
        user.setPassword(hashedPassword);
        user.setEmailVerified(true);
        user.setNumFailedLogins(AuthenticationService.LOCKOUT_LOGIN_THRESHOLD - 1);

        PowerMockito.mockStatic(UserService.class);
        PowerMockito.mockStatic(EmailService.class);
        try {
            Mockito.when(UserService.getUser(username)).thenReturn(user);
            PowerMockito.doNothing().when(UserService.class, "lockAccount", Mockito.anyString());
            PowerMockito.doNothing().when(UserService.class, "createUserUnlockAccount", Mockito.anyString(), Mockito.anyString());
            PowerMockito.doNothing().when(EmailService.class, "sendAccountLockedEmail", Mockito.anyString(), Mockito.anyString());

            AuthenticationService.authenticate(username, password + "changed");
            fail("supposed to throw an exception");
        } catch (Exception e) {
            String message = e.getMessage();
            assertEquals("Account locked", message);
        }
    }

    @Test
    public void authenticateValid() {
        String username = "username";
        String password = "password";
        String salt = "salt";
        String hashedPassword = AuthenticationService.getSecurePassword(password, salt);
        User user = new User();
        user.setUsername(username);
        user.setSalt(salt);
        user.setPassword(hashedPassword);
        user.setEmailVerified(true);

        PowerMockito.mockStatic(UserService.class);
        try {
            Mockito.when(UserService.getUser(username)).thenReturn(user);
            User authenticatedUser = AuthenticationService.authenticate(username, password);
            assertEquals(authenticatedUser.getUsername(), username);
        } catch (Exception e) {
            fail("not supposed to throw an exception");
        }
    }
}
