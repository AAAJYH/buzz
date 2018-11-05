package com.buzz.service;

import com.buzz.dao.StateDao;
import com.buzz.entity.State;
import org.springframework.stereotype.Service;
import javax.annotation.Resource;

/**
 * @Author: jyh
 * @Date: 2018/11/4 16:45
 * 状态表业务层
 */

@Service
public class StateService {

    @Resource
    StateDao stateDao;

    //查询state对象
    public State byStateIdQuery(String stateId){
        return stateDao.byStateIdQuery(stateId);
    }

}
