import{D as T,j as U,r,h as u}from"./index-DGkBJbzT.js";import{s as c}from"./sweetAlert-CCyWe-_C.js";var A={VITE_API_URL:"http://127.0.0.1:3000",BASE_URL:"/node-training-2024-front/",MODE:"production",DEV:!1,PROD:!0,SSR:!1};const{VITE_API_URL:p}=A,V=T("post",()=>{const l=U(),d=r({});function E(e){d.value={...e},l.push(`/post/edit/${e._id}`)}const m=r({}),i=r([]),f=r("desc"),g=r(""),h=r(""),v=r("");async function $(){var e,s,o,t;try{let a=`${p}/posts`;h.value==="user"&&(a+=`/user/${v.value}`),a+=`?sort=${f.value}&q=${g.value}`;const n=await u.get(a);i.value=n.data.posts,m.value=n.data.user}catch(a){((s=(e=a.response)==null?void 0:e.data)==null?void 0:s.message)==="找不到相關貼文"?i.value=[]:c({icon:"error",title:((t=(o=a.response)==null?void 0:o.data)==null?void 0:t.message)||a.message})}}async function D(e){var s,o;try{const t=await u.get(`${p}/post/${e}`);i.value=[t.data.post]}catch(t){c({icon:"error",title:((o=(s=t.response)==null?void 0:s.data)==null?void 0:o.message)||t.message}),l.push("/")}}async function S({form:e,postId:s,postData:o,isNewPost:t}){var P,w;let a="post",n=`${p}/post`,_="新增成功",y="/";t||(a="patch",n+=`/${s}`,_="編輯成功",y=`/post/${s}`);try{await u[a](n,o.value),e.value.resetForm(),c({icon:"success",title:_}),l.push(y)}catch(R){c({icon:"error",title:((w=(P=R.response)==null?void 0:P.data)==null?void 0:w.message)||R.message})}}async function I(e){var s,o;try{await u.delete(`${p}/post/${e}`),await $()}catch(t){c({icon:"error",title:((o=(s=t.response)==null?void 0:s.data)==null?void 0:o.message)||t.message})}}return{user:m,posts:i,sort:f,keyword:g,postsOption:h,postsUserId:v,getPosts:$,getPost:D,submitPost:S,deletePost:I,goToEditPost:E,editingPostData:d}});export{V as p};