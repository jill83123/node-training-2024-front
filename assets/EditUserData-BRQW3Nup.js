import{r as i,z as S,o as I,a as v,b as g,c as N,d as l,e,n as w,F as $,m as L,k as B,g as O,w as D,h as f,f as m,t as j}from"./index-DGkBJbzT.js";import{u as A}from"./userStore-2c8d9DMH.js";import{_ as M}from"./PageTitle-Djt-DbFm.js";import{_ as R}from"./SpinnerComponent-Dyc9hwMW.js";import{s as _}from"./sweetAlert-CCyWe-_C.js";var T={VITE_API_URL:"http://127.0.0.1:3000",BASE_URL:"/node-training-2024-front/",MODE:"production",DEV:!1,PROD:!0,SSR:!1};const q={class:"mt-9"},z={class:"ml-4 flex items-center"},K=["disabled"],W=["disabled"],G={class:"rounded-lg border-2 border-primary bg-white p-8"},H={class:"mb-4"},J=["src"],Q={class:"mx-auto mb-4 max-w-80"},X=e("label",{for:"name",class:"mb-1 block"},[m(" 暱稱 "),e("span",{class:"text-danger"},"*")],-1),Y={class:"mx-auto mb-8 max-w-80"},Z=e("p",{class:"mb-1 mr-2"},[m(" 性別 "),e("span",{class:"text-danger"},"*")],-1),ee={class:"mb-[2px] flex items-center gap-6"},ae={for:"male",class:"flex items-center gap-1"},se={for:"female",class:"flex items-center gap-1"},oe={for:"intersex",class:"flex items-center gap-1"},le={class:"mb-4 text-center text-sm text-danger"},te=["disabled"],re={class:"mx-auto mb-4 max-w-80"},ne=e("label",{for:"oldPassword",class:"mb-1 block"},[m(" 目前的密碼 "),e("span",{class:"text-danger"},"*")],-1),de={class:"mx-auto mb-4 max-w-80"},ue=e("label",{for:"newPassword",class:"mb-1 block"},[m(" 輸入新密碼 "),e("span",{class:"text-danger"},"*")],-1),ie={class:"mx-auto mb-8 max-w-80"},me=e("label",{for:"confirmNewPassword",class:"mb-1 block"},[m(" 確認新密碼 "),e("span",{class:"text-danger"},"*")],-1),ce=["disabled"],fe={__name:"EditUserData",setup(pe){const y=A(),c=i("name"),s=i({}),d=i({}),{VITE_API_URL:h}=T,x=i(!1),P=i(null),V=i("");async function U(){var n,a;x.value=!0,V.value="";try{const o=P.value.files[0],t=new FormData;t.append("image",o);const u=await f.post(`${h}/upload/image?type=avatar`,t);s.value.photo=u.data.imageUrl}catch(o){V.value=((a=(n=o.response)==null?void 0:n.data)==null?void 0:a.message)||o.message}x.value=!1}const k=i(!1);S(()=>s.value,()=>{let n=0;const a=Object.keys(s.value).length;Object.keys(s.value).forEach(o=>{s.value[o]===y.user[o]&&(n+=1)}),k.value=n!==a},{deep:!0});const b=i(!1);async function F(){var n,a;b.value=!0;try{await f.patch(`${h}/user/profile`,s.value),y.getUserProfile(),k.value=!1,_({icon:"success",title:"更新成功"})}catch(o){_({icon:"error",title:((a=(n=o.response)==null?void 0:n.data)==null?void 0:a.message)||o.message})}b.value=!1}async function C(){var n,a;b.value=!0;try{const o=await f.post(`${h}/user/updatePassword`,d.value),{token:t,expires:u}=o.data;f.defaults.headers.common.authorization=`Bearer ${t}`,document.cookie=`MetaWallToken=${t}; expires=${new Date(u)}`,_({icon:"success",title:"重設成功"})}catch(o){_({icon:"error",title:((a=(n=o.response)==null?void 0:n.data)==null?void 0:a.message)||o.message})}b.value=!1}return I(async()=>{s.value={...y.user}}),(n,a)=>{const o=v("VueLoading"),t=v("VField"),u=v("ErrorMessage"),E=v("VForm");return g(),N($,null,[l(o,{active:b.value,"onUpdate:active":a[0]||(a[0]=p=>b.value=p)},null,8,["active"]),l(M,{title:"修改個人資料"}),e("div",q,[e("ul",z,[e("li",null,[e("button",{type:"button",onClick:a[1]||(a[1]=p=>c.value="name"),class:w(["rounded-tl-lg rounded-tr-lg border-2 border-b-0 border-primary px-6 py-2",c.value==="name"?"bg-primary text-white":"bg-white"]),disabled:c.value==="name"}," 暱稱修改 ",10,K)]),e("li",null,[e("button",{type:"button",onClick:a[2]||(a[2]=p=>c.value="password"),class:w(["rounded-tl-lg rounded-tr-lg border-2 border-b-0 border-primary px-6 py-2",c.value==="password"?"bg-primary text-white":"bg-white"]),disabled:c.value==="password"}," 重設密碼 ",10,W)])]),e("div",G,[c.value==="name"?(g(),N($,{key:0},[e("div",H,[e("img",{src:s.value.photo,alt:"大頭貼",class:"mx-auto mb-4 block h-[107px] w-[107px] rounded-full border-2 border-primary"},null,8,J),e("label",{onKeyup:L(U,["enter"]),tabindex:"0",class:w(["mx-auto flex w-full max-w-32 cursor-pointer items-center justify-center bg-primary py-1 text-center text-white hover:bg-goldenrod hover:text-primary",{"pointer-events-none bg-gray-500 hover:bg-auto":x.value}])},[x.value?(g(),B(R,{key:0,width:"16px",height:"16px",color:"white"})):O("",!0),e("span",{class:w({"ml-2":x.value})},"上傳大頭照",2),e("input",{type:"file",ref_key:"imageFileInput",ref:P,onChange:U,class:"hidden"},null,544)],34)]),l(E,{ref:"form",onSubmit:F},{default:D(p=>[e("div",Q,[X,l(t,{id:"name",name:"暱稱",placeholder:"輸入您的暱稱",class:"block w-full border-2 border-primary px-6 py-[14px]",modelValue:s.value.name,"onUpdate:modelValue":a[3]||(a[3]=r=>s.value.name=r),rules:"required|min:2"},null,8,["modelValue"]),l(u,{name:"暱稱",class:"block text-sm text-danger"})]),e("div",Y,[Z,e("div",ee,[e("label",ae,[l(t,{name:"性別",rules:"",id:"male",type:"radio",value:"male",modelValue:s.value.gender,"onUpdate:modelValue":a[4]||(a[4]=r=>s.value.gender=r)},null,8,["modelValue"]),m(" 男 ")]),e("label",se,[l(t,{name:"性別",rules:"",id:"female",type:"radio",value:"female",modelValue:s.value.gender,"onUpdate:modelValue":a[5]||(a[5]=r=>s.value.gender=r)},null,8,["modelValue"]),m(" 女 ")]),e("label",oe,[l(t,{name:"性別",rules:"",id:"intersex",type:"radio",value:"intersex",modelValue:s.value.gender,"onUpdate:modelValue":a[6]||(a[6]=r=>s.value.gender=r)},null,8,["modelValue"]),m(" 無性別 ")])]),l(u,{name:"性別",class:"block text-sm text-danger"})]),e("p",le,j(V.value),1),e("button",{type:"submit",class:"mx-auto block w-full rounded-lg border-2 border-primary bg-goldenrod py-4 disabled:bg-[#A8B0B9] disabled:text-primary sm:w-auto sm:px-[130px]",style:{"box-shadow":"-2px 2px 0px #000400"},disabled:Object.keys(p.errors).length!==0||s.value.name===""||!k.value}," 送出更新 ",8,te)]),_:1},512)],64)):(g(),B(E,{key:1,ref:"form",onSubmit:C},{default:D(p=>[e("div",re,[ne,l(t,{id:"oldPassword",name:"目前的密碼",type:"password",placeholder:"請輸入目前的密碼",class:"block w-full border-2 border-primary px-6 py-[14px]",modelValue:d.value.oldPassword,"onUpdate:modelValue":a[7]||(a[7]=r=>d.value.oldPassword=r),rules:"required"},null,8,["modelValue"]),l(u,{name:"目前的密碼",class:"block text-sm text-danger"})]),e("div",de,[ue,l(t,{id:"newPassword",name:"新密碼",type:"password",placeholder:"請輸入新密碼",class:"block w-full border-2 border-primary px-6 py-[14px]",modelValue:d.value.newPassword,"onUpdate:modelValue":a[8]||(a[8]=r=>d.value.newPassword=r),rules:"required|password"},null,8,["modelValue"]),l(u,{name:"新密碼",class:"block text-sm text-danger"})]),e("div",ie,[me,l(t,{id:"confirmNewPassword",name:"確認新密碼",type:"password",placeholder:"請輸入新密碼",class:"block w-full border-2 border-primary px-6 py-[14px]",modelValue:d.value.confirmNewPassword,"onUpdate:modelValue":a[9]||(a[9]=r=>d.value.confirmNewPassword=r),rules:{required:!0,same:["新密碼",d.value.newPassword]}},null,8,["modelValue","rules"]),l(u,{name:"確認新密碼",class:"block text-sm text-danger"})]),e("button",{type:"submit",class:"mx-auto block w-full rounded-lg border-2 border-primary bg-goldenrod py-4 disabled:bg-[#A8B0B9] disabled:text-primary sm:w-auto sm:px-[130px]",style:{"box-shadow":"-2px 2px 0px #000400"},disabled:Object.keys(p.errors).length!==0||!d.value.oldPassword||!d.value.newPassword||!d.value.confirmNewPassword}," 重設密碼 ",8,ce)]),_:1},512))])])],64)}}};export{fe as default};
