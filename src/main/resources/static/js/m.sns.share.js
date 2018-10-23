//兼容老逻辑
function get_connect_share_js(share_type,title,content,url,pic)
{
    var str = '';
    if(share_type == 'sina')
    {
        if('object' === typeof content) {
            content = content['sina'];
        }
        if(content!='')
            title = content.substr(0,140);
        var pop_url = "http://service.weibo.com/share/share.php?appkey=82015185&title="+encodeURIComponent(title)+"&pic="+encodeURIComponent(pic)+"&url="+encodeURIComponent(url)+"&ralateUid=1730714982";
        str = "window.open('"+pop_url+"','_blank','scrollbars=no,width=600,height=480,left=75,top=20,status=no,resizable=yes');";
    }
    else if(share_type == 'renren' || share_type == 'xiaonei')
    {
        if('object' === typeof title) {
            title = title['renren'];
        }
        if('object' === typeof content) {
            content = content['renren'];
        }
        var rrShareParam = {
            resourceUrl : url,
            pic : pic,
            title : title,
            description : content
        };
        shareClick(rrShareParam);
    }
    else if(share_type == 'qzone' || share_type == 'qq')
    {
        if('object' === typeof title) {
            title = title['qq'];
        }
        if('object' === typeof content) {
            content = content['qq'];
        }
        str = "window.open('http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?title="+encodeURIComponent(title)+"&summary="+encodeURIComponent(content)+"&pics="+encodeURIComponent(pic)+"&site="+encodeURIComponent("马蜂窝")+"&url="+encodeURIComponent(url)+"','_blank','scrollbars=no,width=600,height=450,left=75,top=20,status=no,resizable=yes');"
    }
    else
        return false;
    return str;
}

//新的分享方法
function sns_share_show(key, title, content, url, pic, tag) {
    var from = key.split('_')[0];
    if('object' === typeof content) {
        content = content[from];
    }
    if (typeof(ata)!='undefined') {
        ata('sn');
    }
    if(from == 'wb') {
        if(content != '' && content != undefined) {
            content = content.substr(0, 140);
        }
        var pop_url = "http://www.mafengwo.cn/connect_share.php?key=" + key + "&title=" + encodeURIComponent(title) + "&content=" + encodeURIComponent(content) + "&url=" + encodeURIComponent(url) + "&pic=" + encodeURIComponent(pic);
        return 'window.open("' + pop_url + '", "_blank", "scrollbars=no,width=600,height=480,left=75,top=20,status=no,resizable=yes");';
    } else if(from == 'rr') {
        var pop_url = "http://www.mafengwo.cn/connect_share.php?key=" + key + "&title=" + encodeURIComponent(title) + "&content=" + encodeURIComponent(content) + "&url=" + encodeURIComponent(url) + "&pic=" + encodeURIComponent(pic);
        return 'window.open("' + pop_url + '", "_blank", "scrollbars=no,width=700,height=650,left=75,top=20,status=no,resizable=yes");';
    } else if(from == 'qz') {
        var pop_url = "http://www.mafengwo.cn/connect_share.php?key=" + key + "&title=" + encodeURIComponent(title) + "&content=" + encodeURIComponent(content) + "&url=" + encodeURIComponent(url) + "&pic=" + encodeURIComponent(pic);
        return 'window.open("' + pop_url + '", "_blank", "scrollbars=no,width=600,height=450,left=75,top=20,status=no,resizable=yes");';
    } else if(from == 'qt') {
        var pop_url = "http://www.mafengwo.cn/connect_share.php?key=" + key + "&title=" + encodeURIComponent(title) + "&content=" + encodeURIComponent(content) + "&url=" + encodeURIComponent(url) + "&pic=" + encodeURIComponent(pic);
        return 'window.open("' + pop_url + '", "_blank", "scrollbars=no,width=700,height=680,left=75,top=20,status=no,resizable=no,menubar=no,toolbar=no,scrollbars=no,location=yes");';
    } else if(from == 'ww') {
        var pop_url = "http://www.mafengwo.cn/connect_share.php?key=" + key + "&title=" + encodeURIComponent(title) + "&content=" + encodeURIComponent(content) + "&url=" + encodeURIComponent(url) + "&pic=" + encodeURIComponent(pic) + "&tag=" + encodeURIComponent(tag);

        return 'window.open("' + pop_url + '", "_blank", "scrollbars=no,width=660,height=550,left=75,top=20,status=no,resizable=no,menubar=no,toolbar=no,scrollbars=no,location=yes");';
    }
}

if('M' in window && 'define' in M) {
    M.define('/js/m.sns.share', function(){
        return sns_share_show;
    });
}
