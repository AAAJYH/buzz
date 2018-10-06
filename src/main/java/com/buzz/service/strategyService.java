package com.buzz.service;

import com.buzz.dao.strategyDao;
import com.buzz.entity.strategy;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;

/**
 * @Author: aaaJYH
 * @Date: 2018/10/3 20:23
 * 攻略 业务层
 */

@Service
public class strategyService {

    @Resource
    strategyDao strategyDao;

    //查询城市攻略
    public strategy queryCityStrategy(String cityId){
        return strategyDao.queryCityStrategy(cityId);
    }

}
