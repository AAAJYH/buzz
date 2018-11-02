package com.buzz.interceptor;

import com.buzz.entity.users;
import org.omg.PortableInterceptor.Interceptor;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;

@Component
public class LoginInterceptor implements HandlerInterceptor
{
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws IOException {
        HttpSession session=request.getSession();
        users user= (users) session.getAttribute("user");
        if(null!=user&&!"".equals(user.getUserId()))
            return true;
        else
        {
            String type = request.getHeader("X-Requested-With");// XMLHttpRequest
            String path = request.getContextPath();
            String basePath = request.getScheme() + "://"+ request.getServerName() + ":" + request.getServerPort()+ path + "/";
            //判断是否为ajax请求,如果为ajax请求无法跳转页面,这是需要传参到页面,在页面使用ajaxSetup()方法,在所有ajax请求结束后进行判断
            // window.location.href进行跳转页面
            if ("XMLHttpRequest".equals(type))
            {
                response.setHeader("SESSIONSTATUS", "TIMEOUT");//用户是否登录
                response.setHeader("CONTEXTPATH", basePath+"/usersController/show_login_html");//跳转路径
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);//403 禁止
                return false;
            } else
            {
                response.sendRedirect("/usersController/show_login_html");
                return false;
            }
        }
    }
    // shiro
}
