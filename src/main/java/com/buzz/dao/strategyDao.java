package com.buzz.dao;

import com.buzz.entity.strategy;
import org.apache.ibatis.annotations.*;

import java.sql.Timestamp;
import java.util.List;

/**
 * @Author: aaaJYH
 * @Date: 2018/10/3 20:19
 * 攻略 数据库访问层
 */

@Mapper
public interface strategyDao {

    //查询城市攻略
    @Select("select * from strategy,state where cityId=#{cityId} and strategy.stateId=state.stateId and state.stateName='正常'")
    public List<strategy> queryCityStrategy(@Param("cityId") String cityId);

    /**
     * 根据城市编号查询多个攻略
     * @param cityId
     * @return
     */
    @Select("select * from strategy where cityId=#{cityId}")
    public List<strategy> find_strategyBycityId(@Param("cityId") String cityId);

    /**
     * 根据城市编号查询多个攻略,只返回五条数据
     * @param cityId
     * @return
     */
    @Select("select * from strategy where cityId=#{cityId} LIMIT 0,5")
    public List<strategy> find_strategyBycityIdR5(@Param("cityId") String cityId);
    //攻略下载次数加1
    @Update("update strategy set downloadNumber=downloadNumber+1 where strategyId=#{strategyId}")
    public int updateCityStrategyDownloadNumber(String strategyId);

    //查询其他景点攻略
    @Select("select * from strategy,state where strategyId!=#{strategyId} and cityId=#{cityId} and strategy.stateId=state.stateId and state.stateName='正常'")
    public List<strategy> queryOhterStrategy(@Param("strategyId") String strategyId,@Param("cityId") String cityId);

    //查询id查询攻略
    @Select("select * from strategy where strategyId=#{strategyId}")
    public strategy byStrategyIdQueryStrategy(@Param("strategyId") String strategyId);

    //查询全部攻略
    @Select("select * from strategy")
    public List<strategy> queryAllStrategy();

    //添加攻略
    @Insert("insert into strategy(strategyId,strategyHeadline,strategyBriefIntroduction,scenicSpot,cityId,downloadNumber,updateTime,strategyPhoto,stateId) value(#{strategyId},#{strategyHeadline},#{strategyBriefIntroduction},#{scenicSpot},#{cityId},#{downloadNumber},#{updateTime},'images/gonglve/beijing1.jpg',#{stateId})")
    public int addStrategy(@Param("strategyId") String strategyId,@Param("strategyHeadline")String strategyHeadline,@Param("strategyBriefIntroduction")String strategyBriefIntroduction,@Param("scenicSpot") String scenicSpot,@Param("cityId") String cityId,@Param("downloadNumber")long downloadNumber,@Param("updateTime")Timestamp updateTime,@Param("stateId") String stateId);

    //修改攻略
    @Update("update strategy set strategyHeadline=#{strategyHeadline},strategyBriefIntroduction=#{strategyBriefIntroduction},scenicSpot=#{scenicSpot},cityId=#{cityId},updateTime=#{updateTime},stateId=#{stateId} where strategyId=#{strategyId}")
    public int byStrategyIdUpdateStrategy(@Param("strategyHeadline") String strategyHeadline,@Param("strategyBriefIntroduction") String strategyBriefIntroduction,@Param("scenicSpot") String scenicSpot,@Param("cityId") String cityId,@Param("updateTime") Timestamp updateTime,@Param("strategyId") String strategyId,@Param("stateId") String stateId);

    //写Excel表格
    @Select("select s.strategyId,s.strategyPhoto,s.strategyHeadline,s.strategyBriefIntroduction,s.scenicSpot,c.cityName cityId,s.downloadNumber,s.updateTime,st.stateName stateId from strategy s,city c,state st where s.stateId=st.stateId and s.cityId=c.cityId")
    public List<strategy> StrategyWriteExcel();

    //修改攻略图片
    @Update("update strategy set strategyPhoto=#{strategyPhoto} where strategyId=#{strategyId}")
    public int byStrategyIdUpdatePhoto(@Param("strategyId") String strategyId,@Param("strategyPhoto") String strategyPhoto);

    /**
     * 通过下载数量倒序查询五条旅游攻略
     * @return
     */
    @Select("select * from strategy order by downloadNumber desc LIMIT 0,5")
    public List<strategy> find_strategyHot5();

    /**
     * 根据旅游攻略编号查询
     * @return
     */
    @Select("select * from strategy where strategyId=#{strategyId}")
    public strategy find_strategyBystrategyId(@Param("strategyId") String strategyId);

}
