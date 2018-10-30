package com.buzz.utils;

import org.apache.shiro.crypto.hash.Md5Hash;

/**
 * @Author: aaaJYH
 * @Date: 2018/8/26 19:44
 */
public class Md5 {

    /**
     * 加密字符串
     * encrypt：将。。。译成密码
     * @param param
     * @return
     */
    public static String encrypt(String param){
        Md5Hash md5Hash=new Md5Hash(param);
        return md5Hash.toString();
    }

    public static void main(String[] args) {
        System.out.println(encrypt("admin1"));
    }

}
