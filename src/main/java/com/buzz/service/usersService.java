package com.buzz.service;

import com.buzz.dao.usersDao;
import com.buzz.entity.users;
import com.github.pagehelper.PageHelper;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;

@Service
public class usersService {
    @Resource
    private usersDao userdao;

    public int register_user(users user) {
        return userdao.register_user(user);
    }

    /**
     * 校验手机号
     *
     * @param bindPhone
     * @return 1代表成功, 3代表格式不正确, 2代表已存在
     */
    public Integer checkbindPhone(String bindPhone) {
        users user = userdao.checkbindPhone(bindPhone);
        if (null != bindPhone && !bindPhone.equals("")) {
            if (null != user && user.getBindPhone().equals(bindPhone))
                return 2;
            else
                return 1;
        } else
            return 3;
    }

    public Integer checkbindEmail(String bindEmail) {
        users user = userdao.checkbindEmail(bindEmail);
        if (null != bindEmail && !bindEmail.equals("")) {
            if (null != user && user.getBindEmail().equals(bindEmail))
                return 2;
            else
                return 1;
        } else
            return 3;
    }

    public int update_userPassword_By_bindPhone(String userPassword, String bindPhone) {
        return userdao.update_userPassword_By_bindPhone(userPassword, bindPhone);
    }

    public int update_userPassword_By_bindEmail(String userPassword, String bindEmail) {
        return userdao.update_userPassword_By_bindEmail(userPassword, bindEmail);
    }

    /**
     * 通过手机号和密码登录
     *
     * @param bindPhone    手机号
     * @param userPassword 密码
     * @return
     */
    public users login_user(String bindPhone, String userPassword) {
        return userdao.login_user(bindPhone, userPassword);
    }

    /**
     * 通过邮箱和密码查询用户
     *
     * @param bindEmail    邮箱
     * @param userPassword 密码
     * @return
     */
    public users find_userByuserPasswordAndbindEmail(String bindEmail, String userPassword) {
        return userdao.find_userByuserPasswordAndbindEmail(bindEmail, userPassword);
    }

    /**
     * 通过用户id查询用户
     *
     * @param userId 用户编号
     * @return 用户实体
     */
    public users find_userByuseruserId(String userId) {
        return userdao.find_userByuseruserId(userId);
    }

    /**
     * 查询所有用户的被采纳答案数量
     *
     * @param pageIndex
     * @param optimumAnswer
     * @return
     */
    public List<users> find_user_optimumAnswerNum(Integer pageIndex, String optimumAnswer) {
        PageHelper.startPage(pageIndex, 10);
        return userdao.find_user_optimumAnswerNum(optimumAnswer);
    }

    /**
     * 查询所有用户的回复问答数量
     * @param pageIndex
     * @param stateId
     * @return
     */
    public List<users> find_user_replyAskRespondNum(Integer pageIndex,String stateId)
    {
        PageHelper.startPage(pageIndex, 10);
        return userdao.find_user_replyAskRespondNum(stateId);
    }

    /**
     * 查询所有用户的被顶数量
     * @param pageIndex
     * @return
     */
    public List<users> find_user_replyAskRespondTopNum(Integer pageIndex)
    {
        PageHelper.startPage(pageIndex, 10);
        return userdao.find_user_replyAskRespondTopNum();
    }
}
