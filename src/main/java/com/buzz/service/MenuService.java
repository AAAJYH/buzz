package com.buzz.service;

import com.buzz.dao.MenuDao;
import com.buzz.entity.Menu;
import com.buzz.utils.Common;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

/**
 * @Author: aaaJYH
 * @Date: 2018/8/23 10:12
 */

@Service
public class MenuService {

    @Autowired
    private MenuDao md;

    public Set<Menu> byAdNameQuery(String adname){
        return md.byAdNameQuery(adname);
    }

    public Set<Menu> byParentidQuery(int parentid){
        return md.byParentIdQuery(parentid);
    }

    @Transactional
    public boolean addMenu(Menu menu){
        int rs=md.addMenu(menu);
        return Common.byIntReturnBoolean(rs);
    }

    @Transactional
    public boolean byIdDelMenuAndChildrenMenu(int id){
        int rs1=md.byMenuDelChildren(id);
        int rs2=md.byIdDelMenu(id);
        if(rs1<0&rs2>0){
            return true;
        }else{
            return false;
        }
    }

    @Transactional
    public boolean byIdEditMenu(Menu m){
        int rs=md.byIdEditMenu(m);
        return Common.byIntReturnBoolean(rs);
    }

}
