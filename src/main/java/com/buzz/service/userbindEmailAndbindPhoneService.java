package com.buzz.service;

import com.buzz.dao.userbindEmailAndbindPhoneDao;
import com.buzz.entity.userbindEmailAndbindPhone;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;

@Service
public class userbindEmailAndbindPhoneService
{
    @Resource
    private userbindEmailAndbindPhoneDao userbindemailandbindphonedao;

    /**
     * 通过用户编号和类型查询
     * @param userId
     * @return
     */
    public userbindEmailAndbindPhone find_userbindEmailAndbindPhoneByuserIdAndtype(String userId,String type)
    {
        return userbindemailandbindphonedao.find_userbindEmailAndbindPhoneByuserIdAndtype(userId,type);
    }
    /**
     * 根据修改邮箱查询邮箱手机
     * @param updatebindEmail
     * @return
     */
    public userbindEmailAndbindPhone find_userbindEmailAndbindPhoneByupdatebindEmail(String updatebindEmail)
    {
        return userbindemailandbindphonedao.find_userbindEmailAndbindPhoneByupdatebindEmail(updatebindEmail);
    }

    /**
     * 根据修改手机查询邮箱手机
     * @param updatebindPhone
     * @return
     */
    public userbindEmailAndbindPhone find_userbindEmailAndbindPhoneByupdatebindPhone(String updatebindPhone)
    {
        return userbindemailandbindphonedao.find_userbindEmailAndbindPhoneByupdatebindPhone(updatebindPhone);
    }
    /**
     * 添加绑定邮箱手机
     * @param ueadp
     * @return
     */
    public Integer insert_userbindEmailAndbindPhone(userbindEmailAndbindPhone ueadp)
    {
        return userbindemailandbindphonedao.insert_userbindEmailAndbindPhone(ueadp);
    }

    /**
     * 根据修改编号查询
     * @param updateId
     * @return
     */
    public userbindEmailAndbindPhone find_userbindEmailAndbindPhoneByupdateId(String updateId)
    {
        return userbindemailandbindphonedao.find_userbindEmailAndbindPhoneByupdateId(updateId);
    }

    /**
     * 通过修改编号修改邮箱手机
     * @param ueadp
     * @return
     */
    public Integer update_userbindEmailAndbindPhoneByupdateId(userbindEmailAndbindPhone ueadp)
    {
        return userbindemailandbindphonedao.update_userbindEmailAndbindPhoneByupdateId(ueadp);
    }

    /**
     * 根据修改编号删除
     * @param updateId
     * @return
     */
    public Integer  delete_userbindEmailAndbindPhoneByupdateId(String updateId)
    {
        return userbindemailandbindphonedao.delete_userbindEmailAndbindPhoneByupdateId(updateId);
    }
}
