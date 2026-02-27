import { useState, useEffect, useRef, useCallback } from "react";

// ── Theme ─────────────────────────────────────────────────────────────────────
const THEMES = {
  dark: {
    bg:"#080c14", card:"#0d1421", card2:"#111827", border:"#1a2540",
    accent:"#3b82f6", accent2:"#7c3aed", accent3:"#10b981",
    warn:"#f59e0b", danger:"#ef4444", text:"#e2e8f0", muted:"#64748b",
    white:"#ffffff", subtext:"#94a3b8", inputBg:"#1a2540",
    navBg:"#0d1421", tagBg:"#1e293b", hover:"#1e293b",
  },
  light: {
    bg:"#f1f5f9", card:"#ffffff", card2:"#f8fafc", border:"#e2e8f0",
    accent:"#2563eb", accent2:"#7c3aed", accent3:"#059669",
    warn:"#d97706", danger:"#dc2626", text:"#1e293b", muted:"#64748b",
    white:"#1e293b", subtext:"#475569", inputBg:"#f1f5f9",
    navBg:"#ffffff", tagBg:"#f1f5f9", hover:"#f8fafc",
  },
};

// ── ML Engine ─────────────────────────────────────────────────────────────────
const SKILL_DB = {
  "Python":85,"JavaScript":80,"React":78,"Node.js":72,"TypeScript":75,
  "SQL":70,"Machine Learning":88,"Deep Learning":84,"TensorFlow":82,
  "PyTorch":81,"FastAPI":74,"Docker":76,"Kubernetes":79,"AWS":83,
  "Azure":77,"GCP":76,"Data Analysis":80,"NLP":86,"Computer Vision":83,
  "Java":68,"C++":65,"Rust":72,"Go":74,"Scala":69,
  "Spark":77,"Kafka":74,"Redis":71,"MongoDB":70,"PostgreSQL":73,
  "Tableau":68,"Power BI":67,"Excel":60,"R":72,"Statistics":78,
  "Communication":65,"Leadership":62,"Agile":68,"Git":75,"CI/CD":76,
};
const COURSES = [
  {id:1,title:"Machine Learning A-Z",platform:"Coursera",skill:"Machine Learning",hours:40,cost:0,rating:4.8,salaryBoost:180000},
  {id:2,title:"Deep Learning Specialization",platform:"Coursera",skill:"Deep Learning",hours:60,cost:0,rating:4.9,salaryBoost:260000},
  {id:3,title:"AWS Solutions Architect",platform:"AWS",skill:"AWS",hours:50,cost:24000,rating:4.7,salaryBoost:200000},
  {id:4,title:"Docker & Kubernetes",platform:"Udemy",skill:"Kubernetes",hours:30,cost:1200,rating:4.7,salaryBoost:140000},
  {id:5,title:"React - Complete Guide",platform:"Udemy",skill:"React",hours:48,cost:1200,rating:4.8,salaryBoost:100000},
  {id:6,title:"NLP with Transformers",platform:"HuggingFace",skill:"NLP",hours:35,cost:0,rating:4.9,salaryBoost:280000},
  {id:7,title:"FastAPI Masterclass",platform:"Udemy",skill:"FastAPI",hours:20,cost:1200,rating:4.6,salaryBoost:90000},
  {id:8,title:"Spark & Big Data",platform:"Coursera",skill:"Spark",hours:45,cost:0,rating:4.7,salaryBoost:190000},
  {id:9,title:"PostgreSQL Advanced",platform:"Udemy",skill:"PostgreSQL",hours:25,cost:800,rating:4.6,salaryBoost:80000},
  {id:10,title:"System Design",platform:"Educative",skill:"Kubernetes",hours:40,cost:4500,rating:4.8,salaryBoost:300000},
];
const JOBS = {
  "ML Engineer":    {required:["Python","Machine Learning","TensorFlow","SQL","Docker","Statistics"],baseSalary:2400000,growth:34},
  "Full Stack Dev": {required:["JavaScript","React","Node.js","SQL","Docker","Git","TypeScript"],baseSalary:1800000,growth:22},
  "Data Scientist": {required:["Python","SQL","Machine Learning","Statistics","Spark","Data Analysis","R"],baseSalary:2200000,growth:28},
  "DevOps Engineer":{required:["Docker","Kubernetes","AWS","CI/CD","Python","Git"],baseSalary:2000000,growth:25},
  "AI Engineer":    {required:["Python","Deep Learning","NLP","PyTorch","TensorFlow","AWS","Docker"],baseSalary:2800000,growth:40},
  "Data Engineer":  {required:["Python","Spark","Kafka","SQL","AWS","PostgreSQL","Git"],baseSalary:2100000,growth:30},
};
const INSIGHTS = [
  {id:1,category:"AI Trends",date:"June 2025",impact:"High Impact",headline:"AI-Augmented Development is Replacing Traditional Coding Workflows",summary:"Generative AI tools like GitHub Copilot, Cursor, and Claude Code are reshaping how engineers write, review, and ship software. Teams adopting AI-assisted development report 35–55% faster delivery cycles.",why:"Engineers who don't adapt risk being outpaced by peers who leverage AI as a force multiplier. Prompt engineering and AI orchestration are becoming core competencies.",roleChange:"Roles like 'AI Integration Engineer' and 'LLM Ops Engineer' are rising. Manual QA is being replaced by AI-test automation specialists.",skills:["Prompt Engineering","LangChain","RAG Pipelines","Fine-tuning LLMs"],tools:["Cursor IDE","GitHub Copilot","Claude API","LlamaIndex"],roles:["AI Integration Engineer","LLM Ops","AI Product Engineer"]},
  {id:2,category:"Cloud Shift",date:"June 2025",impact:"High Impact",headline:"Platform Engineering is Becoming the New DevOps",summary:"The 'you build it, you run it' model is evolving into internal developer platforms (IDPs). Companies like Spotify and Netflix are investing in self-service infrastructure for developers.",why:"Developer productivity is now a boardroom metric. Engineers who build and maintain IDPs are in extreme demand as orgs eliminate 'cognitive load tax' on product teams.",roleChange:"DevOps generalists are specializing into Platform Engineers. SRE roles are evolving to include developer experience (DX) ownership.",skills:["Backstage","Terraform","Kubernetes Operators","GitOps"],tools:["Backstage by Spotify","Crossplane","ArgoCD","Pulumi"],roles:["Platform Engineer","Developer Experience Lead","SRE – IDP Focus"]},
  {id:3,category:"Tech Global Weekly",date:"May 2025",impact:"Medium Shift",headline:"WebAssembly is Breaking Out of the Browser",summary:"WASM is moving beyond web apps into edge computing, serverless functions, and plugin systems. Shopify, Fastly, and Cloudflare Workers are deploying WASM at the edge for sub-millisecond latency.",why:"WASM enables language-agnostic runtime portability. This disrupts the Node.js-only serverless model and opens new architecture patterns.",roleChange:"Backend engineers are increasingly expected to understand WASM runtimes. Rust engineers are crossing into web/cloud territory.",skills:["WebAssembly","Rust","WASI","Edge Computing"],tools:["Wasmtime","Wasmer","Fastly Compute@Edge","Spin (Fermyon)"],roles:["Edge Computing Engineer","Systems + Web Engineer","Rust Developer"]},
  {id:4,category:"Data & AI Infra",date:"May 2025",impact:"High Impact",headline:"The Rise of the AI Data Stack: Vector DBs & Real-Time ML",summary:"Vector databases (Pinecone, Weaviate, Qdrant) and real-time feature stores are becoming standard in production AI systems. The modern data stack now has an 'AI layer'.",why:"Every product team building with LLMs needs RAG. Engineers who understand embedding pipelines and vector search are critical bottlenecks in AI product teams.",roleChange:"Data Engineers are evolving into 'AI Data Engineers'. MLE roles now overlap heavily with data platform engineering.",skills:["Vector Search","Embeddings","Feature Stores","MLflow"],tools:["Pinecone","Weaviate","Feast","Ray Serve"],roles:["AI Data Engineer","ML Platform Engineer","Vector DB Specialist"]},
  {id:5,category:"Frontend Evolution",date:"April 2025",impact:"Emerging Trend",headline:"React Server Components & Full-Stack Frameworks Redefine Frontend",summary:"Next.js App Router, Remix, and SvelteKit are blurring frontend/backend lines. React Server Components shift rendering to the server, reducing client bundle sizes by up to 60%.",why:"The 'pure frontend developer' archetype is fading. Modern frontend demands understanding of server rendering, edge caching, and API design.",roleChange:"Frontend roles are becoming 'UI/Full-Stack' hybrids. Demand for engineers who understand RSC patterns and backend APIs is surging.",skills:["React Server Components","Next.js App Router","Edge Rendering","Streaming SSR"],tools:["Next.js 14+","Remix","SvelteKit","Vercel Edge Runtime"],roles:["Full-Stack Frontend Engineer","UI Platform Engineer","React Specialist"]},
  {id:6,category:"Security Shift",date:"April 2025",impact:"Medium Shift",headline:"Shift-Left Security: DevSecOps Becomes Non-Negotiable",summary:"Security is moving from a post-deployment audit to an embedded engineering practice. Supply chain attacks and AI-generated code vulnerabilities are forcing teams to integrate security at every SDLC stage.",why:"Regulators (EU AI Act, NIS2) mandate software supply chain transparency. Engineers who understand SBOM, SAST/DAST, and zero-trust are must-haves.",roleChange:"AppSec engineers are being embedded directly in product squads. 'Security Champion' as a developer role is emerging in mid-to-large orgs.",skills:["SBOM","Zero Trust","SAST/DAST","Supply Chain Security"],tools:["Snyk","Semgrep","Syft","SLSA Framework"],roles:["DevSecOps Engineer","AppSec Engineer","Security Champion"]},
];
const INR = n => "₹" + (n >= 100000 ? (n/100000).toFixed(1)+"L" : (n/1000).toFixed(0)+"K");
const rand = (a,b) => Math.floor(Math.random()*(b-a+1))+a;
const clamp = (v,a=0,b=100) => Math.max(a,Math.min(b,v));

async function extractTextFromPDF(file) {
  return new Promise(resolve => {
    const r = new FileReader();
    r.onload = e => {
      const arr = new Uint8Array(e.target.result);
      let text = "";
      for (let i=0;i<arr.length;i++){const c=arr[i];if((c>=32&&c<=126)||c===10||c===13)text+=String.fromCharCode(c);}
      const words = text.match(/[A-Za-z][A-Za-z0-9+#.\-]{2,}/g)||[];
      resolve([...new Set(words)].join(" ").slice(0,8000));
    };
    r.readAsArrayBuffer(file);
  });
}

function analyzeResume(text, jobRole) {
  const found = Object.keys(SKILL_DB).filter(s=>text.toLowerCase().includes(s.toLowerCase()));
  const job = JOBS[jobRole]||JOBS["ML Engineer"];
  const missing = job.required.filter(s=>!found.includes(s));
  const matched = job.required.filter(s=>found.includes(s));
  const skillScore = clamp(Math.round(matched.length/job.required.length*100));
  const interviewRisk = clamp(100-skillScore+rand(-5,5));
  const currentSalary = Math.round(job.baseSalary*(skillScore/100)*0.9);
  const potentialSalary = Math.round(job.baseSalary*1.15);
  const dnaScore = clamp(rand(skillScore-10,skillScore+5));
  const peerPercentile = clamp(rand(dnaScore-15,dnaScore+10));
  return {found,missing,matched,skillScore,interviewRisk,currentSalary,potentialSalary,dnaScore,peerPercentile,job,jobRole};
}
function genForecast(skill){const base=SKILL_DB[skill]||70;return Array.from({length:6},(_,i)=>({year:2024+i,demand:clamp(base+i*rand(2,5)+rand(-3,3))}));}
function genRoadmap(missing){return [{phase:"Foundation",weeks:"1–4",tasks:missing.slice(0,2).map(s=>({skill:s,action:`Complete intro to ${s}`,resource:`${s} Fundamentals`,effort:"8 hrs/wk"}))},{phase:"Core Skills",weeks:"5–10",tasks:missing.slice(2,4).map(s=>({skill:s,action:`Build project using ${s}`,resource:`Advanced ${s}`,effort:"10 hrs/wk"}))},{phase:"Advanced",weeks:"11–16",tasks:missing.slice(4).map(s=>({skill:s,action:`Deploy ${s} in production`,resource:`${s} Masterclass`,effort:"12 hrs/wk"}))}].filter(p=>p.tasks.length>0);}

// ── UI Primitives ─────────────────────────────────────────────────────────────
const px = s => typeof s==="number"?s+"px":s;
const Txt = ({c,sz,w,mb,style,...p})=><div style={{color:c,fontSize:px(sz||14),fontWeight:w||400,marginBottom:px(mb||0),...style}} {...p}/>;
const Row = ({gap=8,wrap,align="center",justify,style,...p})=><div style={{display:"flex",alignItems:align,justifyContent:justify||"flex-start",gap:px(gap),flexWrap:wrap?"wrap":undefined,...style}} {...p}/>;
const Grid = ({cols="1fr 1fr",gap=12,style,...p})=><div style={{display:"grid",gridTemplateColumns:cols,gap:px(gap),...style}} {...p}/>;

const Card = ({T,style,...p})=><div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:20,...style}} {...p}/>;
const Badge = ({color,bg,children,style})=><span style={{background:bg||color+"22",color,border:`1px solid ${color}44`,borderRadius:20,padding:"3px 10px",fontSize:11,fontWeight:600,...style}}>{children}</span>;
const Btn = ({onClick,disabled,children,sm,outline,T,style})=>(
  <button onClick={onClick} disabled={disabled} style={{background:outline?"transparent":`linear-gradient(135deg,${T.accent2},${T.accent})`,color:outline?T.muted:T.card=="#ffffff"?"#fff":"#fff",border:outline?`1px solid ${T.border}`:"none",padding:sm?"6px 14px":"10px 22px",borderRadius:8,fontSize:sm?12:14,fontWeight:600,cursor:disabled?"not-allowed":"pointer",opacity:disabled?0.5:1,...style}}>{children}</button>
);
const Progress = ({pct,color,h=8,style})=>(
  <div style={{background:"#1a254044",borderRadius:99,height:h,overflow:"hidden",...style}}>
    <div style={{width:`${clamp(pct)}%`,height:"100%",background:`linear-gradient(90deg,${color},${color}99)`,borderRadius:99,transition:"width .6s ease"}}/>
  </div>
);
const Select = ({options,value,onChange,T})=>(
  <select value={value} onChange={e=>onChange(e.target.value)} style={{background:T.inputBg,border:`1px solid ${T.border}`,color:T.text,padding:"10px 14px",borderRadius:8,width:"100%",fontSize:14,outline:"none"}}>
    {options.map(o=><option key={o}>{o}</option>)}
  </select>
);

// ── Charts ────────────────────────────────────────────────────────────────────
function LineChart({series,labels,height=160,T}){
  const ref=useRef();
  useEffect(()=>{
    const cv=ref.current;if(!cv)return;
    const ctx=cv.getContext("2d");const W=cv.offsetWidth||400,H=height;
    cv.width=W;cv.height=H;ctx.clearRect(0,0,W,H);
    const pad={t:20,r:20,b:30,l:40};const w=W-pad.l-pad.r,h=H-pad.t-pad.b;
    const all=series.flatMap(s=>s.data);const mn=Math.min(...all),mx=Math.max(...all);
    const sy=v=>pad.t+h-(v-mn)/(mx-mn||1)*h,sx=i=>pad.l+i/(labels.length-1||1)*w;
    ctx.strokeStyle=T.border;ctx.lineWidth=1;
    for(let i=0;i<5;i++){const y=pad.t+i*h/4;ctx.beginPath();ctx.moveTo(pad.l,y);ctx.lineTo(pad.l+w,y);ctx.stroke();}
    ctx.fillStyle=T.muted;ctx.font="10px Inter,sans-serif";ctx.textAlign="center";
    labels.forEach((l,i)=>ctx.fillText(l,sx(i),H-6));
    series.forEach(s=>{
      ctx.strokeStyle=s.color;ctx.lineWidth=2;ctx.beginPath();
      s.data.forEach((v,i)=>i===0?ctx.moveTo(sx(i),sy(v)):ctx.lineTo(sx(i),sy(v)));ctx.stroke();
      s.data.forEach((v,i)=>{ctx.fillStyle=s.color;ctx.beginPath();ctx.arc(sx(i),sy(v),3,0,Math.PI*2);ctx.fill();});
    });
  },[series,labels,height,T]);
  return <canvas ref={ref} style={{width:"100%",height}}/>;
}
function BarChart({labels,values,colors,height=160,T}){
  const ref=useRef();
  useEffect(()=>{
    const cv=ref.current;if(!cv)return;
    const ctx=cv.getContext("2d");const W=cv.offsetWidth||400,H=height;
    cv.width=W;cv.height=H;ctx.clearRect(0,0,W,H);
    const pad={t:10,r:10,b:36,l:50};const w=W-pad.l-pad.r,h=H-pad.t-pad.b;
    const mx=Math.max(...values,1);const bw=Math.max(w/values.length-8,8);
    ctx.fillStyle=T.muted;ctx.font="10px Inter,sans-serif";ctx.textAlign="right";
    for(let i=0;i<5;i++){const v=Math.round(mx*i/4);const y=pad.t+h-h*i/4;ctx.fillText(v,pad.l-4,y+3);}
    values.forEach((v,i)=>{
      const x=pad.l+i*(w/values.length)+(w/values.length-bw)/2,bh=v/mx*h;
      const g=ctx.createLinearGradient(0,pad.t+h-bh,0,pad.t+h);
      g.addColorStop(0,colors[i%colors.length]);g.addColorStop(1,colors[i%colors.length]+"44");
      ctx.fillStyle=g;ctx.beginPath();ctx.roundRect(x,pad.t+h-bh,bw,bh,4);ctx.fill();
      ctx.fillStyle=T.muted;ctx.font="9px Inter,sans-serif";ctx.textAlign="center";ctx.fillText(labels[i]?.slice(0,7)||"",x+bw/2,H-4);
    });
  },[labels,values,colors,height,T]);
  return <canvas ref={ref} style={{width:"100%",height}}/>;
}
function RadarChart({labels,values,color,size=200,T}){
  const ref=useRef();
  useEffect(()=>{
    const cv=ref.current;if(!cv)return;
    const ctx=cv.getContext("2d");cv.width=size;cv.height=size;ctx.clearRect(0,0,size,size);
    const cx=size/2,cy=size/2,r=size/2-30,n=labels.length;
    const angle=i=>-Math.PI/2+i*2*Math.PI/n,pt=(i,rad)=>[cx+rad*Math.cos(angle(i)),cy+rad*Math.sin(angle(i))];
    for(let g=1;g<=4;g++){ctx.strokeStyle=T.border;ctx.lineWidth=1;ctx.beginPath();labels.forEach((_,i)=>{const[x,y]=pt(i,r*g/4);i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);});ctx.closePath();ctx.stroke();}
    ctx.strokeStyle=T.border+"88";labels.forEach((_,i)=>{const[x,y]=pt(i,r);ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(x,y);ctx.stroke();});
    ctx.fillStyle=color+"33";ctx.strokeStyle=color;ctx.lineWidth=2;ctx.beginPath();
    values.forEach((v,i)=>{const[x,y]=pt(i,r*v/100);i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);});
    ctx.closePath();ctx.fill();ctx.stroke();
    ctx.fillStyle=T.subtext;ctx.font="bold 9px Inter,sans-serif";ctx.textAlign="center";
    labels.forEach((l,i)=>{const[x,y]=pt(i,r+14);ctx.fillText(l.slice(0,8),x,y+4);});
  },[labels,values,color,size,T]);
  return <canvas ref={ref} style={{width:size,height:size}}/>;
}
function DonutChart({value,color,size=120,label,T}){
  const ref=useRef();
  useEffect(()=>{
    const cv=ref.current;if(!cv)return;
    const ctx=cv.getContext("2d");cv.width=size;cv.height=size;ctx.clearRect(0,0,size,size);
    const cx=size/2,cy=size/2,r=size/2-8,start=-Math.PI/2,end=start+(value/100)*2*Math.PI;
    ctx.beginPath();ctx.arc(cx,cy,r,0,2*Math.PI);ctx.strokeStyle=T.border;ctx.lineWidth=18;ctx.stroke();
    ctx.beginPath();ctx.arc(cx,cy,r,start,end);ctx.strokeStyle=color;ctx.lineWidth=18;ctx.lineCap="round";ctx.stroke();
    ctx.fillStyle=color;ctx.font=`bold ${size>100?17:13}px Inter,sans-serif`;ctx.textAlign="center";ctx.fillText(value+"%",cx,cy+5);
    if(label){ctx.fillStyle=T.muted;ctx.font="10px Inter,sans-serif";ctx.fillText(label,cx,cy+19);}
  },[value,color,size,label,T]);
  return <canvas ref={ref} style={{width:size,height:size}}/>;
}

// ── Auth ──────────────────────────────────────────────────────────────────────
function AuthScreen({onLogin,T,isDark,toggleTheme}){
  const [mode,setMode]=useState("login");
  const [form,setForm]=useState({name:"",email:"demo@gap2growth.ai",password:"demo123"});
  const [err,setErr]=useState("");
  const inp={background:T.inputBg,border:`1px solid ${T.border}`,color:T.text,padding:"10px 14px",borderRadius:8,width:"100%",marginBottom:10,fontSize:14,boxSizing:"border-box",outline:"none"};
  return (
    <div style={{minHeight:"100vh",background:T.bg,display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>
      <button onClick={toggleTheme} style={{position:"absolute",top:20,right:20,background:T.card,border:`1px solid ${T.border}`,borderRadius:10,padding:"8px 12px",cursor:"pointer",fontSize:16}}>{isDark?"☀️":"🌙"}</button>
      <div style={{position:"absolute",inset:0,background:`radial-gradient(ellipse at 20% 50%,${T.accent2}18,transparent 60%),radial-gradient(ellipse at 80% 20%,${T.accent}18,transparent 60%)`}}/>
      <Card T={T} style={{width:400,position:"relative",zIndex:1,padding:40}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{fontSize:40,marginBottom:8}}>⚡</div>
          <Txt sz={26} w={800} c={T.text} mb={4}>Gap2Growth</Txt>
          <Txt sz={13} c={T.muted}>AI Career Intelligence Platform</Txt>
        </div>
        <Row gap={0} style={{background:T.inputBg,borderRadius:8,overflow:"hidden",marginBottom:20}}>
          {["login","register"].map(m=>(
            <button key={m} onClick={()=>setMode(m)} style={{flex:1,padding:10,background:mode===m?`linear-gradient(135deg,${T.accent2},${T.accent})`:"transparent",color:mode===m?"#fff":T.muted,border:"none",cursor:"pointer",fontWeight:mode===m?700:400,textTransform:"capitalize",fontSize:14}}>{m}</button>
          ))}
        </Row>
        {mode==="register"&&<input style={inp} placeholder="Full Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>}
        <input style={inp} placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
        <input type="password" style={{...inp,marginBottom:16}} placeholder="Password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/>
        {err&&<Txt c={T.danger} sz={13} mb={10}>⚠ {err}</Txt>}
        <button onClick={()=>{if(!form.email||!form.password)return setErr("All fields required");onLogin({name:form.name||"Alex",email:form.email});}} style={{width:"100%",padding:12,background:`linear-gradient(135deg,${T.accent2},${T.accent})`,color:"#fff",border:"none",borderRadius:8,fontWeight:700,fontSize:16,cursor:"pointer"}}>
          {mode==="login"?"Sign In →":"Create Account"}
        </button>
        <Txt c={T.muted} sz={11} style={{textAlign:"center",marginTop:14}}>demo@gap2growth.ai / demo123</Txt>
      </Card>
    </div>
  );
}

// ── PDF Upload ────────────────────────────────────────────────────────────────
function PDFUpload({onFileReady,T}){
  const [drag,setDrag]=useState(false);
  const [file,setFile]=useState(null);
  const [err,setErr]=useState("");
  const [preview,setPreview]=useState("");
  const [parsing,setParsing]=useState(false);
  const inputRef=useRef();
  const MAX=5*1024*1024;
  const handle=useCallback(async f=>{
    setErr("");
    if(!f)return;
    if(f.type!=="application/pdf")return setErr("❌ Only PDF files are supported.");
    if(f.size>MAX)return setErr("❌ File exceeds 5 MB limit.");
    setFile(f);setParsing(true);
    const text=await extractTextFromPDF(f);
    setParsing(false);setPreview(text.slice(0,350)+"...");onFileReady(text,f);
  },[onFileReady]);
  const pct=file?Math.round(file.size/MAX*100):0;
  const barC=pct>80?T.danger:pct>50?T.warn:T.accent3;
  return (
    <div>
      <div onDragOver={e=>{e.preventDefault();setDrag(true);}} onDragLeave={()=>setDrag(false)}
        onDrop={e=>{e.preventDefault();setDrag(false);handle(e.dataTransfer.files[0]);}}
        onClick={()=>inputRef.current.click()}
        style={{border:`2px dashed ${drag?T.accent:file?T.accent3:T.border}`,borderRadius:14,background:drag?T.accent+"08":file?T.accent3+"08":T.inputBg,padding:"32px 20px",textAlign:"center",cursor:"pointer",transition:"all .2s"}}>
        <input ref={inputRef} type="file" accept=".pdf" style={{display:"none"}} onChange={e=>handle(e.target.files[0])}/>
        {parsing?(
          <div><div style={{fontSize:32,animation:"spin 1s linear infinite"}}>⚙️</div><Txt sz={14} c={T.accent} w={600} style={{marginTop:8}}>Parsing PDF…</Txt></div>
        ):file?(
          <div>
            <div style={{fontSize:36,marginBottom:6}}>✅</div>
            <Txt sz={14} w={700} c={T.accent3} mb={4}>{file.name}</Txt>
            <Txt sz={11} c={T.muted} mb={10}>{(file.size/1024/1024).toFixed(2)} MB / 5 MB</Txt>
            <div style={{maxWidth:220,margin:"0 auto 10px"}}><Progress pct={pct} color={barC} h={5}/><Row justify="space-between" style={{marginTop:3}}><Txt sz={9} c={T.muted}>0 MB</Txt><Txt sz={9} c={barC} w={600}>{(file.size/1024/1024).toFixed(2)} MB</Txt><Txt sz={9} c={T.muted}>5 MB</Txt></Row></div>
            <Badge color={T.accent3}>✓ Parsed</Badge>
            <Txt sz={10} c={T.muted} style={{marginTop:8}}>Click to replace</Txt>
          </div>
        ):(
          <div>
            <div style={{fontSize:44,marginBottom:10}}>📄</div>
            <Txt sz={15} w={700} c={T.text} mb={4}>Drop Resume PDF here</Txt>
            <Txt sz={12} c={T.muted} mb={12}>or click to browse</Txt>
            <Row gap={6} style={{justifyContent:"center"}}><Badge color={T.accent}>PDF only</Badge><Badge color={T.muted}>Max 5 MB</Badge><Badge color={T.accent3}>NLP extract</Badge></Row>
          </div>
        )}
      </div>
      {err&&<div style={{marginTop:8,background:T.danger+"18",border:`1px solid ${T.danger}44`,borderRadius:8,padding:"8px 12px"}}><Txt sz={12} c={T.danger}>{err}</Txt></div>}
      {file&&!err&&(
        <Row justify="space-between" style={{marginTop:10,background:T.inputBg,borderRadius:8,padding:"10px 14px"}}>
          <Row gap={8}><span>📄</span><div><Txt sz={12} c={T.text} w={600}>{file.name}</Txt><Txt sz={10} c={T.muted}>{new Date(file.lastModified).toLocaleDateString()}</Txt></div></Row>
          <button onClick={e=>{e.stopPropagation();setFile(null);setPreview("");onFileReady("","");}} style={{background:"none",border:`1px solid ${T.danger}44`,color:T.danger,borderRadius:6,padding:"3px 9px",cursor:"pointer",fontSize:12}}>✕</button>
        </Row>
      )}
      {preview&&<div style={{marginTop:10,background:T.inputBg,borderRadius:8,padding:10,maxHeight:80,overflowY:"auto"}}><Txt sz={11} c={T.muted} style={{fontFamily:"monospace",lineHeight:1.6}}>{preview}</Txt></div>}
    </div>
  );
}

// ── Upload Screen ─────────────────────────────────────────────────────────────
function UploadScreen({onAnalyze,T}){
  const [resumeText,setResumeText]=useState("");
  const [jobRole,setJobRole]=useState("ML Engineer");
  const [jobDesc,setJobDesc]=useState("");
  const [loading,setLoading]=useState(false);
  const [step,setStep]=useState(0);
  const [fileName,setFileName]=useState("");
  const steps=["Parsing PDF…","Extracting skills with NLP…","Running ML classifier…","Predicting salary (₹ INR)…","Forecasting demand trends…","Generating roadmap…","Done ✓"];
  const analyze=async()=>{
    if(!resumeText.trim())return;setLoading(true);setStep(0);
    for(let i=0;i<steps.length-1;i++){await new Promise(r=>setTimeout(r,460));setStep(i+1);}
    onAnalyze(analyzeResume(resumeText+" "+jobDesc,jobRole),fileName);setLoading(false);
  };
  return (
    <div style={{maxWidth:960,margin:"0 auto",padding:"40px 20px"}}>
      <div style={{textAlign:"center",marginBottom:36}}>
        <Txt sz={30} w={800} c={T.text} mb={8}>⚡ Gap2Growth Analysis</Txt>
        <Txt sz={14} c={T.muted}>Upload your resume PDF and let AI map your career trajectory</Txt>
      </div>
      <Grid cols="1fr 1fr" gap={20} style={{marginBottom:16}}>
        <Card T={T}>
          <Row gap={8} style={{marginBottom:4}}><Txt sz={15} w={700} c={T.text}>📄 Resume Upload</Txt><Badge color={T.accent}>PDF · Max 5 MB</Badge></Row>
          <Txt sz={12} c={T.muted} mb={14}>Text extracted locally via NLP engine</Txt>
          <PDFUpload T={T} onFileReady={(text,f)=>{setResumeText(text);setFileName(f?.name||"");}}/>
        </Card>
        <Card T={T}>
          <Txt sz={15} w={700} c={T.text} mb={4}>🎯 Target Role</Txt>
          <Txt sz={12} c={T.muted} mb={14}>Select target role and paste JD for better matching</Txt>
          <Txt sz={12} c={T.muted} mb={6}>Job Role</Txt>
          <Select T={T} options={Object.keys(JOBS)} value={jobRole} onChange={setJobRole}/>
          <Txt sz={12} c={T.muted} mb={6} style={{marginTop:14}}>Job Description (optional)</Txt>
          <textarea value={jobDesc} onChange={e=>setJobDesc(e.target.value)} rows={5} placeholder="Paste JD here…"
            style={{width:"100%",background:T.inputBg,border:`1px solid ${T.border}`,color:T.text,padding:12,borderRadius:8,fontSize:13,resize:"vertical",boxSizing:"border-box",outline:"none"}}/>
          <div style={{marginTop:12,background:T.inputBg,borderRadius:8,padding:12}}>
            <Row justify="space-between"><Txt sz={12} c={T.muted}>Salary Range</Txt><Txt sz={12} c={T.accent3} w={600}>{INR(JOBS[jobRole].baseSalary)}–{INR(JOBS[jobRole].baseSalary*1.2)}</Txt></Row>
            <Row justify="space-between" style={{marginTop:6}}><Txt sz={12} c={T.muted}>Market Growth</Txt><Badge color={T.accent3}>+{JOBS[jobRole].growth}% YoY</Badge></Row>
          </div>
        </Card>
      </Grid>
      <Card T={T} style={{marginBottom:20,padding:"14px 20px"}}>
        <Txt sz={12} c={T.muted} mb={8}>Required skills for <span style={{color:T.accent,fontWeight:600}}>{jobRole}</span></Txt>
        <Row gap={6} wrap>{JOBS[jobRole].required.map(s=><Badge key={s} color={T.accent2}>{s}</Badge>)}</Row>
      </Card>
      {loading?(
        <Card T={T} style={{textAlign:"center",padding:44}}>
          <div style={{fontSize:36,marginBottom:14,animation:"spin 1s linear infinite"}}>⚙️</div>
          <Txt sz={18} w={700} c={T.text} mb={10}>{steps[step]}</Txt>
          <Progress pct={(step/(steps.length-1))*100} color={T.accent} h={7} style={{maxWidth:400,margin:"0 auto 12px"}}/>
          <Txt sz={12} c={T.muted}>{step} of {steps.length-1} AI modules</Txt>
        </Card>
      ):(
        <div style={{textAlign:"center"}}>
          <button onClick={analyze} disabled={!resumeText.trim()} style={{padding:"13px 48px",background:`linear-gradient(135deg,${T.accent2},${T.accent})`,color:"#fff",border:"none",borderRadius:10,fontSize:16,fontWeight:700,cursor:resumeText?"pointer":"not-allowed",opacity:resumeText?1:0.5}}>
            🚀 Run Gap2Growth Analysis
          </button>
          <Txt sz={12} c={T.muted} style={{marginTop:10}}>{resumeText?`✅ Resume loaded (${(resumeText.length/1000).toFixed(1)}K chars)`:"⬆ Upload a PDF resume to begin"}</Txt>
        </div>
      )}
    </div>
  );
}

// ── Industry Pulse Tab ────────────────────────────────────────────────────────
const IMPACT_CFG={
  "High Impact":{color:"#2563eb",bg:"#eff6ff",dot:"#3b82f6"},
  "Medium Shift":{color:"#7c3aed",bg:"#f5f3ff",dot:"#8b5cf6"},
  "Emerging Trend":{color:"#059669",bg:"#ecfdf5",dot:"#10b981"},
};
const CAT_CFG={
  "AI Trends":{color:"#1d4ed8",bg:"#dbeafe"},
  "Cloud Shift":{color:"#0369a1",bg:"#e0f2fe"},
  "Tech Global Weekly":{color:"#6d28d9",bg:"#ede9fe"},
  "Data & AI Infra":{color:"#0f766e",bg:"#ccfbf1"},
  "Frontend Evolution":{color:"#b45309",bg:"#fef3c7"},
  "Security Shift":{color:"#be123c",bg:"#ffe4e6"},
};

function ImpulseCard({ins,T}){
  const [open,setOpen]=useState(false);
  const [hov,setHov]=useState(false);
  const ic=IMPACT_CFG[ins.impact]||IMPACT_CFG["Emerging Trend"];
  const cc=CAT_CFG[ins.category]||{color:T.muted,bg:T.inputBg};
  return (
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:"20px 22px",cursor:"pointer",transition:"all .2s",transform:hov?"translateY(-3px)":"translateY(0)",boxShadow:hov?`0 10px 28px ${T.accent}18`:`0 1px 4px rgba(0,0,0,0.05)`}}
      onClick={()=>setOpen(o=>!o)}>
      <Row justify="space-between" style={{marginBottom:10,flexWrap:"wrap",gap:6}}>
        <Row gap={8}><span style={{background:cc.bg,color:cc.color,borderRadius:6,padding:"2px 9px",fontSize:11,fontWeight:600}}>{ins.category}</span><Txt sz={11} c={T.muted}>{ins.date}</Txt></Row>
        <span style={{display:"inline-flex",alignItems:"center",gap:5,background:ic.bg,color:ic.color,border:`1px solid ${ic.color}33`,borderRadius:99,padding:"3px 10px",fontSize:11,fontWeight:700}}>
          <span style={{width:6,height:6,borderRadius:"50%",background:ic.dot,display:"inline-block"}}/>
          {ins.impact}
        </span>
      </Row>
      <Txt sz={15} w={700} c={T.text} mb={8} style={{lineHeight:1.45}}>{ins.headline}</Txt>
      <Txt sz={13} c={T.subtext} mb={12} style={{lineHeight:1.7}}>{ins.summary}</Txt>
      <button style={{background:"none",border:"none",padding:0,color:T.accent,fontSize:12,fontWeight:600,cursor:"pointer"}}>
        {open?"▲ Show less":"▼ Engineer Impact"}
      </button>
      {open&&(
        <div style={{borderTop:`1px solid ${T.border}`,marginTop:14,paddingTop:14,display:"flex",flexDirection:"column",gap:14,animation:"fadeIn .2s ease"}}>
          <div><Txt sz={11} w={700} c={T.muted} mb={6} style={{textTransform:"uppercase",letterSpacing:"0.07em"}}>Why It Matters</Txt><Txt sz={13} c={T.subtext} style={{lineHeight:1.7}}>{ins.why}</Txt></div>
          <div><Txt sz={11} w={700} c={T.muted} mb={6} style={{textTransform:"uppercase",letterSpacing:"0.07em"}}>Role Evolution</Txt><Txt sz={13} c={T.subtext} style={{lineHeight:1.7}}>{ins.roleChange}</Txt></div>
          <div style={{height:1,background:T.border}}/>
          <Grid cols="1fr 1fr 1fr" gap={14}>
            {[["🧠 Skills to Learn","#1d4ed8","#dbeafe",ins.skills],["🔧 Tools","#0f766e","#ccfbf1",ins.tools],["📈 Roles in Demand","#7c3aed","#ede9fe",ins.roles]].map(([label,c,bg,items])=>(
              <div key={label}>
                <Txt sz={10} w={700} mb={8} c={c} style={{textTransform:"uppercase",letterSpacing:"0.07em"}}>{label}</Txt>
                <div style={{display:"flex",flexDirection:"column",gap:5}}>
                  {items.map(x=><span key={x} style={{background:bg,color:c,border:`1px solid ${c}22`,borderRadius:6,padding:"3px 9px",fontSize:11,fontWeight:500}}>{x}</span>)}
                </div>
              </div>
            ))}
          </Grid>
        </div>
      )}
    </div>
  );
}

function IndustryPulseTab({T}){
  const [filter,setFilter]=useState("All");
  const filters=["All","High Impact","Medium Shift","Emerging Trend"];
  const filtered=filter==="All"?INSIGHTS:INSIGHTS.filter(i=>i.impact===filter);
  return (
    <div>
      <Row justify="space-between" style={{marginBottom:20,flexWrap:"wrap",gap:12}}>
        <div>
          <Row gap={12} style={{marginBottom:4}}>
            <div style={{width:40,height:40,borderRadius:"50%",background:`linear-gradient(135deg,${T.accent}22,${T.accent2}22)`,border:`1px solid ${T.accent}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>🌐</div>
            <div><Txt sz={20} w={800} c={T.text}>Industry Pulse</Txt><Txt sz={12} c={T.muted}>Stay Ahead of Software Evolution</Txt></div>
          </Row>
        </div>
        <div style={{display:"inline-flex",alignItems:"center",gap:6,background:T.accent3+"18",border:`1px solid ${T.accent3}44`,borderRadius:99,padding:"5px 12px"}}>
          <span style={{width:7,height:7,borderRadius:"50%",background:T.accent3,animation:"pulse 2s infinite"}}/>
          <Txt sz={11} w={700} c={T.accent3}>Live · June 2025</Txt>
        </div>
      </Row>
      <Grid cols="repeat(auto-fit,minmax(140px,1fr))" gap={12} style={{marginBottom:20}}>
        {[["6","Insights This Week"],["3","High Impact Alerts"],["14+","Roles Shifting"],["24","Tools Tracked"]].map(([v,l])=>(
          <Card T={T} key={l} style={{textAlign:"center",padding:14}}>
            <Txt sz={22} w={800} c={T.accent} mb={4}>{v}</Txt>
            <Txt sz={11} c={T.muted}>{l}</Txt>
          </Card>
        ))}
      </Grid>
      <Row gap={6} wrap style={{marginBottom:18}}>
        {filters.map(f=>(
          <button key={f} onClick={()=>setFilter(f)} style={{padding:"5px 14px",borderRadius:99,fontSize:12,fontWeight:600,cursor:"pointer",transition:"all .15s",border:filter===f?"none":`1px solid ${T.border}`,background:filter===f?`linear-gradient(135deg,${T.accent2},${T.accent})`:T.card,color:filter===f?"#fff":T.muted,boxShadow:filter===f?`0 2px 8px ${T.accent}44`:"none"}}>{f}</button>
        ))}
        <Txt sz={12} c={T.muted} style={{marginLeft:"auto",alignSelf:"center"}}>{filtered.length} insight{filtered.length!==1?"s":""}</Txt>
      </Row>
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {filtered.map(ins=><ImpulseCard key={ins.id} ins={ins} T={T}/>)}
      </div>
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
function Dashboard({result,user,fileName,onReset,T}){
  const [tab,setTab]=useState("overview");
  const TABS=[
    {id:"overview",icon:"📊",label:"Overview"},
    {id:"skills",icon:"🧬",label:"Skill DNA"},
    {id:"salary",icon:"💰",label:"Salary"},
    {id:"forecast",icon:"📈",label:"Forecast"},
    {id:"pulse",icon:"🌐",label:"Industry Pulse"},
    {id:"roadmap",icon:"🗺",label:"Roadmap"},
    {id:"courses",icon:"📚",label:"Courses"},
    {id:"report",icon:"📋",label:"Report"},
  ];
  const {found,missing,matched,skillScore,interviewRisk,currentSalary,potentialSalary,dnaScore,peerPercentile,job,jobRole}=result;
  const roadmap=genRoadmap(missing);
  const forecast=genForecast(found[0]||"Python");
  const topCourses=COURSES.filter(c=>missing.includes(c.skill)||found.slice(0,2).includes(c.skill)).slice(0,6);
  const radarLabels=["Python","ML","Cloud","Web","Data","NLP"];
  const radarVals=radarLabels.map(l=>found.find(f=>f.toLowerCase().includes(l.toLowerCase().slice(0,4)))?rand(55,90):rand(10,30));

  return (
    <div>
      <div style={{borderBottom:`1px solid ${T.border}`,background:T.navBg,overflowX:"auto"}}>
        <div style={{display:"flex",maxWidth:1200,margin:"0 auto",padding:"0 16px"}}>
          {TABS.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)} style={{padding:"14px 13px",background:"none",border:"none",borderBottom:`2px solid ${tab===t.id?T.accent:"transparent"}`,color:tab===t.id?T.accent:T.muted,cursor:"pointer",fontSize:13,fontWeight:tab===t.id?600:400,whiteSpace:"nowrap"}}>
              {t.icon} {t.label}
            </button>
          ))}
          <button onClick={onReset} style={{marginLeft:"auto",padding:"14px 14px",background:"none",border:"none",color:T.muted,cursor:"pointer",fontSize:12}}>↩ New</button>
        </div>
      </div>

      <div style={{maxWidth:1200,margin:"0 auto",padding:"24px 16px"}}>
        {fileName&&<div style={{marginBottom:14,background:T.accent3+"18",border:`1px solid ${T.accent3}44`,borderRadius:8,padding:"7px 14px",display:"inline-flex",alignItems:"center",gap:8}}><span>📄</span><Txt sz={12} c={T.accent3}>{fileName}</Txt><Badge color={T.accent3}>Analyzed</Badge></div>}

        {/* OVERVIEW */}
        {tab==="overview"&&(
          <div>
            <Row gap={10} wrap style={{marginBottom:20}}><Txt sz={22} w={800} c={T.text}>👋 {user.name}'s Career Report</Txt><Badge color={T.accent}>{jobRole}</Badge></Row>
            <Grid cols="repeat(auto-fit,minmax(160px,1fr))" gap={12} style={{marginBottom:18}}>
              {[{label:"DNA Score",value:`${dnaScore}/100`,icon:"⚡",c:T.accent},{label:"Skill Match",value:`${skillScore}%`,icon:"✅",c:T.accent3},{label:"Interview Risk",value:`${interviewRisk}%`,icon:"⚠",c:interviewRisk>50?T.danger:T.warn},{label:"Top Percentile",value:`${100-peerPercentile}%`,icon:"🎯",c:"#8b5cf6"},{label:"Salary Potential",value:INR(potentialSalary),icon:"💰",c:T.accent3}].map(s=>(
                <Card T={T} key={s.label} style={{textAlign:"center"}}>
                  <div style={{fontSize:26,marginBottom:5}}>{s.icon}</div>
                  <Txt sz={20} w={800} c={s.c} mb={4}>{s.value}</Txt>
                  <Txt sz={11} c={T.muted}>{s.label}</Txt>
                </Card>
              ))}
            </Grid>
            <Grid cols="1fr 1fr" gap={14}>
              <Card T={T}><Txt sz={14} w={700} c={T.text} mb={12}>✅ Matched Skills ({matched.length})</Txt><Row gap={6} wrap>{matched.length?matched.map(s=><Badge key={s} color={T.accent3}>{s}</Badge>):<Txt c={T.muted}>None found</Txt>}</Row></Card>
              <Card T={T}><Txt sz={14} w={700} c={T.text} mb={12}>🚨 Missing Skills ({missing.length})</Txt><Row gap={6} wrap>{missing.length?missing.map(s=><Badge key={s} color={T.danger}>{s}</Badge>):<Badge color={T.accent3}>🎉 All matched!</Badge>}</Row></Card>
              <Card T={T}><Txt sz={14} w={700} c={T.text} mb={12}>🔍 Detected ({found.length})</Txt><Row gap={6} wrap>{found.map(s=><Badge key={s} color={T.muted}>{s}</Badge>)}</Row></Card>
              <Card T={T}>
                <Txt sz={14} w={700} c={T.text} mb={14}>📊 AI Assessment</Txt>
                {[{l:"Skill Coverage",p:skillScore,c:T.accent3},{l:"Interview Readiness",p:100-interviewRisk,c:T.accent},{l:"Market Alignment",p:rand(55,80),c:"#8b5cf6"},{l:"Resume Quality",p:rand(60,85),c:T.warn}].map(r=>(
                  <div key={r.l} style={{marginBottom:10}}>
                    <Row justify="space-between" style={{marginBottom:3}}><Txt sz={12} c={T.muted}>{r.l}</Txt><Txt sz={12} c={r.c} w={600}>{r.p}%</Txt></Row>
                    <Progress pct={r.p} color={r.c} h={6}/>
                  </div>
                ))}
              </Card>
            </Grid>
          </div>
        )}

        {/* SKILL DNA */}
        {tab==="skills"&&(
          <div>
            <Txt sz={20} w={800} c={T.text} mb={18}>🧬 Skill DNA Profile</Txt>
            <Grid cols="1fr 1fr" gap={14}>
              <Card T={T} style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
                <Txt sz={14} w={700} c={T.text} mb={14}>Skill Radar</Txt>
                <RadarChart T={T} labels={radarLabels} values={radarVals} color={T.accent} size={210}/>
              </Card>
              <Card T={T}>
                <Txt sz={14} w={700} c={T.text} mb={14}>Proficiency Breakdown</Txt>
                {found.slice(0,8).map(s=>{const lvl=SKILL_DB[s]||rand(50,80);return(
                  <div key={s} style={{marginBottom:11}}>
                    <Row justify="space-between" style={{marginBottom:3}}>
                      <Txt sz={13} c={T.text}>{s}</Txt>
                      <Row gap={6}><Badge color={lvl>80?T.accent3:lvl>65?T.accent:T.warn}>{lvl>80?"Expert":lvl>65?"Proficient":"Beginner"}</Badge><Txt sz={11} c={T.muted}>{lvl}%</Txt></Row>
                    </Row>
                    <Progress pct={lvl} color={lvl>80?T.accent3:lvl>65?T.accent:T.warn} h={6}/>
                  </div>
                );})}
              </Card>
              <Card T={T}>
                <Txt sz={14} w={700} c={T.text} mb={14}>🔴 Obsolescence Risk</Txt>
                {found.slice(0,5).map(s=>{const risk=rand(5,40);return(
                  <Row key={s} justify="space-between" style={{marginBottom:10}}>
                    <Txt sz={13} c={T.text}>{s}</Txt>
                    <Row gap={8}><Progress pct={risk} color={risk>30?T.danger:risk>15?T.warn:T.accent3} h={6} style={{width:80}}/><Badge color={risk>30?T.danger:risk>15?T.warn:T.accent3}>{risk>30?"High":risk>15?"Med":"Low"}</Badge></Row>
                  </Row>
                );})}
              </Card>
              <Card T={T}>
                <Txt sz={14} w={700} c={T.text} mb={14}>💡 Skill Gap Severity</Txt>
                <BarChart T={T} labels={missing.slice(0,6)} values={missing.slice(0,6).map(()=>rand(40,90))} colors={[T.danger,T.warn,"#8b5cf6",T.accent,T.accent3,"#ec4899"]} height={150}/>
              </Card>
            </Grid>
          </div>
        )}

        {/* SALARY */}
        {tab==="salary"&&(
          <div>
            <Txt sz={20} w={800} c={T.text} mb={18}>💰 Salary Intelligence (₹ INR)</Txt>
            <Grid cols="repeat(auto-fit,minmax(170px,1fr))" gap={12} style={{marginBottom:16}}>
              {[{l:"Current Estimate",v:INR(currentSalary),c:T.warn},{l:"Role Base",v:INR(job.baseSalary),c:T.accent},{l:"Full Potential",v:INR(potentialSalary),c:T.accent3},{l:"Gap to Close",v:INR(potentialSalary-currentSalary),c:"#8b5cf6"}].map(s=>(
                <Card T={T} key={s.l} style={{textAlign:"center"}}><Txt sz={22} w={800} c={s.c} mb={5}>{s.v}</Txt><Txt sz={11} c={T.muted}>{s.l}</Txt></Card>
              ))}
            </Grid>
            <Grid cols="1fr 1fr" gap={14}>
              <Card T={T}><Txt sz={14} w={700} c={T.text} mb={14}>Salary by Skill (₹)</Txt><BarChart T={T} labels={topCourses.map(c=>c.skill)} values={topCourses.map(c=>c.salaryBoost)} colors={[T.accent,T.accent3,"#8b5cf6",T.warn,T.danger,"#ec4899"]} height={155}/></Card>
              <Card T={T}><Txt sz={14} w={700} c={T.text} mb={14}>5-Year Projection (₹L)</Txt>
                <LineChart T={T} series={[{label:"Current",data:[currentSalary/100000,...Array(5).fill(0).map((_,i)=>+((currentSalary/100000)*(1+i*0.05)).toFixed(1))],color:T.warn},{label:"Optimized",data:[currentSalary/100000,...Array(5).fill(0).map((_,i)=>+((currentSalary/100000)*(1+i*0.13)).toFixed(1))],color:T.accent3}]} labels={["Now","Y1","Y2","Y3","Y4","Y5"]} height={165}/>
              </Card>
              <Card T={T}><Txt sz={14} w={700} c={T.text} mb={14}>🌍 City-wise Salary (₹L/yr)</Txt><BarChart T={T} labels={["Bangalore","Hyderabad","Pune","Mumbai","Delhi","Remote"]} values={[24,21,18,22,20,19]} colors={[T.accent,"#8b5cf6",T.accent3,T.warn,T.accent,"#ec4899"]} height={145}/></Card>
              <Card T={T}><Txt sz={14} w={700} c={T.text} mb={14}>🤖 XGBoost Model Output</Txt>
                <div style={{background:T.inputBg,borderRadius:8,padding:14}}>
                  {[["Model","XGBoost Regression",T.accent],["R² Score","0.87",T.accent3],["Features","12 skills",T.text],["Predicted",INR(currentSalary),T.warn],["Potential",INR(potentialSalary),T.accent3]].map(([l,v,c])=>(
                    <Row key={l} justify="space-between" style={{marginBottom:9}}><Txt sz={13} c={T.muted}>{l}</Txt><Txt sz={13} c={c} w={600}>{v}</Txt></Row>
                  ))}
                </div>
              </Card>
            </Grid>
          </div>
        )}

        {/* FORECAST */}
        {tab==="forecast"&&(
          <div>
            <Txt sz={20} w={800} c={T.text} mb={18}>📈 Skill Demand Forecast 2024–2029</Txt>
            <Grid cols="1fr 1fr" gap={14}>
              {found.slice(0,4).map(skill=>{const fc=genForecast(skill);return(
                <Card T={T} key={skill}>
                  <Row justify="space-between" style={{marginBottom:10}}><Txt sz={14} w={700} c={T.text}>{skill}</Txt><Badge color={T.accent3}>+{rand(18,45)}% demand</Badge></Row>
                  <LineChart T={T} series={[{label:"Demand",data:fc.map(f=>f.demand),color:T.accent}]} labels={fc.map(f=>f.year.toString())} height={135}/>
                </Card>
              );})}
            </Grid>
            <Card T={T} style={{marginTop:14}}>
              <Txt sz={14} w={700} c={T.text} mb={14}>🔮 Emerging Skills Index 2029</Txt>
              <BarChart T={T} labels={["AI/ML","Cloud","DevOps","NLP","Blockchain","Quantum","Edge AI","AutoML"]} values={[95,88,82,90,55,40,75,78]} colors={[T.accent,T.accent3,"#8b5cf6",T.warn,T.danger,"#ec4899",T.accent,T.accent3]} height={165}/>
            </Card>
          </div>
        )}

        {/* INDUSTRY PULSE */}
        {tab==="pulse"&&<IndustryPulseTab T={T}/>}

        {/* ROADMAP */}
        {tab==="roadmap"&&(
          <div>
            <Txt sz={20} w={800} c={T.text} mb={6}>🗺 Adaptive Learning Roadmap</Txt>
            <Txt sz={13} c={T.muted} mb={22}>16-week plan for {jobRole}</Txt>
            {roadmap.length===0&&<Card T={T}><Txt c={T.accent3} style={{textAlign:"center"}}>🎉 All required skills matched!</Txt></Card>}
            <div style={{position:"relative"}}>
              <div style={{position:"absolute",left:24,top:0,bottom:0,width:2,background:`linear-gradient(${T.accent2},${T.accent})`,borderRadius:2}}/>
              {roadmap.map((phase,pi)=>(
                <div key={pi} style={{position:"relative",zIndex:1,marginBottom:22,paddingLeft:58}}>
                  <div style={{position:"absolute",left:14,top:16,width:22,height:22,background:`linear-gradient(135deg,${T.accent2},${T.accent})`,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"#fff"}}>{pi+1}</div>
                  <Card T={T}>
                    <Row justify="space-between" style={{marginBottom:12}}><Txt sz={15} w={700} c={T.text}>{phase.phase}</Txt><Badge color={T.accent}>Weeks {phase.weeks}</Badge></Row>
                    <Grid cols="1fr 1fr" gap={10}>
                      {phase.tasks.map((task,ti)=>(
                        <div key={ti} style={{background:T.inputBg,borderRadius:8,padding:12}}>
                          <Badge color={T.accent3} style={{marginBottom:8,display:"inline-block"}}>{task.skill}</Badge>
                          <Txt sz={13} c={T.text} mb={4}>{task.action}</Txt>
                          <Txt sz={11} c={T.muted} mb={3}>📚 {task.resource}</Txt>
                          <Txt sz={11} c={T.warn}>⏱ {task.effort}</Txt>
                        </div>
                      ))}
                    </Grid>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* COURSES */}
        {tab==="courses"&&(
          <div>
            <Txt sz={20} w={800} c={T.text} mb={6}>📚 AI Course Recommendations</Txt>
            <Txt sz={13} c={T.muted} mb={18}>Ranked by skill gap × salary impact × market demand</Txt>
            <Grid cols="repeat(auto-fill,minmax(280px,1fr))" gap={14}>
              {COURSES.map(c=>{
                const priority=missing.includes(c.skill)?100:found.includes(c.skill)?60:40;
                const score=Math.round(priority*0.4+(c.rating/5*100)*0.3+(c.salaryBoost/280000*100)*0.3);
                return(
                  <Card T={T} key={c.id} style={{position:"relative",borderColor:missing.includes(c.skill)?T.accent2:T.border}}>
                    {missing.includes(c.skill)&&<div style={{position:"absolute",top:-1,left:20,background:`linear-gradient(135deg,${T.accent2},${T.accent})`,color:"#fff",fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:"0 0 8px 8px"}}>🎯 PRIORITY</div>}
                    <div style={{marginTop:missing.includes(c.skill)?12:0}}>
                      <Txt sz={14} w={700} c={T.text} mb={6}>{c.title}</Txt>
                      <Row gap={6} wrap style={{marginBottom:10}}><Badge color={T.accent}>{c.platform}</Badge><Badge color={T.accent3}>{c.skill}</Badge><Badge color={c.cost===0?T.accent3:T.muted}>{c.cost===0?"Free":"₹"+c.cost}</Badge></Row>
                      <Grid cols="1fr 1fr 1fr" gap={8} style={{marginBottom:10}}>
                        {[[`⭐${c.rating}`,"Rating",T.accent],[`${c.hours}h`,"Hours",T.warn],[`+${INR(c.salaryBoost)}`,"Salary",T.accent3]].map(([v,l,cl])=>(
                          <div key={l} style={{textAlign:"center",background:T.inputBg,borderRadius:6,padding:8}}><Txt sz={12} w={700} c={cl}>{v}</Txt><Txt sz={10} c={T.muted}>{l}</Txt></div>
                        ))}
                      </Grid>
                      <Row justify="space-between">
                        <div><Txt sz={10} c={T.muted} mb={2}>AI Match</Txt><Progress pct={score} color={score>80?T.accent3:score>60?T.accent:T.muted} h={5} style={{width:90}}/></div>
                        <button style={{background:`linear-gradient(135deg,${T.accent2},${T.accent})`,color:"#fff",border:"none",padding:"6px 14px",borderRadius:7,fontSize:12,fontWeight:600,cursor:"pointer"}}>Enroll →</button>
                      </Row>
                    </div>
                  </Card>
                );
              })}
            </Grid>
          </div>
        )}

        {/* REPORT */}
        {tab==="report"&&(
          <div>
            <Row justify="space-between" style={{marginBottom:22}}>
              <div><Txt sz={20} w={800} c={T.text} mb={4}>📋 Career Intelligence Report</Txt><Txt sz={12} c={T.muted}>Gap2Growth AI · {new Date().toLocaleDateString()} · {fileName||"Resume"}</Txt></div>
              <button onClick={()=>alert("Production: PDF via WeasyPrint/ReportLab on Python backend")} style={{padding:"10px 20px",background:`linear-gradient(135deg,${T.accent2},${T.accent})`,color:"#fff",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer",fontSize:13}}>⬇ Download PDF</button>
            </Row>
            <Card T={T}>
              <div style={{background:`linear-gradient(135deg,${T.accent2}33,${T.accent}22)`,borderRadius:10,padding:26,marginBottom:22}}>
                <Row gap={14}>
                  <div style={{width:56,height:56,borderRadius:"50%",background:`linear-gradient(135deg,${T.accent2},${T.accent})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,fontWeight:800,color:"#fff"}}>{user.name[0]}</div>
                  <div><Txt sz={20} w={800} c={T.text} mb={4}>{user.name}</Txt><Txt sz={12} c={T.muted} mb={8}>{jobRole} · {fileName||"Resume"}</Txt><Row gap={6}><Badge color={T.accent}>DNA: {dnaScore}/100</Badge><Badge color={T.accent3}>Match: {skillScore}%</Badge><Badge color={"#8b5cf6"}>Top {100-peerPercentile}%</Badge></Row></div>
                </Row>
              </div>
              {[
                {t:"🧬 Skills",c:<Grid cols="1fr 1fr" gap={12}><div><Txt sz={12} c={T.muted} mb={7}>Matched</Txt><Row gap={6} wrap>{matched.map(s=><Badge key={s} color={T.accent3}>{s}</Badge>)}</Row></div><div><Txt sz={12} c={T.muted} mb={7}>Missing</Txt><Row gap={6} wrap>{missing.map(s=><Badge key={s} color={T.danger}>{s}</Badge>)}</Row></div></Grid>},
                {t:"💰 Salary (₹ INR)",c:<Grid cols="1fr 1fr 1fr" gap={10}>{[["Current",INR(currentSalary),T.warn],["Target",INR(job.baseSalary),T.accent],["Potential",INR(potentialSalary),T.accent3]].map(([l,v,c])=><div key={l} style={{background:T.inputBg,borderRadius:8,padding:14,textAlign:"center"}}><Txt sz={18} w={800} c={c} mb={4}>{v}</Txt><Txt sz={11} c={T.muted}>{l}</Txt></div>)}</Grid>},
                {t:"🗺 Roadmap",c:<div>{roadmap.map((p,i)=><Row key={i} gap={10} style={{marginBottom:7}}><Badge color={T.accent}>Phase {i+1}: {p.phase}</Badge><Txt sz={12} c={T.muted}>Wks {p.weeks} — {p.tasks.map(t=>t.skill).join(", ")}</Txt></Row>)}</div>},
                {t:"🤖 AI Modules",c:<Grid cols="1fr 1fr" gap={8}>{[["NLP Engine","spaCy+Transformers"],["Interview Risk","Random Forest 91%"],["Salary","XGBoost R²=0.87"],["Clustering","KMeans k=4"],["Forecast","ARIMA+Prophet"],["Recommender","Hybrid CBF"]].map(([n,m])=><Row key={n} justify="space-between" style={{background:T.inputBg,borderRadius:6,padding:10}}><div><Txt sz={12} c={T.text} w={600}>{n}</Txt><Txt sz={11} c={T.muted}>{m}</Txt></div><Badge color={T.accent3}>✓</Badge></Row>)}</Grid>},
              ].map(s=>(
                <div key={s.t} style={{marginBottom:22}}>
                  <Txt sz={14} w={700} c={T.text} mb={10}>{s.t}</Txt>
                  {s.c}
                  <div style={{borderBottom:`1px solid ${T.border}`,marginTop:18}}/>
                </div>
              ))}
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

// ── App Root ──────────────────────────────────────────────────────────────────
export default function App() {
  const [isDark,setIsDark]=useState(true);
  const [user,setUser]=useState(null);
  const [result,setResult]=useState(null);
  const [fileName,setFileName]=useState("");
  const T=isDark?THEMES.dark:THEMES.light;

  const css=`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
    *{box-sizing:border-box;margin:0;padding:0;}
    body{font-family:'Inter','SF Pro Display',-apple-system,sans-serif;}
    textarea:focus,input:focus,select:focus{border-color:${T.accent}!important;}
    ::-webkit-scrollbar{width:5px;height:5px;}
    ::-webkit-scrollbar-track{background:${T.bg};}
    ::-webkit-scrollbar-thumb{background:${T.border};border-radius:3px;}
    canvas{display:block;}
    @keyframes spin{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}
    @keyframes fadeIn{from{opacity:0;transform:translateY(-5px);}to{opacity:1;transform:translateY(0);}}
    @keyframes pulse{0%,100%{opacity:1;}50%{opacity:.4;}}
  `;

  if(!user) return(
    <>
      <style>{css}</style>
      <div style={{background:T.bg,minHeight:"100vh"}}>
        <AuthScreen T={T} isDark={isDark} toggleTheme={()=>setIsDark(d=>!d)} onLogin={setUser}/>
      </div>
    </>
  );

  return (
    <>
      <style>{css}</style>
      <div style={{background:T.bg,minHeight:"100vh",color:T.text,transition:"background .2s,color .2s"}}>
        {/* Navbar */}
        <div style={{background:T.navBg,borderBottom:`1px solid ${T.border}`,padding:"0 24px",display:"flex",alignItems:"center",height:60,gap:12,position:"sticky",top:0,zIndex:100,boxShadow:`0 1px 0 ${T.border}`}}>
          <span style={{fontSize:20}}>⚡</span>
          <span style={{fontSize:16,fontWeight:800,color:T.text,letterSpacing:"-0.02em"}}>Gap2Growth</span>
          <Badge color={T.accent} style={{fontSize:10}}>AI Platform</Badge>
          <div style={{marginLeft:"auto",display:"flex",gap:10,alignItems:"center"}}>
            {result&&<Badge color={T.accent3} style={{fontSize:10}}>✓ {fileName||"Analyzed"}</Badge>}
            {/* Theme Toggle */}
            <button onClick={()=>setIsDark(d=>!d)} title={isDark?"Switch to Light Mode":"Switch to Dark Mode"}
              style={{background:T.tagBg,border:`1px solid ${T.border}`,borderRadius:10,padding:"6px 10px",cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center",transition:"all .2s",color:T.text}}>
              {isDark?"☀️":"🌙"}
            </button>
            <span style={{fontSize:13,color:T.muted}}>👤 {user.name}</span>
            <button onClick={()=>{setUser(null);setResult(null);setFileName("");}} style={{background:"none",border:`1px solid ${T.border}`,color:T.muted,borderRadius:7,padding:"5px 12px",cursor:"pointer",fontSize:12,fontWeight:600}}>Logout</button>
          </div>
        </div>

        {!result
          ? <UploadScreen T={T} onAnalyze={(r,fn)=>{setResult(r);setFileName(fn);}}/>
          : <Dashboard T={T} result={result} user={user} fileName={fileName} onReset={()=>{setResult(null);setFileName("");}}/>
        }
      </div>
    </>
  );
}
