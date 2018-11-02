package com.buzz.dao;

import com.buzz.entity.Menu;
import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Component;

import java.util.Set;

/**
 * @Author: aaaJYH
 * @Date: 2018/8/23 9:48
 */

@Mapper
@Component
public interface MenuDao {

    /**
     * 根据账号查询所有一级菜单栏
     * @param adname
     * @return
     */
    @Select("select m.* from admin a,role r,role_menu rm,menu m where a.rid=r.id and r.id=rm.rid and rm.mid=m.id and a.adname=#{adname}")
    public Set<Menu> byAdNameQuery(@Param("adname") String adname);

    /**
     * 根据parentId查询子菜单
     * @param parentid
     * @return
     */
    @Select("select * from menu where parentId=#{parentid}")
    public Set<Menu> byParentIdQuery(@Param("parentid") int parentid);

    /**
     * 插入菜单
     * @param m
     * @return
     */
    @SelectKey(statement = "select max(id)+1 from menu",before=true,keyColumn ="id",keyProperty = "m.id",resultType = Integer.class)
    @Insert("insert into menu(id,text,url,parentId,icon,state) values(#{m.id},#{m.text},#{m.url},#{m.parentId},#{m.icon},#{m.state})")
    public int addMenu(@Param("m") Menu m);

    /**
     * 根据要删除菜单的id，删除此菜单的所有子菜单
     * @param id
     * @return
     */
    @Delete("delete from menu where parentId=#{id}")
    public int byMenuDelChildren(@Param("id") int id);

    /**
     * 根据id删除菜单
     * @param id
     * @return
     */
    @Delete("delete from menu where id=#{id}")
    public int byIdDelMenu(@Param("id") int id);

    @Update("update menu set text=#{m.text},url=#{m.url},icon=#{m.icon},state=#{m.state} where id=#{m.id}")
    public int byIdEditMenu(@Param("m") Menu m);

}
