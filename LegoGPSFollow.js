
//Called when application is started.

var edt1;
var edt2;
var edt3;
var edt4;
var edt5;
var status1;

var cloudLoc={};

var id='0';
//var	dt = new Date();
//var	ds=dt.toString().substring(16,24);
var ds='GPS';

var VERSION='5.0';

/*
{"_id":"20:51:251",
"_rev":"1-c5d5a8afce820d9d4c339068f07964fb",
"latitude":"-23.634893",
"longitude":"-47.828976"}


*/
var rev='1-c5d5a8afce820d9d4c339068f07964fb';
var id1=ds+id;
var objRet={
 _id: id1,
 _rev:rev,
 latitude:0,
 longitude:0
 };
 


function OnStart()
{
	alert(VERSION+ds);
  Setup('f');
 }
 
 function OnConfig(m)
 {
 m=(app.GetOrientation()!='Portrait')?'m':'f';
// alert(m);
  Setup(m)
 }
 var lay={};
 
 function Setup(mode)
 {
 //smode=(mode== 2?'surf':'foto');
   app.RemoveLayout(lay );
  // alert('##'+mode);
	//Create a layout with objects vertically centered.
	var alig="";
  var alig="Top,FillXY" ;
	lay = app.CreateLayout( "linear", alig);	
	
	status1=app.CreateText( "Status:");//,0.6,0.05 );
	
	status1.SetText( status1.GetText()+(mode=='f'?'GPSclient[photoRobot]orig,dest,graus':'GPSserver[mover]dest' ));
	lay.AddChild( status1);
	    //salva cirloc na nuvem xxxx mover
	btn1 = app.CreateButton( "GetCurLocToEdt2UploadCloudDEST", 0.5, 0.05);
	btn1.SetOnTouch( GetCurLocToEdt2UploadCloud );
  if(mode=='m')	lay.AddChild( btn1 );
  //obtem posicao de filmagem xxxx photo
	btn1 = app.CreateButton( "GetCurLocToEdt1ORIG", 0.4, 0.05 );
	btn1.SetOnTouch( GetCurLocToEdt1 );
	 if(mode=='f')lay.AddChild( btn1 );

//obtem da nuvem xxxx foto
	btn2 = app.CreateButton( "DownFromCloudToEdt2DEST", 0.6, 0.05);
	btn2.SetOnTouch( DownFromCloudToEdt2 );
 if(mode=='f')	lay.AddChild( btn2 );
//mostra xxx foto
	btn3 = app.CreateButton( "ShowOnMap", 0.6, 0.02);
	btn3.SetOnTouch( btn_OnTouch3 )
 if(mode=='f')	lay.AddChild( btn3 );
// transmite para lego xxx foto
	btn4 = app.CreateButton( "LegoIRSendTurn", 0.4, 0.03 );
	btn4.SetOnTouch( btn_OnTouch4 );
  if(mode=='f')	lay.AddChild( btn4 );
	
	//btn5 = app.CreateButton( "inc", 0.4, 0.03 );
//	btn5.SetOnTouch( btn_OnTouch5 );
//	lay.AddChild( btn5 );

//	btn6 = app.CreateButton( "dec", 0.4, 0.03 );
//	btn6.SetOnTouch( btn_OnTouch6 );
//	lay.AddChild( btn6 );

//    -23.6351,-47.8293,
//    -23.6359,-47.8288
//  if(mode=='f')
    createSpin(lay);

	            //Create an text edit box.
    edt1 = app.CreateTextEdit( "-23.6351", 0.6, 0.06);
    edt1.SetMargins( 0, 0.01, 0, 0 );
    if(mode=='f')  lay.AddChild( edt1 );
 
    edt2 = app.CreateTextEdit( "-47.8293", 0.6, 0.06 );
    edt2.SetMargins( 0, 0.01, 0, 0 );
    if(mode=='f')  lay.AddChild( edt2 );
 
    edt3 = app.CreateTextEdit( "-23.6359", 0.6, 0.09 );
     edt3.SetBackColor( "#cc22cc" );
      edt3.SetMargins( 0, 0.02, 0, 0 );
    lay.AddChild( edt3  );

    edt4 = app.CreateTextEdit( "-47.8288", 0.6, 0.09 );
   edt4.SetBackColor( "#cc22cc" );
    edt4.SetMargins( 0, 0.02, 0, 0 );
    lay.AddChild( edt4  );
    
  edt5= app.CreateTextEdit( "90", 0.6, 0.09 );
   edt5.SetBackColor( "#0000ff" );
    edt5.SetMargins( 0, 0.02, 0, 0 );
  if(mode=='f')    lay.AddChild( edt5  );

	
	//Add layout to app.	
	app.AddLayout( lay );
	
	// timer = setInterval( DrawFrame, 1000/30 );

}

function createSpin(lay,mode)
{
  //lay = app.CreateLayout( "Linear", "VCenter,FillXY" );

  spin = app.CreateSpinner((mode!='f'? "turnGraus,zero,incDest,decDest,resetSpin":"getVersion,updateCloud,resetSpin"), 0.4 );
  spin.SetOnChange( handleSelection );
  //spin.SelectItem( "Frodo" );
  lay.AddChild( spin );

 // app.AddLayout( lay );
}

function handleSelection( item )
{
  app.ShowPopup( "Selected = " + item );
  if(item==("turn"))
  {
      //d = locDegress(lat1,lon1,lat2,lon2);
      d=edt5.GetText();
    p = degreeToIRPos(d);
	status1.SetText( 'Graus:'+	d+" Pos:"+p);
	TurnLegoDegrees(d);

  }
}


var currLocationData={};
var appLoc={};
//Called when user touches our button.
//Get curr location & put on cloud
function GetCurLocToEdt2UploadCloud()
{
	appLoc = app.CreateLocator( "GPS,Network" );
	
	appLoc.SetOnChange( loc_OnChange ); 
	appLoc.SetRate( 2); //5 seconds.
	appLoc.Start();
    
}
/*
Stop no locator
Obtem loc altual
Coloca nos edits
Salva na nuvem
*/
function loc_OnChange( data )
{
 appLoc.Stop();
 currLocationData=data;
 
 //alert(JSON.stringify(data));
 app.Alert( currLocationData.provider+": Lat "+currLocationData.latitude+", Lng "+data.longitude);
 edt3.SetText(currLocationData.latitude);
 edt4.SetText(currLocationData.longitude);

//id++;
//xxxxxxxxxxxxxxxxxxxxxx
  //Send request to remote server. 
  //var postCode = edt.GetText(); 
  var url="";
  var url = "http://192.169.169.38:8010/appgps/"
        +ds+ id;
        
   //obtempara ter a ultima revisao
 //  GetRequest(url,'GET',null);
         
        objRet.latiitude=currLocationData.latitude;
        objRet.longitude=currLocationData.longitude;
//  alert(url)
     // alert('Leu:'+JSON.stringify(objRet));
      //put: update !!!
  PutRequest( url,"PUT",objRet);


//xxxxxxxxxxxxxxxxxxxxxx
/*
PUT. To create new document you can either
 use a POST operation or a PUT operation. ...
  To update an existing document,  issue a PUT request.
   In this case, the JSON body must contain a _rev
    property, which lets CouchDB know
 which revision the edits are based on.
*/
}
function PutRequest( url,method,body )
{
app.Alert('update to:'+url);        
  
 
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange =
     function() { HandleReplyPut(httpRequest); };  
    httpRequest.open(method, url, true);
    httpRequest.send(body);
    
    app.ShowProgress( "Loading*Put..." );
   // app.Wait(5);
}
//Handle the server's reply (a json object).
function HandleReplyPut( httpRequest )
{
    if( httpRequest.readyState==4 )
    {
        //If we got a valid response.
        if( httpRequest.status==200 )
        {
            alert("Update OK");
            //edt3.SetText( "Response: " + httpRequest.status + httpRequest.responseText);
            //edt4.SetText( "Response: " + httpRequest.status + httpRequest.responseText);
        }
        //An error occurred
        else
            alert( "Errorput: " + httpRequest.status + httpRequest.responseText);
    }
  app.HideProgress();
}


//Called when user touches our button.
//Get curr location & put on cloud
function GetCurLocToEdt1()
{
	appLoc = app.CreateLocator( "GPS,Network" );
	
	appLoc.SetOnChange( loc_OnChange2 ); 
	appLoc.SetRate( 5); //5 seconds.
	appLoc.Start();
    
}
/*
Stop no locator
Obtem loc altual
Coloca nos edits
NAO salva na nuvem
*/
function loc_OnChange2( data )
{
 appLoc.Stop();
 currLocationData=data;
 
 //alert(JSON.stringify(data));
 app.Alert( currLocationData.provider+": Lat "+currLocationData.latitude+", Lng "+data.longitude);
 edt1.SetText(currLocationData.latitude);
 edt2.SetText(currLocationData.longitude);

}

//
//Handle button press.
//OBTEM DA NUVEM
//
function DownFromCloudToEdt2() 
{ 
   var url = "http://192.169.169.38:8010/appgps/"
        +ds+ id;
   GetRequest( url , false );
}
// todo terminar
function UpdateCloudFromEdt2() 
{ 
   var url = "http://192.169.169.38:8010/appgps/"
        +ds+ id;
   GetRequest( url, true  );
}
//todo teinat
//Send an http get request.
function GetRequest( url , isUpdate)
{
app.Alert('readin from:'+url);        
  
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange 
    = function() { HandleReply(httpRequest,isUpdate); };  
    httpRequest.open("GET", url, true);
    httpRequest.send(null);
    
    app.ShowProgress( "Loading..." );
}

//Handle the server's reply (a json object).
function HandleReply( httpRequest, isUpdate )
{
    if( httpRequest.readyState==4 )
    {
        //If we got a valid response.
        if( httpRequest.status==200 )
        {
         alert( "read ok ret:"+httpRequest.responseText);
         objRet=JSON.parse(httpRequest.responseText);
         if(isUpdate==false){
          var lat=  objRet.latitude;
           var lon=  objRet.longitude;
          edt1.SetText(objRet._rev);
          
          edt2.SetText(httpRequest.responseText);
            edt3.SetText(lat);
            edt4.SetText(lon);
            }
            else{
            
            }
        }
        //An error occurred
        else
            edt3.SetText( "ErrorVget: " + httpRequest.status + httpRequest.responseText);
    }
  app.HideProgress();
}

///
// MOSTRA NO MPAPA
//Called when user touches our button.
//
function btn_OnTouch3()
{
    simpleMap2(
        edt1.GetText(),
        edt2.GetText(),
        edt3.GetText(),
        edt4.GetText());
        
}

function simpleMap2(la1,lo1,la2,lo2)
{
    var packageName = "com.google.android.apps.maps";
    var className = null;
    var action = "android.intent.action.VIEW";
    //var uri =  "google.navigation:q="+latitude+","+longitude+"&mode=w";

    var uri =  "geo:"+
    la1+","+lo1+"(ORIG)"+
    "?q="+la2+","+lo2+"(DEST)";
    
    app.Alert(uri);
    
    if(app.IsAppInstalled( packageName ))
      app.SendIntent( packageName, className, action,null,uri );
    else
    {
    app.Alert("maps app not installed");
    app.OpenUrl("market://details?id="+packageName);
    }
}
//
//Manda IR para lego
//Called when user touches our button.
//
//

var tabGPS=[
[0,6.42,7],
[6.42,19.28,6],
[19.28,32.14,5],
[32.14,45,4],
[45,57.86,3],
[57.86,70.72,2],
[70.72,83.58,1],

[83.58,96.44,0],

[96.44,109.3,15],
[109.3,122.16,14],
[122.16,135.02,13],
[135.02,147.88,12],
[147.88,160.74,11],
[160.74,173.6,10],
[173.6,186.46,9],
];

function degreeToIRPos(degree) 
{
   for(var i=0;i<tabGPS.length;i++)
   {
       var ini=tabGPS[i][0];
       var end=tabGPS[i][1];
       var pos=tabGPS[i][2];
       if( (degree >=ini)&&(degree<end))
           return pos;
   }    
   return 0; 
}


function deg (angleRad) {
  return angleRad * (180 / Math.PI);
}
function rad(degrees) {
    return degrees * Math.PI / 180;
}


function locDegress(plat1,plon1,plat2,plon2)
{
    
    o = plat2 - plat1;
    a = plon2 - plon1;
    return deg(Math.atan2(o,a))
}

function btn_OnTouch4()
{

    lat1=    edt1.GetText();
    lon1=    edt2.GetText();
    lat2=   edt3.GetText();
    lon2=   edt4.GetText();
    d = locDegress(lat1,lon1,lat2,lon2);
    p = degreeToIRPos(d);
	status1.SetText( 'Graus:'+	d+" Pos:"+p);
	TurnLegoDegrees(d);
} 
function TurnLegoDegrees(d)
{
    p = degreeToIRPos(d);

    //endereço do driver - App "IntentToIRDriver"    
    var action = "com.andermusic.intenttoirdriver.notification";
    var category = null;
    var type = "message/rfc822";
    
    
    var extras={};
    
    //if(edt1.GetText()=='S')
        extras=servoAbsControl(0,p);
    //else 
    //    extras=motorControlAB(edt3.GetText(),edt2.GetText(),0);
    
    extras = JSON.stringify( extras );
     
    //tem que ser nulo o data type extras senao nao chama o Tasker"!!!
    app.BroadcastIntent( action,category,null,null,extras )

}

///
// inc
//Called when user touches our button.
//
function btn_OnTouch5()
{
    
      edt3.SetText(  Number.parseFloat(edt3.GetText())+0.0001);
      edt4.SetText(  Number.parseFloat( edt4.GetText())+0.0001);
      //  edt3.GetText(),
     //   edt4.GetText());
        btn_OnTouch4();
}
//
// inc
//Called when user touches our button.
//
function btn_OnTouch6()
{
    
      edt3.SetText(  Number.parseFloat(edt3.GetText())-0.0001);
      edt4.SetText(  Number.parseFloat( edt4.GetText())-0.0001);
      //  edt3.GetText(),
     //   edt4.GetText());
        btn_OnTouch4();
}
/*
cmd:
0 nada
1 forward
2 back
3 brake (stop)
*/
function motorControlAB(ch, cmdA, cmdB) 
{
  var fcmdA="00";
  var fcmdB="00";
  var fc="00"; //channel
  if(ch==0) fc="00";  
  if(ch==1) fc="01";  
  if(ch==2) fc="10";  
  if(ch==3) fc="11";  

  if(cmdA==0) fcmdA="00";  
  if(cmdA==1) fcmdA="01";  
  if(cmdA==2) fcmdA="10";  
  if(cmdA==3) fcmdA="11";  

  if(cmdB==0) fcmdB="00";  
  if(cmdB==1) fcmdB="01";  
  if(cmdB==2) fcmdB="10";  
  if(cmdB==3) fcmdB="11";
  
  var prefix="00"; //toggle:0+escape:0
  var mode="0001"; //combo direct: 2 comandos Azul e Vermelho ao mesmo tempo

  //return prefix+fc+mode+fcmdA+fcmdB;
    var extras = [ 
          {name:"p1", type:"string", value:prefix+fc},
          {name:"p2", type:"string", value:mode},
          {name:"p3", type:"string", value:fcmdA+fcmdB},

    ];
  return extras;
  
}  

/*
movimenta servo de modo absoluto
*/
function servoAbsControl(ch, cmdA) 
{
  var fcmdA="0000";
  var fcmdB="0000";
  var fc="00"; //channel
  if(ch==0) fc="00";  
  if(ch==1) fc="01";  
  if(ch==2) fc="10";  
  if(ch==3) fc="11";  

  if(cmdA==0) fcmdA="0000";  
  if(cmdA==1) fcmdA="0001";  
  if(cmdA==2) fcmdA="0010";  
  if(cmdA==3) fcmdA="0011";  

  if(cmdA==4) fcmdA="0100";  
  if(cmdA==5) fcmdA="0101";  
  if(cmdA==6) fcmdA="0110";  
  if(cmdA==7) fcmdA="0111";  

  if(cmdA==8) fcmdA="1000";  

  if(cmdA==9) fcmdA="1001";  
  if(cmdA==10) fcmdA="1010";  
  if(cmdA==11) fcmdA="1011";  

  if(cmdA==12) fcmdA="1100";  
  if(cmdA==13) fcmdA="1101";  
  if(cmdA==14) fcmdA="1110";  
  if(cmdA==15) fcmdA="1111";  

  
  var prefix="00"; //toggle:0+escape:0
  var mode="0100"; //single output mode PWM
 // return prefix+fc+mode+fcmdA;
    var extras = [ 
          {name:"p1", type:"string", value:prefix+fc},
          {name:"p2", type:"string", value:mode},
          {name:"p3", type:"string", value:fcmdA},

    ];
  return extras;
 
}  