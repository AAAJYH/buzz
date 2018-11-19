package com.buzz.service;

import com.buzz.dao.travelNotesReplyDao;
import com.buzz.entity.travelNotesReply;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;

@Service
public class travelNotesReplyService {
    @Resource
    private travelNotesReplyDao travelnotesreplydao;

    /**
     * 根据游记编号分页查询游记回复
     * @param travelNotesId 游记编号
     * @param pageIndex 显示第几页
     * @param pageSize 每页显示几条
     * @param stateId 状态编号
     * @return
     */
    public List<travelNotesReply> find_travelNotesReplyBytravelNotesIdAndstateId(String travelNotesId,int pageIndex,int pageSize,String stateId)
    {
        //mysql分页使用limit oracle分页用伪列 sqlserver分页用top
        //PageHelper帮我们生成分页语句,底层使用aop原理修改sql语句
        PageHelper.startPage(pageIndex,pageSize);
        return travelnotesreplydao.find_travelNotesReplyBytravelNotesIdAndstateId(travelNotesId,stateId);
    }

    /**
     * 根据游记编号和状态编号查询
     * @param travelNotesId
     * @param stateId
     * @return
     */
    public List<travelNotesReply> find_travelNotesReplyBytravelNotesIdAndstateIdNoPage(String travelNotesId,String stateId)
    {
        return travelnotesreplydao.find_travelNotesReplyBytravelNotesIdAndstateId(travelNotesId,stateId);
    }
    /**
     * 根据游记回复编号查询游记回复
     * @param travelNotesReplyId 游记回复编号
     * @return
     */
    public travelNotesReply find_travelNotesReplyBytravelNotesReplyId(String travelNotesReplyId)
    {
        return travelnotesreplydao.find_travelNotesReplyBytravelNotesReplyId(travelNotesReplyId);
    }

    /**
     * 根据游记编号查询游记回复数量
     * @param travelNotesId 游记编号
     * @param stateId 状态编号
     * @return
     */
    public Integer find_travelNotesReply_CountBytravelNotesIdAndstateId(String travelNotesId,String stateId)
    {
        return travelnotesreplydao.find_travelNotesReply_CountBytravelNotesIdAndstateId(travelNotesId,stateId);
    }

    /**
     * 添加游记回复
     *
     * @param t
     * @return 受影响行数
     */
    public Integer insert_travelNotesReply(travelNotesReply t)
    {
        return travelnotesreplydao.insert_travelNotesReply(t);
    }

    /**
     * 根据游记评论编号修改状态评论
     * @param travelNotesReplyId 游记评论编号
     * @param stateId 状态
     * @return 受影响行数
     */
    public Integer delete_travelNotesReplyBytravelNotesReplyId(String travelNotesReplyId,String stateId)
    {
        return travelnotesreplydao.delete_travelNotesReplyBytravelNotesReplyId(travelNotesReplyId,stateId);
    }
}
