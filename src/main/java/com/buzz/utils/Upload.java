package com.buzz.utils;

import org.springframework.util.ResourceUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.UUID;

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
        String uuid= UUID.randomUUID().toString()+".jpg"; //生成图片随机名
        path=path.replace("%20"," "); //把文件中的%20替换成空格
        File file=new File(path+uuid); //创建一个文件
        multipartFile.transferTo(file); //将上传文件写入到指定文件
        return uuid;
    }

}
