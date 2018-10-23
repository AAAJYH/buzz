package com.buzz.controller;

import com.alibaba.fastjson.JSON;
import com.buzz.entity.smsCode;
import com.buzz.entity.users;
import com.buzz.service.emailService;
import com.buzz.service.usersService;
import com.buzz.utils.Encryption;
import com.buzz.utils.verifyCodeUtils;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.ResourceUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttributes;

import javax.annotation.Resource;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;

@Controller
@RequestMapping("usersController")
@SessionAttributes("user")
public class usersController {
    @Resource
    private usersService usersservice;
    @Resource
    private emailService emailservice;
    /**
     * 显示登录页面
     *
     * @return 返回登录页面路径
     */
    @RequestMapping("show_login_html")
    public String show_login_html() {
        return "front_desk/login";
    }

    /**
     * 显示注册页面
     *
     * @param model
     * @param bindPhone 获取提交的手机号
     * @return
     */
    @RequestMapping("show_register_html")
    public String show_register_html(Model model, String bindPhone) {
        model.addAttribute("bindPhone", bindPhone);
        return "front_desk/register";
    }

    /**
     * 显示用户使用协议
     *
     * @return 返回登录页面路径
     */
    @RequestMapping("show_agreement_html")
    public String show_agreement_html() {
        return "front_desk/agreement";
    }

    /**
     * 显示忘记密码页面
     * @return
     */
    @RequestMapping("show_forgetuserPassword_html")
    public String show_forgetuserPassword_html()
    {
        return "front_desk/forgetuserPassword";
    }

    /**
     * 显示修改用户密码页面,根据temp变量指定显示根据手机号修改用户密码页面或根据邮箱修改用户密码页面
     * @param temp email/phone
     * @param passport 手机号或邮箱账号
     * @param model
     * @param response
     * @return
     */
    @RequestMapping("showUpdateuserPassword_html")
    public String showUpdateuserPassword_html(String temp,String passport,Model model,HttpServletResponse response)
    {
        if(null!=temp&&temp.equals("email"))
        {
            String code=Encryption.getUUID();
            Cookie cookie=new Cookie(code,passport);
            cookie.setMaxAge(60*60*24);//设置为一天时间
            response.addCookie(cookie);
            String url="http://localhost:8000/usersController/show_updateuserPasswordBybindEmail_html?code="+code;
            String content="<div style='width:500px;margin:auto;border:1px solid #DEDEDE;padding:50px;'><p style='border-bottom:1px solid #CCCCCC;padding:10px 0px;'><span style='font-family:Montserrat;font-weight:700;letter-spacing:1px;text-transform:uppercase;font-size:25px;color: #7B7B7B;'>buzz Travel network</span></p><p style='font-size:18px;font-family: 黑体;font-weight: bold;color:#7B7B7B;'>亲爱的用户，你好!</p><p style='color: #7B7B7B;'>我们已经收到了你的密码重置请求，请 24 小时内点击下面的按钮重置密码。</p><p style='text-align:center;'><a style='display: inline-block;width:120px;height:50px;background-color:#FFA800;color:white;line-height: 50px;border-radius: 3px;text-decoration: none;' href='"+url+"'>重置密码</a></p><p style='margin-top:50px;border-top:1px solid #CCCCCC;padding:10px 0px;color:#7B7B7B;'>如果以上按钮无法打开，请把下面的链接复制到浏览器地址栏中打开：</p><a href='"+url+"' style='color:#7B7B7B;'>"+url+"</a></div>";
            emailservice.sendHtmlEmail(passport,"设置新密码",content);
            model.addAttribute("bindEmail",passport);
            return "front_desk/updateBybindEmailuserPassword";
        }
        else if(null!=temp&&temp.equals("phone"))
        {
            int verificationCode = (int) ((Math.random() * 9 + 1) * 100000); //验证码
            String smsContent = "【嗡嗡嗡旅游网】尊敬的用户，您的验证码为" + verificationCode;//短信签名+内容（用模板不能自定义必须和模板一致）
            //SmsVerification.getVerificationCode(bindPhone,smsContent);
            System.out.println(verificationCode);
            smsCode smscode = new smsCode(passport, verificationCode);
            String str = JSON.toJSONString(smscode);
            str = str.replace('"', '#');
            str = str.replace(',', '@');
            Cookie cookie = new Cookie("smsCode", str);
            cookie.setMaxAge(60 * 5);
            response.addCookie(cookie);
            model.addAttribute("bindPhone",passport);
            return "front_desk/updateBybindPhoneuserPassword";
        }
        else
        {
            model.addAttribute("danger_message","啊哦,出错了,请不要随意更改浏览器地址栏地址!");
            return "front_desk/forgetuserPassword";
        }
    }
    @RequestMapping("show_updateuserPasswordBybindEmail_html")
    public String show_updateuserPasswordBybindEmail_html(String code,Model model)
    {
        model.addAttribute("code",code);
        return "front_desk/updateuserPasswordBybindEmail";
    }
    /**
     * 验证注册用户
     *
     * @param bindPhone 指定发送手机号
     * @return
     */
    @ResponseBody
    @RequestMapping("SendRegisterVerificationCode")
    public int SendRegisterVerificationCode(String bindPhone, HttpServletRequest request, HttpServletResponse response) {
        int verificationCode = (int) ((Math.random() * 9 + 1) * 100000); //验证码
        String smsContent = "【嗡嗡嗡旅游网】尊敬的用户，您的验证码为" + verificationCode;//短信签名+内容（用模板不能自定义必须和模板一致）
        //SmsVerification.getVerificationCode(bindPhone,smsContent);
        System.out.println(verificationCode);
        smsCode smscode = new smsCode(bindPhone, verificationCode);
        String str = JSON.toJSONString(smscode);
        str = str.replace('"', '#');
        str = str.replace(',', '@');
        Cookie cookie = new Cookie("smsCode", str);
        cookie.setMaxAge(60 * 5);
        response.addCookie(cookie);
        return verificationCode;
    }

    /**
     * 校验短信验证码
     *
     * @param bindPhone
     * @param verificationCode
     * @param request
     * @param response
     * @return
     */
    @ResponseBody
    @RequestMapping("checksmsCode")
    public boolean checksmsCode(String bindPhone, Integer verificationCode, HttpServletRequest request, HttpServletResponse response) {
        if (null != verificationCode) {
            Cookie[] cookies = request.getCookies();
            if (null != cookies && cookies.length > 0) {
                boolean flag = false;
                for (Cookie c : cookies) {
                    if (c.getName().equals("smsCode")) {
                        String str = c.getValue();
                        str = str.replace('#', '"');
                        str = str.replace('@', ',');
                        smsCode smscode = JSON.parseObject(str, smsCode.class);
                        if (smscode.getBindPhone().equals(bindPhone) && smscode.getVerificationCode().equals(verificationCode))
                            flag = true;
                        else
                            flag = false;
                    }
                }
                return flag;
            } else
                return false;
        } else
            return false;
    }

    /**
     * 检测图片验证码是否正确
     * @param code
     * @param request
     * @param response
     * @return
     */
    @ResponseBody
    @RequestMapping("checkCode")
    public boolean checkCode(String code, HttpServletRequest request, HttpServletResponse response)
    {
        Cookie []cookies=request.getCookies();
        if(null!=cookies&&0<cookies.length)
        {
            for(Cookie c:cookies)
            {
                if("verifyCode".equals(c.getName()))
                {
                    if(c.getValue().equals(code.toUpperCase()))
                        return true;
                    else
                        return false;
                }
            }
            return false;
        }
        else
            return false;
    }
    /**
     * 注册用户
     *
     * @param model
     * @param user
     * @param password
     * @param mobile
     * @return
     */
    @RequestMapping("register_user")
    public String register_user(Model model, users user, String password, String mobile) {
        user.setUserId(Encryption.getUUID());
        user.setPhoto("images/wKgED1uqIpCARLIhAAAZUeRPlFM676.png");
        user.setUserPassword(Encryption.encryption_md5(password));
        user.setSex("男");
        user.setStateId("0ee26211-3ae8-48b7-973f-8488bfe837d6");
        user.setBindPhone(mobile);
        if (0 < usersservice.register_user(user))
        {
            model.addAttribute("warning_message","注册用户成功,请登录。");
            return "front_desk/login";
        }
        else {
            model.addAttribute("bindPhone", user.getPhoto());
            model.addAttribute("danger_message", "抱歉,注册用户失败,请重试。");
            return "front_desk/register";
        }
    }

    /**
     * 检测手机号是否已经存在
     * @param bindPhone
     * @return
     */
    @ResponseBody
    @RequestMapping("checkbindPhone")
    public Integer checkbindPhone(String bindPhone)
    {
        return usersservice.checkbindPhone(bindPhone);
    }

    /**
     *  检测邮箱是否已经存在
     * @param bindEmail
     * @return
     */
    @ResponseBody
    @RequestMapping("checkbindEmail")
    public Integer checkbindEmail(String bindEmail)
    {
        return usersservice.checkbindEmail(bindEmail);
    }

    /**
     * 生成图片验证码并返回给前台
     * @param request
     * @param response
     * @throws IOException
     */
    @ResponseBody
    @RequestMapping("generate_verifyCode")
    public void generate_verifyCode(HttpServletRequest request,HttpServletResponse response) throws IOException
    {
        String path = ResourceUtils.getURL("src/main/resources/static/verifyCodeImages").getPath();
        path=path.replace("%20"," ");
        int w = 120, h = 40;
        String verifyCode = verifyCodeUtils.generateVerifyCode(4);
        //将生成的验证码图片保存在服务器
        File file = new File(path+"/"+verifyCode + ".jpg");
        verifyCodeUtils.outputImage(w, h, file, verifyCode);
        //将验证码保存在cookie中
        Cookie cookie=new Cookie("verifyCode",verifyCode);
        cookie.setMaxAge(60*5);
        response.addCookie(cookie);
        //获取验证码图片返回给前台显示
        FileInputStream fis=null;
        OutputStream os=null;
        try
        {
            fis=new FileInputStream(path+"/"+verifyCode+".jpg");
            os=response.getOutputStream();
            int count=0;
            byte[]buffer=new byte[1024*8];
            while((count=fis.read(buffer))!=-1)
            {
                os.write(buffer,0,count);
                os.flush();
            }
        }
        catch(Exception e)
        {
            e.printStackTrace();
        }
        finally
        {
            try
            {
                fis.close();//必须在上面,之后要进行删除图片操作,删除之前关闭,删除图片不能被其他进程所使用
                os.close();
                if(file.exists())
                {
                    file.delete();
                }
            }catch(IOException e)
            {
                e.printStackTrace();
            }
        }
    }
    @RequestMapping("update_userPassword_By_bindPhone")
    public String update_userPassword_By_bindPhone(String password,String mobile,Model model)
    {
        users user=usersservice.login_user(mobile,Encryption.encryption_md5(password));
        if(null!=user&&user.getBindPhone().equals(mobile))
        {
            model.addAttribute("bindPhone",mobile);
            model.addAttribute("danger_message","新密码不能与旧密码一致,请重新设置。");
            return "front_desk/updateBybindPhoneuserPassword";
        }
        else
        {
            Integer result=usersservice.update_userPassword_By_bindPhone(Encryption.encryption_md5(password),mobile);
            if(null!=result&&0<result)
            {
                model.addAttribute("warning_message","密码设置成功,请重新登录。");
                return "front_desk/login";
            }
            else
            {
                model.addAttribute("bindPhone",mobile);
                model.addAttribute("danger_message","密码设置失败,请重新设置。");
                return "front_desk/updateBybindPhoneuserPassword";
            }
        }
    }
    @RequestMapping("update_userPassword_By_bindEmail")
    public String update_userPassword_By_bindEmail(String code,String password,HttpServletRequest request,Model model)
    {
        Cookie [] cookies=request.getCookies();
        String bindEmail=null;
        if(null!=cookies&&0<cookies.length)
        {
            for(Cookie c:cookies)
            {
                if(c.getName().equals(code))
                {
                    bindEmail=c.getValue();
                }
            }
        }
        if(null!=bindEmail)
        {
            users user=usersservice.find_userByuserPasswordAndbindEmail(bindEmail,Encryption.encryption_md5(password));
            if(null!=user&&bindEmail.equals(user.getBindEmail()))
            {
                model.addAttribute("danger_message","新密码不能与旧密码一致,请重新设置。");
                model.addAttribute("code",code);
                return "front_desk/updateuserPasswordBybindEmail";
            }
            else
            {
                int result=usersservice.update_userPassword_By_bindEmail(Encryption.encryption_md5(password),bindEmail);
                if(0<result)
                {
                    model.addAttribute("warning_message","密码设置成功,请重新登录。");
                    return "front_desk/login";
                }
                else
                {
                    model.addAttribute("danger_message","抱歉,修改密码失败,请重新设置。");
                    model.addAttribute("code",code);
                    return "front_desk/updateuserPasswordBybindEmail";
                }
            }
        }
        else
        {
            model.addAttribute("danger_message","验证数据已过期,请重试!");
            return "front_desk/forgetuserPassword";
        }
    }
    @RequestMapping("login_user")
    public String login_user(String passport,String password,Model model,HttpSession session) {
        if (null != passport && !"".equals(passport) && null != password && !"".equals(password))
        {
            users user=usersservice.login_user(passport,Encryption.encryption_md5(password));
            if(null!=user&&user.getBindPhone().equals(passport))
            {
                model.addAttribute("user",user);
                return "front_desk/personalCenter";
            }
            else
            {
                model.addAttribute("danger_message","账号或密码错误,请重试!");
                return "front_desk/login";
            }
        }
        else
        {
            users user= (users) session.getAttribute("user");
            if(null!=user&&!"".equals(user.getBindPhone()))
            {
                return "front_desk/personalCenter";
            }
            else
            {
                model.addAttribute("danger_message","账号或密码错误,请重试!");
                return "front_desk/login";
            }
        }
    }
}
