var url = 'https://explorer.newtonproject.org/api/v1/txs?address=' + address,
    page = 0,
    dataIndex = 1,
    data1 = [],
    data2 = [],
    tmpData = [],
    showIndex = 0
    timer = 0;

function loadDataByPage(currentPage) {

    $.get(url, {pageNum: currentPage}, function(res){

        if (res) {

            var txs = res.txs;

            for (var i = 0; i < txs.length; i++) {

                if (dataIndex == 1) {
                    data2.push(txs[i]);
                } else {
                    data1.push(txs[i]);
                }
            
            }

            if (currentPage + 1 < res.pagesTotal) {

                page ++;
                loadDataByPage(currentPage + 1);

            } else {

                page = 0;
                dataIndex = dataIndex == 1 ? 2 : 1;

            }

        }
    });
}

function loadData() {

    loadDataByPage(page);

    setInterval(function(){
        
        loadDataByPage(page);

    }, 1000 * 60);

}

function showData() {

    timer = setInterval(function(){

        if (tmpData.length == 0) {
            tmpData = dataIndex == 1 ? Array.from(data1) : Array.from(data2);
        }

        var bullet = tmpData.shift();
        var text = '';
        if (bullet) {
            var data = bullet['data'];

            if (data && data.length > 2) {
                text = hex2str(data.substring(2));
            } else {
                text = bullet['value'] + 'NEW';
            }
            barrageWall.upWall("https://www.newtonproject.org/static/images/newton-logo.svg?v=385","",text);
        } 

        if (tmpData.length == 0) {
            clearInterval(timer);
            setTimeout(function(){
                showData();
            }, 6000);
        }

    }, 500);

}

function hex2str(hexstr) {
    if (hexstr) {
        var newstr = '';
        var charArr = hexstr.split("");
        for (var i = 0; i < charArr.length; i++) {
            if (i % 2 == 0) {
                newstr += '%' + charArr[i];
            } else {
                newstr += charArr[i];
            }
        }
        return decodeURIComponent(newstr);
    }
    return '';
}


$(function () {

    var option={
      container:".container",//弹幕墙的id
      barrageLen:15//弹幕的行数
    }
    barrageWall.init(option);//初始化弹幕墙
    

    loadData();
    showData();

});