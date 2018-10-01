package com.buzz.service;

import com.buzz.dao.usersDao;
import com.buzz.entity.users;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;

@Service
public class usersService
{
    @Resource
    private usersDao userdao;
    public int register_user(users user)
    {
        return userdao.register_user(user);
    }

    /**
     * 校验手机号
     * @param bindPhone
     * @return 1代表成功,3代表格式不正确,2代表已存在
     */
    public Integer checkbindPhone(String bindPhone)
    {
        users user=userdao.checkbindPhone(bindPhone);
        if(null!=bindPhone&&!bindPhone.equals(""))
        {
            if(null!=user&&user.getBindPhone().equals(bindPhone))
                return 2;
            else
                return 1;
        }
        else
            return 3;
    }
    public Integer checkbindEmail(String bindEmail)
    {
        users user=userdao.checkbindEmail(bindEmail);
        if(null!=bindEmail&&!bindEmail.equals(""))
        {
            if(null!=user&&user.getBindEmail().equals(bindEmail))
                return 2;
            else
                return 1;
        }
        else
            return 3;
    }
}
