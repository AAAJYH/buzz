package com.buzz.dao;

import com.buzz.entity.Admin;
import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * @Author: aaaJYH
 * @Date: 2018/8/22 15:59
 */

@Mapper
@Component
public interface AdminDao {

    /**
     * 根据管理员账号查询实体
     * @param AdName
     * @return
     */
    @Select("select * from admin where adname=#{AdName} and state='0'")
    public Admin byAdNameQuery(@Param("AdName") String AdName);

    /**
     * 添加admin
     * @param ad
     * @return
     */
    @SelectKey(statement = "select max(id)+1 from admin",before = true,keyColumn = "id",keyProperty="ad.id",resultType=Integer.class)
    @Insert("insert into admin(id,adname,pwd,rid,state) values(#{ad.id},#{ad.adname},#{ad.pwd},#{ad.rid},#{ad.state})")
    public int addAdmin(@Param("ad") Admin ad);

    /**
     * 根据id删除admin
     * @param id
     * @return
     */
    @Delete("delete from admin where id=#{id}")
    public int byIdDelAdmin(@Param("id") int id);

    /**
     * 修改admin
     * @param admin
     * @return
     */
    @Update("update admin set pwd=#{ad.pwd},rid=#{ad.rid},state=#{ad.state} where id=#{ad.id}")
    public int EditAdmin(@Param("ad") Admin admin);

    /**
     * 查询全部admin
     * @return
     */
    @Select("select * from admin")
    public List<Admin> queryAllAdmin();

    //根据账号密码判断是否存在此对象
    @Select("select * from admin where adname=#{adname} and pwd=#{pwd}")
    public Admin queryAdmin(@Param("adname") String adname,@Param("pwd") String pwd);

    //修改密码
    @Select("update admin set pwd=#{pwd} where id=#{id}")
    public Integer byIdUpdatePwd(@Param("id") Integer id,@Param("pwd") String pwd);

}
