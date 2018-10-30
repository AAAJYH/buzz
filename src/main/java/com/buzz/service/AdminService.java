package com.buzz.service;

import com.buzz.dao.AdminDao;
import com.buzz.entity.Admin;
import com.buzz.entity.Paging;
import com.buzz.utils.Common;
import com.github.pagehelper.PageHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * @Author: aaaJYH
 * @Date: 2018/8/22 16:05
 */

@Service
public class AdminService {

    @Autowired
    private AdminDao adminDao;

    /**
     * 根据管理员账号查询实体
     */
    public Admin byAdNameQuery(String AdName){
        return adminDao.byAdNameQuery(AdName);
    }

    @Transactional
    public boolean addAdmin(Admin admin){
        int rs=adminDao.addAdmin(admin);
        return Common.byIntReturnBoolean(rs);
    }

    @Transactional
    public boolean byIdDelAadmin(int id){
        int rs=adminDao.byIdDelAdmin(id);
        return Common.byIntReturnBoolean(rs);
    }

    @Transactional
    public boolean EditAdmin(Admin admin){
        int rs=adminDao.EditAdmin(admin);
        return Common.byIntReturnBoolean(rs);
    }

    /**
     * 分页查询admin
     * @return
     */
    public Paging<Admin> pagingQueryAdmin(int page, int rows){
        int total=adminDao.queryAllAdmin().size(); //总页数
        PageHelper.startPage(page,rows); //PageHelper分页插件，修改底层查询语句
        List<Admin> adminList=adminDao.queryAllAdmin();
        return new Paging<Admin>(adminList,total);
    }

}
