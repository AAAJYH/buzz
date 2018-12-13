package com.buzz.controller;

import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;
@Controller
public class MainsiteErrorController implements ErrorController
{
    private static final String ERROR_PATH = "/error";
    @RequestMapping(value=ERROR_PATH)
    public String handleError(HttpServletRequest request){
        //获取statusCode:401,404,500
        Integer statusCode = (Integer) request.getAttribute("javax.servlet.error.status_code");
        if(statusCode == 401){
            return "redirect:/401.html";
        }else if(statusCode == 404){
            return "redirect:/404.html";
        }else if(statusCode == 403){
            return "redirect:/403.html";
        }else{
            return "redirect:/500.html";
        }
    }
    @Override
    public String getErrorPath() {
        return ERROR_PATH;
    }
}
