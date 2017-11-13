$(document).ready(function(){
  $("#signup").click(function(){
    event.preventDefault();
    var uName = document.usingup.uName.value;
    var password = document.usingup.password.value;
    var name = document.usingup.name.value;
    var email = document.usingup.email.value;
    var phone = document.usingup.telephone.value;
    if(uName&&password&&name&&email&&phone){
      var formData = JSON.stringify({
        "uUserName":uName,
        "password":password,
        "uName":name,
        "phoneNumber":phone,
        "emailId":email,
        "userType":"cust"
      });
      console.log(formData);
      $.ajax({
          url : 'http://192.168.0.104:8000/signup/',
          type: 'POST',
          data: formData,
          dataType:'json',
          processData: false,
          contentType: 'application/json',
          success: function(data){
            var dummy = JSON.stringify(data);
            var jDummy = JSON.parse(dummy);
            if(window.localStorage){
              localStorage.setItem('userInfo',dummy);

              if(localStorage.getItem('userInfo')){
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
      });
      Materialize.toast('Please pass username and password', 4000);
    }
    Materialize.toast('Please pass all the fields', 4000);
  });
});
