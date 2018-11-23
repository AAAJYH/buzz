package com.buzz.service;

import com.buzz.dao.replyAskRespondDao;
import com.buzz.entity.replyAskRespond;
import com.github.pagehelper.PageHelper;
import org.apache.ibatis.annotations.Select;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;

@Service
public class replyAskRespondService {
    @Resource
    private replyAskRespondDao replyaskresponddao;

    /**
     * 通过问答编号,用户编号,状态编号查询回复问答
     *
     * @param userId
     * @param askRespondId
     * @param stateId
     * @return
     */
    public replyAskRespond find_replyAskRespondByuserIdAndaskRespondIdAndstateId(String userId, String askRespondId, String stateId) {
        return replyaskresponddao.find_replyAskRespondByuserIdAndaskRespondIdAndstateId(userId, askRespondId, stateId);
    }

    /**
     * 通过回复问答编号,回复问答头图,所属问答,回复问答内容,所属用户,状态添加
     *
     * @param r
     * @return
     */
    public int insert_replyAskRespondByaskRespondId(replyAskRespond r) {
        return replyaskresponddao.insert_replyAskRespondByaskRespondId(r);
    }

    /**
     * 通过用户编号和状态编号查询回复问答数量
     *
     * @param userId
     * @param stateIds
     * @return
     */
    public Integer find_replyAskRespondCountByuserIdAndStateId(String userId, String... stateIds) {
        return replyaskresponddao.find_replyAskRespondCountByuserIdAndStateId(userId, stateIds);
    }

    /**
     * 通过用户编号和状态编号进行分页查询回复问答,回复问答评论数量,点赞数量
     *
     * @param pageIndex
     * @param pageSize
     * @param userId
     * @param stateIds
     * @return
     */
    public List<replyAskRespond> find_replyAskRespondByuserIdAndstateIdAndPage(Integer pageIndex, Integer pageSize, String userId, String... stateIds) {
        PageHelper.startPage(pageIndex, pageSize);
        return replyaskresponddao.find_replyAskRespondByuserIdAndstateIdAndPage(userId, stateIds);
    }

    /**
     * 通过用户编号和状态编号查询回复问答
     *
     * @param userId
     * @param stateIds
     * @return
     */
    public List<replyAskRespond> find_replyAskRespondByuserIdAndstateId(String userId, String... stateIds)
    {
        return replyaskresponddao.find_replyAskRespondByuserIdAndstateId(userId,stateIds);
    }
    /**
     * 通过用户编号和状态编号和金牌回答编号查询回复问答,回复问答评论数量,点赞数量
     * @param userId
     * @param stateIds
     * @return
     */
    public List<replyAskRespond> find_replyAskRespond_optimumAnswerByuserIdAndstateId(Integer pageIndex,Integer pageSize,String userId,String optimumAnswer,String...stateIds)
    {
        PageHelper.startPage(pageIndex,pageSize);
        return replyaskresponddao.find_replyAskRespond_optimumAnswerByuserIdAndstateId(userId,optimumAnswer,stateIds);
    }
    /**
     * 通过用户编号和状态编号获取被采纳的答案数量
     * @param userId
     * @param optimumAnswer
     * @param stateIds
     * @return
     */
    public Integer find_replyAskRespond_optimumAnswerNum(String userId,String optimumAnswer,String...stateIds)
    {
        return replyaskresponddao.find_replyAskRespond_optimumAnswerNum(userId,optimumAnswer,stateIds);
    }
    /**
     * 根据问答编号和状态编号查询回复问答
     * @param askRespondId  问答编号
     * @param stateId 状态编号
     * @return
     */
    public List<replyAskRespond> find_replyAskRespondByaskRespondIdAndstateIdAndUnequaluserId(Integer pageIndex,String askRespondId,String userId,String stateId,String optimumAnswer)
    {
        PageHelper.startPage(pageIndex,10);
        return replyaskresponddao.find_replyAskRespondByaskRespondIdAndstateIdAndUnequaluserId(askRespondId,userId,stateId,optimumAnswer);
    }

    /**
     *  根据回复问答编号和状态编号查询回复问答
     * @param replyAskRespondId
     * @param stateId
     * @return
     */
    public replyAskRespond find_replyAskRespondByreplyAskRespondIdAndstateId(String replyAskRespondId,String stateId)
    {
        return replyaskresponddao.find_replyAskRespondByreplyAskRespondIdAndstateId(replyAskRespondId,stateId);
    }

    /**
     * 根据回复问答编号查询回复问答
     * @param replyAskRespondId
     * @return
     */
    public replyAskRespond find_replyAskRespondByreplyAskRespondId(String replyAskRespondId)
    {
        return replyaskresponddao.find_replyAskRespondByreplyAskRespondId(replyAskRespondId);
    }

    /**
     * 通过回复问答编号修改回复问答内容
     * @param replyAskRespondId
     * @param replyAskRespondContent
     * @return
     */
    public int update_replyAskRespondContentByreplyAskRespondIdAndreplyAskRespondContent(String replyAskRespondId,String replyBrief,String replyAskRespondContent)
    {
        return replyaskresponddao.update_replyAskRespondContentByreplyAskRespondIdAndreplyAskRespondContent(replyAskRespondId,replyBrief,replyAskRespondContent);
    }

    /**
     * 通过回复问答编号修改问答状态为删除
     * @param replyAskRespondId
     * @param stateId
     * @return
     */
    public int update_replyAskRespond_stateIdByreplyAskRespondId(String replyAskRespondId,String stateId)
    {
        return replyaskresponddao.update_replyAskRespond_stateIdByreplyAskRespondId(replyAskRespondId,stateId);
    }

    /**
     * 根据问答编号和是否为最佳答案查询
     * @param askRespondId
     * @param optimumAnswer
     * @return
     */
    public replyAskRespond find_replyAskRespondByaskRespondIdAndoptimumAnswer(String askRespondId,String optimumAnswer)
    {
        return replyaskresponddao.find_replyAskRespondByaskRespondIdAndoptimumAnswer(askRespondId,optimumAnswer);
    }

    /**
     * 根据问答编号和状态编号查询点赞数量最多回复问答
     * @param pageIndex 页数
     * @param pageSize 一页多少数据
     * @param askRespondId
     * @param stateId
     * @return
     */
    public List<replyAskRespond> find_replyAskRespondByaskRespondIdByreplyAskRespondTopNumdesc(Integer pageIndex,Integer pageSize,String askRespondId,String stateId)
    {
        PageHelper.startPage(pageIndex,pageSize);
        return replyaskresponddao.find_replyAskRespondByaskRespondIdByreplyAskRespondTopNumdesc(askRespondId,stateId);
    }
    /**
     * 通过问答编号查询回复问答数量
     * @param askRespondId
     * @param stateId
     * @return
     */
    public Integer find_replyAskRespondCountByaskRespondIdAndStateId(String askRespondId,String stateId)
    {
        return replyaskresponddao.find_replyAskRespondCountByaskRespondIdAndStateId(askRespondId,stateId);
    }
    /**
     * 通过回复问答编号修改该问答为最佳回答
     * @param replyAskRespondId
     * @param optimumAnswer
     * @return
     */
    public int update_replyAskRespond_optimumAnswerByreplyAskRespondId(String replyAskRespondId,String optimumAnswer)
    {
        return replyaskresponddao.update_replyAskRespond_optimumAnswerByreplyAskRespondId(replyAskRespondId,optimumAnswer);
    }

    /**
     * 通过用户编号分页查询所收藏回复问答
     * @param userId
     * @param stateIds
     * @return
     */
    public List<replyAskRespond> find_replyAskRespondByreplyAskRespondTopAnduserIdAndstateId(Integer pageIndex,Integer pageSize,String userId,String...stateIds)
    {
        PageHelper.startPage(pageIndex,pageSize);
        return replyaskresponddao.find_replyAskRespondByreplyAskRespondTopAnduserIdAndstateId(userId,stateIds);
    }

    /**
     * 通过用户编号和状态获取回复问答,当做问答消息
     * @param userId
     * @param stateIds
     * @return
     */
    public List<replyAskRespond> find_replyAskRespond_Message_askRespondByuserIdAndstateId(String userId,String...stateIds)
    {
        return replyaskresponddao.find_replyAskRespond_Message_askRespondByuserIdAndstateId(userId,stateIds);
    }

    /**
     * 通过用户编号获取回复回答评论,当做回答评论
     * @param userId
     * @param stateIds
     * @return
     */
    public List<replyAskRespond> find_replyAskRespond_Message_replyAskRespondCommentByuserIdAndstateId(String userId,String...stateIds)
    {
        return replyaskresponddao.find_replyAskRespond_Message_replyAskRespondCommentByuserIdAndstateId(userId,stateIds);
    }

    /**
     * 通过问答编号,状态,最佳问答状态,查询最佳回复问答
     * @return
     */
    public replyAskRespond find_replyAskRespondByaskRespondIdAndoptimumAnswerAndstateId(String askRespondId,String optimumAnswer,String...stateIds)
    {
        return replyaskresponddao.find_replyAskRespondByaskRespondIdAndoptimumAnswerAndstateId(askRespondId,optimumAnswer,stateIds);
    }
    /**
     * 通过问答编号,状态查询最佳回复问答
     * @param askRespondId
     * @param stateIds
     * @return
     */
    public replyAskRespond find_replyAskRespondByaskRespondIdAndstateId(String askRespondId,String...stateIds)
    {
        PageHelper.startPage(1,1);
        return replyaskresponddao.find_replyAskRespondByaskRespondIdAndstateId(askRespondId,stateIds);
    }
}
