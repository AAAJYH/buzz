package com.buzz.service;

import com.buzz.dao.travelNotesDao;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;

@Service
public class travelNotesService
{
    @Resource
    private travelNotesDao travelnotesdao;
    /**
     * 根据用户编号查询和状态查询草稿游记
     * @param userId 用户编号
     * @param stateId 状态为草稿
     * @return
     */
    public int find_travelNotes_NumberByuserId(String userId,String stateId)
    {
        return travelnotesdao.find_travelNotes_NumberByuserId(userId,stateId);
    }
}
