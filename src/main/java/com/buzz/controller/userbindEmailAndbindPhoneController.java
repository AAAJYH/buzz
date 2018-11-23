package com.buzz.controller;

import com.buzz.entity.userbindEmailAndbindPhone;
import com.buzz.entity.users;
import com.buzz.service.userbindEmailAndbindPhoneService;
import com.buzz.service.usersService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttributes;

import javax.annotation.Resource;
import java.util.HashMap;
import java.util.Map;

@Controller
@RequestMapping("userbindEmailAndbindPhoneController")
@SessionAttributes({"user"})
public class userbindEmailAndbindPhoneController
{
    @Resource
    private userbindEmailAndbindPhoneService userbindemailandbindphoneservice;
    @Resource
    private usersService usersservice;
    /**
     * 根据用户编号和类型查询
     * @param userId
     * @return
     */
    @ResponseBody
    @RequestMapping("find_userbindEmailAndbindPhoneByuserIdAndtype")
    public Map<String,Object> find_userbindEmailAndbindPhoneByuserIdAndtype(String userId,String type)
    {
        Map<String,Object> map=new HashMap<String,Object>();
        userbindEmailAndbindPhone ueap=userbindemailandbindphoneservice.find_userbindEmailAndbindPhoneByuserIdAndtype(userId,type);
        if(null==ueap)
            map.put("result",false);
        else
        {
            map.put("result",true);
            map.put("ueap",ueap);
        }
        return map;
    }
    /**
     * 根据修改邮箱手机修改用户绑定邮箱
     * @param updateId
     * @param model
     * @return
     */
    @RequestMapping("update_userbindEmailByuserbindEmailAndbindPhone")
    public String update_userbindEmailByuserbindEmailAndbindPhone(String updateId,Model model)
    {
        userbindEmailAndbindPhone ueap=userbindemailandbindphoneservice.find_userbindEmailAndbindPhoneByupdateId(updateId);
        if(null!=ueap)
        {
            users user=new users();
            user.setUserId(ueap.getUserId());
            user.setBindEmail(ueap.getUpdatebindEmail());
            if(0<usersservice.update_usersByuserId(user))
            {
                ueap.setUpdatebindEmailstateId("009291aa-e66a-427b-aa10-413dfcb89719");
                userbindemailandbindphoneservice.update_userbindEmailAndbindPhoneByupdateId(ueap);
                user=usersservice.find_userByuseruserId(ueap.getUserId());
                model.addAttribute("user",user);
            }
        }
        return "front_desk/users/my_users_bindEmail";
    }

    /**
     * 根据新手机号修改用户绑定手机,根据修改编号修改userbindEmailAndbindPhone的updatebindPhonestateId
     * @param updateId
     * @param bindPhone
     * @param model
     * @return
     */
    @ResponseBody
    @RequestMapping("update_updatebindPhonestateIdAndusers_bindPhoneByupdateId")
    public boolean update_updatebindPhonestateIdAndusers_bindPhoneByupdateId(String updateId,String bindPhone,Model model)
    {
        userbindEmailAndbindPhone ueap=userbindemailandbindphoneservice.find_userbindEmailAndbindPhoneByupdateId(updateId);
        if(null!=ueap)
        {
            users update_user=new users();
            update_user.setUserId(ueap.getUserId());
            update_user.setBindPhone(bindPhone);
            if(0<usersservice.update_usersByuserId(update_user))
            {
                ueap.setUpdatebindPhonestateId("009291aa-e66a-427b-aa10-413dfcb89719");
                userbindemailandbindphoneservice.update_userbindEmailAndbindPhoneByupdateId(ueap);
                update_user=usersservice.find_userByuseruserId(ueap.getUserId());
                model.addAttribute("user",update_user);
                return true;
            }
            else
                return false;
        }
        else
            return false;
    }
    /**
     * 根据新邮箱修改用户绑定邮箱,根据修改编号修改userbindEmailAndbindPhone的updatebindPhonestateId
     * @param updateId
     * @param bindEmail
     * @param model
     * @return
     */
    @ResponseBody
    @RequestMapping("update_updatebindPhonestateIdAndusers_bindEmailByupdateId")
    public boolean update_updatebindPhonestateIdAndusers_bindEmailByupdateId(String updateId,String bindEmail,Model model)
    {
        userbindEmailAndbindPhone ueap=userbindemailandbindphoneservice.find_userbindEmailAndbindPhoneByupdateId(updateId);
        if(null!=ueap)
        {
            users update_user=new users();
            update_user.setUserId(ueap.getUserId());
            update_user.setBindEmail(bindEmail);
            if(0<usersservice.update_usersByuserId(update_user))
            {
                ueap.setUpdatebindPhonestateId("009291aa-e66a-427b-aa10-413dfcb89719");
                userbindemailandbindphoneservice.update_userbindEmailAndbindPhoneByupdateId(ueap);
                update_user=usersservice.find_userByuseruserId(ueap.getUserId());
                model.addAttribute("user",update_user);
                return true;
            }
            else
                return false;
        }
        else
            return false;
    }
    /**
     * 通过修改编号删除
     * @param updateId
     * @return
     */
    @ResponseBody
    @RequestMapping("delete_userbindEmailAndbindPhoneByupdateId")
    public boolean delete_userbindEmailAndbindPhoneByupdateId(String updateId)
    {
        if(null!=updateId&&!"".equals(updateId))
        {
            if(0<userbindemailandbindphoneservice.delete_userbindEmailAndbindPhoneByupdateId(updateId))
                return true;
            else
                return false;
        }
        else
            return false;
    }
}
