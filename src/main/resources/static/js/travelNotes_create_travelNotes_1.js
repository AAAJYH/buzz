//点击textarea外面的div,textarea获取焦点
$("#pagelet-block-2e45b644c927e980b6da626ea10b8476").click(
	function()
	{
		var textnumber=$("textarea").length;
        if(textnumber==1)
        {
            $("textarea").focus();
        }
	}
);
//如果textarea出现滚动条,重新设置textarea高度
$("textarea").keyup(
	function()
	{
        $('textarea').each(function ()
		{
            this.setAttribute('style', 'height:' + (this.scrollHeight) + 'px;overflow-y:hidden;');
        }).on('input', function ()
		{
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
        })
	}
);
var croppicHeaderOptions = {
    //uploadUrl:'img_save_to_file.php',
    cropData:{
        "dummyData":1,
        "dummyData2":"asdas"
    },
    cropUrl:'travelNotesController/uploadPhotos',
    customUploadButtonId:'_j_upload_toppic',
    outputUrlId:'_j_change_toppic',
    modal:false,
    processInline:true,
    loaderHtml:'<div class="loader bubblingG"><span id="bubblingG_1"></span><span id="bubblingG_2"></span><span id="bubblingG_3"></span></div> ',
    onBeforeImgUpload: function(){
        //隐藏设置游记头图
        $(".set_page").css("display","none");
    },
    onAfterImgUpload: function(){ console.log('onAfterImgUpload') },
    onImgDrag: function(){ console.log('onImgDrag') },
    onImgZoom: function(){ console.log('onImgZoom') },
    onBeforeImgCrop: function(){ console.log('onBeforeImgCrop') },
    onAfterImgCrop:function(){
        console.log('onAfterImgCrop')
    },
    onReset:function(){
        //如果关闭剪切图片,显示设置游记头图按钮
        $(".set_page").css("display","block");
    },
    onError:function(errormessage){
        //当上传出现错误时
        alert(errormessage);
    }
}
var croppic = new Croppic('cropContainerModal', croppicHeaderOptions);
//判断游记标题长度是否超出48,如果超出截取前48个字
$("#_j_title").keyup(
    function()
    {
        var value=$(this).val();
        var length=value.length;
        if(length==0)
        {
            $(".set_title").children("span").css("display","none");
        }
        else
        {
            $(".set_title").children("span").css("display","block");
            var index=48-length;
            if(index<=0)
            {
                index=0;
                value=value.substring(0,47);
            }
            $(".set_title").children("span").children("strong").text(index);
        }
    }
);


