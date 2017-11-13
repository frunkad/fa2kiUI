$(document).ready(function(){


  var dUrl = 'http://192.168.0.104:8000/getitems';
  $.get({
    url : dUrl,
    type:'GET',
    dataType:'json',
    processData: false,
    contentType: 'application/json',
    complete: function(data){
      var d = JSON.stringify(data);
      var x = JSON.parse(d);
      var abc = x.responseJSON.data;
      var x = 0;
      $.each(abc,function(i,v){
        var abc1 = v.subItems;
        var gName = v.mainItemId;
        var tAppend = "<h2 class=header>"+gName+"</h2>"
        $('#list').append(tAppend);
        $.each(abc1,function(j,k){
          var iName = k.Name;
          var rate = k.rate;
          var l=i;
          var p=j;
          var subItemId = k.subItemId;
          var mainItemId = v.mainItemId;
          var myObj = {};
          myObj["mainItemId"] = mainItemId;
          myObj["subItemId"] = subItemId;
          myObj["name"] = iName;
          myObj["rate"] = rate;
          var json = JSON.stringify(myObj);
          if(window.sessionStorage){
            sessionStorage  .setItem(x,json);
            //Inserting the dynamic div for card views
            var qx = 'q'+x;
            var nx = 'n'+x;
            var print= "<div class=col s12 m7><div class=card horizontal><div class=card-image></div><div class=card-stacked><div class=card-content><span class=card-title activator grey-text text-darken-4 >"+iName+"</span><p>Rate:"+rate+"</p><div class=row><form class=col s12 id="+x+"><div class=row><div class=input-field col s6><input id="+qx+" type=text class=validate><label for=quantity>Quantity</label></div><div class=row><div class=input-field col s6><input id="+nx+" type=number class=validate><label for=nod>Number of days</label></div></div></form></div></div><div class=card-action><a href=javascript:addCart("+x+","+qx+","+nx+"); id="+x+">Add to cart</a></div></div></div></div>";
            $('#list').append(print);
            console.log(qx);
            x++;
          }
        })
      });
    },
    error: function(data) {
        console.log(data);
    }
  });
});
function addCart(x,qx,nx){
  console.log(x);
  var j = parseInt(x);
  var quantity = $(qx).val();
  var nod1 = parseInt($(nx).val());
  console.log(quantity+','+nod1);
  if(quantity&&nod1)
  {
      var val = new Date();
      var sdate= val.getFullYear()+"-"+(val.getMonth()+1)+"-"+val.getDate();
      var val1 = new Date();
      val1.setDate(val1.getDate() + (nod1-1));
      var edate = val1.getFullYear()+"-"+(val1.getMonth()+1)+"-"+val1.getDate();
      console.log(sdate+','+edate);
      if(window.sessionStorage){
        var data  = sessionStorage.getItem(x);
        var y = JSON.parse(data);
        var rate = parseInt(y.rate);
        var myObj = {};
        myObj["mItemId"]=y.mainItemId;
        myObj["subItemId"]=y.subItemId;
        myObj["sDate"]=sdate;
        myObj["eDate"]=edate;
        myObj["quantity"]=quantity;
        myObj["rate"]=rate;
        myObj["name"]=y.name;
        var json = JSON.stringify(myObj);
        var lJson =JSON.parse(json);
        console.log(json);
        if(window.localStorage){
          if(localStorage.getItem('Amount')){
            tAmount = rate*quantity;
            var Amount = parseInt(localStorage.getItem('Amount'));

            Amount = Amount + tAmount;
            localStorage.setItem("Amount",Amount);
          }else{
            tAmount = rate*quantity;
            var Amount = tAmount;
            localStorage.setItem("Amount",Amount);
          }
          if(localStorage.getItem('sDate')){
            var ssDate = localStorage.getItem('sDate');
            if(ssDate>sdate)
            {
              localStorage.setItem('sDate',sdate);
            }
          }else{
            localStorage.setItem('sDate',sdate);
          }
          if(localStorage.getItem('eDate')){
            var eeDate = localStorage.getItem('eDate');
            if(eeDate<edate)
            {
              localStorage.setItem('eDate',edate);
            }
          }else{
            localStorage.setItem('eDate',edate);
          }


          if(localStorage.getItem('list')){
            var items = localStorage.getItem('list');
            var xitems = JSON.parse(items);
            xitems['name'].push(lJson.name);
            var lxitems = JSON.stringify(xitems);
            console.log(lxitems);
            localStorage.setItem(lJson.name,json);
            localStorage.setItem('list',lxitems);
          }
          else{
            localStorage.setItem(lJson.name,json);
            var txt = {};
            txt['name']=[];
            txt['name']=[lJson.name];
            var l = JSON.stringify(txt);
            localStorage.setItem('list',l)
          }
        }
        Materialize.toast('Item added in cart', 4000);

      }

  }
  else{
    Materialize.toast('Some missing values', 4000);
  }
};


function addorder(){
  if(window.localStorage){
    if(localStorage.getItem('list')){
      window.location.replace("http://192.168.0.104/address.html");
    }
    else{
      Materialize.toast('Nothid added in cart yet', 4000);
    }
  }

};
