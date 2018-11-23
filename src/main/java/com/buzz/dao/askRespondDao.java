package com.buzz.dao;

import com.buzz.entity.askRespond;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface askRespondDao
{
    /**
     * 添加问答
     * @param a
     * @return
     */
    @Insert({"<script>insert into askRespond(askRespondId,askRespondTitle,askRespondDetail<if test=\"null!=interestLabelId and ''!=interestLabelId\">,interestLabelId</if><if test=\"null!=cityId and ''!=cityId\">,cityId</if>,userId,stateId) values(#{askRespondId},#{askRespondTitle},#{askRespondDetail}<if test=\"null!=interestLabelId and ''!=interestLabelId\">,#{interestLabelId}</if><if test=\"null!=cityId and ''!=cityId\">,#{cityId}</if>,#{userId},#{stateId})</script>"})
    public int insert_askRespond(askRespond a);

    /**
     * 通过问答编号查询问答
     * @param askRespondId
     * @return
     */
    @Select({"<script>select * from askRespond where askRespondId=#{askRespondId} <if test=\"null!=stateIds\">and stateId in <foreach collection='stateIds' item='stateId' open='(' separator=',' close=')'>#{stateId}</foreach></if></script>"})
    public askRespond find_askRespondByaskRespondId(@Param("askRespondId") String askRespondId,@Param("stateIds")String...stateIds);

    /**
     * 通过问答编号修改问答详细内容
     * @param askRespondId
     * @param askRespondDetail
     * @return
     */
    @Update("update askRespond set askRespondDetail=#{askRespondDetail} where askRespondId=#{askRespondId}")
    public int update_askRespondDetailByaskRespondId(@Param("askRespondId")String askRespondId,@Param("askRespondDetail")String askRespondDetail);

    /**
     * 通过问答编号修改状态为删除
     * @param askRespondId
     * @param stateId
     * @return
     */
    @Update("update askRespond set stateId=#{stateId} where askRespondId=#{askRespondId}")
    public int update_stateIdByaskRespondId(@Param("askRespondId")String askRespondId,@Param("stateId")String stateId);

    /**
     * 通过兴趣标签和状态查询问答
     * @param interestLabelId
     * @param stateIds
     * @return
     */
    @Select({"<script>select * from askRespond where interestLabelId=#{interestLabelId} and stateId in <foreach collection='stateIds' item='stateId' open='(' separator=',' close=')'>#{stateId}</foreach></script>"})
    public List<askRespond> find_askRespondByinterestLabelIdAndstateId(@Param("interestLabelId") String interestLabelId,@Param("stateIds") String... stateIds);

    /**
     * 通过城市和状态查询问答
     * @param cityId
     * @param stateIds
     * @return
     */
    @Select({"<script>select * from askRespond where cityId=#{cityId} and stateId in <foreach collection='stateIds' item='stateId' open='(' separator=',' close=')'>#{stateId}</foreach></script>"})
    public List<askRespond> find_askRespondBycityIdAndstateId(@Param("cityId") String cityId,@Param("stateIds") String... stateIds);

    /**
     * 通过问答标题和状态查询问答
     * @param askRespondTitle
     * @param stateIds
     * @return
     */
    @Select({"<script>select * from askRespond where askRespondTitle like concat('%',#{askRespondTitle},'%') and stateId in <foreach collection='stateIds' item='stateId' open='(' separator=',' close=')'>#{stateId}</foreach></script>"})
    public List<askRespond> find_askRespondByaskRespondTitleAndstateId(@Param("askRespondTitle") String askRespondTitle,@Param("stateIds") String... stateIds);

    /**
     * 通过模糊搜索城市名称和状态编号查询
     * @param cityName
     * @param stateIds
     * @return
     */
    @Select({"<script>SELECT ask.* FROM askrespond ask left join city c on c.cityId=ask.cityId where c.cityName like concat('%',#{cityName},'%') and ask.stateId in <foreach collection='stateIds' item='stateId' open='(' separator=',' close=')'>#{stateId}</foreach></script>"})
    public List<askRespond> find_askRespondBycityNameAndstateId(@Param("cityName")String cityName,@Param("stateIds")String...stateIds);

    /**
     * 通过模糊搜索兴趣编号和状态编号查询
     * @param interestLabelName
     * @param stateIds
     * @return
     */
    @Select({"<script>SELECT ask.* FROM askrespond ask left join interestLabel i on i.interestLabelId=ask.interestLabelId where i.interestLabelName like concat('%',#{interestLabelName},'%') and ask.stateId in <foreach collection='stateIds' item='stateId' open='(' separator=',' close=')'>#{stateId}</foreach></script>"})
    public List<askRespond> find_askRespondByinterestLabelNameAndstateId(@Param("interestLabelName") String interestLabelName,@Param("stateIds")String... stateIds);
    /**
     * 通过状态查询问答
     * @param stateIds
     * @return
     */
    @Select({"<script>select * from askRespond where stateId in <foreach collection='stateIds' item='stateId' open='(' separator=',' close=')'>#{stateId}</foreach></script>"})
    public List<askRespond> find_askRespondBystateId(@Param("stateIds") String... stateIds);

    /**
     * 通过用户和状态查询问答和回复问答数量
     * @param userId
     * @param stateIds
     * @return
     */
    @Select({"<script>select ask.*,(select count(rak.replyAskRespondId) from replyAskRespond rak where rak.askRespondId=ask.askRespondId) replyAskRespondNum from askRespond ask where ask.userId=#{userId} and stateId in <foreach collection='stateIds' item='stateId' open='(' separator=',' close=')'>#{stateId}</foreach></script>"})
    public List<askRespond> find_askRespondByuserIdAndstateId(@Param("userId")String userId,@Param("stateIds")String...stateIds);

    /**
     * 通过用户和状态查询问答数量
     * @param userId
     * @param stateIds
     * @return
     */
    @Select({"<script>select count(askRespondId) from askRespond where userId=#{userId} and stateId in <foreach collection='stateIds' item='stateId' open='(' separator=',' close=')'>#{stateId}</foreach></script>"})
    public Integer find_askRespond_CountByuserIdAndstateId(@Param("userId")String userId,@Param("stateIds")String...stateIds);

    /**
     * 通过状态查询问答和回复问答数量
     * @param stateIds
     * @return
     */
    @Select({"<script>select ask.*,(select count(rak.replyAskRespondId) from replyAskRespond rak where rak.askRespondId=ask.askRespondId) replyAskRespondNum from askRespond ask where stateId in <foreach collection='stateIds' item='stateId' open='(' separator=',' close=')'>#{stateId}</foreach></script>"})
    public List<askRespond> find_askRespond_replyAskRespondNumBystateId(@Param("stateIds")String...stateIds);

    /**
     * 查询所有问答数量
     * @param stateIds
     * @return
     */
    @Select({"<script>select count(askRespondId) from askRespond where stateId in <foreach collection='stateIds' item='stateId' open='(' separator=',' close=')'>#{stateId}</foreach></script>"})
    public Integer find_askRespond_countBystateId(@Param("stateIds")String...stateIds);

    /**
     * 根据城市编号和状态获取两个问答
     * @param cityId
     * @param stateIds
     * @return
     */
    @Select({"<script>select * from askRespond where cityId=#{cityId} and stateId in <foreach collection='stateIds' item='stateId' open='(' separator=',' close=')'>#{stateId}</foreach></script>"})
    public List<askRespond> find_askRespondAndcityBycityIdTop2(@Param("cityId") String cityId,@Param("stateIds")String...stateIds);
}
