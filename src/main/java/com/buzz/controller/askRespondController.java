package com.buzz.controller;

import com.buzz.entity.*;
import com.buzz.service.*;
import com.buzz.utils.Encryption;
import com.buzz.utils.Upload;
import org.springframework.stereotype.Controller;
import org.springframework.util.ResourceUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.*;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("askRespondController")
public class askRespondController {
    @Resource
    private askRespondService askrespondservice;
    @Resource
    private interestLabelService interestlabelservice;
    @Resource
    private cityService cityservice;
    @Resource
    private usersService usersservice;
    @Resource
    private replyAskRespondCommentService replyaskrespondcommentservice;
    @Resource
    private replyAskRespondService replyaskrespondservice;

    @ResponseBody
    @RequestMapping("insert_askRespond")
    public Map<String, Object> insert_askRespond(String askRespondTitle, String interestLabelId, String askRespondDetail, String cityId, String userId) throws IOException {
        Map<String, Object> map = new HashMap<String, Object>();
        String path = ResourceUtils.getURL("src/main/resources/static").getPath();
        path = path.replace("%20", " ");
        String newfilename = "upload/askRespond/askRespondDetail/" + Encryption.getUUID() + "." + "txt";
        if (null == cityId || "".equals(cityId))
            cityId = null;
        if (null == interestLabelId || "".equals(interestLabelId))
            interestLabelId = null;
        askRespond a = new askRespond();
        String askRespondId = Encryption.getUUID();
        a.setAskRespondId(askRespondId);
        a.setAskRespondTitle(askRespondTitle);
        a.setAskRespondDetail(newfilename);
        a.setUserId(userId);
        a.setCityId(cityId);
        a.setInterestLabelId(interestLabelId);
        a.setStateId("0ee26211-3ae8-48b7-973f-8488bfe837d6");
        File file = new File(path + "/" + newfilename);
        FileOutputStream fos = null;
        try {
            fos = new FileOutputStream(file);
            fos.write(askRespondDetail.getBytes());
            if (file.exists()) {
                if (0 < askrespondservice.insert_askRespond(a)) {
                    map.put("askRespondId", askRespondId);
                    map.put("result", true);
                } else {
                    file.delete();
                    map.put("result", false);
                }
            } else
                map.put("result", false);
        } catch (Exception e) {
            e.printStackTrace();
            map.put("result", false);
        } finally {
            if (null != fos) {
                fos.flush();
                fos.close();
            }
        }
        return map;
    }

    /**
     * 根据问答编号修改问答详细内容
     *
     * @param askRespondId
     * @param askRespondDetail
     * @return
     * @throws IOException
     */
    @ResponseBody
    @RequestMapping("update_askRespondDetailByaskRespondId")
    public Map<String, Object> update_askRespondDetailByaskRespondId(String askRespondId, String askRespondDetail) throws IOException {
        Map<String, Object> map = new HashMap<String, Object>();
        askRespond ask = askrespondservice.find_askRespondByaskRespondId(askRespondId,"0ee26211-3ae8-48b7-973f-8488bfe837d6","79ce7fee-9393-4ab8-88a0-306d7b2c9d22","2130f38e-48b2-4e7e-a4cf-120aa3a149af");
        if (null != ask) {
            if (ask.getStateId().equals("0ee26211-3ae8-48b7-973f-8488bfe837d6")) {
                String path = ResourceUtils.getURL("src/main/resources/static").getPath();
                path = path.replace("%20", " ");
                File delete_file = new File(path + '/' + ask.getAskRespondDetail());
                if (delete_file.exists())//判断是否存在进行删除
                    delete_file.delete();
                String newfilename = "upload/askRespond/askRespondDetail/" + Encryption.getUUID() + "." + "txt";
                File file = new File(path + '/' + newfilename);
                FileOutputStream fos = null;
                try {
                    fos = new FileOutputStream(file);
                    fos.write(askRespondDetail.getBytes());
                    if (file.exists()) {
                        if (0 < askrespondservice.update_askRespondDetailByaskRespondId(askRespondId, newfilename)) {
                            map.put("askRespondDetail", askRespondDetail);
                            map.put("result", true);
                        } else {
                            file.delete();
                            map.put("result", false);
                        }
                    } else
                        map.put("result", false);
                } catch (Exception e) {
                    map.put("result", false);
                    e.printStackTrace();
                } finally {
                    fos.flush();
                    fos.close();
                }
            } else
                map.put("result", false);
        } else
            map.put("result", false);
        return map;
    }

    /**
     * 根据问答编号删除
     *
     * @param askRespondId
     * @return
     */
    @ResponseBody
    @RequestMapping("delete_askRespondByaskRespondId")
    public Map<String, Object> delete_askRespondByaskRespondId(String askRespondId) throws FileNotFoundException {
        Map<String, Object> map = new HashMap<String, Object>();
        askRespond ask = askrespondservice.find_askRespondByaskRespondId(askRespondId,"0ee26211-3ae8-48b7-973f-8488bfe837d6","79ce7fee-9393-4ab8-88a0-306d7b2c9d22","2130f38e-48b2-4e7e-a4cf-120aa3a149af");
        if (null != ask) {
            try {
                if (ask.getStateId().equals("0ee26211-3ae8-48b7-973f-8488bfe837d6")) {
                    String path = ResourceUtils.getURL("src/main/resources/static").getPath();
                    path = path.replace("%20", " ");
                    File delete_file = new File(path + '/' + ask.getAskRespondDetail());
                    if (delete_file.exists())//判断是否存在进行删除
                        delete_file.delete();
                    if (0 < askrespondservice.update_stateIdByaskRespondId(askRespondId, "ac618998-ffe3-4300-a391-cd581f74078c"))
                        map.put("result", true);
                } else {
                    map.put("result", false);
                    map.put("message", "问答已被回复不能进行删除");
                }
            } catch (Exception e) {
                map.put("result", false);
                map.put("message", "删除问答文件出现错误");
                e.printStackTrace();
            }
        } else {
            map.put("result", false);
            map.put("message", "该问答不存在或已删除");
        }
        return map;
    }

    /**
     * 根据问答编号获取
     *
     * @param askRespondId
     * @return
     * @throws IOException
     */
    @ResponseBody
    @RequestMapping("find_askRespondByaskRespondId")
    public Map<String, Object> find_askRespondByaskRespondId(String askRespondId, String currentUserId, HttpSession session) throws IOException
    {
        String path = ResourceUtils.getURL("src/main/resources/static/").getPath();
        path = path.replace("%20", " ");
        Map<String, Object> map = new HashMap<String, Object>();
        askRespond ask = askrespondservice.find_askRespondByaskRespondId(askRespondId,"0ee26211-3ae8-48b7-973f-8488bfe837d6","79ce7fee-9393-4ab8-88a0-306d7b2c9d22","2130f38e-48b2-4e7e-a4cf-120aa3a149af");
        if (null != ask)
        {
            ask.setAskRespondDetail(askrespondservice.format_askRespondDetail(path, ask.getAskRespondDetail()));
            if (null != ask.getInterestLabelId() && !"".equals(ask.getInterestLabelId()))
                ask.setInterestlabel(interestlabelservice.find_interestLabelByinterestLabelId(ask.getInterestLabelId()));
            if (null != ask.getCityId() && !"".equals(ask.getCityId()))
                ask.setCity(cityservice.byCityIdQuery(ask.getCityId()));
            if (null != ask.getUserId() && !"".equals(ask.getUserId()))
                ask.setUser(usersservice.find_userByuseruserId(ask.getUserId()));
            if(null==currentUserId||"".equals(currentUserId))
            {
                users user= (users) session.getAttribute("user");
                if(null!=user)
                    currentUserId=user.getUserId();
            }
            if(null!=currentUserId&&!"".equals(currentUserId))
            {
                users user = usersservice.find_userByuseruserId(currentUserId);
                replyAskRespond rask = replyaskrespondservice.find_replyAskRespondByuserIdAndaskRespondIdAndstateId(user.getUserId(), askRespondId, "0ee26211-3ae8-48b7-973f-8488bfe837d6");
                if (null != rask)
                {
                    if (null != rask.getReplyAskRespondContent() && !"".equals(rask.getReplyAskRespondContent()))
                        rask.setReplyAskRespondContent(askrespondservice.format_askRespondDetail(path, rask.getReplyAskRespondContent()));
                    List<replyAskRespondComment> replyAskRespondComments = replyaskrespondcommentservice.find_replyAskRespondCommentByreplyAskRespondIdAndstateId(rask.getReplyAskRespondId(), "0ee26211-3ae8-48b7-973f-8488bfe837d6");
                    if (null != replyAskRespondComments && 0 < replyAskRespondComments.size()) {
                        for (replyAskRespondComment r : replyAskRespondComments) {
                            if (null != r.getParentRespondCommentId() && !"".equals(r.getParentRespondCommentId())) {
                                replyAskRespondComment parentrask=replyaskrespondcommentservice.find_replyAskRespondCommentByreplyAskRespondCommentId(r.getParentRespondCommentId());
                                parentrask.setUser(usersservice.find_userByuseruserId(parentrask.getUserId()));
                                r.setParentrespondcomment(parentrask);
                            }
                            r.setUser(usersservice.find_userByuseruserId(r.getUserId()));
                        }
                        rask.setReplyaskrespondcomments(replyAskRespondComments);
                    }
                    rask.setUser(user);
                    map.put("replyAskRespond", rask);
                }
            }
            map.put("result", true);
            map.put("askRespond", ask);
            replyAskRespond optimumAnswerReplyAskRespond=replyaskrespondservice.find_replyAskRespondByaskRespondIdAndoptimumAnswer(askRespondId,"true");
            if(null!=optimumAnswerReplyAskRespond)
            {
                if (null != optimumAnswerReplyAskRespond.getReplyAskRespondContent() && !"".equals(optimumAnswerReplyAskRespond.getReplyAskRespondContent()))
                    optimumAnswerReplyAskRespond.setReplyAskRespondContent(askrespondservice.format_askRespondDetail(path, optimumAnswerReplyAskRespond.getReplyAskRespondContent()));
                List<replyAskRespondComment> replyAskRespondComments = replyaskrespondcommentservice.find_replyAskRespondCommentByreplyAskRespondIdAndstateId(optimumAnswerReplyAskRespond.getReplyAskRespondId(), "0ee26211-3ae8-48b7-973f-8488bfe837d6");
                if (null != replyAskRespondComments && 0 < replyAskRespondComments.size()) {
                    for (replyAskRespondComment r : replyAskRespondComments) {
                        if (null != r.getParentRespondCommentId() && !"".equals(r.getParentRespondCommentId())) {
                            replyAskRespondComment parentrask=replyaskrespondcommentservice.find_replyAskRespondCommentByreplyAskRespondCommentId(r.getParentRespondCommentId());
                            parentrask.setUser(usersservice.find_userByuseruserId(parentrask.getUserId()));
                            r.setParentrespondcomment(parentrask);
                        }
                        r.setUser(usersservice.find_userByuseruserId(r.getUserId()));
                    }
                    optimumAnswerReplyAskRespond.setReplyaskrespondcomments(replyAskRespondComments);
                }
                optimumAnswerReplyAskRespond.setUser(usersservice.find_userByuseruserId(optimumAnswerReplyAskRespond.getUserId()));
                map.put("optimumAnswerReplyAskRespond", optimumAnswerReplyAskRespond);
            }
            List<replyAskRespond> rasks=replyaskrespondservice.find_replyAskRespondByaskRespondIdAndstateIdAndUnequaluserId(1,askRespondId,currentUserId,"0ee26211-3ae8-48b7-973f-8488bfe837d6","true");
            if(null!=rasks&&0<rasks.size())
            {
                for(replyAskRespond r:rasks)
                {
                    r.setUser(usersservice.find_userByuseruserId(r.getUserId()));
                    r.setReplyAskRespondContent(askrespondservice.format_askRespondDetail(path,r.getReplyAskRespondContent()));
                    List<replyAskRespondComment> replyAskRespondComments = replyaskrespondcommentservice.find_replyAskRespondCommentByreplyAskRespondIdAndstateId(r.getReplyAskRespondId(), "0ee26211-3ae8-48b7-973f-8488bfe837d6");
                    if (null != replyAskRespondComments && 0 < replyAskRespondComments.size()) {
                        for (replyAskRespondComment rar : replyAskRespondComments) {
                            if (null != rar.getParentRespondCommentId() && !"".equals(rar.getParentRespondCommentId())) {
                                replyAskRespondComment parentrask=replyaskrespondcommentservice.find_replyAskRespondCommentByreplyAskRespondCommentId(rar.getParentRespondCommentId());
                                parentrask.setUser(usersservice.find_userByuseruserId(parentrask.getUserId()));
                                rar.setParentrespondcomment(parentrask);
                            }
                            rar.setUser(usersservice.find_userByuseruserId(rar.getUserId()));
                        }
                        r.setReplyaskrespondcomments(replyAskRespondComments);
                    }
                }
                map.put("replyAskResponds",rasks);
            }
        }
        else
            map.put("result", false);
        return map;
    }

    /**
     * 删除问答图片
     * @return
     */
    @ResponseBody
    @RequestMapping("delete_askRespondPhoto")
    public boolean delete_askRespondPhoto(String src) throws FileNotFoundException
    {
        String path=ResourceUtils.getURL("src/main/resources/static/").getPath().replace("%20", " ");
        return Upload.delete_File(path+"/"+src);
    }

    /**
     * 添加问答图片
     * @param request
     * @param response
     * @return
     * @throws IOException
     * @throws ServletException
     */
    @ResponseBody
    @RequestMapping("add_askRespondPhoto")
    public Map<Object, Object> add_askRespondPhoto(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
        File uploads = new File(ResourceUtils.getURL("src/main/resources/static/images/askRespond/photo").getPath().replace("%20", " "));
        return Upload.insert_Photo(uploads,request,response);
    }

    /**
     * 根据按下键值查询问答
     * @param keyvalue
     * @return
     */
    @ResponseBody
    @RequestMapping("find_askRespondByaskRespondTitle_key")
    public List<askRespond> find_askRespondByaskRespondTitle_key(String keyvalue)
    {
        List<askRespond>lists=new ArrayList<askRespond>();
        List<askRespond> list1=askrespondservice.find_askRespondByaskRespondTitleAndstateId(keyvalue,"0ee26211-3ae8-48b7-973f-8488bfe837d6","79ce7fee-9393-4ab8-88a0-306d7b2c9d22","2130f38e-48b2-4e7e-a4cf-120aa3a149af");
        List<askRespond> list2=askrespondservice.find_askRespondBycityNameAndstateId(keyvalue,"0ee26211-3ae8-48b7-973f-8488bfe837d6","79ce7fee-9393-4ab8-88a0-306d7b2c9d22","2130f38e-48b2-4e7e-a4cf-120aa3a149af");
        List<askRespond> list3=askrespondservice.find_askRespondByinterestLabelNameAndstateId(keyvalue,"0ee26211-3ae8-48b7-973f-8488bfe837d6","79ce7fee-9393-4ab8-88a0-306d7b2c9d22","2130f38e-48b2-4e7e-a4cf-120aa3a149af");
        if(null!=list1&&0< list1.size())
            lists.addAll(list1);
        if(null!=list2&&0< list2.size())
            lists.addAll(list2);
        if(null!=list3&&0< list3.size())
            lists.addAll(list3);
        if(null!=lists&&0<lists.size())
        {
            for(askRespond a:lists)
                a.setReplyAskRespondNum(replyaskrespondservice.find_replyAskRespondCountByaskRespondIdAndStateId(a.getAskRespondId(),"0ee26211-3ae8-48b7-973f-8488bfe837d6"));
        }
        return lists;
    }

    /**
     * 根据状态查询所有问答
     * @return
     */
    @ResponseBody
    @RequestMapping("find_askRespondBystateId")
    public Map<String,Object> find_askRespondBystateId(Integer pageIndex)
    {
        Map<String,Object> map=new HashMap<String,Object>();
        List<askRespond>list=askrespondservice.find_askRespondBystateId(pageIndex,"0ee26211-3ae8-48b7-973f-8488bfe837d6","79ce7fee-9393-4ab8-88a0-306d7b2c9d22","2130f38e-48b2-4e7e-a4cf-120aa3a149af");
        map.put("askResponds",askrespondservice.load_TopreplyAskRespond(list));
        map.put("currentIndex",pageIndex);
        return map;
    }

    /**
     * 通过城市编号和状态查询
     * @param pageIndex
     * @param cityId
     * @return
     */
    @ResponseBody
    @RequestMapping("find_askRespondBycityIdAndstateId")
    public Map<String,Object> find_askRespondBycityIdAndstateId(Integer pageIndex,String cityId)
    {
        Map<String,Object> map=new HashMap<String,Object>();
        List<askRespond>list=askrespondservice.find_askRespondBycityIdAndstateId(pageIndex,cityId,"0ee26211-3ae8-48b7-973f-8488bfe837d6","79ce7fee-9393-4ab8-88a0-306d7b2c9d22","2130f38e-48b2-4e7e-a4cf-120aa3a149af");
        map.put("askResponds",askrespondservice.load_TopreplyAskRespond(list));
        map.put("currentIndex",pageIndex);
        return map;
    }

    /**
     * 通过兴趣标签查询
     * @param pageIndex
     * @param interestLabelId
     * @return
     */
    @ResponseBody
    @RequestMapping("find_askRespondByinterestLabelIdAndstateId")
    public Map<String,Object> find_askRespondByinterestLabelIdAndstateId(Integer pageIndex,String interestLabelId)
    {
        Map<String,Object> map=new HashMap<String,Object>();
        List<askRespond>list=askrespondservice.find_askRespondByinterestLabelIdAndstateId(pageIndex,interestLabelId,"0ee26211-3ae8-48b7-973f-8488bfe837d6","79ce7fee-9393-4ab8-88a0-306d7b2c9d22","2130f38e-48b2-4e7e-a4cf-120aa3a149af");
        map.put("askResponds",askrespondservice.load_TopreplyAskRespond(list));
        map.put("currentIndex",pageIndex);
        return map;
    }

    /**
     * 根据键值查询
     * @param pageIndex
     * @param keyvalue
     * @return
     */
    @ResponseBody
    @RequestMapping("find_askRespondBykeyvalueAndstateId")
    public Map<String,Object> find_askRespondBykeyvalueAndstateId(Integer pageIndex,String keyvalue) throws UnsupportedEncodingException {
        if(null!=keyvalue&&!"".equals(keyvalue))
            keyvalue=URLDecoder.decode(keyvalue,"UTF-8");
        Integer pageSize=10;
        Map<String,Object> map=new HashMap<String,Object>();
        List <askRespond>list=new ArrayList<askRespond>();
        List<askRespond>lists=new ArrayList<askRespond>();
        List<askRespond> list1=askrespondservice.find_askRespondByaskRespondTitleAndstateId(keyvalue,"0ee26211-3ae8-48b7-973f-8488bfe837d6","79ce7fee-9393-4ab8-88a0-306d7b2c9d22","2130f38e-48b2-4e7e-a4cf-120aa3a149af");
        List<askRespond> list2=askrespondservice.find_askRespondBycityNameAndstateId(keyvalue,"0ee26211-3ae8-48b7-973f-8488bfe837d6","79ce7fee-9393-4ab8-88a0-306d7b2c9d22","2130f38e-48b2-4e7e-a4cf-120aa3a149af");
        List<askRespond> list3=askrespondservice.find_askRespondByinterestLabelNameAndstateId(keyvalue,"0ee26211-3ae8-48b7-973f-8488bfe837d6","79ce7fee-9393-4ab8-88a0-306d7b2c9d22","2130f38e-48b2-4e7e-a4cf-120aa3a149af");
        if(null!=list1&&0< list1.size())
            lists.addAll(list1);
        if(null!=list2&&0< list2.size())
            lists.addAll(list2);
        if(null!=list3&&0< list3.size())
            lists.addAll(list3);
        if(null!=lists&&0< lists.size())
        {
            if(lists.size()>pageIndex*pageSize-pageSize)
            {
                for(int i=pageIndex*pageSize-pageSize;i<pageIndex*pageSize;i++)
                {
                    if(i<lists.size())
                        list.add(lists.get(i));
                    else
                        break;
                }
            }
        }
        map.put("askResponds",askrespondservice.load_TopreplyAskRespond(list));
        map.put("currentIndex",pageIndex);
        return map;
    }

    /**
     * 根据用户和状态分页查询问答
     * @param userId
     * @param pageIndex
     * @return
     */
    @ResponseBody
    @RequestMapping("find_askRespondByuserIdAndstateIdAndPage")
    public Map<String,Object> find_askRespondByuserIdAndstateIdAndPage(String userId,Integer pageIndex)
    {
        Integer pageSize=10;
        Map<String, Object> map=new HashMap<String, Object>();
        map.put("currentIndex",pageIndex);
        String [] stateIds={"0ee26211-3ae8-48b7-973f-8488bfe837d6","79ce7fee-9393-4ab8-88a0-306d7b2c9d22","2130f38e-48b2-4e7e-a4cf-120aa3a149af"};
        Integer replyAskRespondsNum=replyaskrespondservice.find_replyAskRespondCountByuserIdAndStateId(userId,stateIds);
        Integer optimumAnswerNum=replyaskrespondservice.find_replyAskRespond_optimumAnswerNum(userId,"true",stateIds);
        map.put("replyAskRespondsNum",replyAskRespondsNum);
        map.put("optimumAnswerNum",optimumAnswerNum);
        float cainalv=(float)optimumAnswerNum/replyAskRespondsNum*100;
        map.put("cainalv",cainalv);
        List<askRespond> askResponds=askrespondservice.find_askRespondByuserIdAndstateId(pageIndex,pageSize,userId,stateIds);
        Integer askRespondNum=askrespondservice.find_askRespond_CountByuserIdAndstateId(userId,stateIds);
        map.put("askRespondNum",askRespondNum);
        if(null!=askResponds&&0<askResponds.size())
        {
            for(askRespond a:askResponds)
            {
                if(null!=a.getCityId()&&!"".equals(a.getCityId()))
                    a.setCity(cityservice.byCityIdQuery(a.getCityId()));
            }
            map.put("askResponds",askResponds);
        }
        Integer pages=0;
        if(askRespondNum%pageSize>0)
            pages=askRespondNum/pageSize+1;
        else
            pages=askRespondNum/pageSize;
        map.put("pages",pages);
        return map;
    }

    /**
     * 查询所有问答
     * @param userId
     * @param pageIndex
     * @return
     */
    @ResponseBody
    @RequestMapping("find_askRespond_AllBystateId")
    public Map<String,Object> find_askRespond_AllBystateId(String userId,Integer pageIndex)
    {
        Integer pageSize=10;
        Map<String, Object> map=new HashMap<String, Object>();
        map.put("currentIndex",pageIndex);
        String [] stateIds={"0ee26211-3ae8-48b7-973f-8488bfe837d6","79ce7fee-9393-4ab8-88a0-306d7b2c9d22","2130f38e-48b2-4e7e-a4cf-120aa3a149af"};
        Integer replyAskRespondsNum=replyaskrespondservice.find_replyAskRespondCountByuserIdAndStateId(userId,stateIds);
        Integer optimumAnswerNum=replyaskrespondservice.find_replyAskRespond_optimumAnswerNum(userId,"true",stateIds);
        map.put("replyAskRespondsNum",replyAskRespondsNum);
        map.put("optimumAnswerNum",optimumAnswerNum);
        float cainalv=(float)optimumAnswerNum/replyAskRespondsNum*100;
        map.put("cainalv",cainalv);
        List<askRespond> askResponds=askrespondservice.find_askRespond_replyAskRespondNumBystateId(pageIndex,pageSize,stateIds);
        Integer askRespondNum=askrespondservice.find_askRespond_countBystateId(stateIds);
        map.put("askRespondNum",askRespondNum);
        if(null!=askResponds&&0<askResponds.size())
        {
            for(askRespond a:askResponds)
            {
                if(null!=a.getCityId()&&!"".equals(a.getCityId()))
                    a.setCity(cityservice.byCityIdQuery(a.getCityId()));
            }
            map.put("askResponds",askResponds);
        }
        Integer pages=0;
        if(askRespondNum%pageSize>0)
            pages=askRespondNum/pageSize+1;
        else
            pages=askRespondNum/pageSize;
        map.put("pages",pages);
        return map;
    }

    /**
     * 根据城市获取两个问答
     * @param cityId
     * @return
     */
    @ResponseBody
    @RequestMapping("find_askRespondAndcityBycityIdTop2")
    public Map<String,Object> find_askRespondAndcityBycityIdTop2(String cityId)
    {
        String [] stateIds={"0ee26211-3ae8-48b7-973f-8488bfe837d6","79ce7fee-9393-4ab8-88a0-306d7b2c9d22","2130f38e-48b2-4e7e-a4cf-120aa3a149af"};
        Map<String,Object> map=new HashMap<String,Object>();
        List<askRespond> askResponds=askrespondservice.find_askRespondAndcityBycityIdTop2(cityId,stateIds);
        if(null!=askResponds&&0<askResponds.size())
        {
            for(askRespond a:askResponds)
            {
                a.setUser(usersservice.find_userByuseruserId(a.getUserId()));
                if(a.getStateId().equals("2130f38e-48b2-4e7e-a4cf-120aa3a149af"))
                {
                    replyAskRespond rask=replyaskrespondservice.find_replyAskRespondByaskRespondIdAndoptimumAnswerAndstateId(a.getAskRespondId(),"true",stateIds);
                    if(null!=rask)
                        rask.setUser(usersservice.find_userByuseruserId(rask.getUserId()));
                    a.setReplyaskrespond(rask);
                }
                else
                {
                    replyAskRespond rask=replyaskrespondservice.find_replyAskRespondByaskRespondIdAndstateId(a.getAskRespondId(),stateIds);
                    if(null!=rask)
                        rask.setUser(usersservice.find_userByuseruserId(rask.getUserId()));
                    a.setReplyaskrespond(rask);
                }
            }
        }
        city city=cityservice.byCityIdQuery(cityId);
        map.put("city",city);
        map.put("askResponds",askResponds);
        return map;
    }
}
