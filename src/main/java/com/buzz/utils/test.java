package com.buzz.utils;

import com.buzz.service.emailService;

import javax.annotation.Resource;

public class test
{
    /*public static void main(String[] args) {
            System.out.println(Encryption.getUUID());
            System.out.println(Encryption.getUUID());
            System.out.println(Encryption.getUUID());
            System.out.println(Encryption.getUUID());
    }*/
    public static void main(String[] args)
    {
        emailService emailservice=new emailService();
        String rscid="001";
        String Content="<html><body>这是有图片的邮件:<img src=\'cid':"+rscid+"\'></body></html>";
        String imgPath="C:\\Users\\admin\\Desktop\\旅游网项目\\素材\\图片\\32.jpg";
        emailservice.sendInlineResourceEmail("421246627@qq.com","嗡嗡嗡旅游网",Content,imgPath,rscid);
    }
}
