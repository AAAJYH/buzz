package com.buzz.utils;

import javax.swing.*;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.util.Date;

public class Conversion
{
    /**
     * Object转integer
     * @param
     * @return
     */
    public static Integer parseInteger(Object obj)
    {
        if(null==obj||"".equals(obj)||"undefined".equals(obj))
        {
            return 0;
        }
        else
        {
            return Integer.parseInt(obj.toString());
        }
    }
    /**
     * Object转double
     * @param
     * @return
     */
    public  static double parseDouble(Object obj)
    {
        if(null==obj||"".equals(obj)||"undefined".equals(obj))
        {
            return 0;
        }
        else
        {
            return Double.parseDouble(obj.toString());
        }
    }
    /**
     * Object转string
     * @param obj
     * @return
     */
    public static String parseString(Object obj)
    {
        if(null==obj||"undefined".equals(obj))
        {
            return "";
        }
        else
        {
            return obj.toString();
        }
    }
    public static Date parseDate(Object obj)
    {
        if(null==obj)
        {
            return null;
        }
        else
        {
            return (Date)obj;
        }
    }
}