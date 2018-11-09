package com.buzz.service;

import com.buzz.dao.askRespondDao;
import com.buzz.entity.askRespond;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;

@Service
public class askRespondService
{
    @Resource
    private askRespondDao askresponddao;
    /**
     * 添加问答
     * @param a
     * @return
     */
    public int insert_askRespond(askRespond a)
    {
        return askresponddao.insert_askRespond(a);
    }

    /**
     * 通过问答编号查询问答
     * @param askRespondId
     * @return
     */
    public askRespond find_askRespondByaskRespondId(String askRespondId)
    {
        return askresponddao.find_askRespondByaskRespondId(askRespondId);
    }
    //将问答详细内容转换为字符串
    public String format_askRespondDetail(String path,String askRespondDetailPath) throws IOException {
        String askRespondDetail=null;
        if(null!=askRespondDetailPath&&!"".equals(askRespondDetailPath)){
                File file = new File(path+'/'+askRespondDetailPath);
                String content = "";
                StringBuffer sb = new StringBuffer();
                BufferedReader reader = new BufferedReader(new FileReader(file));
                while (null != content) {
                    content = reader.readLine();
                    if (null == content)
                        break;
                    sb.append(content);
                }
                reader.close();
            askRespondDetail = sb.toString();
        }
        return askRespondDetail;
    }

    /**
     * 通过问答编号修改问答详细内容
     * @param askRespondId
     * @param askRespondDetail
     * @return
     */
    public int update_askRespondDetailByaskRespondId(String askRespondId,String askRespondDetail)
    {
        return askresponddao.update_askRespondDetailByaskRespondId(askRespondId,askRespondDetail);
    }
    /**
     * 通过问答编号修改状态为删除
     * @param askRespondId
     * @param stateId
     * @return
     */
    public int update_stateIdByaskRespondId(String askRespondId,String stateId)
    {
        return askresponddao.update_stateIdByaskRespondId(askRespondId,stateId);
    }
}
