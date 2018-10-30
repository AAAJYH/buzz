package com.buzz.service;

import com.buzz.dao.Role_MenuDao;
import com.buzz.entity.Role_Menu;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * @Author: aaaJYH
 * @Date: 2018/8/25 15:40
 */

@Service
public class Role_MenuService {

    @Autowired
    private Role_MenuDao rmd;

    @Transactional
    public int addRole_Menu(Role_Menu rm){
        return rmd.addRole_Menu(rm);
    }

    @Transactional
    public int byRidDelRM( Integer rid){
        return rmd.byRidDelRM(rid);
    }

    public List<Role_Menu> byRidQueryMid(int rid){
        return rmd.byRidQueryMid(rid);
    }

}
