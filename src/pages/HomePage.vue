<script setup lang="ts">
import { useAppState } from '../composables/appState'
const { waLink, featuredProjects, toMm, fileInput, file, error, unit, oriented, targetHeightMm, sliceStatus, sliceError, sliceResult, dragging, currentPage, meshStats, tallestPart, multiplier, dimensions, originalDimensions, uniformScalePercent, volume, bedFits, bedText, go, fmt, partDimensions, checkout, formatDuration, orientOnBed, restoreOrientation, chooseFile, dropFile, setViewer } = useAppState()
</script>

<template>
<div v-show="currentPage === 'inicio'" class="home-page">
    <section id="inicio" class="hero section-anchor">
      <div class="hero-copy"><span class="eyebrow"><i></i> IMPRESIÓN 3D PROFESIONAL · PERÚ</span><h1>TUS IDEAS<br><em>COBRAN VIDA</em><br>EN 3D.</h1><p>Maquetas arquitectónicas, prototipos y piezas personalizadas fabricadas con precisión para tus proyectos.</p><div class="hero-actions"><button class="button button-primary" @click="go('cotizador')">COTIZAR MI STL <span>→</span></button><button class="button button-outline" @click="go('portafolio')">VER PORTAFOLIO</button></div><div class="hero-points"><span>✓ Alta precisión</span><span>✓ Materiales premium</span><span>✓ Envíos a todo el Perú</span></div></div>
      <div class="hero-art"><div class="hero-cube"><span></span><span></span><span></span></div><div class="hero-stats"><b>EXOCASE3D</b><small>MODELADO · IMPRESIÓN · ACABADO</small></div><div class="hero-caption">DEL CONCEPTO<br>A LA REALIDAD</div></div>
    </section>

    <section id="servicios" class="services-page section-anchor">
      <div class="services-page-inner">
        <div class="services-page-intro">
          <span class="eyebrow"><i></i> EXOCASE3D · SERVICIOS</span>
          <h1>Nuestros<br>Servicios</h1>
          <p>Soluciones integrales de manufactura aditiva para empresas, estudiantes y aficionados.</p>
          <button class="button button-outline" @click="go('contacto')">Explorar todos los servicios <span>→</span></button>
        </div>
        <div class="services-page-grid">
          <article class="service-showcase-card">
            <div class="service-showcase-art service-print-art"><span class="print-nozzle">⌄</span><i></i><b></b></div>
            <div class="service-showcase-copy"><small>FABRICACIÓN ADITIVA</small><h2>Impresión 3D</h2><p>Fabricación de piezas funcionales, prototipos y productos personalizados.</p><button @click="go('cotizador')">Cotizar una impresión <span>→</span></button></div>
          </article>
          <article class="service-showcase-card">
            <div class="service-showcase-art service-maquette-art"><div class="maquette-building"><i></i><i></i><i></i></div><span>1:100</span></div>
            <div class="service-showcase-copy"><small>ARQUITECTURA Y URBANISMO</small><h2>Maquetas</h2><p>Maquetas arquitectónicas y urbanas a escala, con detalle y buenos acabados.</p><button @click="go('portafolio')">Ver proyectos <span>→</span></button></div>
          </article>
          <article class="service-showcase-card">
            <div class="service-showcase-art service-render-art"><div class="render-room"><i></i><b></b></div><span>VISTA 3D</span></div>
            <div class="service-showcase-copy"><small>VISUALIZACIÓN</small><h2>Renderizado</h2><p>Visualización 3D para presentar proyectos arquitectónicos, productos e ideas.</p><button @click="go('portafolio')">Ver proyectos <span>→</span></button></div>
          </article>
        </div>
      </div>
    </section>




    <section id="cotizador" class="quote-section section-anchor">
      <div class="quote-heading"><div><span class="eyebrow"><i></i> COTIZADOR INTERACTIVO</span><h2>SUBE TU STL.<br><em>DESCUBRE CUÁNTO CUESTA.</em></h2><p>Gira el modelo, revisa sus medidas y obtén una estimación referencial.</p></div><div class="rate-cards"><div><small>HASTA 10 HORAS</small><b>S/15 <small>/ hora</small></b></div><div><small>MÁS DE 10 HORAS</small><b>S/10 <small>/ hora</small></b></div></div></div>
      <div class="quote-layout">
        <div class="model-column">
          <div class="viewer-shell" :class="{dragging}" @dragover.prevent="dragging=true" @dragleave.prevent="dragging=false" @drop.prevent="dropFile">
            <div :ref="setViewer" class="viewer-canvas"><div class="viewer-badge"><span>STL</span>{{file?.name||'VISTA 3D · ARRASTRA PARA GIRAR'}}</div><div v-if="!file" class="viewer-empty"><div class="empty-cube">⬡</div><b>Tu modelo aparecerá aquí</b><span>Arrastra para girar · rueda para acercar</span></div><div class="viewer-bed-label">BANDEJA {{bedText}}</div></div>
          </div>
          <div v-if="file" class="orientation-tools"><span>{{oriented?'Orientado automáticamente sobre la cama':'Orientación original del STL'}}</span><button v-if="oriented" class="text-link" @click="restoreOrientation">Restaurar orientación original</button><button v-else class="text-link" @click="orientOnBed">Orientar sobre la cama</button></div>
          <div class="upload-box" @dragover.prevent="dragging=true" @dragleave.prevent="dragging=false" @drop.prevent="dropFile"><div><b>Arrastra tu STL aquí</b> o selecciónalo desde tu computadora<small>STL binario o ASCII · laminado con el perfil fijo de Bambu Studio</small></div><input ref="fileInput" type="file" accept=".stl,model/stl" hidden @change="chooseFile"><button class="button button-primary upload-button" @click="fileInput?.click()">{{file?'Cambiar STL':'Subir STL'}}</button></div>
          <p v-if="error" class="error-text">{{error}}</p><p v-if="file" class="file-meta">{{file.name}} · {{fmt(file.size/1048576,2)}} MB</p>
        </div>
        <div class="quote-controls">
          <div class="control-topline"><span>CONFIGURA TU MODELO</span><span>PRECIOS REFERENCIALES</span></div>
          <div class="option-row"><label>UNIDAD DEL ARCHIVO<select v-model="unit"><option value="mm">Milímetros (mm)</option><option value="cm">Centímetros (cm)</option><option value="m">Metros (m)</option></select></label></div>
          <div class="fixed-profile"><b>PERFIL DE LAMINADO</b><span>Bambu Lab A1 Combo · boquilla 0.4 mm · 0.28 mm Extra Draft · 2 paredes · 15% Gyroid · soportes árbol/auto a 40° · PLA</span></div>
          <div v-if="meshStats" class="stl-readout"><div class="stl-readout-heading"><b>MEDIDAS DEL STL COMPLETO</b><span>{{meshStats.parts.length}} {{meshStats.parts.length===1?'COMPONENTE AISLADO':'COMPONENTES AISLADOS'}} DETECTADOS</span></div><strong>X × Y × Z: {{fmt(originalDimensions[0],2)}} × {{fmt(originalDimensions[1],2)}} × {{fmt(originalDimensions[2],2)}} mm</strong><p>La pieza seleccionada en Bambu puede mostrar medidas menores que el conjunto completo.</p><details><summary>Ver medidas de cada componente aislado</summary><div v-for="part in meshStats.parts" :key="part.id" class="part-measure"><span>Componente {{part.id}} <small v-if="part.id===tallestPart?.id">· mayor Z individual</small></span><div><small>Original · {{partDimensions(part,toMm[unit])}}</small><b v-if="targetHeightMm&&targetHeightMm>0">Escalado · {{partDimensions(part,multiplier)}}</b></div></div></details></div>
          <div class="scale-calculator"><div class="scale-calculator-title"><b>ALTURA OBJETIVO DEL STL COMPLETO</b><span>Opcional · escalado uniforme de todos los componentes</span></div><div class="scale-calculator-body"><label>ALTURA FINAL TOTAL EN Z<span class="input-suffix"><input v-model.number="targetHeightMm" type="number" min="0.1" step="0.01" placeholder="Tamaño original" :disabled="!meshStats"><small>mm</small></span></label><div class="scale-result"><small>EXTENSIÓN FINAL DEL STL · X × Y × Z</small><b>{{meshStats?fmt(dimensions[0],2)+' × '+fmt(dimensions[1],2)+' × '+fmt(dimensions[2],2)+' mm':'Sube un STL para ver las medidas'}}</b></div></div><p class="scale-help">Factor uniforme aplicado: {{fmt(uniformScalePercent,2)}}%. Si el objetivo coincide con el Z original, el tamaño no cambia.</p></div>
          <div class="stats-grid"><div><small>EXTENSIÓN FINAL DEL STL · X × Y × Z</small><b>{{meshStats?fmt(dimensions[0],2)+' × '+fmt(dimensions[1],2)+' × '+fmt(dimensions[2],2)+' mm':'— × — × — mm'}}</b></div><div><small>VOLUMEN DE MALLA</small><b>{{meshStats?fmt(volume,2)+' cm³':'— cm³'}}</b></div><div><small>TRIÁNGULOS STL</small><b>{{meshStats?fmt(meshStats.triangles,0):'—'}}</b></div><div><small>VOLUMEN DE IMPRESIÓN X × Y × Z</small><b :class="meshStats?(bedFits?'fit-good':'fit-bad'):''">{{meshStats?(bedFits?'Entra en una pieza':'Requiere revisión o división'):'Sube un modelo'}}</b></div></div>
          <div class="extra-stats"><span>Filamento según laminado <b>{{sliceResult?fmt(sliceResult.weightGrams,1)+' g':'—'}}</b></span><span>Altura total Z <b>{{meshStats?fmt(dimensions[2],2)+' mm':'—'}}</b></span></div>
          <div v-if="file" class="slicer-status" :class="'status-'+sliceStatus"><b>{{sliceStatus==='slicing'?'BAMBU STUDIO ESTÁ LAMINANDO':sliceStatus==='done'?'LAMINADO COMPLETADO':sliceStatus==='error'?'NO SE PUDO LAMINAR':'LISTO'}}</b><span v-if="sliceStatus==='slicing'">Puede tardar unos minutos. No cierres el servicio local.</span><span v-else-if="sliceStatus==='done'&&sliceResult">Tiempo {{formatDuration(sliceResult.timeSeconds)}} · {{fmt(sliceResult.weightGrams,1)}} g de PLA</span><span v-else-if="sliceStatus==='error'">{{sliceError}}</span></div>
          <div class="price-block"><small>PRECIO REFERENCIAL</small><strong v-if="sliceResult">S/ {{fmt(sliceResult.priceSoles,2)}}</strong><strong v-else>—</strong><span v-if="sliceResult">{{formatDuration(sliceResult.timeSeconds)}} × S/{{sliceResult.hourlyRate}} por hora · PLA laminado</span><span v-else-if="sliceStatus==='slicing'">Calculando el precio desde el laminado…</span><span v-else-if="sliceStatus==='error'">No mostramos un precio hasta obtener el resultado del laminado.</span><span v-else>Sube un STL para calcular el precio con Bambu Studio.</span></div><button class="button button-primary quote-whatsapp" :disabled="!sliceResult" @click="checkout"><span>☏</span> Enviar cotización por WhatsApp</button><p class="disclaimer">El laminado usa el perfil fijo mostrado arriba. Adjunta nuevamente tu STL al abrir WhatsApp para confirmar el pedido.</p>
        </div>
      </div>
      <div class="steps-row"><div><b>01 · EXPORTA</b><span>Guarda tu proyecto como .STL.</span></div><div><b>02 · CONFIGURA</b><span>Unidades, escala, material y relleno.</span></div><div><b>03 · REVISA</b><span>Dimensiones y precio estimado.</span></div><div><b>04 · ENVÍA</b><span>Adjunta tu STL por WhatsApp.</span></div></div>
    </section>





    <section id="contacto" class="contact-section section-anchor"><div><span class="eyebrow"><i></i> ¿TIENES UN PROYECTO?</span><h2>HAGAMOS ALGO<br><em>EXTRAORDINARIO.</em></h2><p>Envíanos tu idea o archivo STL y te ayudamos a convertirlo en una pieza real.</p></div><a class="button button-primary" :href="waLink" target="_blank" rel="noreferrer">☏ ESCRIBIR POR WHATSAPP</a></section>    <section id="trabajos" class="featured-section section-anchor"><div class="featured-heading"><div><span class="eyebrow"><i></i> NUESTROS TRABAJOS</span><h2>Proyectos destacados</h2><p>Fabricación 3D para arquitectura, industria, ingeniería y proyectos personalizados.</p></div><button class="button button-outline" @click="go('portafolio')">VER PORTAFOLIO COMPLETO <span>→</span></button></div><div class="featured-grid"><article v-for="work in featuredProjects" :key="work.name" class="featured-card"><div v-if="work.name === 'Planta de Asfalto'" class="featured-art featured-plant-photo"><img src="/images/portfolio/planta-asfalto-detalle.png" alt="Maqueta de Planta de Asfalto"></div><div v-else class="featured-art" :class="work.style"><span>{{work.icon}}</span><small>EXOCASE3D</small></div><div class="featured-info"><b>{{work.category}}</b><h3>{{work.name}}</h3><small>{{work.location}}</small></div></article></div></section>
    </div>
</template>
