package com.buzz.service;

import com.buzz.dao.strategyDao;
import com.buzz.entity.strategy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    public List<strategy> queryCityStrategy(String cityId){
        return strategyDao.queryCityStrategy(cityId);
    }

    //攻略下载次数加1
    @Transactional
    public int updateCityStrategyDownloadNumber(String strategyId){
        return strategyDao.updateCityStrategyDownloadNumber(strategyId);
    }

    //查询其他景点攻略
    public List<strategy> queryOhterStrategy(String strategyId){
        return strategyDao.queryOhterStrategy(strategyId);
    }

    //查询id查询攻略
    public strategy byStrategyIdQueryStrategy(String strategyId){
        return strategyDao.byStrategyIdQueryStrategy(strategyId);
    }

}
