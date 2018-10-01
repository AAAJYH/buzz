package com.buzz.dao;

import com.buzz.entity.users;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

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
    @Select("update users set userPassword=#{userPassword} where bindPhone=#{bindPhone}")
    public int update_userPassword_By_bindPhone(@Param("userPassword")String userPassword,@Param("bindPhone")String bindPhone);

    /**
     * 通过邮箱修改用户密码
     * @param userPassword 密码
     * @param bindEmail 邮箱
     * @return
     */
    @Select("update users set userPassword=#{userPassword} where bindEmail=#{bindEmail}")
    public int update_userPassword_By_bindEmail(@Param("userPassword")String userPassword,@Param("bindEmail")String bindEmail);
}
