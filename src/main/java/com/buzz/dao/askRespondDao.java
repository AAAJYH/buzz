package com.buzz.dao;

import com.buzz.entity.askRespond;
import org.apache.ibatis.annotations.*;

@Mapper
public interface askRespondDao
{
    /**
     * 添加问答
     * @param a
     * @return
     */
    @Insert({"<script>insert into askRespond(askRespondId,askRespondTitle,askRespondDetail<if test='null!=interestLabelId'>,interestLabelId</if><if test='null!=cityId'>,cityId</if>,userId,stateId) values(#{askRespondId},#{askRespondTitle},#{askRespondDetail}<if test='null!=interestLabelId'>,#{interestLabelId}</if><if test='null!=cityId'>,#{cityId}</if>,#{userId},#{stateId})</script>"})
    public int insert_askRespond(askRespond a);

    /**
     * 通过问答编号查询问答
     * @param askRespondId
     * @return
     */
    @Select("select * from askRespond where askRespondId=#{askRespondId}")
    public askRespond find_askRespondByaskRespondId(@Param("askRespondId") String askRespondId);

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
}
