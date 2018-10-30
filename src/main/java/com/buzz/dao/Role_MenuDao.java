package com.buzz.dao;

import com.buzz.entity.Role_Menu;
import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * @Author: aaaJYH
 * @Date: 2018/8/25 15:34
 */

@Component
@Mapper
public interface Role_MenuDao {

    /**
     * 添加
     * @param rm
     * @return
     */
    @SelectKey(statement = "select max(id)+1 from role_menu",before=true,keyColumn="id",keyProperty="rm.id",resultType = Integer.class)
    @Insert("insert into role_menu(id,rid,mid) values(#{rm.id},#{rm.rid},#{rm.mid})")
    public int addRole_Menu(@Param("rm") Role_Menu rm);

    /**
     * 根据rid删除role_menu信息
     * @param rid
     * @return
     */
    @Delete("delete from role_menu where rid=#{rid}")
    public int byRidDelRM(@Param("rid") Integer rid);

    /**
     * 根据rid查询mid
     * @param rid
     * @return
     */
    @Select("select * from role_menu where rid=#{rid}")
    public List<Role_Menu> byRidQueryMid(@Param("rid") Integer rid);

}
