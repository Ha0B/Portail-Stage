package com.stages_conventions.stages.conventions.Util;

import java.nio.file.Files;
import java.nio.file.Path;
import java.security.MessageDigest;

public class HashService {

    public static String calculerSHA256(Path filePath) throws Exception {

        byte[] fileBytes = Files.readAllBytes(filePath);

        MessageDigest digest =
                MessageDigest.getInstance("SHA-256");

        byte[] hashBytes =
                digest.digest(fileBytes);

        StringBuilder sb = new StringBuilder();

        for (byte b : hashBytes) {
            sb.append(
                    String.format("%02x", b)
            );
        }

        return sb.toString();
    }
}