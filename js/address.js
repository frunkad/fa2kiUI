$(document).ready(function(){
  if(window.localStorage){
    if(localStorage.getItem('userInfo')){
      if((localStorage.getItem('list'))&&(localStorage.getItem('sDate'))&&(localStorage.getItem('eDate'))&&(localStorage.getItem('Amount'))){
        if((localStorage.getItem('address'))&&(localStorage.getItem('pocketId'))){
          var test = "<div class=row><div class=col s12 m6><div class=card blue-grey darken-1><div class=card-content white-text><span class=card-title>Order Summary</span><p>Amount "+localStorage.getItem('Amount')+"<br>Address "+localStorage.getItem('address')+"</p></div><div class=card-action><a href=javascript:createOrder()>Payment</a><a href=index.html>Go back</a></div></div></div>";
          $('#address').append(test);
        }
        else{
          Materialize.toast('Add address', 4000);
          window.location.replace("http://192.168.0.104/");
        }
      }
      else{
        Materialize.toast('Add items in your cart', 4000);
        var test = "<button class=btn waves-effect waves-light type=submit name=action id=listview>Add items<i class=material-icons right>send</i></button>";
        $('#address').append(test);
      }
    }else{
      console.log('HELLo');
      var test = "<form class=col s12 name=login><div class=input-field col s6 m6 l6 xl6><input id=userName type=text class=validate required><label for=userName>User Name</label></div><div class=row><div class=input-field col s6 m6 l6 xl6><input id=password type=password class=validate required><label for=password>Password</label></div></div><button class=btn waves-effect waves-light type=submit name=action id=login>Login</button><button class=btn waves-effect waves-light type=submit id=signUp>SignUp</button></form>";
      $('#address').append(test);
    }
  }
  $('#listview').click(function(){
    window.location.replace("http://192.168.0.104/listview.html");
  })

  $('#login').click(function(){
    event.preventDefault();
    var uname =document.login.userName.value;
    var pass = document.login.password.value;
    var formData = JSON.stringify({
      "uUserName":uname,
      "password":pass
    });
    if(uname&&pass){
      $.ajax({
        url : 'http://192.168.0.104:8000/login/',
        type:'POST',
        dataType:'json',
        processData: false,
        contentType: 'application/json',
        data: formData,
        success: function(data){
          var dummy = JSON.stringify(data);
          var jDummy = JSON.parse(dummy);
          if(window.localStorage){
            localStorage.setItem('userInfo',dummy);
            if(localStorage.getItem('userInfo'))
            {
              var add = localStorage.getItem('addValue');
              var jAdd = JSON.parse(add);
              var myObj ={};
              myObj['addressValue']=localStorage.getItem('address');
              myObj['pocketId']=localStorage.getItem('pocketId');
              myObj['uId'] = jDummy.uId;
              myObj['lattitude']=jAdd.lattitude;
              myObj['longitude']=jAdd.longitude;
              var xJson = JSON.stringify(myObj);
              var head = jDummy.basicAuthenticate;
              console.log(head);
              $.ajax({
                url : 'http://192.168.0.104:8000/add/address',
                type : 'POST',
                data : xJson,
                processData: false,
                contentType: 'application/json',
                headers : {"basicauthenticate":""+head},
                success: function(data){
                  var iTem = JSON.stringify(data)
                  var temp = JSON.parse(iTem);
                  localStorage.setItem('addressId',temp.addressId)
                  console.log(temp.addressId);
                  window.location.replace("http://192.168.0.104/address.html");
                },
                error: function(data) {
                    console.log(data);
                }
              })
            }
          };
          console.log(dummy);
        },
        error: function(data) {
            console.log(data);
        }
      })
    }
    else {
        Materialize.toast('Please pass username and password', 4000);
    }
  });
  $('#signUp').click(function(){
      window.location.replace("http://192.168.0.104/signup.html")
  });
});

function createOrder(){
  var myObj = {};
  if(window.localStorage){
    var session = localStorage.getItem('userInfo');
    var pSession = JSON.parse(session);
    var uId = pSession.uId;
    var head = pSession.basicAuthenticate;
    if(localStorage.getItem('list'));
    {
      var list1 = localStorage.getItem('list');
      var xList = JSON.parse(list1);
      myObj["items"]=[];
      $.each(xList.name, function(i,v){
        var test = localStorage.getItem(v);
        var ltest = JSON.parse(test);
        myObj["items"].push(ltest);
      })
    }
    console.log(myObj["items"]);
    myObj["uId"]=uId;
    myObj["amount"]=localStorage.getItem('Amount');
    myObj["isPaid"]=1;
    myObj["paymentReference"]="sdad1231";
    myObj["addressId"]=localStorage.getItem('addressId');
    myObj["startDate"]=localStorage.getItem('sDate');
    myObj["endDate"]=localStorage.getItem('eDate');
    var xJson = JSON.stringify(myObj);
    console.log(xJson);
    $.ajax({
      url:'http://192.168.0.104:8000/order/create',
      type : 'POST',
      data : xJson,
      processData: false,
      contentType: 'application/json',
      headers : {"basicauthenticate":""+head},
      success: function(data){
        Materialize.toast('Order created successfuly', 4000);
        var c=JSON.parse(localStorage.getItem('list'));
        $.each(c.name,function(i,v){
          localStorage.removeItem(v);
        })
        localStorage.removeItem('sDate');
        localStorage.removeItem('eDate');
        localStorage.removeItem('Amount');
        localStorage.removeItem('list');
        setTimeout(window.location.replace("http://192.168.0.104/listview.html"), 4000);
        console.log(data);
      },
      error: function(data) {
          console.log(data);
      }
    })
  }
  console.log(myObj);
};
