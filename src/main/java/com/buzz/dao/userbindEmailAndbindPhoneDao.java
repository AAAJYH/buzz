package com.buzz.dao;

import com.buzz.entity.userbindEmailAndbindPhone;
import org.apache.ibatis.annotations.*;

@Mapper
public interface userbindEmailAndbindPhoneDao
{
    /**
     * 通过用户编号和类型查询
     * @param userId
     * @return
     */
    @Select("select * from userbindEmailAndbindPhone where userId=#{userId} and type=#{type}")
    public userbindEmailAndbindPhone find_userbindEmailAndbindPhoneByuserIdAndtype(@Param("userId")String userId,@Param("type")String type);

    /**
     * 根据修改手机查询邮箱手机
     * @param updatebindPhone
     * @return
     */
    @Select("select * from userbindEmailAndbindPhone where updatebindPhone=#{updatebindPhone}")
    public userbindEmailAndbindPhone find_userbindEmailAndbindPhoneByupdatebindPhone(@Param("updatebindPhone")String updatebindPhone);

    /**
     * 根据修改邮箱查询邮箱手机
     * @param updatebindEmail
     * @return
     */
    @Select("select * from userbindEmailAndbindPhone where updatebindEmail=#{updatebindEmail}")
    public userbindEmailAndbindPhone find_userbindEmailAndbindPhoneByupdatebindEmail(@Param("updatebindEmail")String updatebindEmail);
    /**
     * 添加绑定邮箱手机
     * @param ueadp
     * @return
     */
    @Insert({"<script>insert into userbindEmailAndbindPhone(updateId,userId<if test=\"null!=updatebindEmail and ''!=updatebindEmail\">,updatebindEmail</if><if test=\"null!=updatebindEmailstateId and ''!=updatebindEmailstateId\">,updatebindEmailstateId</if><if test=\"null!=updatebindPhone and ''!=updatebindPhone\">,updatebindPhone</if><if test=\"null!=updatebindPhonestateId and ''!=updatebindPhonestateId\">,updatebindPhonestateId</if><if test=\"null!=verificationMode and ''!=verificationMode\">,verificationMode</if><if test=\"null!=verificationCode and ''!=verificationCode\">,verificationCode</if><if test=\"null!=type and ''!=type\">,type</if>) values(#{updateId},#{userId}<if test=\"null!=updatebindEmail and ''!=updatebindEmail\">,#{updatebindEmail}</if><if test=\"null!=updatebindEmailstateId and ''!=updatebindEmailstateId\">,#{updatebindEmailstateId}</if><if test=\"null!=updatebindPhone and ''!=updatebindPhone\">,#{updatebindPhone}</if><if test=\"null!=updatebindPhonestateId and ''!=updatebindPhonestateId\">,#{updatebindPhonestateId}</if><if test=\"null!=verificationMode and ''!=verificationMode\">,#{verificationMode}</if><if test=\"null!=verificationCode and ''!=verificationCode\">,#{verificationCode}</if><if test=\"null!=type and ''!=type\">,#{type}</if>)</script>"})
    public Integer insert_userbindEmailAndbindPhone(userbindEmailAndbindPhone ueadp);

    /**
     * 通过修改编号修改邮箱手机
     * @param ueadp
     * @return
     */
    @Update({"<script>Update userbindEmailAndbindPhone set updateId=updateId<if test=\"null!=updatebindEmail and ''!=updatebindEmail\">,updatebindEmail=#{updatebindEmail}</if><if test=\"null!=updatebindEmailstateId and ''!=updatebindEmailstateId\">,updatebindEmailstateId=#{updatebindEmailstateId}</if><if test=\"null!=updatebindPhone and ''!=updatebindPhone\">,updatebindPhone=#{updatebindPhone}</if><if test=\"null!=updatebindPhonestateId and ''!=updatebindPhonestateId\">,updatebindPhonestateId=#{updatebindPhonestateId}</if><if test=\"null!=verificationMode and ''!=verificationMode\">,verificationMode=#{verificationMode}</if><if test=\"null!=verificationCode and ''!=verificationCode\">,verificationCode=#{verificationCode}</if><if test=\"null!=type and ''!=type\">,type=#{type}</if> where updateId=#{updateId}</script>"})
    public Integer update_userbindEmailAndbindPhoneByupdateId(userbindEmailAndbindPhone ueadp);
    /**
     * 根据修改编号查询
     * @param updateId
     * @return
     */
    @Select("select * from userbindEmailAndbindPhone where updateId=#{updateId}")
    public userbindEmailAndbindPhone find_userbindEmailAndbindPhoneByupdateId(@Param("updateId")String updateId);

    /**
     * 根据修改编号删除
     * @param updateId
     * @return
     */
    @Delete("delete from userbindEmailAndbindPhone where updateId=#{updateId}")
    public Integer  delete_userbindEmailAndbindPhoneByupdateId(@Param("updateId")String updateId);
}
