var ji = new Image(); //内摇杆图片
var jo = new Image(); //外摇杆图片
var joystick = document.getElementById('joystick'); //画板
var josize = joystick.height; //外摇杆大小
var jisize = josize * 0.6; //内摇杆大小
var centerX = josize / 2; //摇杆中心x坐标
var centerY = josize / 2; //摇杆中心y坐标
window.addEventListener('load', load, false);
var jc = joystick.getContext('2d'); //画布
var jx = 0,
	jy = 0;
ji.onload = function() {
	jc.drawImage(ji, centerX - jisize / 2, centerY - jisize / 2, jisize, jisize); //首次绘制内摇杆
}
jo.onload = function() {
	jc.drawImage(jo, centerX - josize / 2, centerY - josize / 2, josize, josize);
}

function move() {
	jc.clearRect(centerX - josize / 2, centerY - josize / 2, josize, josize);
	jc.drawImage(jo, centerX - josize / 2, centerY - josize / 2, josize, josize);
	jc.drawImage(ji, centerX - jisize / 2 + jx, centerY - jisize / 2 + jy, jisize, jisize);

	requestAnimationFrame(move); //准备下一次绘图
}
ji.src = '../img/joystickin.png';
jo.src = '../img/joystickout.png';

function load() {
	document.addEventListener('touchstart', touch, false);
	document.addEventListener('touchmove', touch, false);
	document.addEventListener('touchend', touch, false);
	move();
	var effectiveFinger = 0; //当前有效手指

	function touch(event) {
		var event = event || window.event;
		var oInp = document.getElementById("inp");
		switch(event.type) {
			case "touchstart":
				//				//判断是否击中摇杆头
				//				if(Math.abs(event.touches[event.identifier].clientX - 100 - jx) <= 40 &&
				//					Math.abs(event.touches[event.identifier].clientY - 100 - jy) <= 40) {
				//					effectiveFinger = event.identifier; //若是,则将此手指设为有效手指
				//				}
				break;
			case "touchend":
					//若手指离开,那就把内摇杆放中间
					jx = 0;
					jy = 0;
				
				break;
			case "touchmove":
				//是否触摸点在摇杆上
				if(Math.sqrt(Math.pow(event.touches[effectiveFinger].clientX - centerX, 2) +
						Math.pow(event.touches[effectiveFinger].clientY - centerY, 2)) <=
					josize / 2 - jisize / 2) {
					jx = event.touches[effectiveFinger].clientX - centerX;
					jy = event.touches[effectiveFinger].clientY - centerY;
				} else
				//否则计算摇杆最接近的位置
				{
					var x = event.touches[effectiveFinger].clientX,
						y = event.touches[effectiveFinger].clientY,
						r = josize / 2-jisize/2;
					
					var ans=GetPoint(centerX,centerY,r,centerX,centerY,x,y);
					if(Math.sqrt((ans[0]-x)*(ans[0]-x)+(ans[1]-y)*(ans[1]-y))<Math.sqrt((ans[2]-x)*(ans[2]-x)+(ans[3]-y)*(ans[3]-y)))
					{
						jx=ans[0]-centerX;jy=ans[1]-centerY;
					}
					else
					{
						jx=ans[2]-centerX;jy=ans[3]-centerY;
					}
				}
				//move();
				event.preventDefault();
				break;
		}
	}
	requestAnimationFrame(move);
}

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
	return [x1,y1,x2,y2];
}