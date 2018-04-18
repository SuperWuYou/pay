var enterTime = new Date();

// userAgent
var vm = new Vue({
    el: '#pay',
    data: {
        agent: 3,  //扫描app->1:支付宝；2:微信；3:其他
        message: {},    //页面内容
        which: '确认支付',     //显示那个box
        payResult: true,     //支付结果：true--成功； false--失败
        timeout: false,
        sessionId: '',
        quoteNo: ''
    },
    computed: {
        witchAgent: function () {
            return {
                'ml-3vw': this.agent != 3,
                'ml-6vw': this.agent == 3
            }
        },
        wxHeader: function () {
            return {
                'wx-header': this.agent == 2
            }
        }
    },
    methods: {
        getUrlParam: function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return decodeURIComponent(r[2]);
            return null;
        },
        getData: function () {
            var _self = this;
            _self.sessionId = _self.getUrlParam('sessionId');
            _self.quoteNo = _self.getUrlParam('quoteNo');
            _self.platform();
            $.ajax({
                type: 'POST',
                url: URL,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify({
                    "params": {sessionId: _self.sessionId, quoteNo: _self.quoteNo},
                    "jsonrpc": 1,
                    "method": "",
                    "id": 1
                }),
                success: function (data) {
                    if(data.error){
                        if(data.error.code == '-30798'){
                            _self.which = '服务已付款';
                        }else if(data.error.code == '-31697'){
                            _self.which = '二维码失效';
                        }

                    }else {
                        _self.which = '确认支付';
                        _self.message = data.result;
                    }
                },
                error: function (errMsg) {

                }
            });
        },
        ifTimeout: function () {
            var payTime = new Date();
            return payTime - enterTime < 86400000 * 15 ? true : false;
        },
        platform: function () {   //判断是什么终端扫开的二维码
            var _self = this;
            var u = navigator.userAgent.toLowerCase();
            console.log(u);
            if(u.indexOf('micromessenger') > -1){
                _self.agent = 2;
            }else if(u.indexOf('alipay') > -1){
                _self.agent = 1;
            }else {
                _self.agent = 3;
            }
        },
        wxPay: function () {     //微信支付
            var _self = this;
            if (_self.ifTimeout()) {

            }
        },
        aliPay: function () {     //支付宝支付

        },
        close: function () {     //<-
            window.history.back();
        },
        openApp: function () {    //打开铺铺旺 APP

        }
    }
});

vm.getData();