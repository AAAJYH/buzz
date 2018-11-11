package com.buzz.service;

import com.buzz.dao.LogDao;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.sql.Timestamp;

/**
 * @Author: jyh
 * @Date: 2018/11/11 17:32
 */

@Service
public class LogService {

    @Resource
    LogDao logDao;

    //添加日志
    @Transactional
    public int addLog(String logId,String requestUrl,String requestType,String responseContent,long TotalTime,String ip,Timestamp createSubtime,String requestParam){
        return logDao.addLog( logId, requestUrl, requestType, responseContent, TotalTime, ip, createSubtime,requestParam);
    }


}
