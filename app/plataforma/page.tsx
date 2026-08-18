"use client";

import { useEffect, useMemo, useState } from "react";

type Gender = "mulher" | "homem";
type Place = "academia" | "casa";
type Level = "iniciante" | "intermediario" | "avancado";
type Tab = "hoje" | "treino" | "alimentacao" | "progresso" | "perfil";
type Profile = { name:string; gender:Gender; place:Place; level:Level; age:number; weight:number; height:number; goalWeight:number; daysPerWeek:number; supplements:boolean };
type Exercise = {name:string; sets:number; reps:string; rest:string; note:string; technique?:string};
type Workout = {title:string; focus:string; cardio:string; duration:string; exercises:Exercise[]};
type Meal = {title:string; time:string; items:string[]; kcal:number; protein:number; alternative?:{title:string;items:string[];note:string}};

function NumberStepper({label,value,min,max,step=1,unit,onChange}:{label:string;value:number;min:number;max:number;step?:number;unit?:string;onChange:(v:number)=>void}){
 const clamp=(v:number)=>Math.min(max,Math.max(min,Math.round(v/step)*step));
 return <div className="number-stepper"><span className="number-stepper-label">{label}</span><div className="number-stepper-control"><button type="button" aria-label={`Diminuir ${label}`} onClick={()=>onChange(clamp(value-step))}>−</button><div className="number-stepper-value"><b>{value}</b>{unit&&<small>{unit}</small>}</div><button type="button" aria-label={`Aumentar ${label}`} onClick={()=>onChange(clamp(value+step))}>+</button></div></div>;
}

const womanGym: Workout[] = [
 {title:"Glúteos • Força",focus:"Glúteos e posterior",cardio:"Bike: 15 min leve após o treino",duration:"65–75 min",exercises:[
  {name:"Elevação pélvica",sets:4,reps:"8–10",rest:"90s",note:"Pausa de 2s no topo",technique:"Progressão de carga"},
  {name:"Agachamento livre",sets:4,reps:"8–10",rest:"120s",note:"Amplitude confortável"},
  {name:"Stiff com barra",sets:3,reps:"10–12",rest:"90s",note:"Quadril para trás"},
  {name:"Cadeira abdutora",sets:3,reps:"15 + drop",rest:"60s",note:"Última série em drop set",technique:"Drop set"},
  {name:"Coice no cabo",sets:3,reps:"12 cada",rest:"60s",note:"Sem girar o quadril"}]},
 {title:"Costas • Postura",focus:"Costas, bíceps e core",cardio:"Esteira inclinada: 22 min",duration:"55–65 min",exercises:[
  {name:"Puxada frontal",sets:4,reps:"10–12",rest:"75s",note:"Peito aberto"},{name:"Remada baixa",sets:4,reps:"10–12",rest:"75s",note:"Puxe com os cotovelos"},{name:"Remada unilateral",sets:3,reps:"12 cada",rest:"60s",note:"Controle a descida"},{name:"Rosca alternada",sets:3,reps:"10–12",rest:"60s",note:"Sem balanço"},{name:"Prancha",sets:3,reps:"30–45s",rest:"45s",note:"Corpo alinhado"}]},
 {title:"Quadríceps • Volume",focus:"Quadríceps e panturrilhas",cardio:"Elíptico: 15 min moderado",duration:"65–75 min",exercises:[
  {name:"Agachamento hack",sets:4,reps:"10–12",rest:"90s",note:"Joelhos alinhados"},{name:"Leg press 45°",sets:4,reps:"12",rest:"90s",note:"Pés médios"},{name:"Cadeira extensora",sets:3,reps:"12 + drop",rest:"60s",note:"Última série em drop set",technique:"Drop set"},{name:"Afundo búlgaro",sets:3,reps:"10 cada",rest:"75s",note:"Passo estável"},{name:"Panturrilha sentada",sets:4,reps:"15–20",rest:"45s",note:"Amplitude completa"}]},
 {title:"Ombros • Core",focus:"Ombros, braços e abdômen",cardio:"Escada: 18 min intervalado",duration:"50–60 min",exercises:[
  {name:"Desenvolvimento máquina",sets:4,reps:"10–12",rest:"75s",note:"Não arquear lombar"},{name:"Elevação lateral",sets:3,reps:"12–15",rest:"60s",note:"Controle total"},{name:"Tríceps corda",sets:3,reps:"12",rest:"60s",note:"Cotovelos fixos"},{name:"Rosca martelo",sets:3,reps:"12",rest:"60s",note:"Punhos neutros"},{name:"Abdominal infra",sets:3,reps:"12–15",rest:"45s",note:"Sem impulso"}]},
 {title:"Posterior • Glúteos",focus:"Posterior e glúteos",cardio:"Bike: 20 min zona 2",duration:"65–75 min",exercises:[
  {name:"Levantamento terra romeno",sets:4,reps:"8–10",rest:"120s",note:"Coluna neutra"},{name:"Mesa flexora",sets:4,reps:"10–12",rest:"75s",note:"Quadril apoiado"},{name:"Elevação pélvica unilateral",sets:3,reps:"12 cada",rest:"75s",note:"Pausa no topo"},{name:"Abdutora inclinada",sets:4,reps:"15–20",rest:"45s",note:"Queima controlada"},{name:"Passada no smith",sets:3,reps:"10 cada",rest:"75s",note:"Passo longo"}]},
 {title:"Glúteos • Metabólico",focus:"Glúteos completos",cardio:"Esteira: 12 tiros de 30s/60s",duration:"55–65 min",exercises:[
  {name:"Hip thrust",sets:4,reps:"12",rest:"75s",note:"Carga moderada"},{name:"Agachamento sumô",sets:3,reps:"12–15",rest:"75s",note:"Pés abertos"},{name:"Abdução no cabo",sets:3,reps:"15 cada",rest:"45s",note:"Movimento curto e limpo"},{name:"Step-up",sets:3,reps:"12 cada",rest:"60s",note:"Suba pelo calcanhar"},{name:"Cadeira abdutora",sets:2,reps:"20 + drop",rest:"45s",note:"Finalizador",technique:"Drop set"}]}
];

const manGym: Workout[] = [
 {title:"Peito • Tríceps",focus:"Empurrar e força",cardio:"Esteira inclinada: 20 min",duration:"65–75 min",exercises:[
  {name:"Supino reto",sets:4,reps:"6–10",rest:"120s",note:"Progressão semanal",technique:"Progressão de carga"},{name:"Supino inclinado halteres",sets:4,reps:"8–12",rest:"90s",note:"Controle na descida"},{name:"Crucifixo máquina",sets:3,reps:"12–15",rest:"60s",note:"Alongamento sem dor"},{name:"Tríceps testa",sets:3,reps:"10–12",rest:"60s",note:"Cotovelos fixos"},{name:"Tríceps corda",sets:3,reps:"12 + drop",rest:"60s",note:"Última série drop",technique:"Drop set"}]},
 {title:"Costas • Bíceps",focus:"Puxar e espessura",cardio:"Bike: 18 min moderado",duration:"65–75 min",exercises:[
  {name:"Puxada frontal",sets:4,reps:"8–12",rest:"90s",note:"Sem balançar"},{name:"Remada curvada",sets:4,reps:"8–10",rest:"120s",note:"Coluna neutra"},{name:"Remada baixa",sets:3,reps:"10–12",rest:"75s",note:"Peito aberto"},{name:"Rosca direta",sets:3,reps:"8–12",rest:"60s",note:"Sem impulso"},{name:"Rosca martelo",sets:3,reps:"12 + drop",rest:"60s",note:"Última série drop",technique:"Drop set"}]},
 {title:"Pernas • Completo",focus:"Quadríceps, posterior e glúteos",cardio:"Elíptico: 12 min leve",duration:"70–85 min",exercises:[
  {name:"Agachamento livre",sets:4,reps:"6–10",rest:"120s",note:"Técnica antes da carga"},{name:"Leg press",sets:4,reps:"10–12",rest:"90s",note:"Amplitude segura"},{name:"Stiff",sets:3,reps:"8–12",rest:"90s",note:"Quadril para trás"},{name:"Mesa flexora",sets:3,reps:"12 + drop",rest:"60s",note:"Última série drop",technique:"Drop set"},{name:"Panturrilha em pé",sets:4,reps:"15–20",rest:"45s",note:"Pausa no topo"}]},
 {title:"Ombros • Abdômen",focus:"Deltoides e core",cardio:"Escada: 20 min",duration:"55–65 min",exercises:[
  {name:"Desenvolvimento halteres",sets:4,reps:"8–12",rest:"90s",note:"Core firme"},{name:"Elevação lateral",sets:4,reps:"12–15",rest:"60s",note:"Sem balanço"},{name:"Crucifixo inverso",sets:3,reps:"12–15",rest:"60s",note:"Ombros baixos"},{name:"Encolhimento",sets:3,reps:"12",rest:"60s",note:"Pausa no topo"},{name:"Prancha",sets:3,reps:"40–60s",rest:"45s",note:"Corpo alinhado"}]},
 {title:"Upper • Intensidade",focus:"Tronco completo",cardio:"HIIT bike: 10 tiros de 30s/60s",duration:"65–75 min",exercises:[
  {name:"Supino inclinado",sets:4,reps:"8–10",rest:"90s",note:"Carga progressiva"},{name:"Barra fixa",sets:4,reps:"8–12",rest:"90s",note:"Suba o peito em direção à barra"},{name:"Remada máquina",sets:3,reps:"10–12",rest:"75s",note:"Sem elevar ombros"},{name:"Elevação lateral",sets:3,reps:"15 + drop",rest:"45s",note:"Finalizador",technique:"Drop set"},{name:"Bíceps + tríceps",sets:3,reps:"12 + 12",rest:"60s",note:"Bi-set",technique:"Bi-set"}]},
 {title:"Lower • Força",focus:"Pernas e cadeia posterior",cardio:"Caminhada: 15 min leve",duration:"70–80 min",exercises:[
  {name:"Terra romeno",sets:4,reps:"6–10",rest:"120s",note:"Progressão semanal"},{name:"Hack squat",sets:4,reps:"8–12",rest:"90s",note:"Amplitude segura"},{name:"Afundo",sets:3,reps:"10 cada",rest:"75s",note:"Passo firme"},{name:"Flexora",sets:3,reps:"12–15",rest:"60s",note:"Controle"},{name:"Panturrilha sentada",sets:4,reps:"15–20",rest:"45s",note:"Amplitude"}]}
];

const homeWoman: Workout[] = womanGym.map((w,i)=>({...w,title:w.title+" • Casa",duration:"40–55 min",exercises:[
 {name:["Ponte de glúteos","Remada com mochila","Agachamento lento","Flexão inclinada","Stiff com mochila","Agachamento sumô"][i],sets:4,reps:"12–20",rest:"60s",note:"Use peso corporal, mochila ou elástico doméstico"},
 {name:["Agachamento búlgaro","Pulldown com elástico","Afundo reverso","Elevação lateral com garrafas","Ponte unilateral","Step-up em cadeira firme"][i],sets:3,reps:"10–15 cada",rest:"60s",note:"Movimento controlado"},
 {name:"Circuito funcional",sets:4,reps:"40s trabalho / 20s pausa",rest:"60s",note:"Intensidade progressiva"},
 {name:"Prancha",sets:3,reps:"30–45s",rest:"45s",note:"Core firme"}],cardio:"Caminhada rápida ou corda: 20–30 min"}));
const homeMan: Workout[] = manGym.map((w,i)=>({...w,title:w.title+" • Casa",duration:"45–60 min",exercises:[
 {name:["Flexão de braços","Remada com mochila","Agachamento com mochila","Flexão pike","Flexão declinada","Agachamento unilateral assistido"][i],sets:4,reps:"8–20",rest:"75s",note:"Aumente carga na mochila"},
 {name:["Mergulho em cadeira firme","Rosca com mochila","Afundo","Elevação lateral com garrafas","Remada unilateral","Stiff com mochila"][i],sets:4,reps:"10–15",rest:"60s",note:"Controle a descida"},
 {name:"Circuito metabólico",sets:4,reps:"45s trabalho / 15s pausa",rest:"60s",note:"Sem perder a técnica"},
 {name:"Prancha",sets:3,reps:"40–60s",rest:"45s",note:"Core firme"}],cardio:"Caminhada, corrida leve ou corda: 20–30 min"}));

const mealTemplates = {
 breakfast:[
  ["2 ovos mexidos","2 fatias de pão integral","1 banana com canela"],
  ["Iogurte natural 170 g","Aveia 30 g","1 banana pequena","Canela a gosto"],
  ["Omelete com 2 ovos","Queijo branco 30 g","1 fatia de pão integral","1 fruta"]
 ],
 lunch:[
  ["Frango grelhado 150 g","Arroz 120 g","Feijão 100 g","Salada e legumes à vontade"],
  ["Carne bovina magra 150 g","Batata inglesa 180 g","Legumes 120 g","Salada à vontade"],
  ["Peixe grelhado 160 g","Arroz 120 g","Feijão 80 g","Salada e legumes à vontade"]
 ],
 snack:[
  ["Iogurte natural 170 g","Aveia 30 g","1 fruta pequena"],
  ["Sanduíche integral","Frango desfiado 80 g","Queijo branco 30 g","Folhas à vontade"],
  ["2 ovos cozidos","1 fruta","1 fatia de pão integral"]
 ],
 dinner:[
  ["Frango grelhado 150 g","Batata-doce 180 g","Legumes 120 g","Salada à vontade"],
  ["Omelete com 3 ovos","Arroz 100 g","Salada e legumes à vontade"],
  ["Carne magra 150 g","Arroz 100 g","Feijão 80 g","Salada à vontade"]
 ]
};

function calcPlan(p:Profile){
 const bmr = p.gender==="homem" ? 10*p.weight+6.25*p.height-5*p.age+5 : 10*p.weight+6.25*p.height-5*p.age-161;
 const activity = p.daysPerWeek>=5?1.55:p.daysPerWeek>=3?1.4:1.25;
 const maintenance = bmr*activity;
 const delta = p.goalWeight < p.weight-1 ? -450 : p.goalWeight > p.weight+1 ? 280 : 0;
 const kcal = Math.max(1400,Math.round((maintenance+delta)/50)*50);
 const protein = Math.round(p.weight*(p.goalWeight<p.weight?1.8:2));
 const water = Math.round(p.weight*35/100)*100;
 return {kcal,protein,water,bmi:+(p.weight/((p.height/100)**2)).toFixed(1),goal:delta<0?"Emagrecimento":delta>0?"Ganho de massa":"Manutenção"};
}
function dayPhase(day:number){ if(day<=30)return {name:"Fundação",label:"Técnica, consistência e adaptação",accent:"Fase 1"}; if(day<=60)return {name:"Evolução",label:"Progressão de carga e intensidade",accent:"Fase 2"}; return {name:"Performance",label:"Consolidação e estilo de vida",accent:"Fase 3"}; }
function techniqueGuide(technique?:string){
 if(technique==="Drop set") return {title:"Como fazer o drop set",steps:["Faça a última série com a carga normal até faltar no máximo 1 repetição para falhar.","Sem descansar, reduza a carga entre 20% e 30%.","Continue o exercício com boa execução por mais 6 a 12 repetições.","Use somente na última série indicada. Se a técnica piorar, pare."]};
 if(technique==="Bi-set") return {title:"Como fazer o bi-set",steps:["Faça o primeiro exercício pelo número indicado de repetições.","Passe imediatamente para o segundo exercício, sem descanso.","Depois dos dois exercícios, descanse pelo tempo indicado.","A sequência completa dos dois exercícios vale como uma série."]};
 if(technique==="Progressão de carga") return {title:"Como progredir com segurança",steps:["Comece com uma carga que permita completar todas as repetições com técnica limpa.","Quando atingir o máximo da faixa em todas as séries, aumente a menor carga possível.","Em membros superiores, tente subir de 1 kg a 2,5 kg; em pernas, de 2,5 kg a 5 kg.","Se não completar a faixa, mantenha a carga na próxima sessão."]};
 return null;
}
function normalizeExercise(name:string){return name.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim();}
type MotionKind="plank"|"pushup"|"chest"|"pulldown"|"row"|"curlarm"|"triceps"|"press"|"abs"|"calf"|"abductor"|"extension"|"legcurl"|"hinge"|"bridge"|"stepup"|"lunge"|"squat"|"circuit"|"biset"|"jumpingjack";
type ExerciseSpec={id:string;motion:MotionKind};
const EXERCISE_SPECS:Record<string,ExerciseSpec>={
 "elevacao pelvica":{id:"elevacao_pelvica_barra",motion:"bridge"},
 "agachamento livre":{id:"agachamento_livre_barra",motion:"squat"},
 "stiff com barra":{id:"stiff_barra",motion:"hinge"},
 "cadeira abdutora":{id:"cadeira_abdutora",motion:"abductor"},
 "coice no cabo":{id:"coice_cabo",motion:"abductor"},
 "puxada frontal":{id:"puxada_frontal_polia",motion:"pulldown"},
 "remada baixa":{id:"remada_baixa_cabo",motion:"row"},
 "remada unilateral":{id:"remada_unilateral_halter",motion:"row"},
 "rosca alternada":{id:"rosca_alternada_halter",motion:"curlarm"},
 "prancha":{id:"prancha_isometrica",motion:"plank"},
 "agachamento hack":{id:"agachamento_hack_maquina",motion:"squat"},
 "leg press 45°":{id:"leg_press_45",motion:"squat"},
 "cadeira extensora":{id:"cadeira_extensora",motion:"extension"},
 "afundo bulgaro":{id:"afundo_bulgaro",motion:"lunge"},
 "panturrilha sentada":{id:"panturrilha_sentada",motion:"calf"},
 "desenvolvimento maquina":{id:"desenvolvimento_maquina",motion:"press"},
 "elevacao lateral":{id:"elevacao_lateral_halter",motion:"press"},
 "triceps corda":{id:"triceps_corda_polia",motion:"triceps"},
 "rosca martelo":{id:"rosca_martelo_halter",motion:"curlarm"},
 "abdominal infra":{id:"abdominal_infra",motion:"abs"},
 "levantamento terra romeno":{id:"terra_romeno_barra",motion:"hinge"},
 "mesa flexora":{id:"mesa_flexora",motion:"legcurl"},
 "elevacao pelvica unilateral":{id:"elevacao_pelvica_unilateral",motion:"bridge"},
 "abdutora inclinada":{id:"abdutora_inclinada",motion:"abductor"},
 "passada no smith":{id:"passada_smith",motion:"lunge"},
 "hip thrust":{id:"hip_thrust_barra",motion:"bridge"},
 "agachamento sumo":{id:"agachamento_sumo",motion:"squat"},
 "abducao no cabo":{id:"abducao_cabo",motion:"abductor"},
 "step-up":{id:"step_up_caixa",motion:"stepup"},
 "supino reto":{id:"supino_reto_barra",motion:"chest"},
 "supino inclinado halteres":{id:"supino_inclinado_halteres",motion:"chest"},
 "crucifixo maquina":{id:"crucifixo_maquina",motion:"chest"},
 "triceps testa":{id:"triceps_testa",motion:"triceps"},
 "remada curvada":{id:"remada_curvada_barra",motion:"row"},
 "rosca direta":{id:"rosca_direta_barra",motion:"curlarm"},
 "leg press":{id:"leg_press",motion:"squat"},
 "stiff":{id:"stiff",motion:"hinge"},
 "flexora":{id:"flexora",motion:"legcurl"},
 "panturrilha em pe":{id:"panturrilha_em_pe",motion:"calf"},
 "desenvolvimento halteres":{id:"desenvolvimento_halteres",motion:"press"},
 "crucifixo inverso":{id:"crucifixo_inverso",motion:"press"},
 "encolhimento":{id:"encolhimento_halteres",motion:"press"},
 "supino inclinado":{id:"supino_inclinado_barra",motion:"chest"},
 "barra fixa":{id:"barra_fixa",motion:"pulldown"},
 "remada maquina":{id:"remada_maquina",motion:"row"},
 "biceps + triceps":{id:"biset_biceps_triceps",motion:"biset"},
 "terra romeno":{id:"terra_romeno",motion:"hinge"},
 "hack squat":{id:"hack_squat",motion:"squat"},
 "afundo":{id:"afundo",motion:"lunge"},
 "ponte de gluteos":{id:"ponte_gluteos_casa",motion:"bridge"},
 "remada com mochila":{id:"remada_mochila_casa",motion:"row"},
 "agachamento lento":{id:"agachamento_lento_casa",motion:"squat"},
 "flexao inclinada":{id:"flexao_inclinada_casa",motion:"pushup"},
 "stiff com mochila":{id:"stiff_mochila_casa",motion:"hinge"},
 "agachamento bulgaro":{id:"agachamento_bulgaro_casa",motion:"lunge"},
 "pulldown com elastico":{id:"pulldown_elastico_casa",motion:"pulldown"},
 "afundo reverso":{id:"afundo_reverso_casa",motion:"lunge"},
 "elevacao lateral com garrafas":{id:"elevacao_lateral_garrafas_casa",motion:"press"},
 "ponte unilateral":{id:"ponte_unilateral_casa",motion:"bridge"},
 "step-up em cadeira firme":{id:"step_up_cadeira_casa",motion:"stepup"},
 "circuito funcional":{id:"circuito_funcional_casa",motion:"circuit"},
 "flexao de bracos":{id:"flexao_bracos_casa",motion:"pushup"},
 "agachamento com mochila":{id:"agachamento_mochila_casa",motion:"squat"},
 "flexao pike":{id:"flexao_pike_casa",motion:"pushup"},
 "flexao declinada":{id:"flexao_declinada_casa",motion:"pushup"},
 "agachamento unilateral assistido":{id:"agachamento_unilateral_assistido_casa",motion:"squat"},
 "mergulho em cadeira firme":{id:"mergulho_cadeira_casa",motion:"triceps"},
 "rosca com mochila":{id:"rosca_mochila_casa",motion:"curlarm"},
 "circuito metabolico":{id:"circuito_metabolico_casa",motion:"circuit"}
};
function exerciseSpec(name:string):ExerciseSpec{
 const key=normalizeExercise(name); const spec=EXERCISE_SPECS[key];
 if(!spec) throw new Error(`Exercício sem animação cadastrada: ${name}`);
 return spec;
}
function exerciseAnimation(name:string){return exerciseSpec(name).motion;}
function homeEquipment(name:string){
 const n=normalizeExercise(name);
 if(n.includes("circuito")) return "Peso corporal • sequência de 4 exercícios";
 if(n==="flexao inclinada") return "Mesa ou bancada firme";
 if(n==="flexao declinada") return "Cadeira firme para apoiar os pés";
 if(n==="agachamento unilateral assistido") return "Cadeira firme para apoio da mão";
 if(n.includes("mochila")) return "Mochila com livros ou garrafas";
 if(n.includes("remada")) return "Mochila ou garrafão com água";
 if(n.includes("cadeira")||n.includes("mergulho")||n.includes("step-up")||n.includes("bulgaro")) return "Cadeira firme / degrau";
 if(n.includes("garrafas")||n.includes("elevacao lateral")) return "2 garrafas com água";
 if(n.includes("elastico")||n.includes("pulldown")) return "Elástico preso em ponto seguro";
 return "Peso do próprio corpo";
}
function gymEquipment(type:string,name:string){
 const n=normalizeExercise(name);
 if(n==="agachamento livre") return "Rack + barra + anilhas";
 if(n==="rosca direta"||n==="remada curvada"||n==="stiff"||n==="stiff com barra"||n==="levantamento terra romeno"||n==="terra romeno") return "Barra + anilhas";
 if(n==="agachamento sumo") return "Halter ou kettlebell";
 if(n==="afundo") return "Halteres";
 if(n==="afundo bulgaro") return "Halteres + banco";
 if(n.includes("passada no smith")) return "Smith machine";
 if(n.includes("supino")) return n.includes("halter")?"Banco inclinado + halteres":n.includes("inclinado")?"Banco inclinado + barra":"Banco reto + barra";
 if(n.includes("crucifixo maquina")) return "Peck deck / crucifixo máquina";
 if(n.includes("crucifixo inverso")) return "Peck deck inverso";
 if(n==="desenvolvimento maquina") return "Máquina de desenvolvimento";
 if(n==="remada maquina") return "Máquina de remada";
 if(n.includes("halter")||n==="rosca alternada"||n==="rosca martelo"||n==="elevacao lateral"||n==="encolhimento") return "Halteres";
 if(n.includes("leg press")) return "Leg press";
 if(n.includes("hack")) return "Hack squat";
 if(n.includes("cadeira extensora")) return "Cadeira extensora";
 if(n.includes("mesa flexora")||n==="flexora") return "Mesa flexora";
 if(n.includes("abdutora")) return "Cadeira abdutora";
 if(n==="panturrilha sentada") return "Máquina de panturrilha sentada";
 if(n==="panturrilha em pe") return "Máquina / apoio para panturrilha em pé";
 if(n.includes("cabo")||n.includes("corda")||n.includes("puxada")||n.includes("remada baixa")||n.includes("abducao")) return "Polia / cabo";
 if(type==="bridge") return "Banco + barra / anilha";
 if(type==="stepup") return "Caixa / banco firme";
 if(n==="abdominal infra"||n==="prancha") return "Peso corporal / colchonete";
 return "Equipamento específico do exercício";
}
type Pt={x:number;y:number};
type BodyPose={head:Pt;ls:Pt;rs:Pt;lh:Pt;rh:Pt;le:Pt;re:Pt;lw:Pt;rw:Pt;lk:Pt;rk:Pt;la:Pt;ra:Pt;};
const P=(x:number,y:number):Pt=>({x,y});
function bodyPose(type:string,step:number,name:string=""):BodyPose{
 let p:BodyPose={head:P(110,35),ls:P(96,62),rs:P(124,62),lh:P(101,108),rh:P(119,108),le:P(82,91),re:P(138,91),lw:P(77,122),rw:P(143,122),lk:P(96,140),rk:P(124,140),la:P(92,172),ra:P(128,172)};
 const s=step;
 if(type==="squat"){
  const dy=[0,18,32][s]; p.head.y+=dy*.55;p.ls.y+=dy*.6;p.rs.y+=dy*.6;p.lh.y+=dy;p.rh.y+=dy;p.lk=P(82,138+dy*.55);p.rk=P(138,138+dy*.55);p.la=P(72,172);p.ra=P(148,172);p.le=P(78,86+dy*.55);p.re=P(142,86+dy*.55);p.lw=P(70,115+dy*.55);p.rw=P(150,115+dy*.55);
 }
 if(type==="lunge"){
  p.la=P(68,172);p.ra=P(153,172);p.lk=P(83,141+s*10);p.rk=P(136,135+s*15);p.lh.y+=s*17;p.rh.y+=s*17;p.head.y+=s*8;p.ls.y+=s*9;p.rs.y+=s*9;
 }
 if(type==="hinge"){
  const dx=[0,20,36][s];p.head=P(110+dx,35+s*15);p.ls=P(96+dx,62+s*12);p.rs=P(124+dx,62+s*12);p.lh=P(101,108);p.rh=P(119,108);p.le=P(88+dx,91+s*10);p.re=P(140+dx,91+s*10);p.lw=P(87+dx,124+s*5);p.rw=P(147+dx,124+s*5);
 }
 if(type==="press"){
  p.le=P(77,78-s*15);p.re=P(143,78-s*15);p.lw=P(76,62-s*25);p.rw=P(144,62-s*25);
 }
 if(type==="curlarm"){
  p.le=P(84,94);p.re=P(136,94);p.lw=P(78+s*12,126-s*34);p.rw=P(142-s*12,126-s*34);
 }
 if(type==="triceps"){
  p.le=P(91,82);p.re=P(129,82);p.lw=P(88,92+s*31);p.rw=P(132,92+s*31);
 }
 if(type==="pulldown"){
  p.lh=P(101,112);p.rh=P(119,112);p.lk=P(92,145);p.rk=P(128,145);p.la=P(84,173);p.ra=P(136,173);p.le=P(78,52+s*19);p.re=P(142,52+s*19);p.lw=P(72,28+s*41);p.rw=P(148,28+s*41);
 }
 if(type==="row"){
  p.head=P(126,48);p.ls=P(109,68);p.rs=P(135,72);p.lh=P(101,112);p.rh=P(119,112);p.le=P(91-s*3,91);p.re=P(148-s*13,91+s*5);p.lw=P(75,116);p.rw=P(168-s*26,112-s*4);
 }
 if(type==="calf"){
  const dy=[0,-5,-10][s];for(const k of ["head","ls","rs","lh","rh","le","re","lw","rw","lk","rk","la","ra"] as (keyof BodyPose)[])p[k].y+=dy;p.la.y=172;p.ra.y=172;p.la.x=94;p.ra.x=126;
 }
 if(type==="stepup"){
  p.la=P(78,172);p.ra=P(151,150-s*18);p.lk=P(94,140);p.rk=P(135,134-s*15);p.lh.y-=s*8;p.rh.y-=s*8;p.head.y-=s*10;p.ls.y-=s*9;p.rs.y-=s*9;
 }
 if(type==="abductor"){
  p.lh=P(101,108);p.rh=P(119,108);p.lk=P(95-s*15,140);p.rk=P(125+s*15,140);p.la=P(84-s*25,168);p.ra=P(136+s*25,168);
 }
 if(type==="extension"){
  p.lh=P(101,110);p.rh=P(119,110);p.lk=P(92,140);p.rk=P(128,140);p.la=P(90-s*7,170-s*22);p.ra=P(130+s*7,170-s*22);
 }
 if(type==="chest"){
  p={head:P(57,103),ls:P(79,97),rs:P(99,97),lh:P(124,103),rh:P(136,103),le:P(84,70-s*19),re:P(104,70-s*19),lw:P(84,48-s*13),rw:P(104,48-s*13),lk:P(157,128),rk:P(162,106),la:P(182,146),ra:P(183,116)};
 }
 if(type==="pushup"||type==="plank"){
  const down=type==="pushup"?[0,12,22][s]:4;p={head:P(54,93+down),ls:P(77,96+down),rs:P(91,97+down),lh:P(127,112),rh:P(138,113),le:P(77,126),re:P(91,127),lw:P(64,158),rw:P(80,158),lk:P(160,125),rk:P(168,126),la:P(190,145),ra:P(195,145)};
 }
 if(type==="bridge"){
  const up=[0,-16,-28][s];p={head:P(43,128),ls:P(67,127),rs:P(82,127),lh:P(119,126+up),rh:P(130,126+up),le:P(72,151),re:P(86,151),lw:P(59,163),rw:P(75,163),lk:P(158,142),rk:P(160,142),la:P(181,166),ra:P(193,166)};
 }
 if(type==="legcurl"){
  p={head:P(45,98),ls:P(67,103),rs:P(82,103),lh:P(119,110),rh:P(132,110),le:P(72,130),re:P(87,130),lw:P(62,151),rw:P(78,151),lk:P(157,116),rk:P(159,126),la:P(184-s*12,118-s*28),ra:P(190-s*13,129-s*28)};
 }
 if(type==="abs"){
  const up=[0,-8,-18][s];p={head:P(55,130+up),ls:P(77,126+up),rs:P(92,126+up),lh:P(125,137),rh:P(137,137),le:P(79,99+up),re:P(95,99+up),lw:P(61,91+up),rw:P(111,91+up),lk:P(159,143),rk:P(161,143),la:P(185,166),ra:P(195,166)};
 }
 if(type==="jumpingjack"){
  const open=[0,0.55,1][s];
  p.le=P(82-20*open,88-24*open);p.re=P(138+20*open,88-24*open);
  p.lw=P(78-28*open,122-70*open);p.rw=P(142+28*open,122-70*open);
  p.lk=P(97-12*open,140);p.rk=P(123+12*open,140);
  p.la=P(92-34*open,172);p.ra=P(128+34*open,172);
 }
 if(type==="circuit"){
  if(s===1){p.le=P(78,80);p.re=P(142,80);p.lw=P(67,57);p.rw=P(153,57);p.lk=P(88,142);p.rk=P(132,142);p.la=P(72,171);p.ra=P(148,171)}
 }
 // Refinos por exercício: cada nome do plano tem uma variação visual própria.
 const n=normalizeExercise(name);
 if(n.includes("supino inclinado")){ const lift=[0,-8,-18][s]; p.head=P(65,96);p.ls=P(82,88);p.rs=P(102,84);p.lh=P(124,105);p.rh=P(137,102);p.le=P(83,68+lift);p.re=P(105,65+lift);p.lw=P(77,49+lift);p.rw=P(111,46+lift); }
 if(n.includes("crucifixo maquina")){ const open=[0,14,27][s];p.le=P(78-open,78);p.re=P(142+open,78);p.lw=P(70-open,82);p.rw=P(150+open,82); }
 if(n.includes("crucifixo inverso")){ const open=[0,16,31][s];p.le=P(91-open,91);p.re=P(129+open,91);p.lw=P(88-open,116);p.rw=P(132+open,116); }
 if(n.includes("encolhimento")){ const up=[0,-6,-12][s];p.ls.y+=up;p.rs.y+=up;p.le=P(88,104+up);p.re=P(132,104+up);p.lw=P(82,137+up);p.rw=P(138,137+up); }
 if(n.includes("triceps testa")){p.le=P(88,61);p.re=P(112,61);p.lw=P(84,38+s*25);p.rw=P(116,38+s*25);}
 if(n.includes("triceps corda")){p.le=P(90,86);p.re=P(130,86);p.lw=P(92-s*9,96+s*28);p.rw=P(128+s*9,96+s*28);}
 if(n.includes("desenvolvimento maquina")){p.le=P(82,78-s*12);p.re=P(138,78-s*12);p.lw=P(82,64-s*23);p.rw=P(138,64-s*23);}
 if(n.includes("elevacao lateral")){const out=[8,24,43][s];p.le=P(94-out,91-s*7);p.re=P(126+out,91-s*7);p.lw=P(92-out*1.45,122-s*17);p.rw=P(128+out*1.45,122-s*17);}
 if(n.includes("remada curvada")){const dx=[18,27,36][s];p.head=P(120+dx,50);p.ls=P(101+dx,70);p.rs=P(127+dx,73);p.le=P(92+dx,95);p.re=P(140+dx,95);p.lw=P(85+dx,126-s*17);p.rw=P(148+dx,126-s*17);}
 if(n.includes("remada baixa")){p.head=P(110,50);p.ls=P(96,70);p.rs=P(124,70);p.lh=P(101,114);p.rh=P(119,114);p.le=P(84+s*8,91);p.re=P(136-s*8,91);p.lw=P(66+s*24,108);p.rw=P(154-s*24,108);}
 if(n.includes("remada unilateral")){p.head=P(125,49);p.ls=P(105,69);p.rs=P(134,72);p.le=P(91,103);p.lw=P(72,128);p.re=P(148-s*12,94);p.rw=P(165-s*28,126-s*10);}
 if(n.includes("rosca alternada")){p.lw=P(78+s*14,126-s*35);p.rw=P(142,126);}
 if(n.includes("rosca martelo")){p.lw=P(82+s*9,126-s*32);p.rw=P(138-s*9,126-s*32);}
 if(n.includes("agachamento sumo")){p.la=P(58,172);p.ra=P(162,172);p.lk=P(76,138+s*10);p.rk=P(144,138+s*10);}
 if(n.includes("hack")){p.head.x+=18;p.ls.x+=15;p.rs.x+=15;p.lh.x+=8;p.rh.x+=8;p.la=P(78,172);p.ra=P(145,172);}
 if(n.includes("leg press")){p.head=P(70,118);p.ls=P(87,110);p.rs=P(103,105);p.lh=P(119,119);p.rh=P(130,116);p.lk=P(142-s*12,110-s*13);p.rk=P(150-s*12,105-s*13);p.la=P(177,75);p.ra=P(188,69);}
 if(n.includes("panturrilha sentada")){p.head=P(105,58);p.lh=P(101,115);p.rh=P(119,115);p.lk=P(88,143);p.rk=P(132,143);p.la=P(82,169-s*7);p.ra=P(138,169-s*7);}
 if(n.includes("coice")){p.head=P(120,52);p.ls=P(102,72);p.rs=P(132,74);p.lh=P(105,112);p.rh=P(123,112);p.lk=P(96,143);p.rk=P(138-s*7,139-s*9);p.la=P(90,172);p.ra=P(156+s*13,163-s*18);}
 if(n.includes("abducao no cabo")){p.lk=P(96,140);p.rk=P(124+s*12,140);p.la=P(92,172);p.ra=P(128+s*28,169-s*4);}
 if(n.includes("elevacao pelvica unilateral")){p.lk=P(154,142);p.rk=P(154,142);p.la=P(181,166);p.ra=P(172+s*7,132-s*20);}
 if(n.includes("pike")){p.head=P(82,118-s*10);p.ls=P(99,112-s*8);p.rs=P(112,112-s*8);p.lh=P(140,82);p.rh=P(150,82);p.lk=P(132,136);p.rk=P(145,136);p.la=P(171,165);p.ra=P(185,165);p.lw=P(76,158);p.rw=P(91,158);}
 if(n.includes("flexao inclinada")){p.head.y-=18;p.ls.y-=18;p.rs.y-=18;p.le.y-=8;p.re.y-=8;p.lw=P(72,120);p.rw=P(87,120);}
 if(n.includes("flexao declinada")){p.la=P(190,116);p.ra=P(198,116);p.lk=P(162,112);p.rk=P(171,112);}
 if(n.includes("agachamento unilateral")){p.lk=P(91,140+s*10);p.la=P(78,172);p.rk=P(132+s*13,135-s*8);p.ra=P(155+s*20,154-s*20);}
 if(n==="supino reto"){p.head=P(57,103);p.ls=P(79,97);p.rs=P(99,97);p.lw=P(84,55-s*16);p.rw=P(104,55-s*16);}
 if(n==="supino inclinado"){const lift=[0,-7,-16][s];p.head=P(64,98);p.ls=P(82,90);p.rs=P(103,86);p.lh=P(125,106);p.rh=P(138,103);p.lw=P(78,53+lift);p.rw=P(112,49+lift);}
 if(n==="agachamento livre"){p.lw=P(72,74+s*4);p.rw=P(148,74+s*4);p.le=P(82,72+s*4);p.re=P(138,72+s*4);}
 if(n==="agachamento lento"){p.lk.y+=s*5;p.rk.y+=s*5;p.head.y+=s*4;}
 if(n==="agachamento com mochila"){p.lw=P(92,92);p.rw=P(128,92);p.le=P(91,76);p.re=P(129,76);}
 if(n==="afundo reverso"){p.la=P(78,172);p.ra=P(155+s*12,172);p.lk=P(92,140+s*7);p.rk=P(135+s*8,139+s*5);}
 if(n==="afundo bulgaro"||n==="agachamento bulgaro"){p.ra=P(177,144);p.rk=P(145,130+s*12);p.la=P(72,172);p.lk=P(90,139+s*12);}
 if(n==="passada no smith"){p.lw=P(74,78);p.rw=P(146,78);p.le=P(84,77);p.re=P(136,77);}
 if(n==="stiff"||n==="stiff com barra"){p.lw.y=127-s*3;p.rw.y=127-s*3;}
 if(n==="stiff com mochila"){p.lw=P(101,123+s*2);p.rw=P(119,123+s*2);}
 if(n==="levantamento terra romeno"||n==="terra romeno"){p.lk.x=94;p.rk.x=126;p.lw.y=132-s*5;p.rw.y=132-s*5;}
 if(n==="hip thrust"){p.lh.y-=s*31;p.rh.y-=s*31;p.lk=P(158,141);p.rk=P(160,141);}
 if(n==="elevacao pelvica"){p.lh.y-=s*25;p.rh.y-=s*25;}
 if(n==="ponte de gluteos"){p.lh.y-=s*22;p.rh.y-=s*22;p.lw=P(60,162);p.rw=P(76,162);}
 if(n==="ponte unilateral"){p.lh.y-=s*24;p.rh.y-=s*24;p.ra=P(168,135-s*24);}
 if(n==="abdutora inclinada"){p.head=P(122,52);p.ls=P(103,71);p.rs=P(132,73);p.lk=P(92-s*17,141);p.rk=P(128+s*17,141);}
 if(n==="cadeira abdutora"){p.head=P(110,50);p.lh=P(101,113);p.rh=P(119,113);}
 if(n==="puxada frontal"){p.lw=P(72,27+s*42);p.rw=P(148,27+s*42);}
 if(n==="barra fixa"){p.lw=P(69,22);p.rw=P(151,22);p.le=P(76+s*7,50+s*18);p.re=P(144-s*7,50+s*18);p.lh.y=113-s*8;p.rh.y=113-s*8;}
 if(n==="remada maquina"){p.head=P(108,55);p.ls=P(94,73);p.rs=P(122,73);p.lw=P(70+s*24,108);p.rw=P(150-s*24,108);}
 if(n==="rosca direta"){p.lw=P(80+s*10,126-s*35);p.rw=P(140-s*10,126-s*35);}
 if(n==="rosca com mochila"){p.lw=P(98,126-s*32);p.rw=P(122,126-s*32);}
 if(n==="desenvolvimento halteres"){p.lw=P(76,64-s*26);p.rw=P(144,64-s*26);p.le=P(78,82-s*14);p.re=P(142,82-s*14);}
 if(n==="crucifixo inverso"){p.head.x=126;p.ls.x=109;p.rs.x=135;p.lh.x=103;p.rh.x=121;}
 if(n==="panturrilha em pe"){p.la=P(91,172-s*8);p.ra=P(129,172-s*8);}
 // Refinamento final: movimentos antes marcados como parciais.
 if(n==="rosca martelo"){const bend=[0,20,38][s];p.le=P(84,94);p.re=P(136,94);p.lw=P(82,126-bend);p.rw=P(138,126-bend);}
 if(n==="encolhimento"){const rise=[0,-9,-18][s];p.ls=P(96,62+rise);p.rs=P(124,62+rise);p.le=P(84,100+rise);p.re=P(136,100+rise);p.lw=P(80,136+rise);p.rw=P(140,136+rise);}
 if(n==="panturrilha em pe"){const rise=[0,9,18][s];p.head.y-=rise;p.ls.y-=rise;p.rs.y-=rise;p.lh.y-=rise;p.rh.y-=rise;p.le.y-=rise;p.re.y-=rise;p.lw.y-=rise;p.rw.y-=rise;p.lk.y-=rise;p.rk.y-=rise;p.la=P(91,172-rise);p.ra=P(129,172-rise);}
 if(n==="abdutora inclinada"){const spread=[0,18,35][s];p.head=P(135,58);p.ls=P(111,74);p.rs=P(139,79);p.lh=P(104,116);p.rh=P(124,119);p.lk=P(94-spread*.45,142);p.rk=P(130+spread*.45,143);p.la=P(82-spread,169);p.ra=P(143+spread,169);}
 if(n==="ponte unilateral"){const lift=[0,18,34][s];p.lh=P(119,126-lift);p.rh=P(130,126-lift);p.lk=P(158,142-lift*.35);p.la=P(181,166);p.rk=P(150,132-lift*.45);p.ra=P(157,100-lift*.65);}
 if(n==="flexao pike"){const down=[0,13,25][s];p.head=P(79,116+down);p.ls=P(99,109+down*.55);p.rs=P(113,110+down*.55);p.lh=P(143,82);p.rh=P(153,82);p.le=P(82,132+down*.45);p.re=P(98,132+down*.45);p.lw=P(70,158);p.rw=P(88,158);p.lk=P(143,128);p.rk=P(156,128);p.la=P(174,164);p.ra=P(188,164);}
 if(n==="afundo"){const drop=[0,13,25][s];p.head.y+=drop*.35;p.ls.y+=drop*.45;p.rs.y+=drop*.45;p.lh.y+=drop*.7;p.rh.y+=drop*.7;p.la=P(67,172);p.ra=P(155,172);p.lk=P(84,139+drop);p.rk=P(136,138+drop*.75);}
 if(n==="elevacao pelvica unilateral"){const lift=[0,18,34][s];p.lh=P(119,126-lift);p.rh=P(130,126-lift);p.lk=P(158,142-lift*.35);p.la=P(181,166);p.rk=P(151,132-lift*.5);p.ra=P(158,101-lift*.7);}
 if(n==="remada unilateral"){const pull=[0,18,34][s];p.head=P(123,50);p.ls=P(103,70);p.rs=P(132,73);p.lh=P(102,112);p.rh=P(121,112);p.le=P(77,105);p.lw=P(58,130);p.re=P(148-pull*.35,96);p.rw=P(169-pull,130-pull*.45);p.lk=P(96,145);p.la=P(88,172);p.rk=P(139,142);p.ra=P(159,164);}
 if(n==="step-up em cadeira firme"){p.ra=P(170,137-s*17);p.rk=P(140,129-s*14);}
 if(n==="mergulho em cadeira firme"){const down=[0,11,20][s];p.head.y+=down;p.ls.y+=down;p.rs.y+=down;p.lh.y+=down;p.rh.y+=down;p.le=P(80,113+down);p.re=P(140,113+down);p.lw=P(70,134);p.rw=P(150,134);p.lk=P(153,145);p.rk=P(160,145);}
 // Correções biomecânicas individuais após a pose-base.
 if(n==="triceps testa"){const bend=[0,23,42][s];p={head:P(55,105),ls:P(78,99),rs:P(96,99),lh:P(123,108),rh:P(136,108),le:P(82,72),re:P(103,72),lw:P(78,48+bend),rw:P(108,48+bend),lk:P(157,132),rk:P(161,111),la:P(181,153),ra:P(183,122)};}
 if(n==="cadeira extensora"){const ext=[0,20,38][s];p={head:P(108,52),ls:P(94,73),rs:P(122,73),lh:P(98,112),rh:P(118,112),le:P(84,98),re:P(132,98),lw:P(80,122),rw:P(136,122),lk:P(91,142),rk:P(126,142),la:P(88-ext,169-ext*.35),ra:P(130+ext,169-ext*.35)};}
 if(n==="panturrilha sentada"){const rise=[0,5,10][s];p={head:P(109,55),ls:P(95,76),rs:P(123,76),lh:P(99,114),rh:P(119,114),le:P(84,99),re:P(134,99),lw:P(81,124),rw:P(138,124),lk:P(88,143),rk:P(132,143),la:P(81,170-rise),ra:P(139,170-rise)};}
 if(n==="abdominal infra"){const lift=[0,31,60][s];p={head:P(52,135-lift*.08),ls:P(75,130),rs:P(91,130),lh:P(121,137),rh:P(135,137),le:P(77,151),re:P(94,151),lw:P(62,162),rw:P(79,162),lk:P(158-lift*.15,145-lift*.35),rk:P(162-lift*.15,145-lift*.35),la:P(188-lift*.55,165-lift),ra:P(199-lift*.55,165-lift)};}
 if(n==="remada unilateral"){p.head=P(124,50);p.ls=P(104,70);p.rs=P(132,73);p.lh=P(102,112);p.rh=P(121,112);p.le=P(82,104);p.lw=P(63,132);p.re=P(147-s*10,94);p.rw=P(165-s*28,127-s*13);p.lk=P(96,145);p.la=P(88,172);p.rk=P(139,142);p.ra=P(159,164);}
 if(n==="remada maquina"){p.head=P(109,57);p.ls=P(95,76);p.rs=P(123,76);p.lh=P(100,115);p.rh=P(120,115);p.le=P(84+s*7,94);p.re=P(136-s*7,94);p.lw=P(66+s*25,108);p.rw=P(154-s*25,108);p.lk=P(92,143);p.rk=P(128,143);p.la=P(84,171);p.ra=P(136,171);}
 if(n==="crucifixo maquina"){p.head=P(110,53);p.ls=P(96,73);p.rs=P(124,73);p.lh=P(101,112);p.rh=P(119,112);const close=[0,18,36][s];p.le=P(76+close*.5,88);p.re=P(144-close*.5,88);p.lw=P(62+close,90);p.rw=P(158-close,90);p.lk=P(92,143);p.rk=P(128,143);p.la=P(84,171);p.ra=P(136,171);}
 if(n==="crucifixo inverso"){p.head=P(122,58);p.ls=P(106,77);p.rs=P(134,79);p.lh=P(104,116);p.rh=P(122,116);const open=[0,18,38][s];p.le=P(99-open*.5,92);p.re=P(141+open*.5,92);p.lw=P(92-open,112);p.rw=P(148+open,112);p.lk=P(95,145);p.rk=P(131,145);p.la=P(87,171);p.ra=P(139,171);}
 if(n==="desenvolvimento maquina"){p.head=P(110,52);p.ls=P(96,73);p.rs=P(124,73);p.lh=P(101,113);p.rh=P(119,113);p.le=P(82,83-s*14);p.re=P(138,83-s*14);p.lw=P(82,66-s*26);p.rw=P(138,66-s*26);p.lk=P(92,143);p.rk=P(128,143);p.la=P(84,171);p.ra=P(136,171);}
 if(n==="afundo bulgaro"||n==="agachamento bulgaro"){const down=[0,12,24][s];p.head=P(106,43+down*.45);p.ls=P(93,64+down*.5);p.rs=P(121,64+down*.5);p.lh=P(99,108+down);p.rh=P(118,108+down);p.lk=P(86,139+down*.45);p.la=P(69,172);p.rk=P(143,129+down*.25);p.ra=P(178,143);p.le=P(80,93+down*.5);p.re=P(134,93+down*.5);p.lw=P(76,125+down*.5);p.rw=P(138,125+down*.5);}
 if(n==="flexao declinada"){const down=[0,10,20][s];p.head=P(58,95+down);p.ls=P(80,98+down);p.rs=P(94,99+down);p.lh=P(130,112);p.rh=P(142,113);p.le=P(78,128);p.re=P(93,129);p.lw=P(64,158);p.rw=P(80,158);p.lk=P(164,112);p.rk=P(173,112);p.la=P(188,108);p.ra=P(199,108);}
 if(n==="agachamento unilateral assistido"){const down=[0,15,29][s];p.head=P(105,38+down*.55);p.ls=P(92,60+down*.6);p.rs=P(120,60+down*.6);p.lh=P(98,107+down);p.rh=P(116,107+down);p.lk=P(88,139+down*.45);p.la=P(76,171);p.rk=P(132,136-down*.2);p.ra=P(157,151-down*.55);p.le=P(80,89+down*.6);p.re=P(135,90+down*.4);p.lw=P(76,120+down*.6);p.rw=P(151,120);}
 return p;
}
function limb(a:Pt,b:Pt,w:number,fill:string){return <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={fill} strokeWidth={w} strokeLinecap="round"/>}
function EquipmentScene({type,step,home,name}:{type:string;step:number;home:boolean;name:string}){
 const n=normalizeExercise(name); const p=bodyPose(type,step,name);
 const mx=(p.lw.x+p.rw.x)/2, my=(p.lw.y+p.rw.y)/2;
 const Barbell=({shoulders=false}:{shoulders?:boolean})=>{
  const y=shoulders?(p.ls.y+p.rs.y)/2+4:my;
  const x1=shoulders?Math.min(p.ls.x,p.rs.x)-34:Math.min(p.lw.x,p.rw.x)-28;
  const x2=shoulders?Math.max(p.ls.x,p.rs.x)+34:Math.max(p.lw.x,p.rw.x)+28;
  return <g className="gym-object"><line x1={x1} y1={y} x2={x2} y2={y} strokeWidth="5"/><circle cx={x1-5} cy={y} r="9"/><circle cx={x2+5} cy={y} r="9"/></g>;
 };
 const Dumbbells=()=> <g className="gym-dumbbells">{[p.lw,p.rw].map((q,i)=><g key={i} transform={`translate(${q.x-9} ${q.y-8})`}><rect x="0" y="6" width="18" height="5" rx="2"/><rect x="-3" y="1" width="5" height="15" rx="2"/><rect x="19" y="1" width="5" height="15" rx="2"/></g>)}</g>;
 const Chair=({x=150,y=120,w=55}:{x?:number;y?:number;w?:number})=> <g className="home-object"><rect x={x} y={y} width={w} height="11" rx="4"/><rect x={x+7} y={y+11} width="7" height="39" rx="3"/><rect x={x+w-14} y={y+11} width="7" height="39" rx="3"/></g>;
 const Bench=({incline=false}:{incline?:boolean})=> incline?<g className="gym-object"><line x1="48" y1="132" x2="118" y2="105" strokeWidth="11" strokeLinecap="round"/><rect x="111" y="119" width="45" height="10" rx="4"/><rect x="57" y="134" width="7" height="32"/><rect x="141" y="129" width="7" height="37"/></g>:<g className="gym-object"><rect x="42" y="130" width="114" height="10" rx="5"/><rect x="55" y="140" width="7" height="28"/><rect x="140" y="140" width="7" height="28"/></g>;

 if(home){
  if(n==="flexao inclinada") return <g><rect className="home-object" x="34" y="116" width="69" height="11" rx="4"/><rect className="home-object" x="41" y="127" width="7" height="42"/><rect className="home-object" x="88" y="127" width="7" height="42"/></g>;
  if(n==="flexao declinada") return <Chair x={166} y={108} w={42}/>;
  if(n==="agachamento bulgaro"||n==="step-up em cadeira firme"||n==="mergulho em cadeira firme") return <Chair/>;
  if(n==="agachamento unilateral assistido") return <g><Chair x={152} y={120} w={48}/><line className="home-object" x1={p.rw.x} y1={p.rw.y} x2="153" y2="121" strokeWidth="4"/></g>;
  if(n==="pulldown com elastico") return <g className="home-elastic"><circle cx="110" cy="18" r="5"/><line x1="110" y1="23" x2={p.lw.x} y2={p.lw.y} strokeWidth="4"/><line x1="110" y1="23" x2={p.rw.x} y2={p.rw.y} strokeWidth="4"/></g>;
  if(n==="elevacao lateral com garrafas") return <g className="home-bottles">{[p.lw,p.rw].map((q,i)=><g key={i} transform={`translate(${q.x-6} ${q.y-16})`}><rect x="0" y="6" width="12" height="28" rx="5"/><rect x="3" y="0" width="6" height="8" rx="2"/></g>)}</g>;
  if(n==="agachamento com mochila") return <g className="home-object"><path d={`M${p.ls.x-6} ${p.ls.y+3} Q${(p.ls.x+p.rs.x)/2} ${p.ls.y-5} ${p.rs.x+7} ${p.rs.y+3} L${p.rs.x+9} ${p.rh.y-5} Q${mx} ${p.rh.y+8} ${p.ls.x-10} ${p.lh.y-5}Z`}/></g>;
  if(n==="remada com mochila"||n==="stiff com mochila"||n==="rosca com mochila") return <g className="home-object"><path d={`M${mx-15} ${my-10} Q${mx} ${my-22} ${mx+15} ${my-10} L${mx+18} ${my+20} Q${mx} ${my+28} ${mx-18} ${my+20}Z`}/><line x1={p.lw.x} y1={p.lw.y} x2={mx-8} y2={my-8} strokeWidth="4"/><line x1={p.rw.x} y1={p.rw.y} x2={mx+8} y2={my-8} strokeWidth="4"/></g>;
  return null;
 }

 // Supinos: banco e implemento devem acompanhar o nome exato.
 if(n==="supino reto") return <g><Bench/><Barbell/></g>;
 if(n==="supino inclinado") return <g><Bench incline/><Barbell/></g>;
 if(n==="supino inclinado halteres") return <g><Bench incline/><Dumbbells/></g>;

 if(n==="crucifixo maquina") return <g className="gym-object"><rect x="95" y="112" width="36" height="10" rx="4"/><rect x="108" y="122" width="8" height="43"/><rect x="88" y="71" width="7" height="44" rx="3"/><rect x="132" y="71" width="7" height="44" rx="3"/><line x1="91" y1="77" x2={p.lw.x} y2={p.lw.y} strokeWidth="5"/><line x1="136" y1="77" x2={p.rw.x} y2={p.rw.y} strokeWidth="5"/></g>;
 if(n==="crucifixo inverso") return <g className="gym-object"><rect x="94" y="116" width="38" height="10" rx="4"/><rect x="109" y="126" width="8" height="39"/><rect x="84" y="70" width="7" height="47"/><rect x="139" y="70" width="7" height="47"/><line x1="88" y1="77" x2={p.lw.x} y2={p.lw.y} strokeWidth="5"/><line x1="143" y1="77" x2={p.rw.x} y2={p.rw.y} strokeWidth="5"/></g>;
 if(n==="desenvolvimento maquina") return <g className="gym-object"><rect x="95" y="118" width="35" height="10" rx="4"/><rect x="108" y="128" width="8" height="38"/><line x1="82" y1="130" x2="82" y2="50" strokeWidth="6"/><line x1="138" y1="130" x2="138" y2="50" strokeWidth="6"/><line x1="82" y1="55" x2={p.lw.x} y2={p.lw.y} strokeWidth="4"/><line x1="138" y1="55" x2={p.rw.x} y2={p.rw.y} strokeWidth="4"/></g>;
 if(n==="remada maquina") return <g className="gym-object"><rect x="75" y="123" width="43" height="10" rx="4"/><rect x="88" y="133" width="8" height="33"/><rect x="154" y="55" width="9" height="111" rx="3"/><line x1="158" y1="82" x2={p.lw.x} y2={p.lw.y} strokeWidth="3"/><line x1="158" y1="82" x2={p.rw.x} y2={p.rw.y} strokeWidth="3"/></g>;
 if(n==="cadeira abdutora"||n==="abdutora inclinada") return <g className="gym-object">{n==="abdutora inclinada"&&<line x1="93" y1="112" x2="126" y2="78" strokeWidth="11" strokeLinecap="round"/>}<rect x="88" y="112" width="48" height="11" rx="4"/><rect x="97" y="123" width="8" height="42"/><rect x="126" y="123" width="8" height="42"/><rect x="80" y="132" width="12" height="28" rx="5"/><rect x="142" y="132" width="12" height="28" rx="5"/></g>;
 if(n==="cadeira extensora") return <g className="gym-object"><rect x="75" y="111" width="56" height="11" rx="4"/><rect x="82" y="73" width="11" height="42" rx="4"/><rect x="93" y="122" width="8" height="43"/><circle cx={(p.la.x+p.ra.x)/2+8} cy={(p.la.y+p.ra.y)/2} r="11"/></g>;
 if(n==="mesa flexora"||n==="flexora") return <g className="gym-object"><rect x="55" y="113" width="108" height="10" rx="4"/><rect x="70" y="123" width="8" height="42"/><rect x="143" y="123" width="8" height="42"/><circle cx={(p.la.x+p.ra.x)/2} cy={(p.la.y+p.ra.y)/2} r="10"/></g>;
 if(n.includes("leg press")) return <g className="gym-object"><path d="M151 43 L202 111 L188 122 L137 54Z"/><rect x="155" y="50" width="42" height="14" rx="4"/><line x1="145" y1="57" x2="191" y2="122" strokeWidth="5"/><rect x="61" y="116" width="55" height="10" rx="4"/></g>;
 if(n.includes("hack")) return <g className="gym-object"><line x1="66" y1="35" x2="66" y2="169" strokeWidth="6"/><line x1="157" y1="35" x2="157" y2="169" strokeWidth="6"/><line x1="77" y1="54" x2="146" y2="54" strokeWidth="8"/><rect x="76" y="154" width="70" height="9" rx="4"/></g>;
 if(n==="passada no smith") return <g className="gym-object"><line x1="52" y1="25" x2="52" y2="170" strokeWidth="6"/><line x1="168" y1="25" x2="168" y2="170" strokeWidth="6"/><line x1="56" y1={(p.ls.y+p.rs.y)/2+3} x2="164" y2={(p.ls.y+p.rs.y)/2+3} strokeWidth="6"/></g>;
 if(n==="puxada frontal") return <g className="gym-object"><rect x="178" y="22" width="8" height="146" rx="3"/><rect x="150" y="22" width="55" height="8" rx="3"/><circle cx="182" cy="40" r="7"/><line x1="182" y1="47" x2={mx} y2={my} strokeWidth="2"/><line x1={p.lw.x-10} y1={p.lw.y} x2={p.rw.x+10} y2={p.rw.y} strokeWidth="5"/></g>;
 if(n==="barra fixa") return <g className="gym-object"><line x1="52" y1="21" x2="168" y2="21" strokeWidth="7"/><line x1="62" y1="21" x2="62" y2="8" strokeWidth="5"/><line x1="158" y1="21" x2="158" y2="8" strokeWidth="5"/></g>;
 if(n==="remada baixa") return <g className="gym-object"><rect x="67" y="139" width="54" height="9" rx="4"/><rect x="171" y="61" width="8" height="104"/><line x1="175" y1="87" x2={mx} y2={my} strokeWidth="3"/><line x1={p.lw.x} y1={p.lw.y} x2={p.rw.x} y2={p.rw.y} strokeWidth="5"/></g>;
 if(n==="remada unilateral") return <g><Bench/><g className="gym-dumbbells" transform={`translate(${p.rw.x-9} ${p.rw.y-8})`}><rect x="0" y="6" width="18" height="5" rx="2"/><rect x="-3" y="1" width="5" height="15" rx="2"/><rect x="19" y="1" width="5" height="15" rx="2"/></g><line className="gym-object" x1={p.lw.x} y1={p.lw.y} x2="105" y2="130" strokeWidth="4"/></g>;
 if(n==="remada curvada") return <Barbell/>;
 if(n==="rosca direta") return <Barbell/>;
 if(n==="rosca martelo") return <g className="gym-dumbbells">{[p.lw,p.rw].map((q,i)=><g key={i} transform={`translate(${q.x-5} ${q.y-12})`}><rect x="3" y="0" width="5" height="24" rx="2"/><rect x="0" y="-3" width="11" height="5" rx="2"/><rect x="0" y="22" width="11" height="5" rx="2"/></g>)}</g>;
 if(n==="rosca alternada"||n==="desenvolvimento halteres"||n==="elevacao lateral"||n==="encolhimento") return <Dumbbells/>;
 if(n==="triceps testa") return <g><Bench/><Barbell/></g>;
 if(n==="triceps corda") return <g className="gym-object"><rect x="177" y="22" width="8" height="146" rx="3"/><circle cx="181" cy="47" r="7"/><line x1="181" y1="54" x2={mx} y2={my} strokeWidth="2"/><line x1={mx} y1={my} x2={p.lw.x} y2={p.lw.y} strokeWidth="4"/><line x1={mx} y1={my} x2={p.rw.x} y2={p.rw.y} strokeWidth="4"/></g>;
 if(n==="coice no cabo"||n==="abducao no cabo") return <g className="gym-object"><rect x="177" y="25" width="8" height="142" rx="3"/><circle cx="181" cy="144" r="7"/><line x1="181" y1="144" x2={p.ra.x} y2={p.ra.y-3} strokeWidth="3"/><circle cx={p.ra.x} cy={p.ra.y-3} r="4"/></g>;
 if(n==="agachamento livre") return <Barbell shoulders/>;
 if(n==="stiff"||n==="stiff com barra"||n==="levantamento terra romeno"||n==="terra romeno") return <Barbell/>;
 if(n==="agachamento sumo") return <g className="gym-object"><line x1={mx} y1={my-8} x2={mx} y2={my+14} strokeWidth="5"/><circle cx={mx} cy={my+19} r="10"/></g>;
 if(n==="afundo"||n==="afundo bulgaro") return <g>{n==="afundo bulgaro"&&<Bench/>}<Dumbbells/></g>;
 if(n==="panturrilha sentada") return <g className="gym-object"><rect x="83" y="116" width="55" height="10" rx="4"/><rect x="97" y="126" width="8" height="38"/><rect x="84" y="134" width="54" height="9" rx="4"/><rect x="78" y="164" width="72" height="7" rx="3"/></g>;
 if(n==="panturrilha em pe") return <g className="gym-object"><rect x="72" y="168" width="76" height="6" rx="3"/><line x1="82" y1="42" x2="82" y2="168" strokeWidth="6"/><line x1="138" y1="42" x2="138" y2="168" strokeWidth="6"/></g>;
 if(n==="elevacao pelvica"||n==="hip thrust") return <g><Bench/><Barbell/></g>;
 if(n==="elevacao pelvica unilateral") return <Bench/>;
 if(n==="step-up") return <g className="gym-object"><rect x="145" y="138" width="58" height="30" rx="4"/></g>;
 if(n==="abdominal infra"||n==="prancha") return null;
 return null;
}

function Pose({type,step,home,name,gender}:{type:string;step:number;home:boolean;name:string;gender:Gender}){
 const p=bodyPose(type,step,name); const skin=`url(#skin-${type}-${step})`; const shirt=`url(#shirt-${type}-${step})`; const shorts=`url(#shorts-${type}-${step})`;
 return <svg viewBox="0 0 220 190" className="pose-svg realistic-pose" role="img" aria-label={`${name}, ${step===0?'posição inicial':step===1?'movimento':'posição final'}`}>
  <defs>
   <linearGradient id={`skin-${type}-${step}`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#f2c9a6"/><stop offset=".48" stopColor="#d49a73"/><stop offset="1" stopColor="#a96f50"/></linearGradient>
   <linearGradient id={`shirt-${type}-${step}`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#1e2b24"/><stop offset=".45" stopColor="#101713"/><stop offset="1" stopColor="#050806"/></linearGradient>
   <linearGradient id={`shorts-${type}-${step}`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#252b28"/><stop offset="1" stopColor="#080a09"/></linearGradient>
   <filter id={`shadow-${type}-${step}`}><feDropShadow dx="0" dy="3" stdDeviation="2.5" floodOpacity=".45"/></filter>
  </defs>
  <ellipse cx="110" cy="176" rx="73" ry="7" fill="#000" opacity=".35"/>
  <EquipmentScene type={type} step={step} home={home} name={name}/>
  <g filter={`url(#shadow-${type}-${step})`}>
   {limb(p.lh,p.lk,gender==="homem"?16:14,skin)}{limb(p.rh,p.rk,gender==="homem"?16:14,skin)}
   {limb(p.lk,p.la,gender==="homem"?14:12,skin)}{limb(p.rk,p.ra,gender==="homem"?14:12,skin)}
   <path d={`M${p.ls.x},${p.ls.y} Q${p.head.x},${p.ls.y-7} ${p.rs.x},${p.rs.y} L${p.rh.x},${p.rh.y} Q${p.head.x},${p.rh.y+8} ${p.lh.x},${p.lh.y} Z`} fill={shirt}/>
   <path d={`M${p.lh.x-3},${p.lh.y-3} L${p.rh.x+3},${p.rh.y-3} L${p.rk.x-3},${Math.min(p.rk.y,p.lk.y)-8} Q${p.head.x},${Math.min(p.rk.y,p.lk.y)+3} ${p.lk.x+3},${p.lk.y-8} Z`} fill={shorts} opacity=".96"/>
   {limb(p.ls,p.le,gender==="homem"?14:12,skin)}{limb(p.rs,p.re,gender==="homem"?14:12,skin)}
   {limb(p.le,p.lw,gender==="homem"?12:10,skin)}{limb(p.re,p.rw,gender==="homem"?12:10,skin)}
   <circle cx={p.lw.x} cy={p.lw.y} r="6" fill={skin}/><circle cx={p.rw.x} cy={p.rw.y} r="6" fill={skin}/>
   <circle cx={p.head.x} cy={p.head.y} r={gender==="homem"?16:15} fill={skin}/>
   <path d={`M${p.head.x-14},${p.head.y-5} Q${p.head.x},${p.head.y-22} ${p.head.x+14},${p.head.y-5} Q${p.head.x+7},${p.head.y-14} ${p.head.x-10},${p.head.y-9}Z`} fill={gender==="homem"?"#21170f":"#392419"}/>
   {gender==="mulher"&&<path d={`M${p.head.x+12},${p.head.y-3} Q${p.head.x+24},${p.head.y+8} ${p.head.x+12},${p.head.y+28}`} fill="none" stroke="#392419" strokeWidth="8" strokeLinecap="round"/>}
   <circle cx={p.head.x-5} cy={p.head.y+1} r="1.5" fill="#2a201a"/><circle cx={p.head.x+5} cy={p.head.y+1} r="1.5" fill="#2a201a"/><path d={`M${p.head.x-4},${p.head.y+8} Q${p.head.x},${p.head.y+11} ${p.head.x+4},${p.head.y+8}`} fill="none" stroke="#8e5948" strokeWidth="1.4"/>
   <g fill="#e7ece9"><path d={`M${p.la.x-10},${p.la.y-2} q12 1 17 0 l7 6 q-14 6-25 0z`}/><path d={`M${p.ra.x-10},${p.ra.y-2} q12 1 17 0 l7 6 q-14 6-25 0z`}/></g>
   <path d={`M${p.ls.x+4},${p.ls.y+7} Q${p.head.x},${(p.ls.y+p.lh.y)/2} ${p.rh.x-4},${p.rh.y-10}`} fill="none" stroke="#54d775" strokeWidth="3" opacity=".8"/>
  </g>
  <g className="motion-direction"><path d={step===0?"M24 95 H48":step===1?"M24 80 H48":"M24 65 H48"}/><path d={step===0?"M43 89 L50 95 L43 101":step===1?"M43 74 L50 80 L43 86":"M43 59 L50 65 L43 71"}/></g>
 </svg>
}
type DemoAsset={kind:"video"|"images";base:string;start:string;end:string};
function demoAsset(name:string,type:string,home:boolean):DemoAsset{
 const n=normalizeExercise(name);
 const images=(base:string):DemoAsset=>({kind:"images",base,start:`/demo/${base}_0.jpg`,end:`/demo/${base}_1.jpg`});
 const video=(base:string):DemoAsset=>({kind:"video",base,start:`/demo/${base}_0.jpg`,end:`/demo/${base}_1.jpg`});
 if(home){
  if(n.includes("mergulho")) return images("dips");
  if(n.includes("step-up")) return images("stepup");
  if(n.includes("prancha")) return images("plank");
  if(n.includes("flexao")) return images("pushup");
  if(n.includes("agachamento unilateral")||n.includes("afundo")||n.includes("bulgaro")) return images("lunge");
  if(n.includes("agachamento")) return images("bodyweight_squat");
  if(n.includes("ponte")) return video("bridge");
  if(n.includes("stiff")||n.includes("mochila")&&n.includes("stiff")) return video("hinge");
  if(n.includes("remada")) return video("row");
  if(n.includes("rosca")) return video("curl");
  if(n.includes("elevacao lateral")) return images("lateral_raise");
  if(n.includes("pulldown")||n.includes("elastico")) return video("pulldown");
  if(n.includes("circuito")) return images("bodyweight_squat");
  return images("bodyweight_squat");
 }
 if(n.includes("supino")||n.includes("crucifixo maquina")) return images("bench");
 if(n.includes("desenvolvimento")) return images("shoulder_press");
 if(n.includes("elevacao lateral")||n.includes("crucifixo inverso")||n.includes("encolhimento")) return images("lateral_raise");
 if(n.includes("leg press")||n.includes("hack")) return video("legpress");
 if(type==="squat") return images("barbell_squat");
 if(type==="lunge") return images("lunge");
 if(type==="extension") return images("leg_extension");
 if(type==="legcurl") return images("leg_curl");
 if(type==="abs") return images("leg_raise");
 if(type==="plank") return images("plank");
 if(type==="pushup") return images("pushup");
 if(type==="stepup") return images("stepup");
 if(type==="bridge") return video("bridge");
 if(type==="hinge") return video("hinge");
 if(type==="pulldown") return video("pulldown");
 if(type==="row") return n.includes("maquina")?video("rowmachine"):video("row");
 if(type==="curlarm") return video("curl");
 if(type==="triceps") return video("triceps");
 if(type==="abductor") return n.includes("coice")?video("kickback"):video("abductor");
 if(type==="calf") return video("calf");
 if(type==="press") return images("shoulder_press");
 return images("bodyweight_squat");
}
function propGraphic(name:string){
 const e=homeEquipment(name).toLowerCase();
 if(e.includes("mochila")) return "/demo/backpack.svg";
 if(e.includes("cadeira")||e.includes("degrau")||e.includes("mesa")||e.includes("bancada")) return "/demo/chair.svg";
 if(e.includes("garrafa")) return "/demo/bottles.svg";
 if(e.includes("elástico")) return "/demo/band.svg";
 return "";
}
function musclesFor(type:string){
 const m:any={chest:["Peitoral","Tríceps","Deltoide anterior"],pushup:["Peitoral","Tríceps","Core"],press:["Ombros","Tríceps","Core"],pulldown:["Costas","Bíceps","Escápulas"],row:["Costas","Bíceps","Deltoide posterior"],curlarm:["Bíceps","Antebraços"],triceps:["Tríceps","Ombros estabilizadores"],squat:["Quadríceps","Glúteos","Posterior"],lunge:["Quadríceps","Glúteos","Core"],hinge:["Posterior","Glúteos","Lombar estabilizadora"],bridge:["Glúteos","Posterior","Core"],abductor:["Glúteo médio","Abdutores"],extension:["Quadríceps"],legcurl:["Posterior de coxa"],calf:["Panturrilhas"],abs:["Abdômen","Core"],plank:["Core","Abdômen","Ombros"],stepup:["Glúteos","Quadríceps","Core"],jumpingjack:["Corpo inteiro","Panturrilhas","Ombros","Core"]};
 return m[type]||["Músculos principais do movimento","Core estabilizador"];
}
function errorsFor(type:string,home:boolean){
 const base=["Fazer o movimento rápido demais","Perder o alinhamento da coluna","Usar carga que prejudica a técnica"];
 if(type==="squat"||type==="lunge") return ["Joelhos caindo para dentro","Tirar os calcanhares do apoio","Descer sem controle"];
 if(type==="hinge") return ["Arredondar a lombar","Transformar o movimento em agachamento","Afastar a carga do corpo"];
 if(type==="press"||type==="chest"||type==="pushup") return ["Abrir demais os cotovelos","Perder a posição dos ombros","Compensar arqueando a lombar"];
 return home?[...base,"Usar objeto doméstico instável"]:base;
}
function DemoMedia({asset,position,name,home,type,gender}:{asset:DemoAsset;position:"start"|"middle"|"end";name:string;home:boolean;type:string;gender:Gender}){
 const step=position==="start"?0:position==="middle"?1:2;
 return <div className={`real-demo-media real-${position} ${home?'home-demo-media':''}`}>
  <div className="home-pose-stage"><Pose type={type} step={step} home={home} name={name} gender={gender}/></div>
  {home&&<div className="home-prop">{propGraphic(name)&&<img src={propGraphic(name)} alt="Objeto doméstico"/>}<b>{homeEquipment(name)}</b></div>}
 </div>
}

function AnimatedExercisePose({type,name,home,gender}:{type:string;name:string;home:boolean;gender:Gender}){
 const [step,setStep]=useState(0);
 useEffect(()=>{const id=window.setInterval(()=>setStep(v=>(v+1)%3),850);return()=>window.clearInterval(id)},[]);
 return <div className="three-d-stage"><div className="three-d-badge">3D • MOVIMENTO CONTÍNUO</div><Pose type={type} step={step} home={home} name={name} gender={gender}/><div className="three-d-floor"/></div>;
}


function premiumGymDemo(name:string){
 const n=normalizeExercise(name);
 const map:Record<string,string>={
  "supino reto":"supino-reto",
  "supino inclinado halteres":"supino-inclinado-halteres",
  "supino inclinado com halteres":"supino-inclinado-halteres",
  "crucifixo maquina":"crucifixo-maquina",
  "triceps testa":"triceps-testa",
  "triceps corda":"triceps-corda",
  "puxada frontal":"puxada-frontal",
  "remada curvada":"remada-curvada",
  "remada baixa":"remada-baixa",
  "rosca direta":"rosca-direta",
  "rosca martelo":"rosca-martelo",
  "agachamento livre":"agachamento-livre",
  "leg press":"leg-press",
  "stiff":"stiff",
  "stiff com barra":"stiff",
  "mesa flexora":"mesa-flexora",
  "flexora":"mesa-flexora",
  "panturrilha em pe":"panturrilha-em-pe",
  "desenvolvimento halteres":"desenvolvimento-halteres",
  "desenvolvimento com halteres":"desenvolvimento-halteres",
  "elevacao lateral":"elevacao-lateral",
  "crucifixo inverso":"crucifixo-inverso",
  "encolhimento":"encolhimento",
  "prancha":"prancha",
  "supino inclinado":"supino-inclinado",
  "barra fixa":"barra-fixa",
  "remada maquina":"remada-maquina",
  "biceps + triceps":"biceps-triceps",
  "terra romeno":"terra-romeno",
  "levantamento terra romeno":"terra-romeno",
  "hack squat":"hack-squat",
  "afundo":"afundo",
  "panturrilha sentada":"panturrilha-sentada",
  "elevacao pelvica":"elevacao-pelvica",
  "cadeira abdutora":"cadeira-abdutora",
  "coice no cabo":"coice-cabo",
  "remada unilateral":"remada-unilateral",
  "rosca alternada":"rosca-alternada",
  "agachamento hack":"agachamento-hack",
  "leg press 45":"leg-press-45",
  "cadeira extensora":"cadeira-extensora",
  "afundo bulgaro":"afundo-bulgaro",
  "desenvolvimento maquina":"desenvolvimento-maquina",
  "abdominal infra":"abdominal-infra",
  "elevacao pelvica unilateral":"elevacao-pelvica-unilateral",
  "abdutora inclinada":"abdutora-inclinada",
  "passada no smith":"passada-smith",
  "hip thrust":"hip-thrust",
  "agachamento sumo":"agachamento-sumo",
  "abducao no cabo":"abducao-cabo",
  "step-up":"step-up"
 };
 const key=map[n];
 return key?`/demo-premium/${key}.jpg`:"";
}

function premiumHomeDemo(name:string){
 const n=normalizeExercise(name);
 const map:Record<string,string>={
  "flexao de bracos":"flexao-bracos-casa"
 };
 const key=map[n];
 return key?`/demo-premium/${key}.jpg`:"";
}

function ExerciseAnimation({type,name,home,gender}:{type:string;name:string;home:boolean;gender:Gender}){
 const [demoTab,setDemoTab]=useState<"exec"|"muscles"|"errors">("exec");
 const asset=demoAsset(name,type,home); const equipment=home?homeEquipment(name):gymEquipment(type,name);
 const muscles=musclesFor(type), errors=errorsFor(type,home);
 if(type==="circuit"){
  const metabolic=normalizeExercise(name).includes("metabolico");
  return <div className="pro-demo-shell"><div className="real-demo-card"><div className="real-demo-title"><b>{metabolic?"CIRCUITO METABÓLICO • ORDEM CORRETA":"CIRCUITO FUNCIONAL • ORDEM CORRETA"}</b><span>EM CASA • 4 ESTAÇÕES</span></div><div className="real-demo-grid circuit-four">
   {metabolic?<><section><small>1 • POLICHINELO</small><Pose type="jumpingjack" step={2} home name="Polichinelo" gender={gender}/></section><section><small>2 • AGACHAMENTO</small><Pose type="squat" step={2} home name="Agachamento lento" gender={gender}/></section><section><small>3 • FLEXÃO</small><Pose type="pushup" step={1} home name="Flexão de braços" gender={gender}/></section><section><small>4 • AFUNDO REVERSO</small><Pose type="lunge" step={2} home name="Afundo reverso" gender={gender}/></section></>:<><section><small>1 • AGACHAMENTO</small><Pose type="squat" step={2} home name="Agachamento lento" gender={gender}/></section><section><small>2 • FLEXÃO</small><Pose type="pushup" step={1} home name="Flexão de braços" gender={gender}/></section><section><small>3 • AFUNDO</small><Pose type="lunge" step={2} home name="Afundo reverso" gender={gender}/></section><section><small>4 • PRANCHA</small><Pose type="plank" step={2} home name="Prancha" gender={gender}/></section></>}
  </div><div className="demo-coach"><b>COMO FAZER</b><p>{metabolic?"Faça as 4 estações em ritmo controlado, com transições curtas. Complete uma volta, descanse o tempo indicado e repita. Priorize técnica antes de velocidade.":"Faça cada estação pelo tempo indicado, passe para a próxima e descanse somente ao terminar as 4. Mantenha movimentos controlados durante toda a volta."}</p></div></div></div>;
 }
 if(type==="biset") return <div className="pro-demo-shell"><div className="real-demo-card"><div className="real-demo-title"><b>BI-SET • BÍCEPS + TRÍCEPS</b><span>DOIS MOVIMENTOS, SEM DESCANSO ENTRE ELES</span></div><div className="real-demo-grid"><section><small>1 • ROSCA</small><Pose type="curlarm" step={2} home={home} name="Rosca direta" gender={gender}/></section><i className="real-arrow">❯❯</i><section><small>2 • TRÍCEPS</small><Pose type="triceps" step={2} home={home} name="Tríceps corda" gender={gender}/></section></div></div></div>;
 return <div className="pro-demo-shell">
  <div className="pro-demo-tabs">
   <button className={demoTab==="exec"?"active":""} onClick={()=>setDemoTab("exec")}>▶ EXECUÇÃO</button>
   <button className={demoTab==="muscles"?"active":""} onClick={()=>setDemoTab("muscles")}>◒ MÚSCULOS</button>
   <button className={demoTab==="errors"?"active":""} onClick={()=>setDemoTab("errors")}>⚠ ERROS COMUNS</button>
  </div>
  {demoTab==="exec"&&<div className="real-demo-card">
   <div className="real-demo-title"><b>VEJA A EXECUÇÃO COMPLETA</b><span>{home?`EM CASA • ${equipment}`:`ACADEMIA • ${equipment}`}</span></div>
   <div className="single-demo-stage">{home&&premiumHomeDemo(name)?<img className="premium-exercise-demo" src={premiumHomeDemo(name)} alt={`Demonstração em casa de ${name}`}/>:!home&&premiumGymDemo(name)?<img className="premium-exercise-demo" src={premiumGymDemo(name)} alt={`Demonstração de ${name}`}/>:<AnimatedExercisePose type={type} name={name} home={home} gender={gender}/>}</div>
   <div className="demo-status"><span className="live-dot"/> {home&&premiumHomeDemo(name)?"DEMONSTRAÇÃO PREMIUM EM CASA • posição inicial → movimento → posição final":!home&&premiumGymDemo(name)?"DEMONSTRAÇÃO PREMIUM • posição inicial → movimento → posição final":"DEMONSTRAÇÃO AUTOMÁTICA • repete continuamente"}</div>
   {home&&<div className="home-object-strip"><span>OBJETO UTILIZADO</span><div>{propGraphic(name)&&<img src={propGraphic(name)} alt=""/>}<b>{equipment}</b><small>Use somente objeto firme e estável.</small></div></div>}
   <p className="demo-focus">ⓘ {home?`Faça o movimento usando ${equipment.toLowerCase()} em uma superfície firme.`:"Controle a carga durante todo o movimento e mantenha a postura estável."}</p>
  </div>}
  {demoTab==="muscles"&&<div className="demo-info-panel"><h4>MÚSCULOS TRABALHADOS</h4>{muscles.map((m:string,i:number)=><div key={m}><span>{i===0?'●':'○'}</span><b>{m}</b>{i===0&&<small>Principal</small>}</div>)}</div>}
  {demoTab==="errors"&&<div className="demo-info-panel errors"><h4>ERROS COMUNS</h4>{errors.map((e:string)=><div key={e}><span>×</span><b>{e}</b></div>)}</div>}
 </div>
}


function quickExecution(name:string,note:string){
 return [
  `Posicione-se com estabilidade para iniciar ${name.toLowerCase()}.`,
  note ? `Ponto principal: ${note}.` : "Faça o movimento de forma controlada.",
  "Use amplitude confortável, sem tirar a postura apenas para completar a repetição.",
  "Controle a volta do movimento e pare se sentir dor articular."
 ];
}
function buildMeals(p:Profile,day:number):Meal[]{
 const plan=calcPlan(p); const factors=[.25,.35,.15,.25]; const titles=["Café da manhã","Almoço","Lanche da tarde","Jantar"]; const times=["07:00","12:30","16:30","20:00"]; const keys=(['breakfast','lunch','snack','dinner'] as const);
 const scale=plan.kcal/1900; const variant=(day-1)%3;
 const scaleItem=(x:string)=>x.replace(/(\d+) g/g,(m,n)=>`${Math.max(20,Math.round(Number(n)*scale/10)*10)} g`);
 return titles.map((title,i)=>({
  title,time:times[i],items:mealTemplates[keys[i]][variant].map(scaleItem),kcal:Math.round(plan.kcal*factors[i]),protein:Math.round(plan.protein*factors[i]),
  ...(i===2?{alternative:{title:"Alternativa prática com whey",items:["Whey protein 30 g","Leite desnatado ou água 250 ml","1 banana pequena"],note:"Use esta opção no lugar do lanche da tarde, não como refeição extra. Ajuste a dose conforme orientação profissional e sua meta de proteína."}}:{})
 }));
}

const defaultProfile:Profile={name:"",gender:"mulher",place:"academia",level:"iniciante",age:30,weight:75,height:165,goalWeight:65,daysPerWeek:5,supplements:false};

export default function Page(){
 const [profile,setProfile]=useState<Profile>(defaultProfile); const [ready,setReady]=useState(false); const [tab,setTab]=useState<Tab>("hoje"); const [day,setDay]=useState(1); const [done,setDone]=useState<Record<string,boolean>>({}); const [loads,setLoads]=useState<Record<string,string>>({}); const [water,setWater]=useState(0); const [weightLog,setWeightLog]=useState<Record<number,string>>({});
 useEffect(()=>{const raw=localStorage.getItem("p90-state");if(raw){try{const s=JSON.parse(raw);setProfile(s.profile||defaultProfile);setReady(!!s.ready);setDay(s.day||1);setDone(s.done||{});setLoads(s.loads||{});setWater(s.water||0);setWeightLog(s.weightLog||{});}catch{}}},[]);
 useEffect(()=>{localStorage.setItem("p90-state",JSON.stringify({profile,ready,day,done,loads,water,weightLog}))},[profile,ready,day,done,loads,water,weightLog]);
 const plan=useMemo(()=>calcPlan(profile),[profile]); const phase=dayPhase(day); const workouts=profile.place==="academia"?(profile.gender==="mulher"?womanGym:manGym):(profile.gender==="mulher"?homeWoman:homeMan); const workout=workouts[(day-1)%workouts.length]; const meals=useMemo(()=>buildMeals(profile,day),[profile,day]); const dayProgress=Math.round((Object.keys(done).filter(k=>k.startsWith(day+"-")&&done[k]).length/(workout.exercises.length+meals.length+2))*100); const completedTrainingDays=Array.from({length:90},(_,idx)=>idx+1).filter(d=>done[`${d}-cardio`]&&Array.from({length:workouts[(d-1)%workouts.length].exercises.length},(_,i)=>done[`${d}-ex-${i}`]).every(Boolean)).length;
 const toggle=(k:string)=>setDone(v=>({...v,[k]:!v[k]}));
 if(!ready) return <main className="onboarding"><div className="orb one"/><div className="orb two"/><section className="brand"><div className="logo">P90</div><div><b>PROJETO 90 DIAS</b><span>Corpo, mente e hábitos</span></div></section><section className="hero"><div className="eyebrow">MÉTODO COMPLETO DE TRANSFORMAÇÃO</div><h1>Seu novo estilo de vida<br/><em>começa agora.</em></h1><p>Treino e alimentação personalizados para acompanhar você durante 90 dias — com estratégia, evolução e liberdade.</p></section><section className="setup card"><h2>Vamos personalizar seu plano</h2><p>Leva menos de um minuto.</p><label>Como você quer ser chamado?<input value={profile.name} onChange={e=>setProfile({...profile,name:e.target.value})} placeholder="Seu nome"/></label><div className="choice-label">Plano de treino</div><div className="gender-grid"><button className={profile.gender==="mulher"?"selected":""} onClick={()=>setProfile({...profile,gender:"mulher"})}><span>♀</span><b>Feminino</b><small>Ênfase em glúteos e pernas</small></button><button className={profile.gender==="homem"?"selected":""} onClick={()=>setProfile({...profile,gender:"homem"})}><span>♂</span><b>Masculino</b><small>Hipertrofia completa</small></button></div><div className="two"><label>Onde vai treinar?<select value={profile.place} onChange={e=>setProfile({...profile,place:e.target.value as Place})}><option value="academia">Academia</option><option value="casa">Em casa</option></select></label><label>Nível<select value={profile.level} onChange={e=>setProfile({...profile,level:e.target.value as Level})}><option value="iniciante">Iniciante</option><option value="intermediario">Intermediário</option><option value="avancado">Avançado</option></select></label></div><div className="four profile-steppers"><NumberStepper label="Idade" value={profile.age} min={14} max={90} unit="anos" onChange={age=>setProfile({...profile,age})}/><NumberStepper label="Peso atual" value={profile.weight} min={35} max={250} unit="kg" onChange={weight=>setProfile({...profile,weight})}/><NumberStepper label="Altura" value={profile.height} min={130} max={220} unit="cm" onChange={height=>setProfile({...profile,height})}/><NumberStepper label="Peso desejado" value={profile.goalWeight} min={35} max={250} unit="kg" onChange={goalWeight=>setProfile({...profile,goalWeight})}/></div><label>Quantos dias por semana?<input type="range" min="3" max="6" value={profile.daysPerWeek} onChange={e=>setProfile({...profile,daysPerWeek:+e.target.value})}/><div className="range-value">{profile.daysPerWeek} dias</div></label><button className="primary" onClick={()=>profile.name.trim()&&setReady(true)}>CRIAR MEU PLANO DE 90 DIAS <span>→</span></button><small className="disclaimer">Estimativas educativas. Procure um profissional de saúde antes de iniciar caso tenha doença, lesão, gestação ou restrição alimentar.</small></section></main>;
 return <main className="app"><header><section className="brand"><div className="logo">P90</div><div><b>PROJETO 90 DIAS</b><span>{phase.accent} • {phase.name}</span></div></section><div className="header-actions"><button className="day-nav" onClick={()=>setDay(Math.max(1,day-1))}>‹</button><div className="day-pill"><small>DIA</small><b>{day}</b><span>/ 90</span></div><button className="day-nav" onClick={()=>setDay(Math.min(90,day+1))}>›</button></div></header><nav>{([['hoje','◉','Hoje'],['treino','◆','Treino'],['alimentacao','◇','Alimentação'],['progresso','↗','Evolução'],['perfil','⚙','Perfil']] as [Tab,string,string][]).map(([id,icon,label])=><button key={id} className={tab===id?'active':''} onClick={()=>setTab(id)}><span>{icon}</span>{label}</button>)}</nav><section className="content">\n {tab==='hoje'&&<><div className="welcome"><div><span className="eyebrow">{phase.accent} • {phase.label}</span><h1>Olá, {profile.name}.</h1><p>Hoje é mais uma oportunidade de construir a sua melhor versão.</p></div><div className="progress-ring" style={{'--p':dayProgress} as React.CSSProperties}><div><b>{dayProgress}%</b><small>HOJE</small></div></div></div><div className="metrics"><article><span>🔥</span><div><small>META CALÓRICA</small><b>{plan.kcal} kcal</b></div></article><article><span>💧</span><div><small>ÁGUA</small><b>{(plan.water/1000).toFixed(1)} L</b></div></article><article><span>✓</span><div><small>DIAS TREINADOS</small><b>{completedTrainingDays} de 90</b></div></article><article><span>◒</span><div><small>OBJETIVO</small><b>{plan.goal}</b></div></article></div><div className="grid-main"><article className="card featured"><div className="card-top"><div><span className="tag">TREINO DO DIA</span><h2>{workout.title}</h2><p>{workout.focus} • {workout.duration}</p></div><span className="big-icon">◆</span></div><div className="mini-list">{workout.exercises.slice(0,3).map((e,i)=><span key={i}>{e.name}</span>)}</div><div className="card-foot"><span>+ {workout.exercises.length-3} exercícios</span><button onClick={()=>setTab('treino')}>COMEÇAR TREINO →</button></div></article><article className="card nutrition-preview"><span className="tag">PRÓXIMA REFEIÇÃO</span><h2>{meals[2].title}</h2><p>{meals[2].items.join(' • ')}</p><div className="macro-row"><b>{meals[2].kcal} kcal</b><b>{meals[2].protein} g proteína</b></div><button onClick={()=>setTab('alimentacao')}>VER PLANO COMPLETO →</button></article></div><article className="card phase-card"><div><span className="tag">JORNADA DE 90 DIAS</span><h2>{phase.name}</h2><p>{phase.label}</p></div><div className="timeline"><span className={day>=1?'on':''}>1</span><i/><span className={day>=31?'on':''}>30</span><i/><span className={day>=61?'on':''}>60</span><i/><span className={day>=90?'on':''}>90</span></div></article></>}
 {tab==='treino'&&<><div className="section-title"><div><span className="eyebrow">TREINO {profile.gender==='mulher'?'FEMININO':'MASCULINO'} • {profile.place.toUpperCase()}</span><h1>{workout.title}</h1><p>{workout.focus} • {workout.duration}</p></div><div className="phase-badge">{phase.accent}<b>{phase.name}</b></div></div><article className="card place-switch"><div><small>TREINE ONDE DER HOJE</small><h3>{profile.place==='academia'?'Treino de academia selecionado':'Versão rápida para fazer em casa'}</h3><p>A troca vale apenas como sua modalidade atual e não apaga o dia, cargas ou exercícios concluídos.</p></div><div className="place-buttons"><button className={profile.place==='academia'?'active':''} onClick={()=>setProfile({...profile,place:'academia'})}>◆ ACADEMIA</button><button className={profile.place==='casa'?'active':''} onClick={()=>setProfile({...profile,place:'casa'})}>⌂ EM CASA</button></div></article><div className="training-counter"><b>{completedTrainingDays}</b><span>dias de treino completos</span><i>Dia atual: {day} de 90</i></div><article className="card cardio"><div><span>♥</span><div><small>CARDIO DO DIA</small><h3>{workout.cardio}</h3></div></div><button onClick={()=>toggle(`${day}-cardio`)} className={done[`${day}-cardio`]?'done':''}>{done[`${day}-cardio`]?'CONCLUÍDO ✓':'MARCAR COMO FEITO'}</button></article><div className="exercise-list">{workout.exercises.map((e,i)=><article className={`card exercise ${done[`${day}-ex-${i}`]?'completed':''}`} key={e.name}><div className="exercise-num">{String(i+1).padStart(2,'0')}</div><div className="exercise-info"><div className="exercise-head"><div><h3>{e.name}</h3><p>{e.note}</p></div>{e.technique&&(()=>{const guide=techniqueGuide(e.technique);return <details className="technique-guide"><summary>{e.technique} • COMO FAZER</summary>{guide&&<div><h4>{guide.title}</h4><ol>{guide.steps.map((step,n)=><li key={n}>{step}</li>)}</ol><strong>Importante: use carga que permita manter o controle. Dor articular não é normal.</strong></div>}</details>})()}</div><div className="exercise-stats"><span><small>SÉRIES</small><b>{e.sets}</b></span><span><small>REPETIÇÕES</small><b>{e.reps}</b></span><span><small>DESCANSO</small><b>{e.rest}</b></span><label><small>CARGA ATUAL</small><input value={loads[`${profile.gender}-${e.name}`]||''} onChange={ev=>setLoads({...loads,[`${profile.gender}-${e.name}`]:ev.target.value})} placeholder="kg"/></label></div><div className="progress-tip">↗ {day>30?'Tente aumentar 1 repetição ou 2,5% de carga mantendo a execução.':'Priorize técnica perfeita antes de aumentar a carga.'}</div>{(()=>{const motion=exerciseAnimation(e.name);return <details className="execution-box"><summary className="video-button animation-button"><span>◉</span><div><b>VER EXECUÇÃO DEMONSTRATIVA</b><small>{profile.place==='casa'?'Demonstração para casa • com objeto correto':'Demonstração premium específica • dentro da plataforma'}</small></div></summary><div className="internal-guide"><h4>{e.name}</h4><ExerciseAnimation type={motion} name={e.name} home={profile.place==='casa'} gender={profile.gender}/><div className="execution-columns"><div><b>COMO EXECUTAR</b><ol>{quickExecution(e.name,e.note).map((step,n)=><li key={n}>{step}</li>)}</ol></div><div className="execution-checks"><b>CONFIRA ANTES DA SÉRIE</b><span>✓ Postura estável</span><span>✓ Movimento controlado</span><span>✓ Respiração sem prender</span><span>✓ Sem dor articular</span></div></div><strong>{profile.place==='casa'?'Esta versão foi adaptada para ser feita em casa, sem máquinas ou aparelhos de academia.':'Use a demonstração para entender o padrão do movimento antes de aumentar a carga.'}</strong></div></details>})()}</div><button className="check" onClick={()=>toggle(`${day}-ex-${i}`)}>{done[`${day}-ex-${i}`]?'✓':''}</button></article>)}</div></>}
 {tab==='alimentacao'&&<><div className="section-title"><div><span className="eyebrow">ALIMENTAÇÃO INTELIGENTE</span><h1>Plano do dia {day}</h1><p>{day<=60?'Fase sem doces • Refrigerante zero opcional':'Flexibilidade consciente • equilíbrio sem culpa'}</p></div><div className="phase-badge">{plan.kcal}<b>kcal/dia</b></div></div><div className="nutrition-banner card"><div><span className="tag">REGRA DA FASE</span><h2>{day<=60?'60 dias sem doces adicionados':'Flexibilidade planejada'}</h2><p>{day<=60?'Refrigerante zero é opcional, até 1 lata de 350 ml ao dia, e não substitui água.':'A partir do dia 61, inclua uma porção pequena de doce até 2 vezes por semana, de preferência após uma refeição.'}</p></div><div className="rule-icon">{day<=60?'60':'90'}</div></div><div className="meal-list">{meals.map((m,i)=><article className={`card meal ${done[`${day}-meal-${i}`]?'completed':''}`} key={m.title}><div className="meal-time"><b>{m.time}</b><span>{m.title}</span></div><div className="meal-food"><h3>{m.items[0]}</h3><p>{m.items.slice(1).join(' • ')}</p>{m.alternative&&<div className="meal-alternative"><span>↔ TROCA OPCIONAL</span><b>{m.alternative.title}</b><p>{m.alternative.items.join(' • ')}</p><small>{m.alternative.note}</small></div>}</div><div className="meal-macros"><span><b>{m.kcal}</b><small>kcal</small></span><span><b>{m.protein}g</b><small>proteína</small></span></div><button className="check" onClick={()=>toggle(`${day}-meal-${i}`)}>{done[`${day}-meal-${i}`]?'✓':''}</button></article>)}</div><div className="two-cards"><article className="card water-card"><span>💧</span><div><small>META DE ÁGUA</small><h2>{(plan.water/1000).toFixed(1)} litros</h2><p>{(water/1000).toFixed(1)} L consumidos hoje</p><input type="range" min="0" max={plan.water} step="250" value={water} onChange={e=>setWater(+e.target.value)}/></div></article><article className="card supplement-card"><span>✦</span><div><small>SUPLEMENTAÇÃO</small><h2>Totalmente opcional</h2><p>Whey é uma alternativa prática de proteína e já aparece como opção de troca no lanche da tarde. Creatina e outros suplementos devem ser avaliados individualmente.</p><button onClick={()=>setProfile({...profile,supplements:!profile.supplements})}>{profile.supplements?'ROTINA ATIVADA ✓':'USO SUPLEMENTO'}</button></div></article></div></>}
 {tab==='progresso'&&<><div className="section-title"><div><span className="eyebrow">SUA EVOLUÇÃO</span><h1>Consistência visível.</h1><p>Registre seu peso e acompanhe a jornada.</p></div></div><div className="metrics"><article><span>◒</span><div><small>PESO INICIAL</small><b>{profile.weight} kg</b></div></article><article><span>⌁</span><div><small>PESO ATUAL</small><b>{weightLog[day]||profile.weight} kg</b></div></article><article><span>◎</span><div><small>META</small><b>{profile.goalWeight} kg</b></div></article><article><span>↗</span><div><small>IMC ESTIMADO</small><b>{plan.bmi}</b></div></article></div><article className="card weight-entry"><div><span className="tag">CHECK-IN DO DIA {day}</span><h2>Quanto você está pesando?</h2><p>Faça o registro preferencialmente no mesmo horário e condições.</p></div><label><input type="number" step="0.1" value={weightLog[day]||''} onChange={e=>setWeightLog({...weightLog,[day]:e.target.value})} placeholder="00.0"/><span>kg</span></label></article><article className="card chart"><div className="chart-head"><div><span className="tag">PROGRESSO DOS 90 DIAS</span><h2>Linha de evolução</h2></div><b>{Math.round(day/90*100)}%</b></div><div className="bars">{Array.from({length:30},(_,i)=><span key={i} style={{height:`${25+Math.sin(i*.8)*12+((i*3)%35)}%`}} className={i<day/3?'active':''}/>)}</div><div className="chart-labels"><span>Dia 1</span><span>Dia 30</span><span>Dia 60</span><span>Dia 90</span></div></article></>}
 {tab==='perfil'&&<><div className="section-title"><div><span className="eyebrow">CONFIGURAÇÕES</span><h1>Seu perfil</h1><p>Altere os dados e o plano será recalculado.</p></div></div><article className="card profile-card"><div className="avatar">{profile.name.charAt(0).toUpperCase()}</div><div><h2>{profile.name}</h2><p>Plano {profile.gender==='mulher'?'feminino':'masculino'} • {profile.place}</p></div></article><div className="card edit-profile"><div className="four profile-steppers"><NumberStepper label="Idade" value={profile.age} min={14} max={90} unit="anos" onChange={age=>setProfile({...profile,age})}/><NumberStepper label="Peso atual" value={profile.weight} min={35} max={250} unit="kg" onChange={weight=>setProfile({...profile,weight})}/><NumberStepper label="Altura" value={profile.height} min={130} max={220} unit="cm" onChange={height=>setProfile({...profile,height})}/><NumberStepper label="Peso desejado" value={profile.goalWeight} min={35} max={250} unit="kg" onChange={goalWeight=>setProfile({...profile,goalWeight})}/></div><div className="two"><label>Treino<select value={profile.gender} onChange={e=>setProfile({...profile,gender:e.target.value as Gender})}><option value="mulher">Feminino</option><option value="homem">Masculino</option></select></label><label>Local<select value={profile.place} onChange={e=>setProfile({...profile,place:e.target.value as Place})}><option value="academia">Academia</option><option value="casa">Em casa</option></select></label></div><button className="secondary danger" onClick={()=>{localStorage.removeItem('p90-state');location.reload()}}>RECOMEÇAR PROGRAMA</button></div></>}
 </section><footer><b>PROJETO 90 DIAS</b><span>Transformação sustentável, sem extremismo.</span></footer></main>
}
