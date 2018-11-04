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
    public strategy queryCityStrategy(String cityId){
        return strategyDao.queryCityStrategy(cityId);
    }

    //攻略下载次数加1
    @Transactional
    public int updateCityStrategyDownloadNumber(String strategyId){
        return strategyDao.updateCityStrategyDownloadNumber(strategyId);
    }

    /**
     * 通过下载数量倒序查询五条旅游攻略
     * @return
     */
    public List<strategy> find_strategyHot5()
    {
        return strategyDao.find_strategyHot5();
    }

    /**
     * 根据旅游攻略编号查询
     * @return
     */
    public strategy find_strategyBystrategyId(String strategyId)
    {
        return strategyDao.find_strategyBystrategyId(strategyId);
    }
}
