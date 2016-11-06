var ji = new Image(); //内摇杆图片
var jo = new Image(); //外摇杆图片
var joystick = document.getElementById('joystick'); //画板
var josize = joystick.height; //外摇杆大小
var jisize = josize * 0.6; //内摇杆大小
var centerX = josize / 2; //摇杆中心x坐标
var centerY = josize / 2; //摇杆中心y坐标
var touchX = joystick.offsetLeft,
	touchY = joystick.offsetTop;
window.addEventListener('load', load, false);
var jc = joystick.getContext('2d'); //画布

//摇杆头应当移动到的位置
var jx = 0,
	jy = 0;

//图片加载完成时执行这俩函数
ji.onload = function() {
	jc.drawImage(ji, centerX - jisize / 2, centerY - jisize / 2, jisize, jisize); //首次绘制内摇杆
}
jo.onload = function() {
	jc.drawImage(jo, centerX - josize / 2, centerY - josize / 2, josize, josize);
}

//绘图函数（绘制图形的时候就是用户观察到摇杆动了，所以取名是move）
function move() {
	jc.clearRect(centerX - josize / 2, centerY - josize / 2, josize, josize); //清空画板
	jc.drawImage(jo, centerX - josize / 2, centerY - josize / 2, josize, josize); //画底座
	jc.drawImage(ji, centerX - jisize / 2 + jx, centerY - jisize / 2 + jy, jisize, jisize); //画摇杆头
	requestAnimationFrame(move); //下一次绘图
}
ji.src = '../img/joystickin.png'; //加载图片
jo.src = '../img/joystickout.png'; //加载图片

//页面加载时执行该函数
function load() {
	document.addEventListener('touchstart', touch, false);
	document.addEventListener('touchmove', touch, false);
	document.addEventListener('touchend', touch, false);

	//加载的时候先把摇杆绘制出来再说
	move();
	var effectiveFinger = -1; //当前有效手指

	//触摸事件触发函数
	function touch(event) {
		var event = event || window.event;
		var oInp = document.getElementById("inp");
		switch(event.type) {
			case "touchstart":
				//判断是否击中摇杆头
				for(var i = 0; i < event.touches.length; i = i + 1) {
					if(Math.sqrt(Math.pow(event.touches[i].clientX - centerX - touchX, 2) +
							Math.pow(event.touches[i].clientY - centerY - touchY, 2)) <=
						josize / 2 - jisize / 2) {
						effectiveFinger = i;
						console.log("finger No." + i + " is effectiveFinger now.");
					}
				}
				break;
			case "touchend": //手指离开的时候
				//若有效手指离开,那就把内摇杆放中间
				if(event.touches[effectiveFinger] == null) {
					if(event.touches[0] == null) {
						jx = 0;
						jy = 0;
					}
					effectiveFinger -= 1;
				}
				break;
			case "touchmove": //手指移动的时候：
				//是否触摸点在摇杆上
				if(effectiveFinger != -1)
					if(Math.sqrt(Math.pow(event.touches[effectiveFinger].clientX - centerX - touchX, 2) +
							Math.pow(event.touches[effectiveFinger].clientY - centerY - touchY, 2)) <=
						josize / 2 - jisize / 2) {
						jx = event.touches[effectiveFinger].clientX - centerX - touchX;
						jy = event.touches[effectiveFinger].clientY - centerY - touchY;
					} else
					//否则计算摇杆最接近的位置
					{
						var x = event.touches[effectiveFinger].clientX - touchX,
							y = event.touches[effectiveFinger].clientY - touchY,
							r = josize / 2 - jisize / 2;

						var ans = GetPoint(centerX, centerY, r, centerX, centerY, x, y);
						//圆与直线有两个交点，计算出离手指最近的交点
						if(Math.sqrt((ans[0] - x) * (ans[0] - x) + (ans[1] - y) * (ans[1] - y)) < Math.sqrt((ans[2] - x) * (ans[2] - x) + (ans[3] - y) * (ans[3] - y))) {
							jx = ans[0] - centerX;
							jy = ans[1] - centerY;
						} else {
							jx = ans[2] - centerX;
							jy = ans[3] - centerY;
						}
					}
					//move();
				event.preventDefault(); //防止页面滑动，取消掉默认的事件
				break;
		}
	}
	requestAnimationFrame(move); //开始绘图
}

//计算圆于直线的交点（这一块好难啊）
//圆的坐标为cx，cy 半径为r
//直线上两点的坐标分别为(stx,sty)、(edx,edy)
function GetPoint(cx, cy, r, stx, sty, edx, edy) {
	//(x-cx)^2+(y-cy)^2=r^2
	//y=k*x+b
	var k = (edy - sty) / (edx - stx);
	var b = edy - k * edx;
	//(1 + k^2)*x^2 - x*(2*cx -2*k*(b -cy) ) + cx*cx + ( b - cy)*(b - cy) - r*r = 0
	var x1, y1, x2, y2;
	var c = cx * cx + (b - cy) * (b - cy) - r * r;
	var a = (1 + k * k);
	var b1 = (2 * cx - 2 * k * (b - cy));

	var tmp = Math.sqrt(b1 * b1 - 4 * a * c);

	x1 = (b1 + tmp) / (2 * a);
	y1 = k * x1 + b;

	x2 = (b1 - tmp) / (2 * a);
	y2 = k * x2 + b;
	return [x1, y1, x2, y2];
}