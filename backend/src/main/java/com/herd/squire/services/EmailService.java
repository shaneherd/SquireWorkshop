package com.herd.squire.services;

import com.herd.squire.models.SupportRequest;
import com.herd.squire.utilities.SquireLogger;
import com.herd.squire.utilities.SquireProperties;

import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.util.Properties;
import java.util.logging.Logger;

public class EmailService {
    private static final String BASE_URL = SquireProperties.getProperty("baseUrl");
    private static final Logger logger = Logger.getLogger(SquireLogger.class.getName());

    public static void sendForgotUsernameEmail(String toEmail, String username) throws MessagingException {
        String subject = "Squire Forgot Username";
        String message = "Your username is " + username;
        sendEmail(toEmail, subject, message);
    }

    public static void sendForgotPasswordEmail(String toEmail, String resetToken) throws MessagingException {
        String subject = "Squire Forgot Password";
        String message = "The following link will expire in 24 hours. Please click the link to reset your password." + "\n" + BASE_URL + "auth/resetPassword?resetToken=" + resetToken;
        sendEmail(toEmail, subject, message);
    }

    public static void sendAccountLockedEmail(String toEmail, String unlockToken) throws MessagingException {
        String subject = "Squire Account Locked";
        String message = "\"Your account has been locked due to invalid logins. If you have not been attempting to login, please reset your password.\\n\\nTo unlock your account, please click the following link.\\n" + BASE_URL + "auth/unlockAccount?unlockToken=" + unlockToken;
        sendEmail(toEmail, subject, message);
    }

    public static void notifyError(String errorMessage) throws MessagingException {
        String subject = "Database Error";
        String notifyEmailAddress = SquireProperties.getProperty("notifyEmailAddress");
        sendEmail(notifyEmailAddress, subject, errorMessage);
    }

    public static void notifySupportRequest(SupportRequest supportRequest, int userId) throws MessagingException {
        String subject = "Support Request: " + supportRequest.getSubject().toString();
        String message = "User ID: " + userId + "\n" + supportRequest.getMessage();
        String notifyEmailAddress = SquireProperties.getProperty("notifyEmailAddress");
        sendEmail(notifyEmailAddress, subject, message);
    }

    public static void sendEmail(String toEmail, String subject, String message) throws MessagingException {
        try {
            final String emailAddress = SquireProperties.getProperty("emailAddress");
            final String emailPassword = SquireProperties.getProperty("emailPassword");

            Properties props = new Properties();
            props.put("mail.smtp.auth", "true");
            props.put("mail.smtp.starttls.enable", "true");
            props.put("mail.smtp.host", "smtp.gmail.com");
            props.put("mail.smtp.debug", "true");
            props.put("mail.smtp.port", "587");

            Session session = Session.getInstance(props,
                    new javax.mail.Authenticator() {
                        protected PasswordAuthentication getPasswordAuthentication() {
                            return new PasswordAuthentication(emailAddress, emailPassword);
                        }
                    });

            MimeMessage msg = new MimeMessage(session);
            msg.setFrom(new InternetAddress(emailAddress));
            msg.addRecipient(Message.RecipientType.TO, new InternetAddress(toEmail));
            msg.setSubject(subject);
            msg.setText(message);
            Transport.send(msg);
        } catch (Exception e) {
            logger.warning(e.getMessage());
            throw e;
        }
    }
}
