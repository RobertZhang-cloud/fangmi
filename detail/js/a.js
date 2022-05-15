 // window.onload是全部资源加载完成之后执行
        // DOMContentLoaded是等待节点加载完成之后执行，DOMContentLoaded是DOM2级事件，所以需要使用addEventListener监听
        window.addEventListener("DOMContentLoaded", function () {
            //每一个功能放在一个函数中去运行

            //声明一个全局变量来保存缩略图点击的图片下标
            var magnifierImgID = 0;
            //声明一个全局变量 来保存商品的数量，方便再其他函数中调用
            var goodsChangeNum = 1;


            //1.放大镜效果
            magnifier();
            function magnifier() {
                //模拟后台数据 
                var imgsrc = goodData.imgsrc;


                //修改放大镜的小图片为动态的数据
                //获取放大镜的小图
                var oJqzoomImg = document.querySelector(".outer .con .mainCon .previewWrap .preview .jqzoom img");
                // 设置放大镜小图的src
                oJqzoomImg.src = imgsrc[magnifierImgID].s;


                //获取放大镜外层元素
                var oPreview = document.querySelector(".outer .con .mainCon .previewWrap .preview");
                //获取小图的容器
                var oJqzoom = document.querySelector(".outer .con .mainCon .previewWrap .preview .jqzoom")
                //初始化蒙版元素
                var oMask = null;
                //初始化大图外层
                var oMaxBox = null;
                //初始化大图
                var oMaxImg = null;

                //绑定鼠标移入事件
                // onmouseenter和onmouseover 区别在于是否触发冒泡
                oPreview.onmouseenter = function () {
                    //当鼠标移入元素，创建蒙版，严格书写，当没有蒙版的时候，创建，如果存在 则不创建

                    if (!oMask) {
                        //创建蒙版
                        oMask = document.createElement("div");
                        //给蒙版一个类型，并在less中书写蒙版的样式
                        oMask.className = "mask";
                        //把蒙版插入到小图容器中
                        oJqzoom.appendChild(oMask);
                    }
                    //当没有大图外层的时候，则创建一个大图外层及大图
                    if (!oMaxBox) {
                        //创建大图外层
                        oMaxBox = document.createElement("div");
                        //添加样式
                        oMaxBox.className = "maxbox";
                        //给大图外层插入一个大图
                        oMaxImg = new Image();

                        //把放大镜生成的图片路径 改为动态
                        oMaxImg.src = imgsrc[magnifierImgID].b;
                        oMaxBox.appendChild(oMaxImg)

                        //把大图外层插入到页面中
                        oPreview.appendChild(oMaxBox);
                    }

                    //给元素绑定鼠标移动事件
                    oJqzoom.onmousemove = function (e) {
                        //当元素移动的时候，蒙版的位置是  鼠标的clientX-蒙版的一半 - 父级距离屏幕边缘的位置
                        //计算蒙版的位移
                        var maskPosition = {
                            left: e.clientX - oMask.offsetWidth / 2 - oJqzoom.getBoundingClientRect().left,
                            top: e.clientY - oMask.offsetHeight / 2 - oJqzoom.getBoundingClientRect().top
                        }

                        //判断临界值
                        if (maskPosition.left <= 0) {
                            maskPosition.left = 0;
                        } else if (maskPosition.left >= oJqzoom.clientWidth - oMask.offsetWidth) {
                            maskPosition.left = oJqzoom.clientWidth - oMask.offsetWidth;
                        }
                        if (maskPosition.top <= 0) {
                            maskPosition.top = 0;
                        } else if (maskPosition.top >= oJqzoom.clientHeight - oMask.offsetHeight) {
                            maskPosition.top = oJqzoom.clientHeight - oMask.offsetHeight;
                        }


                        //对蒙版进行赋值
                        oMask.style.left = maskPosition.left + "px";
                        oMask.style.top = maskPosition.top + "px";

                        //计算比例：（蒙版总共可以移动的距离/大图能够移动的距离）
                        var scale = (oJqzoom.clientWidth - oMask.offsetWidth) / (oMaxImg.offsetWidth - oMaxBox.clientWidth);
                        // console.log(scale)
                        //计算大图移动的位置
                        var maxPosition = {
                            left: maskPosition.left / scale,
                            top: maskPosition.top / scale
                        }
                        //给大图的定位进行赋值(大图和蒙版移动的方向是相反的)
                        oMaxImg.style.marginLeft = - maxPosition.left + "px";
                        oMaxImg.style.marginTop = - maxPosition.top + "px";


                    }

                    //当放大镜查看结束，鼠标移出
                    oPreview.onmouseleave = function () {
                        //移除DOM节点
                        oJqzoom.removeChild(oMask);
                        oPreview.removeChild(oMaxBox);
                        // console.log(oMask)//元素移除以后，只是移出了DOM

                        //把几个变量恢复初始化
                        //初始化蒙版元素
                        oMask = null;
                        oMaxBox = null;
                        oMaxImg = null;

                        //解绑事件
                        oJqzoom.onmousemove = null;
                        oPreview.onmouseleave = null;


                    }
                }
            }

            //获取元素的非行间样式
            function getStyle(obj, attr) {
                if (obj.currentStyle) {
                    return obj.currentStyle[attr];
                } else {
                    return document.defaultView.getComputedStyle(obj, null)[attr];
                }
            }

            //2.缩略图滑动效果
            thumbnail();
            function thumbnail() {
                //获取可以走动的容器
                var oScrollDiv = document.querySelector(".outer .con .mainCon .previewWrap .specScroll .items .itemsCon");

                //根据动态数据 生成缩略图结构
                let imgSrc = goodData.imgsrc;
                imgSrc.forEach(function (item) {
                    var oImg = new Image();
                    oImg.src = item.s;
                    oScrollDiv.appendChild(oImg);
                })



                //获取容器中图片的集合
                var oScrollItems = document.querySelectorAll(".outer .con .mainCon .previewWrap .specScroll .items .itemsCon img");

                //获取向后的按钮
                var oNext = document.querySelector(".outer .con .mainCon .previewWrap .specScroll .next");
                var oPrev = document.querySelector(".outer .con .mainCon .previewWrap .specScroll .prev");

                //初始化已经走过去的距离
                var tempLength = 0;
                //定义每次容器中可以显示图片的数量
                var viewNum = 5;
                //定义每次滑动的数量
                var moveNum = 2;
                //计算出总共可以移动的长度（）
                var countLength = (oScrollItems.length - viewNum) * (oScrollItems[0].offsetWidth + parseInt(getStyle(oScrollItems[0], "marginRight")));
                //计算出每次移动的长度 (一个元素的宽度（带margin）)*每次移动的数量
                var moveLength = (oScrollItems[0].offsetWidth + parseInt(getStyle(oScrollItems[0], "marginRight"))) * moveNum;


                //给oScrollDiv添加过渡动画
                oScrollDiv.style.transition = "all .3s linear";
                //给后按钮绑定事件：
                oNext.onclick = function () {
                    //如果已经走过的距离 小于 总共可以走的距离  才能继续移动
                    if (tempLength < countLength) {
                        //如果剩余的距离大于 每次可以移动的长度  则每次走该走的距离

                        //剩余的距离是 = 总共可以走的距离  减去 已经走过去的距离
                        if (countLength - tempLength > moveLength) {
                            tempLength += moveLength;
                            oScrollDiv.style.left = -tempLength + "px";
                        } else {
                            // 如果剩余的距离 小于 每次可以移动的长度 就直接走剩余的距离
                            tempLength += (countLength - tempLength);
                            oScrollDiv.style.left = -tempLength + "px";
                        }
                    }
                }

                // 给向前走按钮绑定事件
                oPrev.onclick = function () {
                    //如果可以走的距离还大于0  则继续走
                    if (tempLength >= 0) {
                        //如果可以走的距离 大于 每次移动的距离  则走该走的长度  否则直接到0
                        if (tempLength > moveLength) {
                            tempLength -= moveLength;
                            oScrollDiv.style.left = -tempLength + "px";
                        } else {
                            tempLength = 0;
                            oScrollDiv.style.left = -tempLength + "px";
                        }
                    }
                }
            }

            //3.缩略图点击效果
            thumbnailClick();
            function thumbnailClick() {
                //获取容器中图片的集合
                var oScrollItems = document.querySelectorAll(".outer .con .mainCon .previewWrap .specScroll .items .itemsCon img");
                var oJqzoomImg = document.querySelector(".outer .con .mainCon .previewWrap .preview .jqzoom img");
                //对所有的图片绑定点击事件
                for (var i = 0; i < oScrollItems.length; i++) {
                    oScrollItems[i].onclick = function () {
                        for (var i = 0; i < oScrollItems.length; i++) {
                            if (oScrollItems[i] == this) {
                                //把i传递过去
                                magnifierImgID = i;
                                //立马把小图的路径改变
                                oJqzoomImg.src = this.src;
                            }
                        }
                    }
                }
            }


            //4.商品筛选详情 数据动态加载
            screening();
            function screening() {
                var crumbData = goodData.goodsDetail.crumbData;

                // 获取容器元素
                var oChooseDetail = document.querySelector(".outer .con .mainCon .infoWrap .choose .chooseArea");
                crumbData.forEach(function (item, index, array) {
                    //每次遍历进来，先创建一个dl标签
                    var oDl = document.createElement("dl");
                    //每一个dl都只有一个dt元素 可以在这里创创建一个dt标签
                    var oDt = document.createElement("dt");
                    //给dt赋值
                    oDt.innerHTML = item.title;
                    //把dt插入到dl中
                    oDl.appendChild(oDt);
                    item.data.forEach(function (item) {
                        //生成dd
                        var oDd = document.createElement("dd");
                        //给生成的dd扩展自定义属性，保存对价格的修改
                        oDd.setAttribute("changePrice", item.changePrice);

                        //给dd插入内容
                        oDd.innerHTML = item.type;
                        //把dd插入到dl中
                        oDl.appendChild(oDd);
                    })
                    //把当前遍历生成的dl插入到页面中
                    oChooseDetail.appendChild(oDl);
                })


                //以下是点击选择筛选内容的交互代码
                //获取dl标签
                var oDl = oChooseDetail.getElementsByTagName("dl");
                //定义一个数组，数组中保存帅选条件，需要的时候，按顺序保存和获取里边的条件
                //并且，保证数组只有 crumbData.length 个值 当更换数据的时候，直接替换原有位置的值即可
                /* var arr = [];
                for (let i = 0; i < crumbData.length; i++) {
                    arr.push(0);
                } */
                var arr = new Array(crumbData.length);
                arr.fill(0);

                //遍历所有的dl标签，然后给当前dl标签中的dd绑定事件
                for (var i = 0; i < oDl.length; i++) {
                    //记录每一个dl的下标
                    oDl[i].index = i;
                    //获取当前dl标签中的所有的dd标签
                    ~function () {
                        var oDd = oDl[i].getElementsByTagName("dd");
                        //对所有的dd绑定点击事件
                        for (var j = 0; j < oDd.length; j++) {

                            oDd[j].onclick = function () {
                                // console.log(this.parentNode.querySelectorAll("dd"));

                                //先恢复所有元素的默认颜色
                                for (var i = 0; i < oDd.length; i++) {
                                    oDd[i].style.color = "#666";
                                }
                                // 给当前点击的元素设置颜色
                                this.style.color = "red";

                                //只要用户点击操作了，就要对数组进行修改
                                //数组中保存元素节点，方便以后获取数组中的元素节点的属性
                                arr[this.parentNode.index] = this;
                                console.log(arr);
                                priceSum(arr);

                                var oChoosed = document.querySelector(".outer .con .mainCon .infoWrap .choose .chooseArea .choosed");
                                // 在插入元素之前，先把盛放筛选条件的choosed容器清空
                                oChoosed.innerHTML = "";

                                //遍历数组 生成相对应的元素
                                arr.forEach(function (item, index) {
                                    //检测数组，当数组的值不为0的时候，创建mark标签
                                    if (item) {
                                        //创建mark标签
                                        var oChomark = document.createElement("mark");
                                        //把数组的内容放在mark标签中
                                        oChomark.innerHTML = item.innerHTML;
                                        //创建mark标签中的a标签
                                        var oCxa = document.createElement("a");
                                        //创建a标签的时候，用一个自定义属性保存当前a所以在数组的下标，方便将来删除的时候使用
                                        oCxa.setAttribute("num", index);
                                        oCxa.innerHTML = "X";

                                        //把a标签插入到mark中
                                        oChomark.appendChild(oCxa);
                                        //把mark标签插入到choosed标签中

                                        oChoosed.appendChild(oChomark);
                                    }
                                })

                                //当遍历完数组并添加完mark元素之后，给mark中的a标签添加删除功能
                                //获取mark标签中 所有的a标签
                                var oChoseA = oChoosed.querySelectorAll("mark a");
                                for (var i = 0; i < oChoseA.length; i++) {
                                    oChoseA[i].onclick = function () {
                                        //获取当前a所对应的下标，之前已经通过自定义属性的方法保存过了
                                        var num = parseInt(this.getAttribute("num"));//得到的值是字符串 需要转换成number类型
                                        //删掉当前点击的mark标签
                                        this.parentNode.parentNode.removeChild(this.parentNode);
                                        //去掉当前删除元素所对应元素的颜色
                                        // console.log(oDl[num]);
                                        var oDlDd = oDl[num].querySelectorAll("dd");
                                        for (var i = 0; i < oDlDd.length; i++) {
                                            oDlDd[i].style.color = "#666";
                                        }

                                        //把默认颜色给上去
                                        oDl[num].querySelector("dd:nth-of-type(1)").style.color = "red";

                                        //每次删除一个的时候，要把当前所对应的数组的值也给删除了
                                        arr[num] = 0;

                                        //在删除的时候数组改变 调用价钱函数
                                        priceSum(arr);
                                    }
                                }
                            }
                        }
                    }()
                }

                //计算价钱的函数
                // 只要保存筛选条件的数组被操作了，则调用改函数，所以可以把数组当作参数传递进去
                function priceSum(arr) {
                    //定义初始默认价钱  默认的价钱乘以默认的数量
                    let newPrice = goodData.goodsDetail.price * goodsChangeNum;
                    arr.forEach(function (item, index) {
                        if (item) {
                            newPrice += parseInt(item.getAttribute("changePrice")) * goodsChangeNum
                        }
                    })

                    //获取价钱的容器
                    var oPrice = document.querySelector(".outer .con .mainCon .infoWrap .info1 .priceArea .priceArea1 .price em");
                    oPrice.innerHTML = newPrice;

                    //只要计算价钱就改变搭配选择的价钱
                    var choosePrice = document.querySelector(".outer .productDetail .detail .fitting .good-suits .master p");
                    choosePrice.innerHTML = "¥" + newPrice;

                    //当搭配修改以后，总价页需要被修改
                    var choosePrice = newPrice;
                    var oChooseAllPrice = document.querySelector(".good-suits .result .price");
                    var oChooseAllCheckBoxs = document.querySelectorAll(".good-suits .suits input[type=checkbox]");
                    oChooseAllCheckBoxs.forEach(function (item) {
                        //如果当前的多选矿被选中  则它的checked属性返回true
                        if (item.checked) {
                            choosePrice += parseInt(item.value)
                        }
                    })
                    oChooseAllPrice.innerHTML = "¥" + choosePrice;
                }
            }


            //5.商品数量交互
            goodsNum();
            function goodsNum() {
                var oPlus = document.querySelector(".outer .con .mainCon .infoWrap .choose .cartWrap .controls .plus");
                var oMins = document.querySelector(".outer .con .mainCon .infoWrap .choose .cartWrap .controls .mins");
                var oItxt = document.querySelector(".outer .con .mainCon .infoWrap .choose .cartWrap .controls .itxt");
                //默认数量

                oPlus.onclick = function () {
                    goodsChangeNum++;
                    oItxt.value = goodsChangeNum;

                    //当数量改变的时候，获取当前的价钱，然后计算总价赋值
                    //获取价钱的容器
                    var oPrice = document.querySelector(".outer .con .mainCon .infoWrap .info1 .priceArea .priceArea1 .price em");
                    //每次计算的时候，先获取单价 然后再 乘以新的数量
                    var finalPrice = oPrice.innerHTML / (goodsChangeNum - 1) * goodsChangeNum;
                    oPrice.innerHTML = finalPrice;

                    //把改变数量以后，计算好的总价传参到里边去
                    changeFittingPrice(finalPrice);

                }
                oMins.onclick = function () {
                    if (goodsChangeNum > 1) {
                        goodsChangeNum--;
                        oItxt.value = goodsChangeNum;

                        //获取价钱的容器
                        var oPrice = document.querySelector(".outer .con .mainCon .infoWrap .info1 .priceArea .priceArea1 .price em");
                        //每次计算的时候，先获取单价 然后再 乘以新的数量
                        var finalPrice = oPrice.innerHTML / (goodsChangeNum + 1) * goodsChangeNum;
                        oPrice.innerHTML = finalPrice;

                        changeFittingPrice(finalPrice);

                    }
                }
                //封装一个 改变数量就改变搭配总价的函数
                function changeFittingPrice(finalPrice) {
                    //改变搭配选择价钱
                    var choosePrice = document.querySelector(".good-suits .master p");
                    choosePrice.innerHTML = "¥" + finalPrice;

                    //当搭配修改以后，总价页需要被修改
                    var oChooseAllPrice = document.querySelector(".good-suits .result .price");
                    var oChooseAllCheckBoxs = document.querySelectorAll(".good-suits .suits input[type=checkbox]");
                    oChooseAllCheckBoxs.forEach(function (item) {
                        //如果当前的多选矿被选中  则它的checked属性返回true
                        if (item.checked) {
                            finalPrice += parseInt(item.value)
                        }
                    })
                    oChooseAllPrice.innerHTML = "¥" + finalPrice;


                }
            }

            // 6.路径导航动态生成
            pathUrl();
            function pathUrl() {
                //获取容器
                var oConPoin = document.querySelector(".outer .con .conPoin");
                //得到动态导航路径数据
                var urlCon = goodData.path;
                //遍历路径的数据
                urlCon.forEach(function (item, index) {
                    // 遍历的时候创建一个标签
                    var oA = document.createElement("a");
                    //判断有没有url路径的（href属性）
                    //数组的最后一个值没有
                    if (index == urlCon.length - 1) {
                        oA.innerHTML = item.title;
                        oConPoin.appendChild(oA);
                    } else {
                        oA.href = item.url;
                        oA.innerHTML = item.title;
                        oConPoin.appendChild(oA);
                    }
                })
            }

            //7.商品详情的数据动态生成
            goodsDetail();
            function goodsDetail() {
                //获取容器哦
                var oInfo1 = document.querySelector(".outer .con .mainCon .infoWrap .info1");
                //获取数据
                var goodsCon = goodData.goodsDetail;
                //使用模板字符串拼接结构
                var oInfo1Content = `
                    <h3 class="infoName">${goodsCon.title}</h3>
                        <p class="news">${goodsCon.recommend}</p>
                        <div class="priceArea">
                            <div class="priceArea1">
                                <div class="title">价&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;格</div>
                                <div class="price">
                                    <i>¥</i>
                                    <em>${goodsCon.price}</em>
                                    <span>降价通知</span>
                                </div>
                                <div class="remark">
                                    <i>累计评价</i>
                                    <span>${goodsCon.evaluateNum}</span>
                                </div>
                            </div>
                            <div class="priceArea2">
                                <div class="title">促&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;销</div>
                                <div class="fixWidth">
                                    <i class="red-bg">${goodsCon.promoteSales.type}</i>
                                    <em
                                        class="t-gray">${goodsCon.promoteSales.content}</em>
                                </div>
                            </div>
                        </div>
                        <div class="support">
                            <div class="supportArea">
                                <div class="title">支&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;持</div>
                                <div class="fixWidth">${goodsCon.support}</div>
                            </div>
                            <div class="supportArea">
                                <div class="title">配&nbsp;送&nbsp;至</div>
                                <div class="fixWidth">${goodsCon.address}</div>
                            </div>
                        </div>
                    `;

                oInfo1.innerHTML = oInfo1Content;
            }



            //8.选项卡切换的封装
            // 使用面向对象方法：构造函数+原型 方法
            //两个参数  对应的是标题和内容
            function Tab(btn, content) {
                this.tabBtn = btn;
                this.tabDiv = content;

                //给所有的btn绑定点击事件
                for (var i = 0; i < this.tabBtn.length; i++) {
                    this.tabBtn[i].index = i;
                    //保存当前的this，用来在事件中使用
                    var _this = this;
                    this.tabBtn[i].onclick = function () {
                        //原型对象的方法应该是实例化的对象调用，所以需要使用外边的this
                        //这个点击事件中的this指向的是 事件发生的对象
                        //穿的参数this  是当前点击的对象
                        _this.clickBtn(this);
                    }
                }
            }
            Tab.prototype.clickBtn = function (btn) {
                //选项卡切换逻辑
                for (var i = 0; i < this.tabBtn.length; i++) {
                    this.tabBtn[i].className = "";
                    this.tabDiv[i].style.display = "none";
                }//

                //如果在这里边直接使用this 指向的是实例化对象，而不是当前点击的对象
                //当前点击的对象需要在调用这个原型方法的时候，传递进来
                btn.className = "active";
                this.tabDiv[btn.index].style.display = "block";
            }



            //9.侧边栏调用Tab切换
            asideNav();
            function asideNav() {
                var oTabBtn = document.querySelectorAll(".tabWraped h4");
                var oTabPane = document.querySelectorAll(".tabContent .tab-pane");
                // console.log(oTabPane);
                new Tab(oTabBtn, oTabPane);
            }


            //10.选择搭配价钱
            fittingPrice();
            function fittingPrice() {
                //获取搭配后总价元素
                var oChooseAllPrice = document.querySelector(".good-suits .result .price");
                var oChooseAllCheckBoxs = document.querySelectorAll(".good-suits .suits input[type=checkbox]");
                oChooseAllCheckBoxs.forEach(function (item, index) {
                    //给所有的多选框绑定事件   change事件是当状态改变并失去焦点的时候触发
                    item.onchange = function () {
                        //获取原始价钱 也即是搭配布局第一项的价钱
                        var oChoosePrice = document.querySelector(".good-suits .master p");
                        //因为获取的价钱有¥ 所以需要字符串裁剪
                        var choosePrice = parseInt(oChoosePrice.innerHTML.substr(1));
                        //遍历所有的多选框，判断哪一个是被选中的
                        oChooseAllCheckBoxs.forEach(function (item) {
                            //如果当前的多选矿被选中  则它的checked属性返回true
                            if (item.checked) {
                                choosePrice += parseInt(item.value)
                            }
                        })
                        oChooseAllPrice.innerHTML = "¥" + choosePrice;


                    }
                })
            }

            // 11.详情页评论区Tab切换功能
            intro();
            function intro() {
                var oTabBtn = document.querySelectorAll(".outer .productDetail .detail .intro .tab-wraped li");
                var oTabPane = document.querySelectorAll(".outer .productDetail .detail .intro .tab-content .tab-pane");
                new Tab(oTabBtn, oTabPane);
            }

            //12.侧边栏效果
            asideShow();
            function asideShow() {

                //面包屑开关逻辑
                var oBut = document.querySelector(".outer .toolbar .but");
                var oToolBar = document.querySelector(".outer .toolbar");
                //定义一个开关，保存当前是展开还是缩起来
                var flag = true;//默认是闭合的
                oBut.onclick = function () {
                    if (flag) {
                        oToolBar.className = "toolbar toolbar-out";
                        this.className = "but pull-wrap"
                    } else {
                        oToolBar.className = "toolbar toolbar-wrap";
                        this.className = "but list"
                    }
                    flag = !flag;
                }


                // 鼠标掠过展开小图标逻辑
                var oPull = document.querySelectorAll(".outer .pull");
                var oTabIcon = document.querySelectorAll(".outer .pull .tab-icon");
                var oTabText = document.querySelectorAll(".outer .pull em");
                for (var i = 0; i < oPull.length; i++) {
                    oPull[i].index = i;
                    oPull[i].onmouseenter = function () {
                        oTabText[this.index].style.left = "-59px";
                        oTabText[this.index].style.backgroundColor = "#c81122";
                        oTabIcon[this.index].style.backgroundColor = "#c81122";
                    }
                    oPull[i].onmouseleave = function () {
                        oTabText[this.index].style.left = "35px";
                        oTabText[this.index].style.backgroundColor = "#7a6e6e";
                        oTabIcon[this.index].style.backgroundColor = "#7a6e6e";
                    }
                }
            }
        })

