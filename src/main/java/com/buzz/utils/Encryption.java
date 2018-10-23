package com.buzz.utils;

/**
 * @Author: jyh
 * @Date: 2018/10/17 7:44
 */

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.security.MessageDigest;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.UUID;

    public class Encryption
    {
        public static String encryption_md5(String str)
        {
            char hexDigits[] = {'0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'};
            try {
                byte[] btInput = str.getBytes();
                // 获得MD5摘要算法的 MessageDigest 对象
                MessageDigest mdInst = MessageDigest.getInstance("MD5");
                // 使用指定的字节更新摘要
                mdInst.update(btInput);
                // 获得密文
                byte[] md = mdInst.digest();
                // 把密文转换成十六进制的字符串形式
                int j = md.length;
                char c[] = new char[j * 2];
                int k = 0;
                for (int i = 0; i < j; i++)
                {
                    byte byte0 = md[i];
                    c[k++] = hexDigits[byte0 >>> 4 & 0xf];
                    c[k++] = hexDigits[byte0 & 0xf];
                }
                return new String(c);
            }
            catch (Exception e)
            {
                return null;
            }
        }
        /**
         * 获取UUID
         * @return
         */
        public static String getUUID()
        {
            UUID uuid=UUID.randomUUID();
            return uuid.toString();
        }
        /**
         * 计算两个时间是否相等
         * @param date1
         * @param date2
         * @return
         * @throws ParseException
         */
        public static int getDateAreequal(String date1,String date2) throws ParseException
        {
            SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd");
            Date date3=sdf.parse(date1);
            Date date4=sdf.parse(date2);
            return date3.compareTo(date4);
        }
        public static BufferedImage img_tailor(BufferedImage src, int x, int y, int width, int height) {
            BufferedImage back=src.getSubimage(x,y,width,height);
            return back;
        }
        public static BufferedImage file2img(String imgpath) {
            try {
                BufferedImage bufferedImage= ImageIO.read(new File(imgpath));
                return bufferedImage;
            } catch (Exception e) {
                e.printStackTrace();
                return null;
            }
        }
        //保存图片,extent为格式，"jpg"、"png"等
        public static void img2file(BufferedImage img,String extent,String newfile)
        {
            try {
                ImageIO.write(img, extent, new File(newfile));
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
