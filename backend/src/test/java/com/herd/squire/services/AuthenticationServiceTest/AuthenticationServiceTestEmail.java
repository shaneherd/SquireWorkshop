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
public class AuthenticationServiceTestEmail extends AuthenticationService {
    @Before
    public void setUp() throws Exception {
        SquireProperties.setTesting(true);
        PowerMockito.mockStatic(UserService.class);
        PowerMockito.mockStatic(EmailService.class);
        PowerMockito.doNothing().when(UserService.class, "createUserVerifyEmail", Mockito.anyString(), Mockito.anyString());
        PowerMockito.doNothing().when(UserService.class, "emailVerified", Mockito.anyString());
        PowerMockito.doNothing().when(UserService.class, "deleteVerifyToken", Mockito.anyString());
        PowerMockito.doNothing().when(EmailService.class, "sendVerificationEmail", Mockito.anyString(), Mockito.anyString());
    }

    /*************** Change Email ***************/

    @Test
    public void changeEmailInvalidUser() {
        int userId = 1;
        String username = "username";
        String password = "password";
        String salt = "salt";
        String hashedPassword = AuthenticationService.getSecurePassword(password, salt);
        String email = "test@gmail.com";
        User user = new User();
        user.setUsername(username);
        user.setSalt(salt);
        user.setPassword(hashedPassword);
        user.setEmailVerified(true);

        try {
            Mockito.when(UserService.getUser(userId)).thenReturn(null);
            AuthenticationService.changeEmail(userId, password, email);
            fail("supposed to throw an exception");
        } catch (Exception e) {
            String message = e.getMessage();
            assertEquals("Invalid user", message);
        }
    }

    @Test
    public void changeEmailInvalidPassword() {
        int userId = 1;
        String username = "username";
        String password = "password";
        String salt = "salt";
        String hashedPassword = AuthenticationService.getSecurePassword(password, salt);
        String email = "test@gmail.com";
        User user = new User();
        user.setUsername(username);
        user.setSalt(salt);
        user.setPassword(hashedPassword);
        user.setEmailVerified(true);

        try {
            Mockito.when(UserService.getUser(userId)).thenReturn(user);
            Mockito.when(UserService.getUser(username)).thenReturn(null);
            AuthenticationService.changeEmail(userId, password, email);
            fail("supposed to throw an exception");
        } catch (Exception e) {
            String message = e.getMessage();
            assertEquals("Invalid Password", message);
        }
    }

    @Test
    public void changeEmailSuccess() {
        int userId = 1;
        String username = "username";
        String password = "password";
        String salt = "salt";
        String hashedPassword = AuthenticationService.getSecurePassword(password, salt);
        String email = "test@gmail.com";
        User user = new User();
        user.setUsername(username);
        user.setSalt(salt);
        user.setPassword(hashedPassword);
        user.setEmailVerified(true);

        try {
            Mockito.when(UserService.getUser(userId)).thenReturn(user);
            Mockito.when(UserService.getUser(username)).thenReturn(user);
            AuthenticationService.changeEmail(userId, password, email);
        } catch (Exception e) {
            fail("not supposed to throw an exception");
        }
    }

    /****************** Verify Email **************/

    @Test
    public void verifyEmailSuccess() {
        String username = "username";
        String password = "password";
        String salt = "salt";
        String hashedPassword = AuthenticationService.getSecurePassword(password, salt);
        String email = "test@gmail.com";
        String verifyToken = getToken(email, salt);
        User user = new User();
        user.setUsername(username);
        user.setSalt(salt);
        user.setPassword(hashedPassword);
        user.setEmail(email);

        try {
            Mockito.when(UserService.getUsernameByVerifyToken(verifyToken)).thenReturn(username);
            Mockito.when(UserService.getUser(username)).thenReturn(user);
            String verifiedUsername = AuthenticationService.verifyUserEmail(verifyToken);
            assertEquals(username, verifiedUsername);
        } catch (Exception e) {
            fail("not supposed to throw an exception");
        }
    }

    @Test
    public void verifyEmailInvalidToken() {
        String username = "username";
        String password = "password";
        String salt = "salt";
        String hashedPassword = AuthenticationService.getSecurePassword(password, salt);
        String email = "test@gmail.com";
        String verifyToken = getToken(email, salt);
        User user = new User();
        user.setUsername(username);
        user.setSalt(salt);
        user.setPassword(hashedPassword);
        user.setEmail(email);

        try {
            Mockito.when(UserService.getUsernameByVerifyToken(verifyToken)).thenReturn("");
            Mockito.when(UserService.getUser(username)).thenReturn(user);
            AuthenticationService.verifyUserEmail(verifyToken);
            fail("supposed to throw an exception");
        } catch (Exception e) {
            String message = e.getMessage();
            assertEquals("Invalid Token", message);
        }
    }

    @Test
    public void verifyEmailFailedToFindUser() {
        String username = "username";
        String password = "password";
        String salt = "salt";
        String hashedPassword = AuthenticationService.getSecurePassword(password, salt);
        String email = "test@gmail.com";
        String verifyToken = getToken(email, salt);
        User user = new User();
        user.setUsername(username);
        user.setSalt(salt);
        user.setPassword(hashedPassword);
        user.setEmail(email);

        try {
            Mockito.when(UserService.getUsernameByVerifyToken(verifyToken)).thenReturn(username);
            Mockito.when(UserService.getUser(username)).thenReturn(null);
            AuthenticationService.verifyUserEmail(verifyToken);
            fail("supposed to throw an exception");
        } catch (Exception e) {
            String message = e.getMessage();
            assertEquals("Failed to find user", message);
        }
    }

    @Test
    public void verifyEmailUnexpectedToken() {
        String username = "username";
        String password = "password";
        String salt = "salt";
        String hashedPassword = AuthenticationService.getSecurePassword(password, salt);
        String email = "test@gmail.com";
        String verifyToken = getToken(email, salt) + "changed";
        User user = new User();
        user.setUsername(username);
        user.setSalt(salt);
        user.setPassword(hashedPassword);
        user.setEmail(email);

        try {
            Mockito.when(UserService.getUsernameByVerifyToken(verifyToken)).thenReturn(username);
            Mockito.when(UserService.getUser(username)).thenReturn(user);
            AuthenticationService.verifyUserEmail(verifyToken);
            fail("supposed to throw an exception");
        } catch (Exception e) {
            String message = e.getMessage();
            assertEquals("Invalid Token", message);
        }
    }
}
