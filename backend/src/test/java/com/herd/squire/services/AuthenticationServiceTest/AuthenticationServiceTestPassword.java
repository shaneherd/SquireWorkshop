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

import static org.junit.Assert.*;

@RunWith(PowerMockRunner.class)
@PrepareForTest({UserService.class, EmailService.class})
public class AuthenticationServiceTestPassword extends AuthenticationService {
    @Before
    public void setUp() throws Exception {
        SquireProperties.setTesting(true);
        PowerMockito.mockStatic(UserService.class);
        PowerMockito.doNothing().when(UserService.class, "changePassword", Mockito.anyString(), Mockito.anyString());
        PowerMockito.doNothing().when(UserService.class, "createResetPasswordRequest", Mockito.anyString(), Mockito.anyString());
        PowerMockito.doNothing().when(UserService.class, "deleteResetToken", Mockito.anyString());

        PowerMockito.mockStatic(EmailService.class);
        PowerMockito.doNothing().when(EmailService.class, "sendForgotUsernameEmail", Mockito.anyString(), Mockito.anyString());
        PowerMockito.doNothing().when(EmailService.class, "sendForgotPasswordEmail", Mockito.anyString(), Mockito.anyString());
    }

    /************ Change Password *************/

    @Test
    public void changePasswordSuccess() {
        String username = "username";
        String originalPassword = "originalPassword";
        String newPassword = "newPassword123";
        String salt = "salt";
        String hashedOriginalPassword = AuthenticationService.getSecurePassword(originalPassword, salt);

        User user = new User();
        user.setUsername(username);
        user.setSalt(salt);
        user.setPassword(hashedOriginalPassword);
        user.setEmailVerified(true);

        try {
            Mockito.when(UserService.getUser(username)).thenReturn(user);
            AuthenticationService.changePassword(username, originalPassword, newPassword);
        } catch (Exception e) {
            fail("not supposed to throw an exception");
        }
    }

    @Test
    public void changePasswordInvalidOriginalPassword() {
        String username = "username";
        String originalPassword = "originalPassword";
        String newPassword = "newPassword123";
        String salt = "salt";
        String hashedOriginalPassword = AuthenticationService.getSecurePassword(originalPassword, salt);

        User user = new User();
        user.setUsername(username);
        user.setSalt(salt);
        user.setPassword(hashedOriginalPassword);
        user.setEmailVerified(true);

        try {
            Mockito.when(UserService.getUser(username)).thenReturn(null);
            AuthenticationService.changePassword(username, originalPassword, newPassword);
            fail("supposed to throw an exception");
        } catch (Exception e) {
            String message = e.getMessage();
            assertEquals("Invalid Password", message);
        }
    }

    /**************** Forgot Username ********************/

    @Test
    public void forgotUsernameSuccess() {
        String username = "username";
        String email = "test@gmail.com";
        User user = new User();
        user.setUsername(username);
        user.setEmail(email);

        try {
            Mockito.when(UserService.getUserByEmail(email)).thenReturn(user);
            AuthenticationService.forgotUsername(email);
        } catch (Exception e) {
            fail("not supposed to throw an exception");
        }
    }

    @Test
    public void forgotUsernameInvalidEmail() {
        String username = "username";
        String email = "test@gmail.com";
        User user = new User();
        user.setUsername(username);
        user.setEmail(email);

        try {
            Mockito.when(UserService.getUserByEmail(email)).thenReturn(null);
            AuthenticationService.forgotUsername(email);
            fail("supposed to throw an exception");
        } catch (Exception e) {
            String message = e.getMessage();
            assertEquals("Invalid email", message);
        }
    }

    /**************** Forgot Password ********************/

    @Test
    public void forgotPasswordSuccess() {
        String username = "username";
        String email = "test@gmail.com";
        String salt = "salt";
        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setSalt(salt);

        try {
            Mockito.when(UserService.getUserByEmail(email)).thenReturn(user);
            AuthenticationService.forgotPassword(email);
        } catch (Exception e) {
            fail("not supposed to throw an exception");
        }
    }

    @Test
    public void forgotPasswordInvalidEmail() {
        String username = "username";
        String email = "test@gmail.com";
        String salt = "salt";
        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setSalt(salt);

        try {
            Mockito.when(UserService.getUserByEmail(email)).thenReturn(null);
            AuthenticationService.forgotPassword(email);
            fail("supposed to throw an exception");
        } catch (Exception e) {
            String message = e.getMessage();
            assertEquals("Invalid email", message);
        }
    }

    /******************** Reset Password ***************/

    @Test
    public void resetPasswordSuccess() {
        String username = "username";
        String newPassword = "Password123";
        String email = "test@gmail.com";
        String salt = "salt";
        String resetToken = getToken(email, salt);

        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setSalt(salt);

        try {
            Mockito.when(UserService.getUsernameByResetToken(resetToken)).thenReturn(username);
            Mockito.when(UserService.getUser(username)).thenReturn(user);
            String resetUsername = AuthenticationService.resetPassword(resetToken, newPassword);
            assertEquals(username, resetUsername);
        } catch (Exception e) {
            fail("not supposed to throw an exception");
        }
    }

    @Test
    public void resetPasswordInvalidToken() {
        String username = "username";
        String newPassword = "Password123";
        String email = "test@gmail.com";
        String salt = "salt";
        String resetToken = getToken(email, salt);

        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setSalt(salt);

        try {
            Mockito.when(UserService.getUsernameByResetToken(resetToken)).thenReturn("");
            Mockito.when(UserService.getUser(username)).thenReturn(user);
            AuthenticationService.resetPassword(resetToken, newPassword);
            fail("supposed to throw an exception");
        } catch (Exception e) {
            String message = e.getMessage();
            assertEquals("Invalid Token", message);
        }
    }

    @Test
    public void resetPasswordFailedToFindUser() {
        String username = "username";
        String newPassword = "Password123";
        String email = "test@gmail.com";
        String salt = "salt";
        String resetToken = getToken(email, salt);

        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setSalt(salt);

        try {
            Mockito.when(UserService.getUsernameByResetToken(resetToken)).thenReturn(username);
            Mockito.when(UserService.getUser(username)).thenReturn(null);
            AuthenticationService.resetPassword(resetToken, newPassword);
            fail("supposed to throw an exception");
        } catch (Exception e) {
            String message = e.getMessage();
            assertEquals("Failed to find user", message);
        }
    }

    @Test
    public void resetPasswordAccountLocked() {
        String username = "username";
        String newPassword = "Password123";
        String email = "test@gmail.com";
        String salt = "salt";
        String resetToken = getToken(email, salt);

        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setSalt(salt);
        user.setLocked(true);

        try {
            Mockito.when(UserService.getUsernameByResetToken(resetToken)).thenReturn(username);
            Mockito.when(UserService.getUser(username)).thenReturn(user);
            AuthenticationService.resetPassword(resetToken, newPassword);
            fail("supposed to throw an exception");
        } catch (Exception e) {
            String message = e.getMessage();
            assertEquals("Account locked", message);
        }
    }

    @Test
    public void resetPasswordUnexpectedToken() {
        String username = "username";
        String newPassword = "Password123";
        String email = "test@gmail.com";
        String salt = "salt";
        String resetToken = getToken(email, salt) + "changed";

        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setSalt(salt);

        try {
            Mockito.when(UserService.getUsernameByResetToken(resetToken)).thenReturn(username);
            Mockito.when(UserService.getUser(username)).thenReturn(user);
            AuthenticationService.resetPassword(resetToken, newPassword);
            fail("supposed to throw an exception");
        } catch (Exception e) {
            String message = e.getMessage();
            assertEquals("Invalid Token", message);
        }
    }

    /******************** Get Secure Password ***************/

    @Test
    public void getSecurePasswordConsistent() {
        String password = "Password123";
        String salt = "salt";

        String securePassword = AuthenticationService.getSecurePassword(password, salt);
        assertFalse(securePassword.equals(password));

        String securePassword2 = AuthenticationService.getSecurePassword(password, salt);
        assertEquals(securePassword, securePassword2);
    }

    /******************** Validate Password ***************/

    @Test
    public void validatePasswordSuccess() {
        String password = "Password123";

        try {
            AuthenticationService.validatePassword(password);
        } catch (Exception e) {
            fail("not supposed to throw an exception");
        }
    }

    @Test
    public void validatePasswordNull() {
        String password = null;

        try {
            AuthenticationService.validatePassword(password);
            fail("supposed to throw an exception");
        } catch (Exception e) {
            String message = e.getMessage();
            assertEquals("Must be at least 8 characters", message);
        }
    }

    @Test
    public void validatePasswordTooShort() {
        String password = "Pass123";

        try {
            AuthenticationService.validatePassword(password);
            fail("supposed to throw an exception");
        } catch (Exception e) {
            String message = e.getMessage();
            assertEquals("Must be at least 8 characters", message);
        }
    }

    @Test
    public void validatePasswordTooLong() {
        String password = "Password123ThatIsTooLongToBeAValidPassword";

        try {
            AuthenticationService.validatePassword(password);
            fail("supposed to throw an exception");
        } catch (Exception e) {
            String message = e.getMessage();
            assertEquals("Must be at most 20 characters", message);
        }
    }

    @Test
    public void validatePasswordCapital() {
        String password = "nocapital123";

        try {
            AuthenticationService.validatePassword(password);
            fail("supposed to throw an exception");
        } catch (Exception e) {
            String message = e.getMessage();
            assertEquals("Must contain at least 1 in capital case", message);
        }
    }

    @Test
    public void validatePasswordLower() {
        String password = "NOLOWER123";

        try {
            AuthenticationService.validatePassword(password);
            fail("supposed to throw an exception");
        } catch (Exception e) {
            String message = e.getMessage();
            assertEquals("Must contain at least 1 in lower case", message);
        }
    }

    @Test
    public void validatePasswordNumber() {
        String password = "NoNumber";

        try {
            AuthenticationService.validatePassword(password);
            fail("supposed to throw an exception");
        } catch (Exception e) {
            String message = e.getMessage();
            assertEquals("Must contain at least 1 number", message);
        }
    }

    /******************** Validate Username ***************/

    @Test
    public void validateUsernameSuccess() {
        String username = "username";

        try {
            AuthenticationService.validateUsername(username);
        } catch (Exception e) {
            fail("not supposed to throw an exception");
        }
    }

    @Test
    public void validateUsernameNull() {
        String username = null;

        try {
            AuthenticationService.validateUsername(username);
            fail("supposed to throw an exception");
        } catch (Exception e) {
            String message = e.getMessage();
            assertEquals("Must be at least 5 characters", message);
        }
    }

    @Test
    public void validateUsernameTooShort() {
        String username = "user";

        try {
            AuthenticationService.validateUsername(username);
            fail("supposed to throw an exception");
        } catch (Exception e) {
            String message = e.getMessage();
            assertEquals("Must be at least 5 characters", message);
        }
    }

    @Test
    public void validateUsernameTooLong() {
        String username = "usernamethatistoolongtobevalid";

        try {
            AuthenticationService.validateUsername(username);
            fail("supposed to throw an exception");
        } catch (Exception e) {
            String message = e.getMessage();
            assertEquals("Must be at most 20 characters", message);
        }
    }
}
