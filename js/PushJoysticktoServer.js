var server;
WSInitialization("ws://192.168.31.20:30236");//初始化
var WebSocketSender=window.setInterval("Send()",100);
WebSocketSender
//websocket初始化函数
function WSInitialization(hostname)
{
	server=new WebSocket(hostname);
	server.onclose=reconnect();//断开重连
	server.onmessage=function(evt){//服务端发来消息
		console.log(evt.data);
	}
	function reconnect()
	{
		server=new WebSocket(hostname);
	}
}

function Send()
{
	var a=GetDATA();
	server.send(a[0]+";"+a[1]);
	function GetDATA()
	{
		return [jx/(josize/2-jisize/2),jy/(josize/2-jisize/2)]
	}
}
