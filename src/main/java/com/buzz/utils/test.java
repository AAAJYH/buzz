package com.buzz.utils;

import com.buzz.entity.Log;
import com.buzz.entity.users;
import org.apache.poi.hssf.usermodel.*;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.json.JSONObject;
import org.junit.jupiter.api.Test;
import javax.swing.filechooser.FileSystemView;
import java.io.*;
import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.List;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Map;

/**
 * @Author: aaaJYH
 * @Date: 2018/9/28 8:21
 */

public class test<T> {

    private static final String EXCEL_XLS = "xls"; //xls是excel2003及以前版本的文件格式
    private static final String EXCEL_XLSX = "xlsx"; //xlsx是excel2007及以后的版本

    /**
     * 判断Excel的版本,获取Workbook
     * @return
     * @throws IOException
     */
    public static Workbook getWorkbok(File file) throws IOException {
        System.out.println(file);
        Workbook wb = null;
        FileInputStream in = new FileInputStream(file);
        //endsWith判断是否以指定后缀（suffix）结束
        if(file.getName().endsWith(EXCEL_XLS)){     //Excel&nbsp;2003
            wb = new HSSFWorkbook(in);
        }else if(file.getName().endsWith(EXCEL_XLSX)){    // Excel 2007/2010
            wb = new XSSFWorkbook(in);
        }
        return wb;
    }

    public boolean writeExcel(List<T> dataList, String path, Class clazz) throws IllegalAccessException, IOException {
        boolean rs=true;
        try {
            HSSFWorkbook wb=new HSSFWorkbook();//创建工作薄
            HSSFSheet sheet=wb.createSheet();//创建工作表
            wb.setSheetName(0, "sheet0");//设置工作表名

            //通过类的反射机制，获取要生成对象的全部属性，并设置工作表的第一行内容为属性的Name，作为Title
            Field[] fields=clazz.getDeclaredFields();
            HSSFRow FirstRow=sheet.createRow(0); //创建第一行
            for(int i=0;i<fields.length;i++){
                Field field=fields[i];
                field.setAccessible(true); //允许反射访问该字段
                HSSFCell cell=FirstRow.createCell(i); //创建第一行的第i列的对象
                cell.setCellValue(field.getName().toString()); //设置列的值
                sheet.setColumnWidth(i, (int)350*10); //设置列的宽度
            }

            //从第二行开始写

            HSSFCellStyle style = wb.createCellStyle();

            for (int i = 0; i < dataList.size(); i++) {
                T instance =dataList.get(i);
                HSSFRow row = sheet.createRow(i+1); //创建行
                for(int j=0;j<fields.length;j++){
                    HSSFCell cell=row.createCell(j); //创建列
                    cell.setCellValue(fields[j].get(instance)+""); //设置列值为属性的值
                    cell.setCellStyle(style);
                }
            }

            FileOutputStream fos=new FileOutputStream(path); //创建文件输出流
            wb.write(fos); //写入文件
            fos.close();
        }catch (Exception e){
            String exceptionToString=e.toString();
            //另一个程序正在使用此文件，进程无法访问。
            rs=!exceptionToString.substring(0,exceptionToString.indexOf(":")).equals("java.io.FileNotFoundException");
        }
        return rs;
    }

    @Test
    public void a() throws IOException, IllegalAccessException {

        List<users> userList=new ArrayList<users>();

        users u1=new users();
        u1.setUserId("1");
        u1.setUserName("姬雨航");
        u1.setUserPassword("123");

        users u2=new users();
        u2.setUserId("1");
        u2.setUserName("姬雨航");
        u2.setUserPassword("123");

        userList.add(u1);
        userList.add(u2);

        FileSystemView fsv = FileSystemView.getFileSystemView();
        String com=fsv.getHomeDirectory().toString()+"\\aaa.xlsx";    //这便是读取桌面路径的方法了
        File file=new File(com);
        if(file.exists()){
            file.delete();
        }
        test<users> t=new test<users>();
        t.writeExcel(userList, "C:\\Users\\jyh\\Desktop\\aaa.xls",users.class);

    }

    /**
     * 获取token类
     */
        /**
         * 获取权限token
         * @return 返回示例：
         * {
         * "access_token": "24.460da4889caad24cccdb1fea17221975.2592000.1491995545.282335-1234567",
         * "expires_in": 2592000
         * }
         */

        /**
         * 获取API访问token
         * 该token有一定的有效期，需要自行管理，当失效时需重新获取.
         * @param ak - 百度云官网获取的 API Key
         * @param sk - 百度云官网获取的 Securet Key
         * @return assess_token 示例：
         * "24.460da4889caad24cccdb1fea17221975.2592000.1491995545.282335-1234567"
         */
        public String getAuth(String ak, String sk) {
            // 获取token地址
            String authHost = "https://aip.baidubce.com/oauth/2.0/token?";
            String getAccessTokenUrl = authHost
                    // 1. grant_type为固定参数
                    + "grant_type=client_credentials"
                    // 2. 官网获取的 API Key
                    + "&client_id=" + ak
                    // 3. 官网获取的 Secret Key
                    + "&client_secret=" + sk;
            try {
                URL realUrl = new URL(getAccessTokenUrl);
                // 打开和URL之间的连接
                HttpURLConnection connection = (HttpURLConnection) realUrl.openConnection();
                connection.setRequestMethod("GET");
                connection.connect();
                // 获取所有响应头字段
                Map<String, List<String>> map = connection.getHeaderFields();
                // 遍历所有的响应头字段
                for (String key : map.keySet()) {
                    System.err.println(key + "--->" + map.get(key));
                }
                // 定义 BufferedReader输入流来读取URL的响应
                BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream()));
                String result = "";
                String line;
                while ((line = in.readLine()) != null) {
                    result += line;
                }
                /**
                 * 返回结果示例
                 */
                System.err.println("result:" + result);
                JSONObject jsonObject = new JSONObject(result);
                String access_token = jsonObject.getString("access_token");
                System.out.println(access_token);
                return access_token;
            } catch (Exception e) {
                System.err.printf("获取token失败！");
                e.printStackTrace(System.err);
            }
            return null;
        }

    /*public static void main(String[] args) {
        // 官网获取的 API Key 更新为你注册的
        String clientId = "cymIZx98alUpK82RqX9sNql3";
        // 官网获取的 Secret Key 更新为你注册的
        String clientSecret = "41GDdcLSvoKKUL023L8GzWoo6Wss9sEX";
        test<Log> t=new test();
        System.out.println(t.getAuth(clientId, clientSecret));
    }
*/
    public static void main(String[] args) {
        System.out.println(Encryption.getUUID());
        System.out.println(Encryption.getUUID());
        System.out.println(Encryption.getUUID());
        System.out.println(Encryption.getUUID());
    }

}
