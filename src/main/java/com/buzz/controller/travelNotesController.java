package com.buzz.controller;

import com.buzz.entity.users;
import com.buzz.service.travelNotesService;
import com.buzz.utils.Conversion;
import com.buzz.utils.Encryption;
import org.springframework.stereotype.Controller;
import org.springframework.util.ResourceUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import sun.misc.BASE64Decoder;

import javax.annotation.Resource;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.*;
import java.util.HashMap;
import java.util.Map;

@Controller
@RequestMapping("travelNotesController")
public class travelNotesController
{
    @Resource
    private travelNotesService travelnotesservice;

    /**
     * 显示创建游记页面
     * @return
     */
    @RequestMapping("show_createNoteIndex_html")
    public String show_createNoteIndex_html()
    {
        return "front_desk/travelNotes/createNoteIndex";
    }

    /**
     * 检验该用户草稿游记是否超出十个
     * @param session
     * @return true 未超出,false超出
     */
    @ResponseBody
    @RequestMapping("check_travelNotesNumber")
    public boolean check_travelNotesNumber(HttpSession session)
    {
        users user= (users) session.getAttribute("user");
        //Integer result=travelnotesservice.find_travelNotes_NumberByuserId(user.getUserId(),"aa093f4b-1c4c-4f4f-8626-87d51c50d58b");
        Integer result=0;
        if(null==result||10>result)
            return true;
        else
            return false;
    }

    /**
     * 加载游记文本域块
     * @return
     */
    @ResponseBody
    @RequestMapping("getNoteContentChunk")
    public Map<String,Object> getNoteContentChunk(String act, String id, String seq, String back, String is_retina)
    {
        Map<String,Object>map=new HashMap<String,Object>();
        map.put("has_more",false);
        map.put("unit_num",0);
        map.put("html","<div class='textarea_placeholder _j_plc_item'>\n<textarea cols='30' rows='1' class='textarea _j_textarea _j_textareaplc' data-exclude_class='_j_textarea' tabindex='-1'></textarea>\n</div>\n\n");
        Map<String,Object> data=new HashMap<String,Object>();
        data.put("data",map);
        return data;
    }
    @ResponseBody
    @RequestMapping("checkTokenSaved")
    public Map<String,Object> checkTokenSaved(String act, String id, String cache_token, HttpServletRequest request)
    {
        System.out.println(act);
        System.out.println(id);
        System.out.println(cache_token);
        Cookie [] cookies=request.getCookies();
        for(Cookie c:cookies)
        {
            if(c.getName().equals(cache_token))
            {
                System.out.println(c.getValue());
            }
        }
        return new HashMap();
    }
    @ResponseBody
    @RequestMapping("uploadPhotos")
    public Map<String,Object> uploadPhotos(String imgUrl, String dummyData2, int imgInitW, int imgInitH, double imgW, double imgH, int imgY1, int imgX1, int cropH, int cropW, int  rotation) throws IOException
    {
        Map<String,Object> map=new HashMap();
        if(imgInitH<900||imgInitW<1600)
        {
            map.put("status","error");
            map.put("message","抱歉,请重新选择图片,图片宽度不能小于1600px,高度不行小于900px");
            return map;
        }
        else
        {
            //获取图片信息
            String img_Data=imgUrl.substring(imgUrl.indexOf(",")+1);
            String img_type=imgUrl.substring(imgUrl.indexOf("/")+1,imgUrl.indexOf(";"));
            BASE64Decoder decoder=new BASE64Decoder();
            //转换为byte数组
            byte[]imgData=decoder.decodeBuffer(img_Data);
            String path = ResourceUtils.getURL("src/main/resources/static/images/travelNotesheadPhotos").getPath();
            path=path.replace("%20"," ");
            //原图名称
            String oldfilename=path+"/"+ Encryption.getUUID()+"."+img_type;
            //原图文件
            File oldfile=new File(oldfilename);
            FileOutputStream out = new FileOutputStream(oldfile);
            out.write(imgData);
            out.flush();
            out.close();
           try
           {
               BufferedImage bi=Encryption.file2img(oldfilename);  //读取图片
               int w=1920-cropW;
               if(imgY1>imgInitH-650)
                   imgY1=imgInitH-650;
               BufferedImage bii=Encryption.img_tailor(bi,0,imgY1,imgInitW,650);
               String newfilename=Encryption.getUUID()+"."+img_type;
               String newfilepath=path+"/"+newfilename;
               Encryption.img2file(bii,"jpg",newfilepath);  //生成图片
               map.put("status","success");
               map.put("url",newfilepath);
               return map;
           }
           catch(Exception e)
           {
               e.printStackTrace();
               map.put("status","error");
               map.put("message","设置图片错误!");
               return map;
           }
           finally
           {
               if(oldfile.exists())//如果存在删除文件旧图片
               {
                   oldfile.delete();
               }
           }
        }
    }
    @ResponseBody
    @RequestMapping("gettravelNotesheadPhoto")
    public void gettravelNotesheadPhoto(String path,HttpServletResponse response) throws IOException
    {
        FileInputStream fis=null;
        OutputStream os=null;
        try
        {
            fis=new FileInputStream(path);
            os=response.getOutputStream();
            int count=0;
            byte[]buffer=new byte[1024*8];
            while((count=fis.read(buffer))!=-1)
            {
                os.write(buffer,0,count);
                os.flush();
            }
        }
        catch(Exception e)
        {
            e.printStackTrace();
        }
        finally
        {
            os.close();
            fis.close();
        }
    }

}
