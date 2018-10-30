package com.buzz.service;

import com.buzz.dao.RoleDao;
import com.buzz.entity.Paging;
import com.buzz.entity.Role;
import com.buzz.entity.Role_Menu;
import com.github.pagehelper.PageHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * @Author: aaaJYH
 * @Date: 2018/8/25 7:55
 */

@Service
public class RoleService{

    @Autowired
    private RoleDao roleDao;

    @Autowired
    private Role_MenuService rms;

    public Paging<Role> pagingQueryAll(int rows, int page){
        //分页前查询总页数
        Integer total=roleDao.queryAllRole().size();
        PageHelper.startPage(page,rows);
        //分页后查询当前集合
        List<Role> roleList=roleDao.queryAllRole();
        return new Paging(roleList,total);
    }

    /**
     * 添加角色
     * @param role
     * @param mid
     * @return
     */
    @Transactional
    public boolean addRole(Role role,Integer[] mid){
        //1.添加角色
        int rs=roleDao.addRole(role);
        //2.查询刚刚添加的角色id即获取max(id)的信息
        int rid=roleDao.queryMaxId();
        //3.循环向中间表添加rid和mid
        for (Integer m: mid) {
            rms.addRole_Menu(new Role_Menu(null,rid,m));
        }
        return true;
    }

    /**
     * 删除角色
     * @param id
     * @return
     */
    public boolean ByIdRemoveRole(Integer id){
        //1.根据角色id删除角色
        int rs1=roleDao.byIdDelRole(id);
        //2.根据角色Id删除role_menu中信息
        int rs2=rms.byRidDelRM(id);
        if(rs1>0&&rs2>0){
            return true;
        }else{
            return true;
        }
    }

    /**
     * 修改角色
     * @param role
     * @param mid
     * @return
     */
    public boolean EditRole(Role role,Integer[] mid){
        //1.修改角色
        roleDao.Edit(role);
        //2.根据rid删除角色对应的权限
        rms.byRidDelRM(role.getId());
        //3.向中间表添加角色rid和权限mid
        for (Integer m:mid) {
            rms.addRole_Menu(new Role_Menu(null,role.getId(),m));
        }
        return true;
    }

    public List<Role> querAllRole(){
        return roleDao.queryAllRole();
    }

}
