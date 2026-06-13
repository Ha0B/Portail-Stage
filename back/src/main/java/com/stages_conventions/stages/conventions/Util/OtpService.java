package com.stages_conventions.stages.conventions.Util;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class OtpService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String adminMailId ;

    private static final Map<Long, OtpData> otpStorage = new ConcurrentHashMap<>();

    private static class OtpData {
        private final String code;
        private final LocalDateTime expirationTime;

        public OtpData(String code, LocalDateTime expirationTime) {
            this.code = code;
            this.expirationTime = expirationTime;
        }

    }

    public String genererOtp() {
        return String.valueOf(new SecureRandom().nextInt(900000) + 100000);
    }

    public void envoyerOtp(Long conventionId, String email) {
        String otp = genererOtp();

        otpStorage.put(
                conventionId,
                new OtpData(otp, LocalDateTime.now().plusMinutes(5))
        );

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(adminMailId);
        message.setTo(email);
        message.setSubject("Signature de convention");
        message.setText("Votre code OTP est : " + otp + "\n\nValable pendant 5 minutes.");

        mailSender.send(message);

        log.info("OTP envoyé pour convention {}", conventionId);
    }

    public boolean validerOtp(Long conventionId, String otpFourni) {
        OtpData otpData = otpStorage.get(conventionId);

        if (otpData == null) {
            return false;
        }

        if (LocalDateTime.now().isAfter(otpData.expirationTime)) {
            otpStorage.remove(conventionId);
            return false;
        }

        boolean valide = otpData.code.equals(otpFourni);

        if (valide) {
            otpStorage.remove(conventionId);
        }

        return valide;
    }
}