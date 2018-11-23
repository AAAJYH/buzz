package com.buzz.service;

import com.buzz.dao.askRespondDao;
import com.buzz.entity.askRespond;
import com.buzz.entity.replyAskRespond;
import com.github.pagehelper.PageHelper;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.List;

@Service
public class askRespondService {
    @Resource
    private askRespondDao askresponddao;
    @Resource
    private replyAskRespondService replyaskrespondservice;
    @Resource
    private usersService usersservice;
    @Resource
    private cityService cityservice;
    @Resource
    private interestLabelService interestlabelservice;
    /**
     * 添加问答
     *
     * @param a
     * @return
     */
    public int insert_askRespond(askRespond a) {
        return askresponddao.insert_askRespond(a);
    }

    /**
     * 通过问答编号查询问答
     *
     * @param askRespondId
     * @return
     */
    public askRespond find_askRespondByaskRespondId(String askRespondId,String...stateIds) {
        return askresponddao.find_askRespondByaskRespondId(askRespondId,stateIds);
    }

    //将问答详细内容转换为字符串
    public String format_askRespondDetail(String path, String askRespondDetailPath) throws IOException {
        String askRespondDetail = null;
        if (null != askRespondDetailPath && !"".equals(askRespondDetailPath)) {
            File file = new File(path + '/' + askRespondDetailPath);
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
     *
     * @param askRespondId
     * @param askRespondDetail
     * @return
     */
    public int update_askRespondDetailByaskRespondId(String askRespondId, String askRespondDetail) {
        return askresponddao.update_askRespondDetailByaskRespondId(askRespondId, askRespondDetail);
    }

    /**
     * 通过问答编号修改状态为删除
     *
     * @param askRespondId
     * @param stateId
     * @return
     */
    public int update_stateIdByaskRespondId(String askRespondId, String stateId) {
        return askresponddao.update_stateIdByaskRespondId(askRespondId, stateId);
    }

    /**
     * 通过兴趣标签和状态查询问答
     *
     * @param interestLabelId
     * @param stateIds
     * @return
     */
    public List<askRespond> find_askRespondByinterestLabelIdAndstateId(Integer pageIndex,String interestLabelId, String... stateIds)
    {
        PageHelper.startPage(pageIndex,10);
        return askresponddao.find_askRespondByinterestLabelIdAndstateId(interestLabelId,stateIds);
    }

    /**
     * 通过城市和状态查询问答
     * @param cityId
     * @param stateIds
     * @return
     */
    public List<askRespond> find_askRespondBycityIdAndstateId(Integer pageIndex,String cityId,String... stateIds)
    {
        PageHelper.startPage(pageIndex,10);
        return askresponddao.find_askRespondBycityIdAndstateId(cityId,stateIds);
    }

    /**
     * 通过问答标题和状态查询问答
     * @param askRespondTitle
     * @param stateIds
     * @return
     */
    public List<askRespond> find_askRespondByaskRespondTitleAndstateIdAndpageIndex(Integer pageIndex,String askRespondTitle,String... stateIds)
    {
        PageHelper.startPage(pageIndex,10);
        return  askresponddao.find_askRespondByaskRespondTitleAndstateId(askRespondTitle,stateIds);
    }

    /**
     * 通过问答标题和状态编号模糊搜索
     * @param askRespondTitle
     * @param stateIds
     * @return
     */
    public List<askRespond> find_askRespondByaskRespondTitleAndstateId(String askRespondTitle,String... stateIds)
    {
        return  askresponddao.find_askRespondByaskRespondTitleAndstateId(askRespondTitle,stateIds);
    }
    /**
     * 通过模糊搜索城市名称和状态编号查询
     * @param cityName
     * @param stateIds
     * @return
     */
    public List<askRespond> find_askRespondBycityNameAndstateId(String cityName,String...stateIds)
    {
        return askresponddao.find_askRespondBycityNameAndstateId(cityName,stateIds);
    }

    /**
     * 通过模糊搜索兴趣编号和状态编号查询
     * @param interestLabelName
     * @param stateIds
     * @return
     */
    public List<askRespond> find_askRespondByinterestLabelNameAndstateId(String interestLabelName,String... stateIds)
    {
        return askresponddao.find_askRespondByinterestLabelNameAndstateId(interestLabelName,stateIds);
    }
    /**
     * 通过状态查询问答
     * @param stateIds
     * @return
     */
    public List<askRespond> find_askRespondBystateId(Integer pageIndex,String... stateIds)
    {
        PageHelper.startPage(pageIndex,10);
        return askresponddao.find_askRespondBystateId(stateIds);
    }
    public List<askRespond> load_TopreplyAskRespond(List<askRespond> list)
    {
        if(null!=list&&0<list.size())
        {
            for(askRespond a:list)
            {
                a.setUser(usersservice.find_userByuseruserId(a.getUserId()));
                if(null!=a.getCityId()&&!"".equals(a.getCityId()))
                    a.setCity(cityservice.byCityIdQuery(a.getCityId()));
                if(null!=a.getInterestLabelId()&&!"".equals(a.getInterestLabelId()))
                    a.setInterestlabel(interestlabelservice.find_interestLabelByinterestLabelId(a.getInterestLabelId()));
                a.setReplyAskRespondNum(replyaskrespondservice.find_replyAskRespondCountByaskRespondIdAndStateId(a.getAskRespondId(),"0ee26211-3ae8-48b7-973f-8488bfe837d6"));
                replyAskRespond rak=replyaskrespondservice.find_replyAskRespondByaskRespondIdAndoptimumAnswer(a.getAskRespondId(),"true");
                if(null==rak)
                {
                    List<replyAskRespond>replyAskResponds=replyaskrespondservice.find_replyAskRespondByaskRespondIdByreplyAskRespondTopNumdesc(1,1,a.getAskRespondId(),"0ee26211-3ae8-48b7-973f-8488bfe837d6");
                    if(null!=replyAskResponds&&0<replyAskResponds.size())
                        rak=replyAskResponds.get(0);
                }
                a.setReplyaskrespond(rak);
            }
        }
        return list;
    }

    /**
     * 通过用户和状态查询问答和回复问答数量
     * @param userId
     * @param stateIds
     * @return
     */
    public List<askRespond> find_askRespondByuserIdAndstateId(Integer pageIndex,Integer pageSize,String userId,String...stateIds)
    {
        PageHelper.startPage(pageIndex,pageSize);
        return askresponddao.find_askRespondByuserIdAndstateId(userId,stateIds);
    }

    /**
     * 通过用户和状态查询问答数量
     * @param userId
     * @param stateIds
     * @return
     */
    public Integer find_askRespond_CountByuserIdAndstateId(String userId,String...stateIds)
    {
        return askresponddao.find_askRespond_CountByuserIdAndstateId(userId,stateIds);
    }

    /**
     * 通过状态查询问答和回复问答数量
     * @param stateIds
     * @return
     */
    public List<askRespond> find_askRespond_replyAskRespondNumBystateId(Integer pageIndex,Integer pageSize,String...stateIds)
    {
        PageHelper.startPage(pageIndex,pageSize);
        return askresponddao.find_askRespond_replyAskRespondNumBystateId(stateIds);
    }
    /**
     * 查询所有问答数量
     * @param stateIds
     * @return
     */
    public Integer find_askRespond_countBystateId(String...stateIds)
    {
        return askresponddao.find_askRespond_countBystateId(stateIds);
    }

    /**
     * 根据城市编号和状态获取两个问答
     * @param cityId
     * @param stateIds
     * @return
     */
    public List<askRespond> find_askRespondAndcityBycityIdTop2(String cityId,String...stateIds)
    {
        PageHelper.startPage(1,2);
        return askresponddao.find_askRespondAndcityBycityIdTop2(cityId,stateIds);
    }
}
