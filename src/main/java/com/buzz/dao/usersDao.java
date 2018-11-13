package com.buzz.dao;

import com.buzz.entity.users;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface usersDao
{
    /**
     * 注册用户
     * @param user
     * @return
     */
    @Insert("insert into users(userId,userPassword,bindPhone,photo,userName,sex,stateId) values(#{user.userId},#{user.userPassword},#{user.bindPhone},#{user.photo},#{user.userName},#{user.sex},#{user.stateId})")
    public int register_user(@Param("user") users user);

    /**
     * 通过手机号检查用户是否存在
     * @param bindPhone 手机号
     * @return
     */
    @Select("select * from users where bindPhone=#{bindPhone}")
    public users checkbindPhone(@Param("bindPhone") String bindPhone);

    /**
     *  通过邮箱检查用户是否存在
     * @param bindEmail 邮箱
     * @return
     */
    @Select("select * from users where bindEmail=#{bindEmail}")
    public users  checkbindEmail(@Param("bindEmail")String bindEmail);

    /**
     * 通过手机号修改用户密码
     * @param userPassword 密码
     * @param bindPhone 手机号
     * @return
     */
    @Update("update users set userPassword=#{userPassword} where bindPhone=#{bindPhone}")
    public int update_userPassword_By_bindPhone(@Param("userPassword")String userPassword,@Param("bindPhone")String bindPhone);

    /**
     * 通过邮箱修改用户密码
     * @param userPassword 密码
     * @param bindEmail 邮箱
     * @return
     */
    @Update("update users set userPassword=#{userPassword} where bindEmail=#{bindEmail}")
    public int update_userPassword_By_bindEmail(@Param("userPassword")String userPassword,@Param("bindEmail")String bindEmail);

    /**
     *  通过手机号和密码登录
     * @param bindPhone 手机号
     * @param userPassword   密码
     * @return
     */
    @Select("select * from users where bindPhone=#{bindPhone} and userPassword=#{userPassword}")
    public users login_user(@Param("bindPhone")String bindPhone,@Param("userPassword")String userPassword);

    /**
     * 通过邮箱和密码查询用户
     * @param bindEmail 邮箱
     * @param userPassword  密码
     * @return
     */
    @Select("select * from users where bindEmail=#{bindEmail} and userPassword=#{userPassword}")
    public users find_userByuserPasswordAndbindEmail(@Param("bindEmail")String bindEmail,@Param("userPassword")String userPassword);

    /**
     * 通过用户id查询用户
     * @param userId 用户编号
     * @return 用户实体
     */
    @Select("select * from users where userId=#{userId}")
    public users find_userByuseruserId(@Param("userId")String userId);

    /**
     * 查询所有用户的被采纳答案数量
     * @param optimumAnswer
     * @return
     */
    @Select("select u.*,(select count(r.replyAskRespondId) from replyAskRespond r where r.userId=u.userId and r.optimumAnswer=#{optimumAnswer}) nums from users u ORDER BY nums desc")
    public List<users> find_user_optimumAnswerNum(@Param("optimumAnswer")String optimumAnswer);

    /**
     * 查询所有用户的回复问答数量
     * @param stateId
     * @return
     */
    @Select("select u.*,(select count(r.replyAskRespondId) from replyAskRespond r where r.userId=u.userId and r.stateId=#{stateId}) nums from users u ORDER BY nums desc")
    public List<users> find_user_replyAskRespondNum(@Param("stateId")String stateId);

    /**
     * 查询所有用户的被顶数量
     * @return
     */
    @Select("select u.*,(select count(rat.replyAskRespondTopId) from replyAskRespondTop rat left join replyAskRespond rar on rat.replyAskRespondId=rar.replyAskRespondId where rar.userId=u.userId) nums from users u ORDER BY nums desc")
    public List<users> find_user_replyAskRespondTopNum();
}
