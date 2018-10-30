package com.buzz.controller;

import com.buzz.entity.Paging;
import com.buzz.entity.Role;
import com.buzz.entity.Role_Menu;
import com.buzz.service.RoleService;
import com.buzz.service.Role_MenuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

/**
 * @Author: aaaJYH
 * @Date: 2018/8/25 7:58
 */

@Controller
public class RoleController {

    @Autowired
    private RoleService roleService;

    @Autowired
    private Role_MenuService role_menuService;

    @RequestMapping("/roleManage")
    public String roleIndex(){
        return "backstage_supporter/roleManage";
    }

    /**
     * 分页查询角色
     * @return
     */
    @RequestMapping("/pagingQueryAll")
    @ResponseBody
    public Paging<Role> queryAllRole(int rows, int page){
        return roleService.pagingQueryAll(rows,page);
    }

    /**
     * 添加角色，并在中间表设置角色的权限
     * @param role 添加对象
     * @param mid 菜单Id
     * @return
     */
    @RequestMapping("/addRole")
    @ResponseBody
    public boolean addRole(Role role,Integer[] mid){
        return roleService.addRole(role,mid);
    }

    /**
     * 根据id删除角色
     * @param id 角色id
     * @return
     */
    @RequestMapping("/byIdRemoveRole")
    @ResponseBody
    public boolean byIdRemoveRole(int id){
        return roleService.ByIdRemoveRole(id);
    }

    /**
     * 根据rid查询mid，修改时选中当前角色的菜单节点
     * @param rid 角色id
     * @return
     */
    @RequestMapping("/byRidQueryMid")
    @ResponseBody
    public List<Role_Menu> byRidQueryMid(Integer rid){
        return role_menuService.byRidQueryMid(rid);
    }

    /**
     * 修改角色
     * @param role 角色对象
     * @param mid 菜单Id
     * @return
     */
    @RequestMapping("/EditRole")
    @ResponseBody
    public boolean EditRole(Role role,Integer[] mid){
        return roleService.EditRole(role,mid);
    }

    /**
     * 查询全部角色
     * @return
     */
    @RequestMapping("/queryAllRole")
    @ResponseBody
    public List<Role> queryAllRole(){
        return roleService.querAllRole();
    }

}
