import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch, inject, type InjectionKey } from 'vue'
import * as THREE from 'three'
import { STLLoader } from 'three/addons/loaders/STLLoader.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

export const appStateKey: InjectionKey<ReturnType<typeof createAppState>> = Symbol('exocase-app-state')

export function createAppState() {
type Unit = 'mm' | 'cm' | 'm'
type SliceResult = { timeSeconds:number; weightGrams:number; hours:number; hourlyRate:number; priceSoles:number; fileName:string; profile:string }
type PartStats = { id:number; dims:[number,number,number]; volume:number; triangles:number }
type Product = { id: string; category: string; name: string; description: string; price: number; glyph: string; tone: string; image?: string }
const waLink = 'https://wa.link/b8rz87'
const featuredProjects = [
  { category:'ARQUITECTURA', name:'Maqueta Edificio Multifamiliar', location:'Lima, Perú', icon:'▥', style:'featured-city' },
  { category:'INDUSTRIAL', name:'Planta de Asfalto', location:'Cajamarca, Perú', icon:'⚙', style:'featured-plant' },
  { category:'MECATRÓNICA', name:'Brazo Robótico', location:'Proyecto universitario', icon:'⌘', style:'featured-robot' },
  { category:'ARQUITECTURA', name:'Maqueta Vivienda Moderna', location:'Lima, Perú', icon:'⌂', style:'featured-house' },
  { category:'INGENIERÍA', name:'Caja de Engranajes', location:'Pieza funcional', icon:'⚙', style:'featured-gears' },
]
const categories =
 ['Todos','Monigotes y figuras','Organizadores','Llaveros','Lámparas GTA 6','Prototipos médicos','Otros','EXOPET']
const products: Product[] = [
  { id:'figures',category:'Monigotes y figuras',name:'Figura personalizada',description:'Diseñada a partir de tu idea',price:45,glyph:'♟',tone:'figure' },
  { id:'organizer',category:'Organizadores',name:'Organizador modular',description:'Orden a la medida de tu espacio',price:32,glyph:'▦',tone:'organizer' },
  { id:'keychain',category:'Llaveros',name:'Llavero personalizado',description:'Nombre, logo o diseño especial',price:12,glyph:'◉',tone:'keychain' },
  { id:'lamp',category:'Lámparas GTA 6',name:'Lámpara GTA 6',description:'Iluminación decorativa por encargo',price:65,glyph:'✦',tone:'lamp' },
  { id:'prototype',category:'Prototipos médicos',name:'Prototipo para medicina',description:'Modelos para estudio y presentación de proyectos médicos',price:55,glyph:'⬡',tone:'prototype' },
  { id:'other',category:'Otros',name:'Pieza bajo pedido',description:'Cuéntanos qué necesitas fabricar',price:25,glyph:'✳',tone:'other' },
  { id:'pet1',category:'EXOPET',name:'Llavero bulldog',description:'Un detalle para amantes de los perros',price:18,glyph:'🐾',tone:'pet-keychain',image:'/images/exopet/Llavero Bulldog Blanco Adorable.png' },
  { id:'pet2',category:'EXOPET',name:'Llavero perrito',description:'Personalizado para llevar contigo',price:18,glyph:'🐾',tone:'pet-keychain',image:'/images/exopet/Llavero de perrito blanco y marrón.png' },
  { id:'pet3',category:'EXOPET',name:'Llavero Border Collie',description:'Miniatura impresa en 3D',price:18,glyph:'🐾',tone:'pet-keychain',image:'/images/exopet/Llavero de perro Border Collie en miniatura.png' },
  { id:'pet4',category:'EXOPET',name:'Perritos colgantes',description:'Modelos impresos para regalar',price:22,glyph:'🐾',tone:'pet-pair',image:'/images/exopet/Pareja de Perritos Colgantes.png' },
  { id:'pet5',category:'EXOPET',name:'Llavero rottweiler',description:'Disponible por pedido',price:18,glyph:'🐾',tone:'pet-hand',image:'/images/exopet/llavero_rottweiler.png' },
  { id:'pet6',category:'EXOPET',name:'Bulldog francés negro',description:'Llavero detallado en 3D',price:18,glyph:'🐾',tone:'pet-keychain',image:'/images/exopet/Llavero de bulldog francés negro detallado.png' },
  { id:'pet7',category:'EXOPET',name:'Golden retriever',description:'Llavero de perro en miniatura',price:18,glyph:'🐾',tone:'pet-keychain',image:'/images/exopet/GOLDEN.png' },
  { id:'pet8',category:'EXOPET',name:'Pastor alemán',description:'Dos figuras con llavero',price:22,glyph:'🐾',tone:'pet-pair',image:'/images/exopet/pastor_aleman.jpg' },
  { id:'pet9',category:'EXOPET',name:'Pastor belga',description:'Llavero inspirado en tu mascota',price:18,glyph:'🐾',tone:'pet-keychain',image:'/images/exopet/pastor_belga.jpg' },
  { id:'pet10',category:'EXOPET',name:'Pug',description:'Figuras de colección',price:18,glyph:'🐾',tone:'pet-pair',image:'/images/exopet/PUG.jpeg' },
  { id:'pet11',category:'EXOPET',name:'Llavero Beagle',description:'Un compañero para llevar contigo',price:18,glyph:'🐾',tone:'pet-hand',image:'/images/exopet/Beagle.jpeg' },
  { id:'pet12',category:'EXOPET',name:'Bulldog francés marrón',description:'Llavero detallado en 3D',price:18,glyph:'🐾',tone:'pet-keychain',image:'/images/exopet/BULDOG_FRANCES_BROWN.jpg' },
  { id:'pet13',category:'EXOPET',name:'Llavero Cocker dorado',description:'Miniatura impresa en 3D',price:18,glyph:'🐾',tone:'pet-keychain',image:'/images/exopet/Cocker dorado.png' },
  { id:'pet14',category:'EXOPET',name:'Perritos articulados',description:'Dos llaveros articulados',price:22,glyph:'🐾',tone:'pet-pair',image:'/images/exopet/WhatsApp Image 2026-10-24 at 8.12.50 PM.jpeg' },
]
type PortfolioItem = { id:number; category:string; name:string; description:string; label:string; icon:string; visual:string; image?:string; images?:string[]; imageCaptions?:string[] }
const portfolioCategories=['Todos','Arquitectura','Industrial','Piezas técnicas','Volumetría 1:500']
const portfolioItems:PortfolioItem[]=[
{id:13,category:'Arquitectura',name:'Maqueta arquitectónica de edificio curvo',description:'Proyecto arquitectónico fabricado mediante impresión 3D',label:'Maqueta arquitectónica',icon:'⌂',visual:'curved-building'},
{id:16,category:'Arquitectura',name:'Maqueta arquitectónica de torres de oficinas',description:'Conjunto arquitectónico modular fabricado mediante impresión 3D',label:'Maqueta arquitectónica',icon:'▥',visual:'office-towers'},{id:30,category:'Volumetría 1:500',name:'Museo Stasys · vista de presentación',description:'Volumetría arquitectónica a escala 1:500',label:'Escala 1:500',icon:'▥',visual:'volumetria-500',image:'/images/portfolio/portfolio-volumetria-500-museo.png'},
{id:31,category:'Volumetría 1:500',name:'Museo Stasys · vista alternativa',description:'Segunda vista de la maqueta volumétrica a escala 1:500',label:'Escala 1:500',icon:'▥',visual:'volumetria-500',image:'/images/portfolio/portfolio-volumetria-500-museo-vista-2.png'},
{id:32,category:'Volumetría 1:500',name:'Volumetría de conjunto a color',description:'Estudio de volúmenes arquitectónicos impresos en distintos colores',label:'Escala 1:500',icon:'▥',visual:'volumetria-500',image:'/images/portfolio/portfolio-volumetria-500-maqueta-color.png'},
{id:33,category:'Volumetría 1:500',name:'Estudio de masas · vista en perspectiva',description:'Maqueta blanca de estudio volumétrico a escala 1:500',label:'Escala 1:500',icon:'▥',visual:'volumetria-500',image:'/images/portfolio/portfolio-volumetria-500-maqueta-blanca.png'},
{id:34,category:'Volumetría 1:500',name:'Estudio de masas · vista superior',description:'Vista alternativa de la maqueta blanca de volúmenes',label:'Escala 1:500',icon:'▥',visual:'volumetria-500',image:'/images/portfolio/portfolio-volumetria-500-maqueta-blanca-vista-2.png'},
{id:35,category:'Volumetría 1:500',name:'Volúmenes conceptuales impresos',description:'Composición arquitectónica con volúmenes de varios niveles',label:'Escala 1:500',icon:'▥',visual:'volumetria-500',image:'/images/portfolio/portfolio-volumetria-500-volumenes-naranja.png'},
{id:36,category:'Volumetría 1:500',name:'Maqueta lineal · vista frontal',description:'Modelo arquitectónico longitudinal con estructura abierta',label:'Escala 1:500',icon:'▥',visual:'volumetria-500',image:'/images/portfolio/portfolio-volumetria-500-modelo-lineal.png'},
{id:37,category:'Volumetría 1:500',name:'Maqueta modular y piezas desmontadas',description:'Volumetría arquitectónica con elementos modulares separados',label:'Escala 1:500',icon:'▥',visual:'volumetria-500',image:'/images/portfolio/portfolio-volumetria-500-maqueta-modular.png'},
{id:14,category:'Arquitectura',name:'Maqueta arquitectónica Sol de Janeiro',description:'Maqueta de exhibición arquitectónica con piezas impresas en 3D',label:'Caso de éxito',icon:'⌂',visual:'sol-janeiro'},
{id:15,category:'Industrial',name:'Planta de Asfalto',description:'Maqueta industrial con módulos, tolvas y cintas transportadoras',label:'Planta industrial',icon:'⚙',visual:'plant-asphalt'},
{id:17,category:'Piezas técnicas',name:'Carcasas y tapas técnicas',description:'Carcasas circulares, cubiertas y componentes impresos a medida',label:'Pieza funcional',icon:'⚙',visual:'technical-part',image:'/images/portfolio/piezas-tecnicas-carcasas.png'},
{id:18,category:'Piezas técnicas',name:'Bielas y pasadores',description:'Elementos de unión y articulación fabricados en impresión 3D',label:'Pieza funcional',icon:'⚙',visual:'technical-part',image:'/images/portfolio/piezas-tecnicas-bielas.png'},
{id:19,category:'Piezas técnicas',name:'Adaptadores circulares',description:'Adaptadores y soportes diseñados para aplicaciones específicas',label:'Pieza funcional',icon:'⚙',visual:'technical-part',image:'/images/portfolio/piezas-tecnicas-adaptadores.png'},
{id:20,category:'Piezas técnicas',name:'Acoples y componentes',description:'Acoples técnicos fabricados mediante impresión 3D',label:'Pieza funcional',icon:'⚙',visual:'technical-part',image:'/images/portfolio/piezas-tecnicas-acoples.png'},
{id:21,category:'Piezas técnicas',name:'Tornillo helicoidal · detalle',description:'Componente helicoidal técnico impreso en 3D',label:'Mecanismo',icon:'⚙',visual:'technical-part',image:'/images/portfolio/piezas-tecnicas-helice-detalle.png'},
{id:22,category:'Piezas técnicas',name:'Tornillo helicoidal · impresión',description:'Mecanismo helicoidal funcional fabricado en el taller',label:'Mecanismo',icon:'⚙',visual:'technical-part',image:'/images/portfolio/piezas-tecnicas-helice-impresion.png'},{ id:23,category:'Piezas técnicas',name:'Cubierta curva técnica',description:'Cubierta semicircular impresa para el ensamblaje de un equipo',label:'Componente técnico',icon:'⚙',visual:'technical-part',image:'/images/portfolio/industrial-cubierta-curva.png' },
{ id:24,category:'Piezas técnicas',name:'Base circular con cubo central',description:'Base radial con brida perforada y cuerpo cilíndrico central',label:'Componente técnico',icon:'⚙',visual:'technical-part',image:'/images/portfolio/industrial-base-circular.png',images:['/images/portfolio/industrial-base-circular.png','/images/portfolio/industrial-base-circular-vista-lateral.png','/images/portfolio/industrial-base-circular-vista-superior.png'],imageCaptions:['Vista en perspectiva','Vista lateral','Vista elevada'] },
{ id:25,category:'Piezas técnicas',name:'Adaptador cilíndrico con brida',description:'Adaptador impreso en rojo con cuello cilíndrico y base de fijación',label:'Componente técnico',icon:'⚙',visual:'technical-part',image:'/images/portfolio/industrial-cilindro-rojo.png' },
{ id:26,category:'Piezas técnicas',name:'Soporte articulado rojo',description:'Soporte alargado con perforaciones y alojamiento circular',label:'Componente técnico',icon:'⚙',visual:'technical-part',image:'/images/portfolio/industrial-soporte-rojo.png' },
{ id:27,category:'Piezas técnicas',name:'Carcasa curva con alojamiento',description:'Carcasa gris con geometría curva y ventana para componente',label:'Componente técnico',icon:'⚙',visual:'technical-part',image:'/images/portfolio/industrial-carcasa-curva-gris.png' },
{ id:28,category:'Piezas técnicas',name:'Caja técnica modular',description:'Envolvente rectangular abierta para montaje de componentes',label:'Componente técnico',icon:'⚙',visual:'technical-part',image:'/images/portfolio/industrial-caja-gris.png' },
{ id:29,category:'Piezas técnicas',name:'Aro de fijación rojo',description:'Anillo con collar central y perforaciones perimetrales',label:'Componente técnico',icon:'⚙',visual:'technical-part',image:'/images/portfolio/industrial-aro-rojo.png' },
{id:1,category:'Arquitectura',name:'Maqueta Edificio Multifamiliar',description:'Escala 1:100 · Lima, Perú',label:'Escala 1:100',icon:'▥',visual:'building'},
{id:2,category:'Arquitectura',name:'Torre Residencial',description:'Escala 1:200',label:'Escala 1:200',icon:'▤',visual:'tower'},
{id:6,category:'Arquitectura',name:'Árboles para maquetas',description:'Diferentes escalas',label:'Paisajismo',icon:'♣',visual:'trees'},
{id:9,category:'Arquitectura',name:'Maqueta Urbana',description:'Escala 1:500',label:'Escala 1:500',icon:'⌂',visual:'urban'},
{id:12,category:'Arquitectura',name:'Conjunto Residencial',description:'Escala 1:300',label:'Escala 1:300',icon:'⌂',visual:'residential'},



]
const portfolioTestimonials=[
{name:'Arq. Valeria Torres',role:'Estudio de Arquitectura',quote:'La calidad de las maquetas es increíble. Nos ayudaron en todo el proceso y el resultado superó nuestras expectativas.',avatar:'VT'},
{name:'Ing. Carlos Mendoza',role:'Proyecto de Ingeniería',quote:'Excelente atención y gran nivel de detalle en las piezas. 100% recomendados.',avatar:'CM'},
{name:'Diego Rojas',role:'Cliente Particular',quote:'Las lámparas de GTA 6 son un éxito. Diseños únicos y gran calidad de impresión.',avatar:'DR'},
]
type BlogArticle = { id:number; category:string; title:string; excerpt:string; date:string; minutes:number; icon:string; visual:string; body:string }
const blogCategories = ['Todos los artículos','Arquitectura','Materiales','Diseño y modelado 3D','Impresoras 3D','Proyectos y casos de éxito','Tips y tutoriales','Gaming y cultura pop']
const blogArticles:BlogArticle[] = [
  {id:1,category:'Arquitectura',title:'Cómo la impresión 3D está revolucionando la arquitectura',excerpt:'Descubre cómo la impresión 3D permite crear maquetas, prototipos y hasta viviendas con mayor precisión y menor costo.',date:'12 ago 2025',minutes:6,icon:'▥',visual:'architecture',body:'La impresión 3D ayuda a convertir planos digitales en modelos físicos claros y detallados. En arquitectura permite revisar volúmenes, estudiar proporciones y comunicar ideas antes de construir. Para obtener una buena maqueta, conviene revisar la escala, el grosor de muros y la orientación de cada pieza.'},
  {id:2,category:'Materiales',title:'PLA, PETG, ABS: ¿Qué material es mejor para tu proyecto?',excerpt:'Te explicamos las características, ventajas y usos de los materiales más comunes en impresión 3D.',date:'5 ago 2025',minutes:5,icon:'⬡',visual:'materials',body:'PLA es una opción práctica para modelos y objetos decorativos. PETG aporta mayor resistencia al impacto y a la humedad. ABS puede soportar más temperatura, aunque requiere condiciones de impresión más controladas. La elección depende del uso final, el ambiente y el acabado que buscas.'},
  {id:3,category:'Tips y tutoriales',title:'Cómo crear árboles y vegetación realista en impresión 3D',excerpt:'Guía completa de diseño, escalas, materiales y pintura para maquetas de arquitectura.',date:'28 jul 2025',minutes:7,icon:'♣',visual:'landscape',body:'La vegetación da escala y contexto a una maqueta. Combina alturas y tonos, verifica que cada elemento tenga una base imprimible y evita detalles demasiado finos para la escala. Una capa de pintura y una distribución variada ayudan a integrar los árboles en el paisaje.'},
  {id:4,category:'Diseño y modelado 3D',title:'Los mejores programas de diseño 3D para arquitectos',excerpt:'Comparativa de herramientas como SketchUp, Rhino, Blender y Fusion 360 para llevar tus ideas del plano a la impresión.',date:'20 jul 2025',minutes:8,icon:'⌘',visual:'software',body:'SketchUp es rápido para volúmenes arquitectónicos; Rhino destaca en geometrías complejas; Blender combina modelado y visualización; Fusion 360 es útil para piezas técnicas. Antes de exportar, comprueba que la malla sea cerrada y que las unidades estén definidas correctamente.'},
  {id:5,category:'Gaming y cultura pop',title:'Lámparas de GTA 6: diseño, impresión 3D y personalización',excerpt:'Conoce cómo se diseñan, imprimen y personalizan estas lámparas que están conquistando a la comunidad gamer.',date:'12 jul 2025',minutes:5,icon:'✦',visual:'gaming',body:'Las lámparas decorativas combinan una estructura impresa con iluminación y, a menudo, piezas translúcidas. El diseño debe dejar espacio para los componentes eléctricos y permitir el montaje. Los colores y el difusor cambian mucho el resultado final.'},
  {id:6,category:'Proyectos y casos de éxito',title:'Organizadores de escritorio en 3D: funcionalidad y diseño',excerpt:'Descubre cómo los productos funcionales también pueden ser piezas de diseño únicas para tu espacio de trabajo.',date:'8 jul 2025',minutes:6,icon:'▤',visual:'organizer',body:'Un organizador personalizado aprovecha el espacio disponible y se adapta a los objetos que realmente usas. Mide lápices, cables y accesorios, considera tolerancias y separa módulos cuando eso facilite la impresión o el uso diario.'},
  {id:7,category:'Impresoras 3D',title:'Cómo elegir una impresora 3D para comenzar',excerpt:'Revisa volumen de impresión, materiales, velocidad y mantenimiento antes de escoger tu primera máquina.',date:'2 jul 2025',minutes:6,icon:'▣',visual:'materials',body:'Para elegir una impresora 3D, considera el tamaño de las piezas que planeas fabricar, los materiales que necesitas y cuánto tiempo quieres dedicar a calibración y mantenimiento. También conviene valorar disponibilidad de repuestos y soporte.'},
]
const machineData = { name:'Bambu Lab A1 Combo', bed:[256,256,256] as [number,number,number] }
const toMm: Record<Unit,number> = {mm:1,cm:10,m:1000}
const category = ref('Todos'), search = ref(''), cartOpen = ref(false), cart = ref<{id:string;name:string;price:number;image?:string;qty:number}[]>([])
const fileInput = ref<HTMLInputElement|null>(null), viewer = ref<HTMLDivElement|null>(null)
const file = ref<File|null>(null), error = ref(''), unit = ref<Unit>('mm')
const oriented = ref(false)
const targetHeightMm = ref<number|null>(null)
const sliceStatus = ref<'idle'|'slicing'|'done'|'error'>('idle'), sliceError = ref(''), sliceResult = ref<SliceResult|null>(null)
const dragging = ref(false), activeNav = ref('inicio'), currentPage = ref(window.location.hash === '#nosotros' ? 'nosotros' : window.location.hash === '#blog' ? 'blog' : window.location.hash === '#portafolio' ? 'portafolio' : 'inicio')
const meshStats = ref<{dims:[number,number,number];volume:number;triangles:number;parts:PartStats[]}|null>(null)
const filteredProducts = computed(() => products.filter(p => (category.value === 'Todos' || p.category === category.value) && (p.name + p.description + p.category).toLowerCase().includes(search.value.toLowerCase())))
const blogCategory = ref('Todos los artículos'), blogSearch = ref(''), newsletterEmail = ref(''), newsletterStatus = ref(''), selectedArticle = ref<BlogArticle|null>(null)
const portfolioCategory = ref('Todos'), portfolioSearch = ref(''), selectedPortfolio = ref<PortfolioItem|null>(null), testimonialOffset = ref(0)
const selectedPetImage = ref<Product|null>(null)
const filteredArticles = computed(() => blogArticles.filter(a => (blogCategory.value === 'Todos los artículos' || a.category === blogCategory.value) && (a.title+' '+a.excerpt+' '+a.category).toLowerCase().includes(blogSearch.value.toLowerCase())))
const blogCategoryCounts = computed(() => blogCategories.map(item => item === 'Todos los artículos' ? blogArticles.length : blogArticles.filter(article => article.category === item).length))
function subscribeNewsletter(){newsletterStatus.value = newsletterEmail.value.includes('@') ? 'Formulario de demostración: todavía no está conectado al envío de correos.' : 'Escribe un correo válido para continuar.'}
const filteredPortfolio = computed(() => portfolioItems.filter(item => (portfolioCategory.value === 'Todos' || item.category === portfolioCategory.value) && (item.name+' '+item.description+' '+item.category).toLowerCase().includes(portfolioSearch.value.toLowerCase())))
const visibleTestimonials = computed(() => portfolioTestimonials.map((_,index) => portfolioTestimonials[(index+testimonialOffset.value)%portfolioTestimonials.length]))
const cartCount = computed(() => cart.value.reduce((n,item)=>n+item.qty,0))
const cartTotal = computed(() => cart.value.reduce((n,item)=>n+item.price*item.qty,0))
const tallestPart = computed(() => meshStats.value?.parts.reduce((tallest,part)=>part.dims[2]>tallest.dims[2]?part:tallest,meshStats.value.parts[0]) ?? null)
const multiplier = computed(() => targetHeightMm.value&&meshStats.value&&targetHeightMm.value>0 ? targetHeightMm.value/(meshStats.value.dims[2]*toMm[unit.value]) : toMm[unit.value])
const dimensions = computed(() => meshStats.value ? meshStats.value.dims.map(n=>n*multiplier.value) as [number,number,number] : [0,0,0] as [number,number,number])
const originalDimensions = computed(() => meshStats.value ? meshStats.value.dims.map(n=>n*toMm[unit.value]) as [number,number,number] : [0,0,0] as [number,number,number])
const uniformScalePercent = computed(() => (multiplier.value/toMm[unit.value])*100)
const volume = computed(() => meshStats.value ? meshStats.value.volume*Math.pow(multiplier.value,3)/1000 : 0)
const slicerApi = import.meta.env.DEV ? 'http://127.0.0.1:8787/api' : '/api'
const bedFits = computed(() => {
  if (!meshStats.value) return false
  return dimensions.value.every((dimension,index)=>dimension<=machineData.bed[index])
})
const bedText = computed(() => machineData.bed.join(' × ')+' mm')
let scene:THREE.Scene|null=null,camera:THREE.PerspectiveCamera|null=null,renderer:THREE.WebGLRenderer|null=null,controls:OrbitControls|null=null,mesh:THREE.Mesh|null=null,originalGeometry:THREE.BufferGeometry|null=null,observer:ResizeObserver|null=null,baseScale=1,frame=0

async function go(id:string){currentPage.value=id==='nosotros'||id==='blog'||id==='portafolio'||id==='tienda'?id:'inicio';activeNav.value=id;history.pushState(null,'','#'+id);await nextTick();if(id==='nosotros'||id==='blog'||id==='portafolio'||id==='tienda')window.scrollTo({top:0,behavior:'smooth'});else document.getElementById(id)?.scrollIntoView({behavior:'smooth',block:'start'})}function fmt(value:number,digits=1){return new Intl.NumberFormat('es-PE',{maximumFractionDigits:digits}).format(value)}
function partDimensions(part:PartStats,factor:number){return part.dims.map(n=>fmt(n*factor,2)).join(' × ')+' mm'}
function pic(p:Product){return p.image ? encodeURI(p.image) : ''}
function add(p:Product){const found=cart.value.find(x=>x.id===p.id);if(found)found.qty++;else cart.value.push({id:p.id,name:p.name,price:p.price,image:pic(p),qty:1});cartOpen.value=true}
function qty(id:string,by:number){const item=cart.value.find(x=>x.id===id);if(item){item.qty+=by;if(item.qty<1)cart.value=cart.value.filter(x=>x.id!==id)}}
function checkout(){window.open(waLink,'_blank','noopener')}
function formatDuration(seconds:number){const total=Math.max(0,Math.round(seconds));const h=Math.floor(total/3600),m=Math.floor((total%3600)/60);return h?`${h} h ${m} min`:`${m} min`}
async function requestSlice(input:File){
  sliceStatus.value='slicing';sliceError.value='';sliceResult.value=null
  const scaleFactor=meshStats.value&&targetHeightMm.value&&targetHeightMm.value>0?targetHeightMm.value/(meshStats.value.dims[2]*toMm[unit.value]):toMm[unit.value]
  try{
    const response=await fetch(`${slicerApi}/slice`,{method:'POST',headers:{'Content-Type':'application/octet-stream','X-Model-Name':encodeURIComponent(input.name),'X-Scale-Factor':String(scaleFactor)},body:await input.arrayBuffer()})
    const data=await response.json() as SliceResult|{error:string}
    if(!response.ok)throw new Error('error' in data?data.error:'No se pudo laminar el STL.')
    sliceResult.value=data as SliceResult;sliceStatus.value='done'
  }catch(e){sliceStatus.value='error';sliceError.value=e instanceof Error?e.message:'No se pudo conectar con Bambu Studio. Inicia el servicio local de laminado.'}
}
function setViewer(element:unknown){viewer.value=element as HTMLDivElement|null}
function initViewer(){
  if(!viewer.value||renderer)return
  const w=viewer.value.clientWidth||600,h=viewer.value.clientHeight||420
  scene=new THREE.Scene();scene.background=new THREE.Color('#e9edf4')
  camera=new THREE.PerspectiveCamera(42,w/h,.1,2000);camera.up.set(0,0,1);camera.position.set(150,-170,130);camera.lookAt(0,0,0)
  renderer=new THREE.WebGLRenderer({antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setSize(w,h);renderer.outputColorSpace=THREE.SRGBColorSpace;viewer.value.appendChild(renderer.domElement)
  controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true
  scene.add(new THREE.HemisphereLight(0xffffff,0x78869a,2))
  const light=new THREE.DirectionalLight(0xffffff,2.5);light.position.set(70,120,90);scene.add(light)
  const grid=new THREE.GridHelper(220,22,0x3b78df,0xcbd4e2);grid.rotation.x=Math.PI/2;grid.position.z=-43;scene.add(grid)
  const bed=new THREE.Mesh(new THREE.BoxGeometry(160,160,2),new THREE.MeshStandardMaterial({color:'#ffffff',roughness:.8}));bed.position.z=-44;scene.add(bed)
  const draw=()=>{frame=requestAnimationFrame(draw);controls?.update();if(renderer&&scene&&camera)renderer.render(scene,camera)};draw()
  observer=new ResizeObserver(resizeViewer);observer.observe(viewer.value)
}
function resizeViewer(){if(!viewer.value||!camera||!renderer)return;const w=viewer.value.clientWidth,h=viewer.value.clientHeight;if(!w||!h)return;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h)}
function scaleMesh(){if(!mesh||!meshStats.value)return;mesh.scale.setScalar(baseScale*multiplier.value);mesh.position.z=-43+(meshStats.value.dims[2]*baseScale*multiplier.value)/2}
function analyzeGeometry(geometry:THREE.BufferGeometry){
  const pos=geometry.getAttribute('position'),triangleCount=Math.floor(pos.count/3)
  const parent=new Int32Array(triangleCount);for(let i=0;i<triangleCount;i++)parent[i]=i
  const root=(value:number):number=>{let r=value;while(parent[r]!==r)r=parent[r];while(parent[value]!==value){const next=parent[value];parent[value]=r;value=next}return r}
  const join=(a:number,b:number)=>{const ra=root(a),rb=root(b);if(ra!==rb)parent[rb]=ra}
  geometry.computeBoundingBox();const bounds=geometry.boundingBox!,bboxSize=new THREE.Vector3();bounds.getSize(bboxSize)
  const epsilon=Math.max(bboxSize.length()*1e-7,1e-5),edgeOwners=new Map<string,number>()
  const vertexKey=(i:number)=>`${Math.round(pos.getX(i)/epsilon)},${Math.round(pos.getY(i)/epsilon)},${Math.round(pos.getZ(i)/epsilon)}`
  for(let tri=0;tri<triangleCount;tri++){
    const i=tri*3,keys=[vertexKey(i),vertexKey(i+1),vertexKey(i+2)]
    for(const [a,b] of [[0,1],[1,2],[2,0]]){
      const edge=keys[a]<keys[b]?`${keys[a]}|${keys[b]}`:`${keys[b]}|${keys[a]}`
      const owner=edgeOwners.get(edge);if(owner===undefined)edgeOwners.set(edge,tri);else join(tri,owner)
    }
  }
  type Accumulator={min:THREE.Vector3;max:THREE.Vector3;volume:number;triangles:number}
  const components=new Map<number,Accumulator>()
  for(let tri=0;tri<triangleCount;tri++){
    const i=tri*3,id=root(tri),acc=components.get(id)??{min:new THREE.Vector3(Infinity,Infinity,Infinity),max:new THREE.Vector3(-Infinity,-Infinity,-Infinity),volume:0,triangles:0}
    const a=new THREE.Vector3().fromBufferAttribute(pos,i),b=new THREE.Vector3().fromBufferAttribute(pos,i+1),c=new THREE.Vector3().fromBufferAttribute(pos,i+2)
    for(const point of [a,b,c]){acc.min.min(point);acc.max.max(point)}
    acc.volume+=a.dot(new THREE.Vector3().crossVectors(b,c))/6;acc.triangles++;components.set(id,acc)
  }
  const parts=[...components.values()].map((part,index)=>{const size=part.max.clone().sub(part.min);return{id:index+1,dims:[size.x,size.y,size.z] as [number,number,number],volume:Math.abs(part.volume),triangles:part.triangles}}).sort((a,b)=>b.dims[2]-a.dims[2])
  parts.forEach((part,index)=>part.id=index+1)
  const totalSize=new THREE.Vector3();bounds.getSize(totalSize)
  return{dims:[totalSize.x,totalSize.y,totalSize.z] as [number,number,number],volume:parts.reduce((sum,part)=>sum+part.volume,0),triangles:triangleCount,parts}
}
function setGeometry(geometry:THREE.BufferGeometry){
  if(!mesh)return
  mesh.geometry.dispose();mesh.geometry=geometry;geometry.computeBoundingBox()
  meshStats.value=analyzeGeometry(geometry);const [x,y,z]=meshStats.value.dims;baseScale=96/Math.max(x,y,z,.001)
  scaleMesh()
}
function orientOnBed(){
  if(!mesh||!meshStats.value)return
  const geometry=mesh.geometry.clone(),pos=geometry.getAttribute('position'),groups=new Map<string,{area:number;normal:THREE.Vector3}>()
  for(let i=0;i+2<pos.count;i+=3){
    const a=new THREE.Vector3().fromBufferAttribute(pos,i),b=new THREE.Vector3().fromBufferAttribute(pos,i+1),c=new THREE.Vector3().fromBufferAttribute(pos,i+2)
    const cross=new THREE.Vector3().subVectors(b,a).cross(new THREE.Vector3().subVectors(c,a)),area=cross.length()/2
    if(area<1e-8)continue
    const n=cross.normalize(),d=n.dot(a.clone().add(b).add(c).multiplyScalar(1/3))
    if(d<0){n.negate()}
    const outwardD=Math.abs(d),key=[Math.round(n.x*30),Math.round(n.y*30),Math.round(n.z*30),Math.round(outwardD*4)].join(':')
    const group=groups.get(key)??{area:0,normal:new THREE.Vector3()};group.area+=area;group.normal.addScaledVector(n,area);groups.set(key,group)
  }
  const largest=[...groups.values()].sort((a,b)=>b.area-a.area)[0]
  if(!largest){geometry.dispose();error.value='No se encontró una cara útil para orientar este STL.';return}
  const normal=largest.normal.normalize(),rotation=new THREE.Quaternion().setFromUnitVectors(normal,new THREE.Vector3(0,0,-1))
  geometry.applyQuaternion(rotation);geometry.computeBoundingBox()
  const bounds=geometry.boundingBox!,center=new THREE.Vector3();bounds.getCenter(center);geometry.translate(-center.x,-center.y,-center.z)
  setGeometry(geometry);oriented.value=true
}
function restoreOrientation(){if(!originalGeometry||!mesh)return;setGeometry(originalGeometry.clone());oriented.value=false}
function loadSTL(input:File){
  error.value=''
  if(!input.name.toLowerCase().endsWith('.stl')){error.value='El cotizador acepta archivos .STL.';return}
  if(input.size>100*1024*1024){error.value='El STL supera el límite de 100 MB.';return}
  file.value=input
  input.arrayBuffer().then(buffer=>{
    try{
      const geometry=new STLLoader().parse(buffer);geometry.computeBoundingBox();geometry.computeVertexNormals()
      const bounds=geometry.boundingBox,pos=geometry.attributes.position
      if(!bounds||!pos||pos.count<3)throw new Error('El archivo no contiene una malla STL válida.')
      const center=new THREE.Vector3();bounds.getCenter(center)
      geometry.translate(-center.x,-center.y,-center.z)
      if(mesh&&scene){scene.remove(mesh);mesh.geometry.dispose();(mesh.material as THREE.Material).dispose()}
      originalGeometry?.dispose();originalGeometry=null;oriented.value=false
      meshStats.value=analyzeGeometry(geometry)
      baseScale=96/Math.max(...meshStats.value.dims,.001)
      mesh=new THREE.Mesh(geometry,new THREE.MeshStandardMaterial({color:'#79a9f4',metalness:.08,roughness:.35}))
      geometry.computeBoundingBox();const originalCenter=geometry.boundingBox!.getCenter(new THREE.Vector3());geometry.translate(-originalCenter.x,-originalCenter.y,-originalCenter.z)
      originalGeometry=geometry.clone()
      if(scene){scene.add(mesh);orientOnBed()}
      void requestSlice(input)
    }catch(e){error.value=e instanceof Error?e.message:'No se pudo leer este STL.';file.value=null;meshStats.value=null}
  }).catch(()=>error.value='No se pudo abrir el archivo.')
}
function chooseFile(event:Event){const input=(event.target as HTMLInputElement).files?.[0];if(input)loadSTL(input)}
function dropFile(event:DragEvent){dragging.value=false;const input=event.dataTransfer?.files?.[0];if(input)loadSTL(input)}

watch([unit,targetHeightMm],()=>{scaleMesh();if(file.value)void requestSlice(file.value)})
onMounted(async()=>{const id=window.location.hash.slice(1);if(id){currentPage.value=id==='nosotros'||id==='blog'||id==='portafolio'||id==='tienda'?id:'inicio';activeNav.value=id}await nextTick();initViewer();if(id){requestAnimationFrame(()=>id==='nosotros'||id==='blog'||id==='portafolio'||id==='tienda'?window.scrollTo({top:0,behavior:'auto'}):document.getElementById(id)?.scrollIntoView({behavior:'auto',block:'start'}))}})
onBeforeUnmount(()=>{cancelAnimationFrame(frame);observer?.disconnect();controls?.dispose();renderer?.dispose()})

  return { waLink, featuredProjects, categories, products, portfolioCategories, portfolioItems, portfolioTestimonials, blogCategories, blogArticles, machineData, toMm, category, search, cartOpen, cart, fileInput, viewer, file, error, unit, oriented, targetHeightMm, sliceStatus, sliceError, sliceResult, dragging, activeNav, currentPage, meshStats, filteredProducts, blogCategory, blogSearch, newsletterEmail, newsletterStatus, selectedArticle, portfolioCategory, portfolioSearch, selectedPortfolio, testimonialOffset, selectedPetImage, filteredArticles, blogCategoryCounts, filteredPortfolio, visibleTestimonials, cartCount, cartTotal, tallestPart, multiplier, dimensions, originalDimensions, uniformScalePercent, volume, slicerApi, bedFits, bedText, setViewer, scene, camera, renderer, controls, mesh, originalGeometry, observer, baseScale, frame, subscribeNewsletter, go, fmt, partDimensions, pic, add, qty, checkout, formatDuration, requestSlice, initViewer, resizeViewer, scaleMesh, analyzeGeometry, setGeometry, orientOnBed, restoreOrientation, loadSTL, chooseFile, dropFile }
}

export function useAppState() {
  const state = inject(appStateKey)
  if (!state) throw new Error('El estado de EXOCASE3D no está disponible')
  return state
}
