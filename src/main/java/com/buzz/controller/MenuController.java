package com.buzz.controller;

import com.buzz.entity.Menu;
import com.buzz.service.MenuService;
import org.apache.shiro.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Set;

/**
 * @Author: aaaJYH
 * @Date: 2018/8/23 11:03
 */

@Controller
public class MenuController {

    @Autowired
    private MenuService menuService;

    @RequestMapping("/menuIndex")
    public String menuIndex(){
        return "backstage_supporter/menuManage";
    }

    /**
     * 根据账号角色获取菜单集合
     * @return
     */
    @RequestMapping("/byAdNameQuerMenu")
    @ResponseBody
    public Set<Menu> byAdNameQuerMenu(){
        //获取当前登录用户名
        String AdName=(String) SecurityUtils.getSubject().getPrincipal();
        //根据用户名查询菜单集合并设置所有子菜单
        Set<Menu> menuSet=menuService.byAdNameQuery(AdName);
        setChildren(menuSet);
        return menuSet;
    }

    /**
     * 查询全部菜单
     * @return
     */
    @RequestMapping("/queryAllMenu")
    @ResponseBody
    public Set<Menu> queryAllMenu(){
        //查询全部一级菜单
        Set<Menu> menuList=menuService.byParentidQuery(0);
        //设置所有菜单的子菜单
        setChildren(menuList);
        return menuList;
    }

    /**
     * 添加菜单
     * @param menu
     * @return
     */
    @RequestMapping("/addMenu")
    @ResponseBody
    public boolean addMenu(Menu menu){
        return menuService.addMenu(menu);
    }

    /**
     * 根据菜单Id删除当前菜单及当前菜单的所有子菜单
     * @param id
     * @return
     */
    @RequestMapping("/byIdDelMenuAndChildrenMenu")
    @ResponseBody
    public boolean byIdDelMenuAndChildrenMenu(int id){
        return menuService.byIdDelMenuAndChildrenMenu(id);
    }

    /**
     * 根据id修改菜单
     * @param m
     * @return
     */
    @RequestMapping("/byIdEditMenu")
    @ResponseBody
    public boolean byIdEditMenu(Menu m){
        return menuService.byIdEditMenu(m);
    }

    /**
     * 设置菜单的子菜单
     * @param menuSet
     */
    public void setChildren(Set<Menu> menuSet){
        for (Menu menu:menuSet) {
            Set<Menu> childMenu=menuService.byParentidQuery(menu.getId());
            if(childMenu.size()>0){
                menu.setChildren(childMenu);
                setChildren(childMenu);
            }
        }
    }

}
