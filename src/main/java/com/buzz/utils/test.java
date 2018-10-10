package com.buzz.utils;

import com.buzz.entity.Data;
import org.junit.jupiter.api.Test;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.UUID;

/**
 * @Author: aaaJYH
 * @Date: 2018/9/28 8:21
 */

public class test {

   @Test
    public void a(){
        for(int i=0;i<20;i++){
                System.out.println(UUID.randomUUID());
            }
            int w=113;
            int h=114;
            System.out.println(w/1.252+"  "+h/1.25);
    }

    @Test
    public void b() throws Exception {
        String path = "http://apitest.99263.com/Hotel/HotelDetail?Data={'HId':71720}";
        URL url = new URL(path);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setDoOutput(true);
        conn.setDoInput(true);
        conn.setConnectTimeout(5 * 1000);
        conn.setRequestMethod("POST");
        DataOutputStream os = new DataOutputStream( conn.getOutputStream() );
        conn.connect();
        InputStream inStream = conn.getInputStream();
        byte[] data = toByteArray(inStream);
        String result = new String(data, "UTF-8");
        System.out.println(result);
        conn.disconnect();

    }

    private static byte[] toByteArray(InputStream input) throws IOException {
        ByteArrayOutputStream output = new ByteArrayOutputStream();
        byte[] buffer = new byte[4096];
        int n = 0;
        while (-1 != (n = input.read(buffer))) {
            output.write(buffer, 0, n);
        }
        return output.toByteArray();
    }

}
