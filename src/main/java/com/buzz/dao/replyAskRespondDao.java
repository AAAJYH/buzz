package com.buzz.dao;

import com.buzz.entity.replyAskRespond;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface replyAskRespondDao
{
    /**
     * 通过问答编号,用户编号,状态编号查询回复问答
     * @param userId
     * @param askRespondId
     * @param stateId
     * @return
     */
    @Select("select rak.replyAskRespondId,rak.replyHeadPhoto,rak.replyBrief,rak.askRespondId,rak.replyAskRespondContent,rak.userId,rak.releaseTime,rak.optimumAnswer,rak.stateId,count(rat.replyAskRespondTopId) replyAskRespondTopNum from replyAskRespond rak left join replyAskRespondTop rat on rak.replyAskRespondId=rat.replyAskRespondId GROUP BY rak.replyAskRespondId,rak.replyHeadPhoto,rak.replyBrief,rak.askRespondId,rak.replyAskRespondContent,rak.userId,rak.releaseTime,rak.optimumAnswer,rak.stateId HAVING rak.userId=#{userId} and rak.askRespondId=#{askRespondId} and rak.stateId=#{stateId}")
    public replyAskRespond find_replyAskRespondByuserIdAndaskRespondIdAndstateId(@Param("userId")String userId, @Param("askRespondId")String askRespondId, @Param("stateId")String stateId);

    /**
     * 通过回复问答编号,回复问答头图,所属问答,回复问答内容,所属用户,状态添加
     * @param r
     * @return
     */
    @Insert({"<script>insert into replyAskRespond(replyAskRespondId<if test='null != replyHeadPhoto'>,replyHeadPhoto</if>,replyBrief,askRespondId,replyAskRespondContent,userId,optimumAnswer,stateId) values(#{replyAskRespondId}<if test='null != replyHeadPhoto'>,#{replyHeadPhoto}</if>,#{replyBrief},#{askRespondId},#{replyAskRespondContent},#{userId},#{optimumAnswer},#{stateId})</script>"})
    public int insert_replyAskRespondByaskRespondId(replyAskRespond r);

    /**
     * 通过用户编号和状态编号查询回复问答数量
     * @param userId
     * @param stateIds
     * @return
     */
    @Select({"<script>select count(replyAskRespondId) from replyAskRespond where userId=#{userId} and stateId in <foreach collection='stateIds' item='stateId' open='(' separator=',' close=')'>#{stateId}</foreach></script>"})
    public Integer find_replyAskRespondCountByuserIdAndStateId(@Param("userId") String userId,@Param("stateIds") String...stateIds);

    /**
     *  根据问答编号和状态编号和不等于用户编号和不等于最佳答案查询回复问答
     * @param askRespondId
     * @param userId
     * @param stateId
     * @return
     */
    @Select({"<script>select rak.replyAskRespondId,rak.replyHeadPhoto,rak.replyBrief,rak.askRespondId,rak.replyAskRespondContent,rak.userId,rak.releaseTime,rak.optimumAnswer,rak.stateId,count(rat.replyAskRespondTopId) replyAskRespondTopNum from replyAskRespond rak left join replyAskRespondTop rat on rak.replyAskRespondId=rat.replyAskRespondId GROUP BY rak.replyAskRespondId,rak.replyHeadPhoto,rak.replyBrief,rak.askRespondId,rak.replyAskRespondContent,rak.replyAskRespondContent,rak.userId,rak.releaseTime,rak.optimumAnswer,rak.stateId HAVING rak.stateId=#{stateId} and rak.askRespondId=#{askRespondId} <if test='null!=userId'> and rak.userId!=#{userId}</if> and rak.optimumAnswer!=#{optimumAnswer} ORDER BY count(rat.replyAskRespondTopId) desc</script>"})
    public List<replyAskRespond> find_replyAskRespondByaskRespondIdAndstateIdAndUnequaluserId(@Param("askRespondId")String askRespondId,@Param("userId")String userId,@Param("stateId")String stateId,@Param("optimumAnswer")String optimumAnswer);

    /**
     *  根据问答编号和状态编号查询点赞数量最多回复问答
     * @param askRespondId
     * @param stateId
     * @return
     */
    @Select({"<script>select rak.replyAskRespondId,rak.replyHeadPhoto,rak.replyBrief,rak.askRespondId,rak.replyAskRespondContent,rak.userId,rak.releaseTime,rak.optimumAnswer,rak.stateId,count(rat.replyAskRespondTopId) replyAskRespondTopNum from replyAskRespond rak left join replyAskRespondTop rat on rak.replyAskRespondId=rat.replyAskRespondId GROUP BY rak.replyAskRespondId,rak.replyHeadPhoto,rak.replyBrief,rak.askRespondId,rak.replyAskRespondContent,rak.replyAskRespondContent,rak.userId,rak.releaseTime,rak.optimumAnswer,rak.stateId HAVING rak.stateId=#{stateId} and rak.askRespondId=#{askRespondId} ORDER BY count(rat.replyAskRespondTopId) desc</script>"})
    public List<replyAskRespond> find_replyAskRespondByaskRespondIdByreplyAskRespondTopNumdesc(@Param("askRespondId")String askRespondId,@Param("stateId")String stateId);
    /**
     * 根据问答编号和是否为最佳答案查询
     * @param askRespondId
     * @param optimumAnswer
     * @return
     */
    @Select("select rak.replyAskRespondId,rak.replyHeadPhoto,rak.replyBrief,rak.askRespondId,rak.replyAskRespondContent,rak.userId,rak.releaseTime,rak.optimumAnswer,rak.stateId,count(rat.replyAskRespondTopId) replyAskRespondTopNum from replyAskRespond rak left join replyAskRespondTop rat on rak.replyAskRespondId=rat.replyAskRespondId GROUP BY rak.replyAskRespondId,rak.replyHeadPhoto,rak.replyBrief,rak.askRespondId,rak.replyAskRespondContent,rak.userId,rak.releaseTime,rak.optimumAnswer,rak.stateId HAVING rak.askRespondId=#{askRespondId} and rak.optimumAnswer=#{optimumAnswer}")
    public replyAskRespond find_replyAskRespondByaskRespondIdAndoptimumAnswer(@Param("askRespondId")String askRespondId,@Param("optimumAnswer")String optimumAnswer);
    /**
     *  根据回复问答编号和状态编号查询回复问答
     * @param replyAskRespondId
     * @param stateId
     * @return
     */
    @Select("select * from replyAskRespond where replyAskRespondId=#{replyAskRespondId} and stateId=#{stateId}")
    public replyAskRespond find_replyAskRespondByreplyAskRespondIdAndstateId(@Param("replyAskRespondId")String replyAskRespondId,@Param("stateId")String stateId);

    /**
     * 根据回复问答编号查询回复问答
     * @param replyAskRespondId
     * @return
     */
    @Select("select * from replyAskRespond where replyAskRespondId=#{replyAskRespondId}")
    public replyAskRespond find_replyAskRespondByreplyAskRespondId(@Param("replyAskRespondId")String replyAskRespondId);

    /**
     * 通过问答编号查询回复问答数量
     * @param askRespondId
     * @param stateId
     * @return
     */
    @Select("select count(replyAskRespondId) from replyAskRespond where askRespondId=#{askRespondId} and stateId=#{stateId}")
    public Integer find_replyAskRespondCountByaskRespondIdAndStateId(@Param("askRespondId")String askRespondId,@Param("stateId")String stateId);
    /**
     * 通过回复问答编号修改回复问答内容
     * @param replyAskRespondId
     * @param replyAskRespondContent
     * @return
     */
    @Update("update replyAskRespond set replyAskRespondContent=#{replyAskRespondContent},replyBrief=#{replyBrief} where replyAskRespondId=#{replyAskRespondId}")
    public int update_replyAskRespondContentByreplyAskRespondIdAndreplyAskRespondContent(@Param("replyAskRespondId")String replyAskRespondId,@Param("replyBrief")String replyBrief,@Param("replyAskRespondContent")String replyAskRespondContent);

    /**
     * 通过回复问答编号修改问答状态为删除
     * @param replyAskRespondId
     * @param stateId
     * @return
     */
    @Update("update replyAskRespond set stateId=#{stateId} where replyAskRespondId=#{replyAskRespondId}")
    public int update_replyAskRespond_stateIdByreplyAskRespondId(@Param("replyAskRespondId")String replyAskRespondId,@Param("stateId")String stateId);

    /**
     * 通过回复问答编号修改该问答为最佳回答
     * @param replyAskRespondId
     * @param optimumAnswer
     * @return
     */
    @Update("update replyAskRespond set optimumAnswer=#{optimumAnswer} where replyAskRespondId=#{replyAskRespondId}")
    public int update_replyAskRespond_optimumAnswerByreplyAskRespondId(@Param("replyAskRespondId")String replyAskRespondId,@Param("optimumAnswer")String optimumAnswer);
}
