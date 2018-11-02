package com.buzz.dao;

import com.buzz.entity.Role;
import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * @Author: aaaJYH
 * @Date: 2018/8/25 7:53
 */

@Component
@Mapper
public interface RoleDao {

    /**
     * 查询全部角色
     * @return
     */
    @Select("select * from role")
    public List<Role> queryAllRole();

    /**
     * 添加角色
     * @param role
     * @return
     */
    @SelectKey(statement = "select max(id)+1 from role",before = true,keyColumn = "id",keyProperty="r.id",resultType=Integer.class)
    @Insert("insert into role(id,rname,remark) values(#{r.id},#{r.rname},#{r.remark})")
    public int addRole(@Param("r") Role role);

    /**
     * 添加角色后，获取最大的角色id（），添加中间表时要用
     * @return
     */
    @Select("select max(id) from role")
    public int queryMaxId();

    /**
     * 根据id删除角色
     * @param id
     * @return
     */
    @Delete("delete from role where id=#{id}")
    public int byIdDelRole(@Param("id") Integer id);

    /**
     * 修改角色
     * @param role
     * @return
     */
    @Update("update role set rname=#{r.rname},remark=#{r.remark} where id=#{r.id}")
    public int Edit(@Param("r") Role role);

}
