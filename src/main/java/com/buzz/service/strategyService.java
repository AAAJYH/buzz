package com.buzz.service;

import com.buzz.dao.strategyDao;
import com.buzz.entity.strategy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.sql.Timestamp;
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

    /**
     * 根据城市编号查询多个攻略
     * @param cityId
     * @return
     */
    public List<strategy> find_strategyBycityId( String cityId)
    {
        return strategyDao.find_strategyBycityId(cityId);
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

    /**
     * 根据城市编号查询多个攻略,只返回五条数据
     * @param cityId
     * @return
     */
    public List<strategy> find_strategyBycityIdR5(String cityId)
    {
        return strategyDao.find_strategyBycityId(cityId);
    }
    //查询其他景点攻略
    public List<strategy> queryOhterStrategy(String strategyId,String cityId){
        return strategyDao.queryOhterStrategy(strategyId,cityId);
    }

    //查询id查询攻略
    public strategy byStrategyIdQueryStrategy(String strategyId){
        return strategyDao.byStrategyIdQueryStrategy(strategyId);
    }

    //查询全部攻略
    public List<strategy> queryAllStrategy(){
        return strategyDao.queryAllStrategy();
    }

    //添加攻略
    @Transactional
    public int addStrategy(String strategyId,String strategyHeadline,String strategyBriefIntroduction,String scenicSpot,String cityId,long downloadNumber,Timestamp updateTime,String stateId){
        return strategyDao.addStrategy(strategyId,strategyHeadline,strategyBriefIntroduction,scenicSpot,cityId,downloadNumber,updateTime,stateId);
    }

    //修改攻略
    @Transactional
    public int byStrategyIdUpdateStrategy(String strategyHeadline,String strategyBriefIntroduction,String scenicSpot,String cityId,Timestamp updateTime,String strategyId,String stateId){
        return strategyDao.byStrategyIdUpdateStrategy( strategyHeadline, strategyBriefIntroduction, scenicSpot, cityId, updateTime, strategyId,stateId);
    }

    //写Excel表格
    public List<strategy> StrategyWriteExcel(){
        return strategyDao.StrategyWriteExcel();
    }

    //修改攻略图片
    @Transactional
    public int byStrategyIdUpdatePhoto(String strategyId,String strategyPhoto){
        return strategyDao.byStrategyIdUpdatePhoto(strategyId,strategyPhoto);
    }

}
