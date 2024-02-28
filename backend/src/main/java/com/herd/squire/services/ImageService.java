package com.herd.squire.services;

import com.herd.squire.models.SquireImage;
import com.herd.squire.utilities.SquireProperties;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;
import org.jboss.resteasy.plugins.providers.multipart.InputPart;
import org.jboss.resteasy.plugins.providers.multipart.MultipartFormDataInput;

import javax.ws.rs.core.MultivaluedMap;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.util.*;

public class ImageService {
    public static String getFileId(int userId, long objectId) {
        return userId + "_" + objectId;
    }

    public static SquireImage getImage(String filename, String subDirectory) throws IOException {
        SquireImage image = null;
        if (filename != null && filename.length() > 0) {
            String imageType = filename.substring(filename.lastIndexOf(".") + 1);
            byte[] fileContent = FileUtils.readFileToByteArray(new File(getImagesPath(subDirectory) + filename));
            String encodedImage = Base64.getEncoder().encodeToString(fileContent);

            image = new SquireImage(filename, imageType, encodedImage);
        }
        return image;
    }

    public static List<String> uploadFile(MultipartFormDataInput input, String subDirectory, String fileId) throws Exception {
        Map<String, List<InputPart>> uploadForm = input.getFormDataMap();
        List<InputPart> inputParts = uploadForm.get("file");
        List<String> filenames = new ArrayList<>();

        for (InputPart inputPart : inputParts) {
            filenames.add(uploadFile(inputPart, subDirectory, fileId));
        }

        return filenames;
    }

    public static String uploadFile(InputPart inputPart, String subDirectory, String fileId) throws Exception {
        MultivaluedMap<String, String> header = inputPart.getHeaders();
        String filename = fileId + "." + getFileType(header);
        String fullName = getImagesPath(subDirectory) + filename;

        InputStream inputStream = inputPart.getBody(InputStream.class,null);
        byte [] bytes = IOUtils.toByteArray(inputStream);
        writeFile(bytes, fullName);
        return filename;
    }

    public static void deleteImage(String filename, String subDirectory) {
        if (filename == null || filename.equals("")) {
            return;
        }
        try {
            File file = new File(getImagesPath(subDirectory) + filename);
            Files.deleteIfExists(file.toPath());
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static void deleteUserImages(int userId, String subDirectory) {
        List<String> filenames = getUserImages(userId, subDirectory);
        for (String filename : filenames) {
            deleteImage(filename, subDirectory);
        }
    }

    public static List<String> getUserImages(int userId, String subDirectory) {
        List<String> filenames = new ArrayList<>();

        File f = new File(getImagesPath(subDirectory));
        String[] files = f.list();
        if (files == null) {
            return filenames;
        }

        for (String filename : files) {
            if (filename.indexOf(userId + "_") == 0) {
                filenames.add(filename);
            }
        }
        return filenames;
    }

    private static String getImagesPath(String subDirectory) {
        return SquireProperties.getProperty("imagesPath") + "/" + subDirectory + "/";
    }

    private static String getFileType(MultivaluedMap<String, String> header) throws Exception {
        String filename = getFilename(header);
        String[] parts = filename.split("\\.");
        if (parts.length != 2) {
            throw new Exception("invalid filename");
        }
        return parts[1];
    }

    private static String getFilename(MultivaluedMap<String, String> header) {
        String[] contentDisposition = header.getFirst("Content-Disposition").split(";");

        for (String filename : contentDisposition) {
            if ((filename.trim().startsWith("filename"))) {
                String[] name = filename.split("=");
                return name[1].trim().replaceAll("\"", "");
            }
        }
        return "unknown";
    }

    private static void writeFile(byte[] content, String filename) throws Exception {
        File file = new File(filename);

        if (!file.exists()) {
            boolean created = file.createNewFile();
            if (!created) {
                throw new Exception("unable to create file");
            }
        }

        FileOutputStream fop = new FileOutputStream(file);
        fop.write(content);
        fop.flush();
        fop.close();
    }
}
