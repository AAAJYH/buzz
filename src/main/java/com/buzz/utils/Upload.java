package com.buzz.utils;

import org.apache.commons.io.FilenameUtils;
import org.springframework.web.multipart.MultipartFile;
import org.thymeleaf.util.ArrayUtils;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.util.HashMap;
import java.util.Map;

/**
 * @Author: aaaJYH
 * @Date: 2018/9/17 19:53
 */
public class Upload {

    /**
     * 文件上传
     * @param multipartFile 图片名
     * @return
     */
    public static String upload(MultipartFile multipartFile,String path) throws Exception {
        String uuid= Encryption.getUUID()+".jpg"; //生成图片随机名
        path=path.replace("%20"," "); //把文件中的%20替换成空格
        File file=new File(path+uuid); //创建一个文件
        multipartFile.transferTo(file); //将上传文件写入到指定文件
        return uuid;
    }

    /**
     * 删除文件
     * @param path
     * @return
     */
    public static boolean delete_File(String path)
    {
        File file=new File(path);
        if (file.exists())
        {
            file.delete();
            return true;
        }
        return false;
    }
    public static Map<String, Object> insert_File(MultipartFile multipartFile,String path) throws IOException
    {
        Map<String, Object> map = new HashMap<String, Object>();
        String oldfilename = multipartFile.getOriginalFilename();
        String filetype = oldfilename.substring(oldfilename.lastIndexOf("."));
        String newfilename = Encryption.getUUID() + filetype;
        FileOutputStream fos = null;
        try {
            byte[] bytes = multipartFile.getBytes();
            String filepath=path+"/"+newfilename;
            fos = new FileOutputStream(filepath);
            fos.write(bytes);
            fos.flush();
            File file = new File(filepath);
            if (file.exists())//判断文件是否存在
            {
                map.put("result", true);
                map.put("url",filepath.substring(filepath.indexOf("static/")+7));
            } else
                map.put("result", false);
        } catch (IOException e) {
            map.put("result", false);
            e.printStackTrace();
        } finally {
            if (null != fos) {
                fos.close();
            }
        }
        return map;
    }

    /**
     * froala editor上传视频
     * @param uploads
     * @param request
     * @param response
     * @return
     * @throws IOException
     * @throws ServletException
     */
    public static Map<Object,Object> insert_Photo(File uploads, HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
        String multipartContentType = "multipart/form-data";
        String fieldname = "file";
        Part filePart = request.getPart(fieldname);
        Map<Object, Object> responseData = null;
        String linkName = null;
        String name = null;
        try {
            // 检查内容类型
            if (request.getContentType() == null ||
                    request.getContentType().toLowerCase().indexOf(multipartContentType) == -1) {
                throw new Exception("无效的内容类型,它必须是" + multipartContentType);
            }
            // 根据字段名和图像扩展名获取文件部分。
            filePart = request.getPart(fieldname);
            String type = filePart.getContentType();
            type = type.substring(type.lastIndexOf("/") + 1);
            // 生成随机的名字。
            String extension = type;
            extension = (extension != null && extension != "") ? "." + extension : extension;
            name = Encryption.getUUID() + extension;
            // 获取绝对服务器路径。
            String absoluteServerPath = uploads + "/" + name;
            linkName = absoluteServerPath.substring(absoluteServerPath.indexOf("static") + 7);
            // 验证图像。
            String mimeType = filePart.getContentType();
            String[] allowedExts = new String[]{
                    "gif",
                    "jpeg",
                    "jpg",
                    "png",
                    "svg",
                    "blob"
            };
            String[] allowedMimeTypes = new String[]{
                    "image/gif",
                    "image/jpeg",
                    "image/pjpeg",
                    "image/x-png",
                    "image/png",
                    "image/svg+xml"
            };
            if (!ArrayUtils.contains(allowedExts, FilenameUtils.getExtension(absoluteServerPath)) ||
                    !ArrayUtils.contains(allowedMimeTypes, mimeType.toLowerCase())) {
                // 如果上传的图片不符合验证要求删除
                File file = new File(uploads + name);
                if (file.exists()) {
                    file.delete();
                }
                throw new Exception("图像不满足验证。");
            }
            // 将文件保存在服务器上。
            File file = new File(uploads, name);
            try (InputStream input = filePart.getInputStream()) {
                Files.copy(input, file.toPath());
            } catch (Exception e) {
                responseData =new HashMap<Object, Object>();
                responseData.put("error", e.toString());
            }
        } catch (Exception e) {
            e.printStackTrace();
            responseData = new HashMap<Object, Object>();
            responseData.put("error", e.toString());
        } finally {
            // 建立相应数据
            responseData = new HashMap<Object, Object>();
            responseData.put("link", linkName);
            return responseData;
        }
    }

    /**
     * froala editor上传视频
     * @return
     */
    public static Map<Object,Object> insert_Video(File uploads,HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
        //File uploads = new File("/PATH TO/YOUR PROJECT/WORKSPACE/WEBCONTENT/WEB-INF/SOME FOLDER/");
        String multipartContentType = "multipart/form-data";
        String fieldname = "file";
        Part filePart = request.getPart(fieldname);
        // 创建路径组件来保存文件。
        Map < Object, Object > responseData=null;
        String linkName = null;
        try {
            // 检查文件类型。
            if (request.getContentType() == null ||
                    request.getContentType().toLowerCase().indexOf(multipartContentType) == -1) {
                throw new Exception("无效的内容类型,它必须是" + multipartContentType);
            }
            // 根据字段名和文件扩展名获取文件部分。
            String type = filePart.getContentType();
            type = type.substring(type.lastIndexOf("/") + 1);
            // 生成随机的名字。
            String extension = type;
            extension = (extension != null && extension != "") ? "." + extension : extension;
            String name = Encryption.getUUID()+ extension;
            // 获取绝对服务器路径。
            String absoluteServerPath = uploads + "/" + name;
            linkName = absoluteServerPath.substring(absoluteServerPath.indexOf("static") + 7);
            // 验证文件。
            String mimeType = filePart.getContentType();
            String[] allowedExts = new String[] {
                    "mp4",
                    "webm",
                    "ogg"
            };
            String[] allowedMimeTypes = new String[] {
                    "video/mp4",
                    "video/webm",
                    "video/ogg"
            };
            if (!ArrayUtils.contains(allowedExts, FilenameUtils.getExtension(absoluteServerPath)) ||
                    !ArrayUtils.contains(allowedMimeTypes, mimeType.toLowerCase())) {
                // 删除上传的文件。
                File file = new File(absoluteServerPath);
                if (file.exists()) {
                    file.delete();
                }
                throw new Exception("文件不满足验证。");
            }
            // 将文件保存在服务器上。
            File file = new File(uploads, name);
            try (InputStream input = filePart.getInputStream()) {
                Files.copy(input, file.toPath());
            } catch (Exception e) {
                responseData =new HashMap<Object, Object>();
                responseData.put("error",e.toString());
            }
        } catch (Exception e) {
            e.printStackTrace();
            responseData =new HashMap<Object, Object>();
            responseData.put("error", e.toString());
        } finally {
            // 建立相应数据
            responseData = new HashMap<Object, Object>();
            responseData.put("link", linkName);
            return responseData;
        }
    }
}
