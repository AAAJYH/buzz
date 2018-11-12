package com.buzz.configuration;

import com.buzz.service.LogService;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.*;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.sql.Timestamp;
import java.util.Date;
import java.util.Enumeration;
import java.util.UUID;

/**
 * @Author: jyh
 * @Date: 2018/11/11 16:33
 */

@Component
@Aspect
public class WebLogAspect {

    @Resource
    LogService logService;

    String url=""; //请求连接
    String requestType=""; //请求类型
    String ip=""; //ip地址
    String response=""; //响应内容
    //用时
    Date startDate=null;
    Date endDate=null;
    String params=""; //请求参数

    /**
     * 切入点：匹配切入的方法
     *  *：任意返回类型
     *  第一个*：所有类
     *  第二个*：所有方法
     *  (..)：任意参数
     */
    @Pointcut("execution(* com.buzz.controller.*.*(..))")
    public void webLog(){};

    @Before("webLog()") //前置通知
    public void doBefore(JoinPoint joinPoint){
        startDate=new Date();
        //获取请求内容
        ServletRequestAttributes servletRequestAttributes= (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        HttpServletRequest request=servletRequestAttributes.getRequest();
        url=request.getRequestURL().toString(); //获取请求连接
        requestType=request.getMethod(); //获取提交的方式

        /**
         * getRemoteAddr()：Windows操作系统，eclipse开发环境下，在本机上使用http://localhost:8080/...访问本机上
         * 的页面，使用tomcat作为服务器在Servlet或者Action中使用request.getRemoteAddr()获取的返回值不是IPv4的格
         * 式aaa.bbb.ccc.ddd（127.0.0.1），而是IPv6的格式x:y:z:a:b:c:v:w（0:0:0:0:0:0:0:1）
         */

        ip=request.getRemoteAddr(); //获取ip地址
        if(ip.equals("0:0:0:0:0:0:0:1")){
            ip="127.0.0.1";
        }

        //获取请求参数
        params="{";
        Enumeration<String> enumeration=request.getParameterNames();
        while(enumeration.hasMoreElements()){
            String parameterName=enumeration.nextElement();
            params+=parameterName+":"+request.getParameter(parameterName)+",";
        }
        if(params.length()>1){
            params=params.substring(0,params.length()-2);
        }
        params+="}";
    }

    /**
     * 在方法返回结果后执行
     * @param object 返回结果
     */
    @AfterReturning(returning = "object",pointcut = "webLog()")
    public void doAfterReturning(Object object){
        endDate=new Date();
        String logId= UUID.randomUUID().toString(); //日志id
        long totalTime=endDate.getTime()-startDate.getTime(); //用时
        Timestamp currentTime=new Timestamp(System.currentTimeMillis()); //当前时间戳
        //添加日志
        logService.addLog(logId,url,requestType,totalTime,ip,currentTime,params);
    }

}
