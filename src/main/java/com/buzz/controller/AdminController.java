package com.buzz.controller;

import com.buzz.entity.Admin;
import com.buzz.entity.Paging;
import com.buzz.service.AdminService;
import com.buzz.utils.Md5;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.IncorrectCredentialsException;
import org.apache.shiro.authc.UnknownAccountException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;

/**
 * @Author: aaaJYH
 * @Date: 2018/8/22 15:38
 */

@Controller
public class AdminController {

    @Autowired
    private AdminService adminService;

    //跳转登录页面
    @RequestMapping("/loginIndex")
    public String loginIndex(){
            return "backstage_supporter/login";
    }

    //登录失败后去的登录页面显示失败信息
    @RequestMapping("/login")
    public String login(HttpServletRequest request){
       //登录失败从request获取shiro处理的异常信息
        //shiroLoginFailure是Shiro异常类的全类名
        String exception=(String) request.getAttribute("shiroLoginFailure");
        String msg="";
        if (exception != null) {
            if (UnknownAccountException.class.getName().equals(exception)) {
                msg = "错误信息:账号不存在";
            }else if (IncorrectCredentialsException.class.getName().equals(exception)) {
                msg = "错误信息:密码不正确";
            }else {
                msg = exception;
            }
        }
        request.getSession().setAttribute("msg",msg);
        return "backstage_supporter/login";
    }

    //登录成功后去后台主页面
    @RequestMapping("/successLogin")
    public String loginSuccess(HttpServletRequest request){
        request.getSession().removeAttribute("msg"); //清空session
        return "backstage_supporter/background";
    }

    @RequestMapping("/adminIndex")
    public String adminIndex(){
        return "backstage_supporter/adminManage";
    }

    /**
     * 分页查询admin
     * @param page
     * @param rows
     * @return
     */
    @RequestMapping("/pagingQueryAdmin")
    @ResponseBody
    public Paging<Admin> pagingQueryAdmin(int page, int rows){
        return adminService.pagingQueryAdmin(page,rows);
    }

    /**
     * 添加admin
     * @param admin
     * @return
     */
    @RequestMapping("/addAdmin")
    @ResponseBody
    public boolean addAdmin(Admin admin){
        admin.setPwd(Md5.encrypt(admin.getPwd()));
        return adminService.addAdmin(admin);
    }

    //根据id删除admin
    @RequestMapping("/byIdDelAdmin")
    @ResponseBody
    public boolean byIdDelAdmin(Integer id){
        return adminService.byIdDelAadmin(id);
    }

    //编辑admin
    @RequestMapping("/EditAdmin")
    @ResponseBody
    public boolean EditAdmin(Admin admin){
        admin.setPwd(Md5.encrypt(admin.getPwd()));
        return adminService.EditAdmin(admin);
    }

    //注销当前登录
    @RequestMapping("/logout")
    @ResponseBody
    public String logout(){
        SecurityUtils.getSubject().logout(); //调用shiro注销方法
        return "success";
    }
}
