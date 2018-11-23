package com.buzz.controller;

import com.alibaba.fastjson.JSON;
import com.buzz.entity.Paging;
import com.buzz.entity.smsCode;
import com.buzz.entity.userbindEmailAndbindPhone;
import com.buzz.entity.users;
import com.buzz.service.*;
import com.buzz.utils.Encryption;
import com.buzz.utils.SmsVerification;
import com.buzz.utils.verifyCodeUtils;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.ResourceUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttributes;
import org.springframework.web.bind.support.SessionStatus;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.Resource;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.awt.image.BufferedImage;
import java.io.*;
import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("usersController")
@SessionAttributes("user")
public class usersController {
    @Resource
    private usersService usersservice;
    @Resource
    private emailService emailservice;
    @Resource
    private replyAskRespondService replyaskrespondservice;
    @Resource
    private askRespondService askrespondservice;
    @Resource
    private replyAskRespondCommentService replyaskrespondcommentservice;
    @Resource
    private userbindEmailAndbindPhoneService userbindemailandbindphoneservice;
    /**
     * 显示登录页面
     *
     * @return 返回登录页面路径
     */
    @RequestMapping("show_login_html")
    public String show_login_html(String url,HttpServletRequest request) {
        request.getServletContext().setAttribute("pageurl",url);
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
            String url="http://localhost/usersController/show_updateuserPasswordBybindEmail_html?code="+code;
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
    public String register_user(Model model, users user, String password, String mobile) throws IOException {
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

    //登录
    @RequestMapping("login_user")
    public String login_user(String passport,String password,Model model,HttpSession session,HttpServletRequest request) {

        if (null != passport && !"".equals(passport) && null != password && !"".equals(password))
        {
            users user=null;
            if(passport.indexOf("@")>0)//判断是否为邮箱
            {
                user=usersservice.find_userByuserPasswordAndbindEmail(passport,Encryption.encryption_md5(password));
                if(null!=user&&user.getBindEmail().equals(passport))
                {
                    model.addAttribute("user",user);
                    if(request.getServletContext().getAttribute("pageurl")!=null&&!request.getServletContext().getAttribute("pageurl").equals("")){
                        return "redirect:"+request.getServletContext().getAttribute("pageurl").toString().substring(16);
                    }else{
                        return "front_desk/homePage.html";
                    }
                }
                else
                {
                    model.addAttribute("danger_message","账号或密码错误,请重试!");
                    return "front_desk/login";
                }
            }
            else
            {
                user=usersservice.login_user(passport,Encryption.encryption_md5(password));
                if(null!=user&&user.getBindPhone().equals(passport))
                {
                    model.addAttribute("user",user);
                    if(request.getServletContext().getAttribute("pageurl")!=null&&!request.getServletContext().getAttribute("pageurl").equals("")){
                        return "redirect:"+request.getServletContext().getAttribute("pageurl").toString().substring(16);
                    }else{
                        return "front_desk/homePage.html";
                    }
                }
                else
                {
                    model.addAttribute("danger_message","账号或密码错误,请重试!");
                    return "front_desk/login";
                }
            }
        }
        else
        {
            users user= (users) session.getAttribute("user");
            if(null!=user&&!"".equals(user.getBindPhone()))
                if(request.getServletContext().getAttribute("pageurl")!=null&&!request.getServletContext().getAttribute("pageurl").equals("")){
                    return "redirect:"+request.getServletContext().getAttribute("pageurl").toString().substring(16);
                }else{
                    return "front_desk/homePage.html";
                }
            else
            {
                model.addAttribute("danger_message","账号或密码错误,请重试!");
                return "front_desk/login";
            }
        }
    }
    @ResponseBody
    @RequestMapping("getCurrentLoginUser")
    public Map<String,Object> getCurrentLoginUser(HttpSession session)
    {
        Map<String,Object> map=new HashMap<String,Object>();
        users user=(users) session.getAttribute("user");
        if(null!=user)
        {
            map.put("loginState",true);
            map.put("currentUser",user);
        }
        else
            map.put("loginState",false);
        return map;
    }

    /**
     * 根据当前登录用户,问答编号,状态编号回复问答
     * @param askRespondId
     * @param session
     * @return
     * @throws IOException
     */
    @ResponseBody
    @RequestMapping("getCurrentLoginUserAndreplyAskRespond")
    public Map<String,Object>getCurrentLoginUserAndreplyAskRespond(String askRespondId,HttpSession session) throws IOException {
        Map<String,Object> map=new HashMap<String,Object>();
        users user=(users) session.getAttribute("user");
        if(null!=user)
        {
            map.put("loginState",true);
            map.put("currentUser",user);
        }
        else
            map.put("loginState",false);
        return map;
    }
    /**
     * 根据用户编号获取用户
     * @param userId 用户编号
     * @return users实体
     */
    @ResponseBody
    @RequestMapping("find_userByuserId")
    public users find_userByuserId(String userId)
    {
        return usersservice.find_userByuseruserId(userId);
    }

    /**
     * 退出当前登录用户
     * @param session
     * @return
     */
    @ResponseBody
    @RequestMapping("loginOut")
    public boolean loginOut(HttpSession session,SessionStatus sessionstatus)
    {
        session.removeAttribute("user");
        sessionstatus.setComplete();
        users user= (users) session.getAttribute("user");
        if(null!=user)
            return false;
        else
            return true;
    }
    /**
     * 查询所有用户的被采纳答案数量
     *
     * @return
     */
    @ResponseBody
    @RequestMapping("find_user_optimumAnswerNum")
    public List<users> find_user_optimumAnswerNum() {
        return usersservice.find_user_optimumAnswerNum(1,"true");
    }

    /**
     * 查询所有用户的回复问答数量
     * @return
     */
    @ResponseBody
    @RequestMapping("find_user_replyAskRespondNum")
    public List<users> find_user_replyAskRespondNum()
    {
        return usersservice.find_user_replyAskRespondNum(1,"0ee26211-3ae8-48b7-973f-8488bfe837d6");
    }

    /**
     * 查询所有用户的被顶数量
     * @return
     */
    @ResponseBody
    @RequestMapping("find_user_replyAskRespondTopNum")
    public List<users> find_user_replyAskRespondTopNum()
    {
        return usersservice.find_user_replyAskRespondTopNum(1);
    }

    @ResponseBody
    @RequestMapping("find_usersByuserId")
    public users find_usersByuserId(String userId)
    {
        return usersservice.find_userByuseruserId(userId);
    }

    /**
     * 后台用户页面
     * @return
     */
    @RequestMapping("/usersManageIndex")
    public String usersManageIndex(){
        return "backstage_supporter/usersManage.html";
    }

    /**
     * 后台分页查询用户
     * @param page
     * @param rows
     * @return
     */
    @RequestMapping("/PagingQueryAllUsers")
    @ResponseBody
    public Paging<users> PagingQueryAllUsers(Integer page,Integer rows){
        return usersservice.PagingQueryAllUsers(page,rows);
    }

    /**
     * 根据用户编号修改个人简介
     * @param userId
     * @param individualResume
     * @return
     */
    @ResponseBody
    @RequestMapping("update_users_individualResumeByuserId")
    public boolean update_users_individualResumeByuserId(String userId,String individualResume)
    {
        if(0<usersservice.update_users_individualResumeByuserId(userId,individualResume))
            return true;
        else
            return false;
    }

    /**
     * 修改用户信息
     * @param model
     * @param userId
     * @param userName
     * @param sex
     * @param cityId
     * @param birthDate
     * @param individualResume
     * @return
     */
    @ResponseBody
    @RequestMapping("update_usersByuserId")
    public boolean update_usersByuserId(Model model,String userId,String userName,String sex,String cityId,String birthDate,String individualResume) throws ParseException {
        users update_user=new users();
        update_user.setUserId(userId);
        update_user.setUserName(userName);
        update_user.setSex(sex);
        update_user.setAddress(cityId);
        update_user.setBirthDate(Timestamp.valueOf(birthDate+" 18:01:01"));
        update_user.setIndividualResume(individualResume);
        if(0<usersservice.update_usersByuserId(update_user))
        {
            model.addAttribute("user",usersservice.find_userByuseruserId(userId));
            return true;
        }
        else
            return false;
    }

    /**
     * 上传图片
     * @return
     */
    @ResponseBody
    @RequestMapping("upload_users_photo")
    public Map<String,Object> update_users_photoByuserId(@RequestParam("photo")MultipartFile photo) throws IOException {
        Map<String,Object> map=new HashMap<String,Object>();
        String oldfilename = photo.getOriginalFilename();
        String filetype = oldfilename.substring(oldfilename.lastIndexOf("."));
        String newfilename = Encryption.getUUID() + filetype;
        FileOutputStream fos=null;
        try
        {
            String path = ResourceUtils.getURL("src/main/resources/static/images/userPhoto").getPath();
            path = path.replace("%20", " ");
            fos=new FileOutputStream(path+"/"+newfilename);
            byte[] bytes=photo.getBytes();
            fos.write(bytes);
            fos.flush();
            File file=new File(path+"/"+newfilename);
            if(file.exists())
            {
                map.put("result",true);
                map.put("url","images/userPhoto/"+newfilename);
            }
        }
        catch(IOException e)
        {
            map.put("result",false);
            e.printStackTrace();
        }
        finally
        {
            fos.flush();
            fos.close();
        }
        return map;
    }

    /**
     * 通过用户编号和已上传的图片路径,剪切图片并修改用户头像
     * @param userId 用户编号
     * @param url 图片路径
     * @param boundx 封面x
     * @param boundy 封面y
     * @param selectx 选择x
     * @param selecty 选择y
     * @param selectw 选择w
     * @param selecth 选择h
     * @return
     */
    @ResponseBody
    @RequestMapping("update_users_photoByuserId")
    public Map<String,Object> update_users_photoByuserId(Model model,String userId,String url,Integer boundx,Integer boundy,Integer selectx,Integer selecty,Integer selectw,Integer selecth) throws IOException
    {
        Map<String,Object> map=new HashMap<String,Object>();
        String path = ResourceUtils.getURL("src/main/resources/static").getPath();
        path = path.replace("%20", " ");
        String filetype = url.substring(url.lastIndexOf("."));
        String newfilename = "images/userPhoto/"+Encryption.getUUID() + filetype;
        String newfilenames="images/userPhoto/"+Encryption.getUUID() + filetype;
        String oldfile=path+"/"+url;
        String newfile=path+"/"+newfilename;
        String newfiles=path+"/"+newfilenames;
        double wr=0,hr=0;
        try
        {
            boolean flag=Encryption.operateByMaxSize(oldfile,newfile,boundy,boundx);//将图片缩放
            if(flag)
            {
                File old=new File(oldfile);
                if(old.exists())//如果存在删除旧图片
                    old.delete();
                BufferedImage bi = Encryption.file2img(newfile);//读取图片
                File newphoto=new File(newfile);
                if(newphoto.exists())
                    newphoto.delete();
                BufferedImage bii = Encryption.img_tailor(bi, selectx, selecty, selectw,selecth);//按照x,y轴,宽度和高度产生新的图片
                Encryption.img2file(bii, filetype.replace(".",""), newfiles);//生成图片
                File file=new File(newfiles);
                if(file.exists())
                {
                    users update_user=new users();
                    update_user.setUserId(userId);
                    update_user.setPhoto(newfilenames);
                    users user=usersservice.find_userByuseruserId(userId);
                    String delete_filename=user.getPhoto();
                    if(0<usersservice.update_usersByuserId(update_user))
                    {
                        if(!delete_filename.equals("images/wKgED1uqIpCARLIhAAAZUeRPlFM676.png"))//判断不是默认图片
                        {
                            File delete_file=new File(path+"/"+delete_filename);
                            if(delete_file.exists())//删除该用户之前的头像
                                delete_file.delete();
                        }
                        user.setPhoto(newfilenames);
                        model.addAttribute("user",user);
                        map.put("result",true);
                    }
                    else
                        map.put("result",false);
                }
                else
                    map.put("result",true);
            }
            else
                map.put("result",false);
        }
        catch(Exception e)
        {
            map.put("result",false);
            e.printStackTrace();
        }
        return map;
    }

    /**
     * 根据图片路径删除图片
     * @param url
     * @return
     * @throws FileNotFoundException
     */
    @ResponseBody
    @RequestMapping("delete_users_photo")
    public boolean delete_users_photo(String url) throws FileNotFoundException
    {
        String path = ResourceUtils.getURL("src/main/resources/static").getPath();
        path = path.replace("%20", " ");
        String filepath=path+"/"+url;
        File file=new File(filepath);
        if(file.exists())
            file.delete();
        return true;
    }

    /**
     * 发送邮箱验证
     * @param userId
     * @param bindEmail
     * @return
     */
    @ResponseBody
    @RequestMapping("send_bindEmailMessage")
    public boolean send_bindEmailMessage(String userId,String bindEmail)
    {
        String updateId=Encryption.getUUID();
        userbindEmailAndbindPhone ueap=userbindemailandbindphoneservice.find_userbindEmailAndbindPhoneByuserIdAndtype(userId,"insertbindEmail");
        if(null==ueap)
        {
            ueap=new userbindEmailAndbindPhone();
            ueap.setUpdateId(updateId);
            ueap.setUserId(userId);
            ueap.setUpdatebindEmail(bindEmail);
            ueap.setUpdatebindEmailstateId("5402e51d-b657-432a-8e73-025db3393dd5");
            ueap.setType("insertbindEmail");
            if(0<userbindemailandbindphoneservice.insert_userbindEmailAndbindPhone(ueap))
            {
                users user=usersservice.find_userByuseruserId(userId);
                SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd");
                String url="http://localhost/userbindEmailAndbindPhoneController/update_userbindEmailByuserbindEmailAndbindPhone?updateId="+updateId;
                String content="<div><p>"+user.getUserName()+",你好:</p><p>嗡嗡嗡验证您的常用邮箱，是为了确认您能收到好友的提醒，此邮箱帐号我们会为您保密。</p><p>请点击下面的连接地址或者将下面的地址复制到浏览器完成验证。</p><p><a href='"+url+"'>"+url+"</a></p><p>下面是您的绑定信息：</p><p>邮件地址：<a href='https://mail.qq.com'>"+bindEmail+"</a></p><p style='margin-left:100px'>嗡嗡嗡制作</p><p style='margin-left:100px'>"+sdf.format(new Date())+"</p></div>";
                emailservice.sendHtmlEmail(bindEmail,"设置新邮箱",content);
                return true;
            }
            else
                return false;
        }
        else
        {
            users user=usersservice.find_userByuseruserId(userId);
            SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd");
            String url="http://localhost/userbindEmailAndbindPhoneController/update_userbindEmailByuserbindEmailAndbindPhone?updateId="+ueap.getUpdateId();
            String content="<div><p>"+user.getUserName()+",你好:</p><p>嗡嗡嗡验证您的常用邮箱，是为了确认您能收到好友的提醒，此邮箱帐号我们会为您保密。</p><p>请点击下面的连接地址或者将下面的地址复制到浏览器完成验证。</p><p><a href='"+url+"'>"+url+"</a></p><p>下面是您的绑定信息：</p><p>邮件地址：<a href='https://mail.qq.com'>"+ueap.getUpdatebindEmail()+"</a></p><p style='margin-left:100px'>嗡嗡嗡制作</p><p style='margin-left:100px'>"+sdf.format(new Date())+"</p></div>";
            emailservice.sendHtmlEmail(bindEmail,"设置新邮箱",content);
            return true;
        }
    }

    /**
     * 发送修改绑定手机号验证码
     * @param userId
     * @param passport 联系方式
     * @return
     */
    @ResponseBody
    @RequestMapping("send_updatebindPhoneMessage")
    public Map<String,Object> send_updatebindPhoneMessage(String userId,String passport)
    {
        Map<String,Object> map=new HashMap<String,Object>();
        int verificationCode = (int) ((Math.random() * 9 + 1) * 100000); //验证码
        boolean result=false;
        userbindEmailAndbindPhone ueap=userbindemailandbindphoneservice.find_userbindEmailAndbindPhoneByuserIdAndtype(userId,"updatebindPhone");
        if(null!=ueap)
        {
            ueap.setVerificationCode(verificationCode);
            if(0<userbindemailandbindphoneservice.update_userbindEmailAndbindPhoneByupdateId(ueap))
                result=true;
        }
        else
        {
            ueap=new userbindEmailAndbindPhone();
            ueap.setUpdateId(Encryption.getUUID());
            ueap.setUserId(userId);
            ueap.setVerificationMode(passport);
            ueap.setVerificationCode(verificationCode);
            ueap.setType("updatebindPhone");
            if(0<userbindemailandbindphoneservice.insert_userbindEmailAndbindPhone(ueap))
                result=true;
        }
        if(result)
        {
            if(passport.indexOf("@")>0)//判断是否为邮箱或者手机号
            {
                map.put("type","email");
                SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd");
                users user=usersservice.find_userByuseruserId(userId);
                String content="<table border='0' cellpadding='0' cellspacing='0' style='background-color:f7f9fa; border-radius:3px;border:1px solid #dedede;margin:0 auto; background-color:#ffffff' width='552'><tbody><tr><td bgcolor='#ffffff' align='center' style='padding: 0 15px 0px 15px;'><table border='0' cellpadding='0' cellspacing='0' width='480'><tbody><tr><td><table width='100%' border='0' cellpadding='0' cellspacing='0'><tbody><tr><td><table cellpadding='0' cellspacing='0' border='0' align='left'><tbody><tr><td width='550' align='left' valign='top'><table width='100%' border='0' cellpadding='0' cellspacing='0'><tbody><tr><td bgcolor='#ffffff' align='left' style='background-color:#ffffff; font-size: 17px; color:#7b7b7b; padding:28px 0 0 0;line-height:25px;'><b>"+user.getUserName()+",你好：</b></td></tr><tr><td align='left' valign='top' style='font-size:15px; color:#7b7b7b; font-size:14px; line-height: 25px; font-family:Hiragino Sans GB; padding: 20px 0px 20px 0px'>以下是您的验证码,很高兴您使用我们的服务。</td></tr><tr><td style='border-bottom:1px #f1f4f6 solid; padding: 10px 0 35px 0;' align='center'><table border='0' cellspacing='0' cellpadding='0'><tbody><tr><td><span style='font-family:Hiragino Sans GB;font-size:17px;'>验证码："+verificationCode+"</span></td></tr></tbody></table></td></tr><tr><td align='right' valign='top' style='font-size:15px; color:#7b7b7b; font-size:14px; line-height: 25px; font-family:Hiragino Sans GB; padding: 20px 0px 35px 0px'>嗡嗡嗡<br><span style='border-bottom: 1px dashed rgb(204, 204, 204); position: relative;' t='5' times=''>"+sdf.format(new Date())+"</span></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table>";
                emailservice.sendHtmlEmail(passport,"更换手机号",content);
            }
            else
            {
                map.put("type","phone");
                String smsContent = "【嗡嗡嗡旅游网】尊敬的用户，您的验证码为" + verificationCode;//短信签名+内容（用模板不能自定义必须和模板一致）
                //SmsVerification.getVerificationCode(passport,smsContent);
            }
            map.put("verificationCode",verificationCode);
            map.put("updateId",ueap.getUpdateId());
        }
        map.put("result",result);
        System.out.println(verificationCode);
        return map;
    }
    /**
     * 发送修改绑定邮箱验证码
     * @param userId
     * @param passport 联系方式
     * @return
     */
    @ResponseBody
    @RequestMapping("send_updatebindEmailMessage")
    public Map<String,Object> send_updatebindEmailMessage(String userId,String passport)
    {
        Map<String,Object> map=new HashMap<String,Object>();
        int verificationCode = (int) ((Math.random() * 9 + 1) * 100000); //验证码
        boolean result=false;
        userbindEmailAndbindPhone ueap=userbindemailandbindphoneservice.find_userbindEmailAndbindPhoneByuserIdAndtype(userId,"updatebindEmail");
        if(null!=ueap)
        {
            ueap.setVerificationCode(verificationCode);
            if(0<userbindemailandbindphoneservice.update_userbindEmailAndbindPhoneByupdateId(ueap))
                result=true;
        }
        else
        {
            ueap=new userbindEmailAndbindPhone();
            ueap.setUpdateId(Encryption.getUUID());
            ueap.setUserId(userId);
            ueap.setVerificationMode(passport);
            ueap.setVerificationCode(verificationCode);
            ueap.setType("updatebindEmail");
            if(0<userbindemailandbindphoneservice.insert_userbindEmailAndbindPhone(ueap))
                result=true;
        }
        if(result)
        {
            if(passport.indexOf("@")>0)//判断是否为邮箱或者手机号
            {
                map.put("type","email");
                SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd");
                users user=usersservice.find_userByuseruserId(userId);
                String content="<table border='0' cellpadding='0' cellspacing='0' style='background-color:f7f9fa; border-radius:3px;border:1px solid #dedede;margin:0 auto; background-color:#ffffff' width='552'><tbody><tr><td bgcolor='#ffffff' align='center' style='padding: 0 15px 0px 15px;'><table border='0' cellpadding='0' cellspacing='0' width='480'><tbody><tr><td><table width='100%' border='0' cellpadding='0' cellspacing='0'><tbody><tr><td><table cellpadding='0' cellspacing='0' border='0' align='left'><tbody><tr><td width='550' align='left' valign='top'><table width='100%' border='0' cellpadding='0' cellspacing='0'><tbody><tr><td bgcolor='#ffffff' align='left' style='background-color:#ffffff; font-size: 17px; color:#7b7b7b; padding:28px 0 0 0;line-height:25px;'><b>"+user.getUserName()+",你好：</b></td></tr><tr><td align='left' valign='top' style='font-size:15px; color:#7b7b7b; font-size:14px; line-height: 25px; font-family:Hiragino Sans GB; padding: 20px 0px 20px 0px'>以下是您的验证码,很高兴您使用我们的服务。</td></tr><tr><td style='border-bottom:1px #f1f4f6 solid; padding: 10px 0 35px 0;' align='center'><table border='0' cellspacing='0' cellpadding='0'><tbody><tr><td><span style='font-family:Hiragino Sans GB;font-size:17px;'>验证码："+verificationCode+"</span></td></tr></tbody></table></td></tr><tr><td align='right' valign='top' style='font-size:15px; color:#7b7b7b; font-size:14px; line-height: 25px; font-family:Hiragino Sans GB; padding: 20px 0px 35px 0px'>嗡嗡嗡<br><span style='border-bottom: 1px dashed rgb(204, 204, 204); position: relative;' t='5' times=''>"+sdf.format(new Date())+"</span></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table>";
                emailservice.sendHtmlEmail(passport,"更换邮箱地址",content);
            }
            else
            {
                map.put("type","phone");
                String smsContent = "【嗡嗡嗡旅游网】尊敬的用户，您的验证码为" + verificationCode;//短信签名+内容（用模板不能自定义必须和模板一致）
                //SmsVerification.getVerificationCode(passport,smsContent);
            }
            map.put("verificationCode",verificationCode);
            map.put("updateId",ueap.getUpdateId());
        }
        map.put("result",result);
        System.out.println(verificationCode);
        return map;
    }
    /**
     * 向新的手机号或邮箱发送验证码
     * @param userId
     * @param passport
     * @return
     */
    @ResponseBody
    @RequestMapping("send_updatebindEmailorupdatebindPhoneMessage")
    public Map<String,Object> send_updatebindEmailorupdatebindPhoneMessage(String userId,String passport)
    {
        Map<String,Object> map=new HashMap<String,Object>();
        if(null!=passport&&!"".equals(passport))
        {
            int verificationCode = (int) ((Math.random() * 9 + 1) * 100000); //验证码
            if(passport.indexOf("@")>0)//判断是否为邮箱或者手机号
            {
                map.put("type","email");
                SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd");
                users user=usersservice.find_userByuseruserId(userId);
                String content="<table border='0' cellpadding='0' cellspacing='0' style='background-color:f7f9fa; border-radius:3px;border:1px solid #dedede;margin:0 auto; background-color:#ffffff' width='552'><tbody><tr><td bgcolor='#ffffff' align='center' style='padding: 0 15px 0px 15px;'><table border='0' cellpadding='0' cellspacing='0' width='480'><tbody><tr><td><table width='100%' border='0' cellpadding='0' cellspacing='0'><tbody><tr><td><table cellpadding='0' cellspacing='0' border='0' align='left'><tbody><tr><td width='550' align='left' valign='top'><table width='100%' border='0' cellpadding='0' cellspacing='0'><tbody><tr><td bgcolor='#ffffff' align='left' style='background-color:#ffffff; font-size: 17px; color:#7b7b7b; padding:28px 0 0 0;line-height:25px;'><b>"+user.getUserName()+",你好：</b></td></tr><tr><td align='left' valign='top' style='font-size:15px; color:#7b7b7b; font-size:14px; line-height: 25px; font-family:Hiragino Sans GB; padding: 20px 0px 20px 0px'>以下是您的验证码,很高兴您使用我们的服务。</td></tr><tr><td style='border-bottom:1px #f1f4f6 solid; padding: 10px 0 35px 0;' align='center'><table border='0' cellspacing='0' cellpadding='0'><tbody><tr><td><span style='font-family:Hiragino Sans GB;font-size:17px;'>验证码："+verificationCode+"</span></td></tr></tbody></table></td></tr><tr><td align='right' valign='top' style='font-size:15px; color:#7b7b7b; font-size:14px; line-height: 25px; font-family:Hiragino Sans GB; padding: 20px 0px 35px 0px'>嗡嗡嗡<br><span style='border-bottom: 1px dashed rgb(204, 204, 204); position: relative;' t='5' times=''>"+sdf.format(new Date())+"</span></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table>";
                emailservice.sendHtmlEmail(passport,"更换绑定信息",content);
            }
            else
            {
                map.put("type","phone");
                String smsContent = "【嗡嗡嗡旅游网】尊敬的用户，您的验证码为" + verificationCode;//短信签名+内容（用模板不能自定义必须和模板一致）
                //SmsVerification.getVerificationCode(passport,smsContent);
            }
            map.put("result",true);
            map.put("verificationCode",verificationCode);
            System.out.println(verificationCode);
        }
        else
            map.put("result",false);
        return map;
    }
}
