package com.buzz.utils;

import org.apache.poi.hssf.usermodel.*;

import java.io.FileOutputStream;
import java.io.IOException;
import java.lang.reflect.Field;
import java.util.List;

/**
 * @Author: jyh
 * @Date: 2018/11/6 16:13
 */
public class WriteExcel<T> {

    public void write(List<T> dataList, String path, Class clazz) throws IllegalAccessException, IOException {
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
    }


}
